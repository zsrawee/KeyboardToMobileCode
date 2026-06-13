import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardConfig, KeyboardEvents, KeyDefinition, Prediction, SwipeGesture, TouchPoint } from './types';
import { DEFAULT_CONFIG } from './defaults';
import { getPredictions } from './prediction';
import { recognizeSwipe, getSwipeDirection, isTap } from './gesture';
import './styles.css';

/* ============================================================
   COMPACT KEYBOARD COMPONENT
   All letters in ~44px vertical space.
   Three input modes:
     compact : single row, multi-tap letter groups (phone-style)
     t9      : classic 3×4 phone keypad
     swipe   : gesture-based direction typing
   ============================================================ */

interface CompactKeyboardProps extends Partial<KeyboardConfig>, Partial<KeyboardEvents> {
  /** Input element ref to attach to */
  inputRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  /** Controlled value */
  value?: string;
  /** onChange handler for controlled mode */
  onChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Class name for the container */
  className?: string;
}

/* ---- Compact single-row layout: all letters + extras in one line ---- */
const COMPACT_ROW: KeyDefinition[] = [
  { primary: 'abc', secondary: ['a', 'b', 'c'], ariaLabel: 'a b c' },
  { primary: 'def', secondary: ['d', 'e', 'f'], ariaLabel: 'd e f' },
  { primary: 'ghi', secondary: ['g', 'h', 'i'], ariaLabel: 'g h i' },
  { primary: 'jkl', secondary: ['j', 'k', 'l'], ariaLabel: 'j k l' },
  { primary: 'mno', secondary: ['m', 'n', 'o'], ariaLabel: 'm n o' },
  { primary: 'pqrs', secondary: ['p', 'q', 'r', 's'], ariaLabel: 'p q r s' },
  { primary: 'tuv', secondary: ['t', 'u', 'v'], ariaLabel: 't u v' },
  { primary: 'wxyz', secondary: ['w', 'x', 'y', 'z'], ariaLabel: 'w x y z' },
  { primary: '/', action: 'character', ariaLabel: 'Forward slash' },
  { primary: '#', action: 'character', ariaLabel: 'Hash' },
  { primary: '←', action: 'cursor-left', ariaLabel: 'Cursor left' },
  { primary: '↑', action: 'cursor-up', ariaLabel: 'Cursor up' },
  { primary: '↓', action: 'cursor-down', ariaLabel: 'Cursor down' },
  { primary: '→', action: 'cursor-right', ariaLabel: 'Cursor right' },
  { primary: '⌫', action: 'backspace', ariaLabel: 'Backspace' },
  { primary: '◉', action: 'mode-switch', ariaLabel: 'Switch input mode' },
];

/* ---- Classic T9 keypad ---- */
const T9_LAYOUT: KeyDefinition[][] = [
  [
    { primary: 'abc', secondary: ['a', 'b', 'c'], ariaLabel: '2 a b c' },
    { primary: 'def', secondary: ['d', 'e', 'f'], ariaLabel: '3 d e f' },
    { primary: 'ghi', secondary: ['g', 'h', 'i'], ariaLabel: '4 g h i' },
  ],
  [
    { primary: 'jkl', secondary: ['j', 'k', 'l'], ariaLabel: '5 j k l' },
    { primary: 'mno', secondary: ['m', 'n', 'o'], ariaLabel: '6 m n o' },
    { primary: 'pqrs', secondary: ['p', 'q', 'r', 's'], ariaLabel: '7 p q r s' },
  ],
  [
    { primary: 'tuv', secondary: ['t', 'u', 'v'], ariaLabel: '8 t u v' },
    { primary: 'wxyz', secondary: ['w', 'x', 'y', 'z'], ariaLabel: '9 w x y z' },
    { primary: '⌫', action: 'backspace', ariaLabel: 'Backspace' },
  ],
  [
    { primary: '◉', action: 'mode-switch', ariaLabel: 'Switch mode', width: 1.2 },
    { primary: ' ', action: 'space', ariaLabel: 'Space', width: 1.5 },
    { primary: '↵', action: 'enter', ariaLabel: 'Enter' },
  ],
];

/* ---- Direction labels for swipe mode ---- */
const SWIPE_DIRECTIONS: Array<{ dir: string; label: string; letters: string }> = [
  { dir: '←', label: 'left', letters: 'ABCD' },
  { dir: '→', label: 'right', letters: 'EFGH' },
  { dir: '↑', label: 'up', letters: 'IJKLM' },
  { dir: '↓', label: 'down', letters: 'NOPQR' },
  { dir: '↙', label: 'downleft', letters: 'ST' },
  { dir: '↘', label: 'downright', letters: 'UV' },
  { dir: '↖', label: 'upleft', letters: 'WX' },
  { dir: '↗', label: 'upright', letters: 'YZ' },
];

export function CompactKeyboard({
  inputRef: externalInputRef,
  value: controlledValue,
  onChange,
  placeholder,
  className,
  height = DEFAULT_CONFIG.height,
  showPredictions = DEFAULT_CONFIG.showPredictions,
  maxPredictions = DEFAULT_CONFIG.maxPredictions,
  inputMode: initialInputMode = DEFAULT_CONFIG.inputMode,
  hapticFeedback = DEFAULT_CONFIG.hapticFeedback,
  locale = DEFAULT_CONFIG.locale,
  theme = DEFAULT_CONFIG.theme,
  keyBorderRadius = DEFAULT_CONFIG.keyBorderRadius,
  keyGap = DEFAULT_CONFIG.keyGap,
  customWords,
  onTextChange,
  onKeyPress,
  onCompositionChange,
  onPredictionSelect,
  onModeChange,
}: CompactKeyboardProps) {
  // Internal state for uncontrolled mode
  const [internalText, setInternalText] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const [composition, setComposition] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [inputMode, setInputMode] = useState<'compact' | 't9' | 'swipe'>(initialInputMode);
  const [activeKeyIdx, setActiveKeyIdx] = useState<number | null>(null);

  const isControlled = controlledValue !== undefined;
  const text = isControlled ? controlledValue : internalText;

  // For controlled mode, cursor is always at end
  const effectiveCursor = isControlled ? text.length : cursorPos;

  // Touch event tracking for swipe mode
  const touchPoints = useRef<TouchPoint[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const compositionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Update predictions based on current text */
  const updatePredictions = useCallback((currentText: string) => {
    if (!showPredictions) { setPredictions([]); return; }
    const words = currentText.split(/\s+/);
    const lastWord = words[words.length - 1] ?? '';
    if (lastWord.length > 0) {
      setPredictions(getPredictions(lastWord, maxPredictions, locale));
    } else {
      setPredictions([]);
    }
  }, [showPredictions, maxPredictions, locale]);

  /** Insert text at cursor position */
  const insertText = useCallback((t: string) => {
    if (isControlled && onChange) {
      onChange(text + t);
    } else {
      const pos = cursorPos;
      const newText = internalText.slice(0, pos) + t + internalText.slice(pos);
      const newPos = pos + t.length;
      setInternalText(newText);
      setCursorPos(newPos);
      updatePredictions(newText);
    }
    if (hapticFeedback && navigator.vibrate) navigator.vibrate(10);
  }, [isControlled, onChange, cursorPos, text, internalText, updatePredictions, hapticFeedback]);

  /** Delete character before cursor */
  const deleteBackward = useCallback(() => {
    if (isControlled && onChange) {
      const currentText = text;
      const newText = currentText.slice(0, -1);
      onChange(newText);
      updatePredictions(newText);
    } else {
      const pos = cursorPos;
      if (pos <= 0) return;
      const newText = internalText.slice(0, pos - 1) + internalText.slice(pos);
      setInternalText(newText);
      setCursorPos(pos - 1);
      updatePredictions(newText);
    }
    if (hapticFeedback && navigator.vibrate) navigator.vibrate(15);
  }, [isControlled, onChange, cursorPos, text, internalText, updatePredictions, hapticFeedback]);

  /** Move cursor */
  const moveCursor = useCallback((dir: 'left' | 'right' | 'up' | 'down') => {
    if (isControlled) return; // cursor tracked internally only in uncontrolled
    const pos = cursorPos;
    const len = internalText.length;
    let newPos = pos;
    switch (dir) {
      case 'left':  newPos = Math.max(0, pos - 1); break;
      case 'right': newPos = Math.min(len, pos + 1); break;
      case 'up': {
        // Go to start of previous line
        const before = internalText.slice(0, pos);
        const lastNewline = before.lastIndexOf('\n');
        if (lastNewline > 0) {
          newPos = lastNewline;
        } else if (lastNewline === 0) {
          newPos = 0;
        }
        break;
      }
      case 'down': {
        // Go to end of current line
        const after = internalText.slice(pos);
        const nextNewline = after.indexOf('\n');
        if (nextNewline >= 0) {
          newPos = pos + nextNewline + 1;
        } else {
          newPos = len;
        }
        break;
      }
    }
    setCursorPos(newPos);
    if (hapticFeedback && navigator.vibrate) navigator.vibrate(5);
  }, [isControlled, cursorPos, internalText, hapticFeedback]);

  /** Commit composition (multi-tap) */
  const commitComposition = useCallback(() => {
    if (composition) {
      insertText(composition);
      setComposition('');
      if (onCompositionChange) onCompositionChange('');
    }
  }, [composition, insertText, onCompositionChange]);

  /** Handle tapping a compact/T9 key (multi-tap cycling) */
  const handleMultiTapKey = useCallback((key: KeyDefinition) => {
    if (!key.secondary || key.secondary.length === 0) return;

    const allChars = key.secondary;
    const currentComp = composition;
    let idx = allChars.indexOf(currentComp);

    if (idx >= 0 && idx < allChars.length - 1) {
      // Cycle to next letter
      const nextChar = allChars[idx + 1]!;
      setComposition(nextChar);
      if (onCompositionChange) onCompositionChange(nextChar);
      // Clear timeout
      if (compositionTimeoutRef.current) clearTimeout(compositionTimeoutRef.current);
      // Auto-commit after 1.2s of inactivity
      compositionTimeoutRef.current = setTimeout(() => {
        commitComposition();
      }, 1200);
    } else {
      // Commit current, start new
      commitComposition();
      const firstChar = allChars[0]!;
      setComposition(firstChar);
      if (onCompositionChange) onCompositionChange(firstChar);
      if (compositionTimeoutRef.current) clearTimeout(compositionTimeoutRef.current);
      compositionTimeoutRef.current = setTimeout(() => {
        commitComposition();
      }, 1200);
    }
  }, [composition, commitComposition, onCompositionChange]);

  /** Handle key press (all modes) */
  const handleKeyPress = useCallback((key: KeyDefinition, event?: PointerEvent) => {
    if (onKeyPress) onKeyPress(key, event ?? new PointerEvent('pointerdown'));
    const action = key.action ?? 'character';

    switch (action) {
      case 'character': {
        if (inputMode === 'swipe') return;
        if (key.secondary && key.secondary.length > 0 && inputMode !== 't9') {
          handleMultiTapKey(key);
        } else if (inputMode === 't9' && key.secondary) {
          // T9: first tap shows first letter, subsequent taps cycle
          handleMultiTapKey(key);
        } else {
          insertText(key.primary);
        }
        break;
      }
      case 'backspace':
        if (composition) {
          setComposition('');
          if (onCompositionChange) onCompositionChange('');
        } else {
          deleteBackward();
        }
        break;
      case 'space':
        commitComposition();
        insertText(' ');
        break;
      case 'enter':
        commitComposition();
        insertText('\n');
        break;
      case 'cursor-left':
        moveCursor('left');
        break;
      case 'cursor-right':
        moveCursor('right');
        break;
      case 'cursor-up':
        moveCursor('up');
        break;
      case 'cursor-down':
        moveCursor('down');
        break;
      case 'mode-switch': {
        commitComposition();
        const modes: Array<'compact' | 't9' | 'swipe'> = ['compact', 't9', 'swipe'];
        const curIdx = modes.indexOf(inputMode);
        const nextMode = modes[(curIdx + 1) % modes.length]!;
        setInputMode(nextMode);
        setPredictions([]);
        if (onModeChange) onModeChange(nextMode);
        break;
      }
    }
  }, [inputMode, insertText, deleteBackward, commitComposition, handleMultiTapKey, moveCursor, onKeyPress, onCompositionChange, onModeChange, composition]);

  /** Handle prediction selection */
  const handlePredictionSelect = useCallback((pred: Prediction) => {
    if (onPredictionSelect) onPredictionSelect(pred);
    // Replace last word with prediction
    const words = text.split(/\s+/);
    words[words.length - 1] = pred.text;
    const newText = words.join(' ') + ' ';
    if (isControlled && onChange) {
      onChange(newText);
    } else {
      setInternalText(newText);
    }
    setComposition('');
    setPredictions([]);
  }, [text, isControlled, onChange, onPredictionSelect]);

  /** ---- Swipe gesture handlers ---- */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (inputMode !== 'swipe') return;
    const touch = e.touches[0];
    if (!touch) return;
    touchPoints.current = [{
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    }];
  }, [inputMode]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (inputMode !== 'swipe') return;
    const touch = e.touches[0];
    if (!touch) return;
    touchPoints.current.push({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    });
  }, [inputMode]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (inputMode !== 'swipe') return;
    const points = touchPoints.current;
    if (points.length < 2) return;

    if (isTap(points)) {
      // Short tap = space
      insertText(' ');
      return;
    }

    const gesture = recognizeSwipe(points);
    if (!gesture) return;

    const dir = getSwipeDirection(gesture);
    // Map direction to letters
    const dirMap: Record<string, string[]> = {
      'left': ['a', 'b', 'c', 'd'],
      'right': ['e', 'f', 'g', 'h'],
      'up': ['i', 'j', 'k', 'l', 'm'],
      'down': ['n', 'o', 'p', 'q', 'r'],
      'downleft': ['s', 't'],
      'downright': ['u', 'v'],
      'upleft': ['w', 'x'],
      'upright': ['y', 'z'],
    };

    const letters = dirMap[dir];
    if (!letters) return;

    // Multi-tap on swiped direction: cycle through letters from that sector
    const currentComp = composition;
    const idx = currentComp ? letters.indexOf(currentComp) : -1;
    if (idx >= 0 && idx < letters.length - 1) {
      setComposition(letters[idx + 1]!);
      if (onCompositionChange) onCompositionChange(letters[idx + 1]!);
    } else {
      commitComposition();
      setComposition(letters[0]!);
      if (onCompositionChange) onCompositionChange(letters[0]!);
    }

    // Auto-commit
    if (compositionTimeoutRef.current) clearTimeout(compositionTimeoutRef.current);
    compositionTimeoutRef.current = setTimeout(() => {
      commitComposition();
    }, 1200);

    if (hapticFeedback && navigator.vibrate) navigator.vibrate(10);
  }, [inputMode, insertText, composition, commitComposition, onCompositionChange, hapticFeedback]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (compositionTimeoutRef.current) clearTimeout(compositionTimeoutRef.current);
    };
  }, []);

  // Notify text changes
  useEffect(() => {
    if (onTextChange) onTextChange(text);
  }, [text, onTextChange]);

  // Apply theme
  useEffect(() => {
    if (theme === 'auto') {
      document.documentElement.style.removeProperty('color-scheme');
    } else {
      document.documentElement.style.setProperty('color-scheme', theme);
    }
  }, [theme]);

  /* ---- Render helpers ---- */

  /** Render a single key */
  const renderKey = useCallback((key: KeyDefinition, idx: number) => {
    const isAction = key.action && key.action !== 'character';
    const isSpace = key.action === 'space';
    const isActive = activeKeyIdx === idx && composition.length > 0;

    const classNames = [
      'ckb-key',
      isAction && !isSpace ? 'ckb-key-special' : '',
      isSpace ? 'ckb-key-space' : '',
      key.width && key.width > 1 ? 'ckb-key-wide' : '',
      isActive ? 'ckb-key-tap-active' : '',
      inputMode === 'compact' ? 'ckb-key-compact' : '',
    ].filter(Boolean).join(' ');

    return (
      <button
        key={`k-${idx}`}
        className={classNames}
        aria-label={key.ariaLabel ?? key.primary}
        onPointerDown={(e) => {
          if (inputMode === 'swipe') return;
          e.preventDefault();
          setActiveKeyIdx(idx);
          handleKeyPress(key);
        }}
        onPointerUp={() => setActiveKeyIdx(null)}
        onPointerLeave={() => setActiveKeyIdx(null)}
        style={{
          borderRadius: keyBorderRadius,
          fontSize: inputMode === 'compact' ? '9px' : undefined,
        }}
      >
        {inputMode === 'compact' && key.secondary ? (
          <>
            <span className="ckb-key-primary">
              {composition && key.secondary.includes(composition) ? composition : key.primary[0]!}
            </span>
            <span className="ckb-key-secondary">{key.primary}</span>
          </>
        ) : (
          <>
            {key.primary}
            {key.secondary && key.secondary.length > 1 && inputMode === 't9' && (
              <span className="ckb-key-multitap">
                {composition && key.secondary.includes(composition) ? composition : ''}
              </span>
            )}
          </>
        )}
      </button>
    );
  }, [activeKeyIdx, inputMode, composition, handleKeyPress, keyBorderRadius]);

  /** Render swipe pad */
  const renderSwipeMode = () => (
    <div
      className="ckb-body"
      style={{
        height,
        '--ckb-height': height + 'px',
        '--ckb-key-border-radius': keyBorderRadius + 'px',
        '--ckb-key-gap': keyGap + 'px',
      } as React.CSSProperties}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="ckb-row" style={{ flexWrap: 'wrap', padding: '2px' }}>
        {SWIPE_DIRECTIONS.map((d, i) => (
          <div
            key={i}
            className="ckb-key ckb-key-special ckb-key-compact"
            style={{
              flex: '1 1 22%',
              margin: '1px',
              borderRadius: keyBorderRadius,
              fontSize: '8px',
              flexDirection: 'column',
              gap: '1px',
              padding: '1px',
            }}
          >
            <span style={{ fontSize: '14px' }}>{d.dir}</span>
            <span style={{ fontSize: '7px', opacity: 0.5 }}>{d.letters}</span>
          </div>
        ))}
        <div
          className="ckb-key ckb-key-special"
          style={{
            flex: '1 1 30%',
            margin: '1px',
            borderRadius: keyBorderRadius,
            fontSize: '10px',
          }}
          onPointerDown={() => deleteBackward()}
          aria-label="Backspace"
        >
          ⌫
        </div>
        <div
          className="ckb-key ckb-key-special"
          style={{
            flex: '1 1 22%',
            margin: '1px',
            borderRadius: keyBorderRadius,
            fontSize: '9px',
          }}
          onPointerDown={() => {
            commitComposition();
            insertText(' ');
          }}
          aria-label="Space"
        >
          ␣
        </div>
      </div>
    </div>
  );

  /** Render compact single-row mode */
  const renderCompactMode = () => (
    <div
      className="ckb-body"
      style={{
        height,
        '--ckb-height': height + 'px',
        '--ckb-key-border-radius': keyBorderRadius + 'px',
        '--ckb-key-gap': keyGap + 'px',
      } as React.CSSProperties}
    >
      <div className="ckb-row-single">
        {COMPACT_ROW.map((key, idx) => renderKey(key, idx))}
      </div>
    </div>
  );

  /** Render T9 phone keypad mode */
  const renderT9Mode = () => (
    <div
      className="ckb-body"
      style={{
        height: height * 2.2,
        '--ckb-height': (height * 2.2) + 'px',
        '--ckb-key-border-radius': keyBorderRadius + 'px',
        '--ckb-key-gap': keyGap + 'px',
      } as React.CSSProperties}
    >
      {T9_LAYOUT.map((row, ri) => (
        <div key={`r-${ri}`} className="ckb-row">
          {row.map((key, idx) => renderKey(key, ri * 4 + idx))}
        </div>
      ))}
    </div>
  );

  /* ---- Main render ---- */
  return (
    <div
      ref={containerRef}
      className={['ckb-container', className].filter(Boolean).join(' ')}
      style={{
        '--ckb-height': height + 'px',
        '--ckb-key-border-radius': keyBorderRadius + 'px',
        '--ckb-key-gap': keyGap + 'px',
      } as React.CSSProperties}
    >
      {/* Prediction bar */}
      {showPredictions && predictions.length > 0 && (
        <div className="ckb-predictions">
          {predictions.map((pred, i) => (
            <button
              key={`p-${i}`}
              className="ckb-prediction-btn"
              onPointerDown={(e) => {
                e.preventDefault();
                handlePredictionSelect(pred);
              }}
            >
              {pred.text}
            </button>
          ))}
        </div>
      )}

      {/* Composition display */}
      {composition && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--ckb-prediction-bg)',
            color: 'var(--ckb-prediction-text)',
            fontSize: '12px',
            padding: '1px 8px',
            borderRadius: '0 0 8px 8px',
            zIndex: 10,
            fontWeight: 600,
          }}
        >
          {composition}
        </div>
      )}

      {/* Keyboard body based on mode */}
      {inputMode === 'swipe' && renderSwipeMode()}
      {inputMode === 'compact' && renderCompactMode()}
      {inputMode === 't9' && renderT9Mode()}
    </div>
  );
}
