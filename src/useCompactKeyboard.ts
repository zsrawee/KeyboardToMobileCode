import { useState, useCallback, useRef, useEffect } from 'react';
import type { KeyboardConfig, KeyboardState, KeyboardRef, Prediction, KeyDefinition } from './types';
import { DEFAULT_CONFIG } from './defaults';
import { getPredictions } from './prediction';

interface UseCompactKeyboardReturn {
  state: KeyboardState;
  config: KeyboardConfig;
  ref: KeyboardRef;
  setConfig: (patch: Partial<KeyboardConfig>) => void;
  insertText: (text: string) => void;
  deleteBackward: (count?: number) => void;
  setInputMode: (mode: KeyboardConfig['inputMode']) => void;
  handleKeyPress: (key: KeyDefinition) => void;
}

export function useCompactKeyboard(
  initialConfig: Partial<KeyboardConfig> = {}
): UseCompactKeyboardReturn {
  const configRef = useRef<KeyboardConfig>({ ...DEFAULT_CONFIG, ...initialConfig });
  const [state, setState] = useState<KeyboardState>({
    text: '',
    composition: '',
    predictions: [],
    isVisible: true,
    inputMode: configRef.current.inputMode,
    caretPosition: 0,
  });

  const updatePredictions = useCallback((text: string) => {
    const cfg = configRef.current;
    if (!cfg.showPredictions) {
      setState(s => ({ ...s, predictions: [] }));
      return;
    }
    // Get last word prefix
    const words = text.split(/\s+/);
    const lastWord = words[words.length - 1] ?? '';
    if (lastWord.length > 0) {
      const preds = getPredictions(lastWord, cfg.maxPredictions, cfg.locale);
      setState(s => ({ ...s, predictions: preds }));
    } else {
      setState(s => ({ ...s, predictions: [] }));
    }
  }, []);

  const insertText = useCallback((text: string) => {
    setState(prev => {
      const pos = prev.caretPosition;
      const newText = prev.text.slice(0, pos) + text + prev.text.slice(pos);
      const newPos = pos + text.length;
      // Update predictions after state update via timeout
      setTimeout(() => updatePredictions(newText), 0);
      return {
        ...prev,
        text: newText,
        composition: '',
        caretPosition: newPos,
      };
    });
  }, [updatePredictions]);

  const deleteBackward = useCallback((count: number = 1) => {
    setState(prev => {
      const pos = prev.caretPosition;
      const delCount = Math.min(count, pos);
      const newText = prev.text.slice(0, pos - delCount) + prev.text.slice(pos);
      setTimeout(() => updatePredictions(newText), 0);
      return {
        ...prev,
        text: newText,
        composition: '',
        caretPosition: pos - delCount,
      };
    });
  }, [updatePredictions]);

  const setInputMode = useCallback((mode: KeyboardConfig['inputMode']) => {
    configRef.current.inputMode = mode;
    setState(prev => ({ ...prev, composition: '', inputMode: mode }));
  }, []);

  const handleKeyPress = useCallback((key: KeyDefinition) => {
    const action = key.action ?? 'character';
    switch (action) {
      case 'character': {
        if (key.secondary && key.secondary.length > 0) {
          // Multi-tap: cycle through secondary characters
          setState(prev => {
            const comp = prev.composition || key.primary;
            const all = [key.primary, ...key.secondary];
            let nextComp: string;
            if (prev.composition) {
              const idx = all.indexOf(prev.composition);
              if (idx >= 0 && idx < all.length - 1) {
                nextComp = all[idx + 1]!;
              } else {
                // Accept current composition, start new
                const newText = prev.text + prev.composition;
                setTimeout(() => updatePredictions(newText), 0);
                return {
                  ...prev,
                  text: newText,
                  composition: '',
                  caretPosition: prev.caretPosition + prev.composition.length,
                };
              }
            } else {
              nextComp = all[0]!;
            }
            return { ...prev, composition: nextComp };
          });
        } else {
          insertText(key.primary);
        }
        break;
      }
      case 'backspace':
        deleteBackward();
        break;
      case 'space':
        insertText(' ');
        break;
      case 'enter':
        insertText('\n');
        break;
      case 'mode-switch': {
        const modes: KeyboardConfig['inputMode'][] = ['compact', 't9', 'swipe'];
        const currentIdx = modes.indexOf(configRef.current.inputMode);
        const nextMode = modes[(currentIdx + 1) % modes.length]!;
        setInputMode(nextMode);
        break;
      }
    }
  }, [insertText, deleteBackward, setInputMode, updatePredictions]);

  const setConfig = useCallback((patch: Partial<KeyboardConfig>) => {
    configRef.current = { ...configRef.current, ...patch };
    setState(prev => ({ ...prev }));
  }, []);

  const ref: KeyboardRef = {
    focus: () => {},
    blur: () => {},
    setText: (text: string) => {
      setState(prev => ({ ...prev, text }));
      updatePredictions(text);
    },
    getText: () => state.text,
    insertText,
    deleteBackward,
    setInputMode,
    show: () => setState(prev => ({ ...prev, isVisible: true })),
    hide: () => setState(prev => ({ ...prev, isVisible: false })),
    updateConfig: setConfig,
  };

  return {
    state,
    config: configRef.current,
    ref,
    setConfig,
    insertText,
    deleteBackward,
    setInputMode,
    handleKeyPress,
  };
}