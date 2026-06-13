/**
 * Compact Mobile Keyboard Types
 * Professional type definitions for the ultra-low-height keyboard
 */

export interface KeyboardConfig {
  /** Height of the keyboard in pixels (ultra-compact default: 44px) */
  height: number;
  /** Enable haptic feedback on supported devices */
  hapticFeedback: boolean;
  /** Enable audio feedback */
  audioFeedback: boolean;
  /** Input mode: 'compact' (single row) | 't9' (multi-tap) | 'swipe' (gesture) */
  inputMode: 'compact' | 't9' | 'swipe';
  /** Show prediction bar above keyboard */
  showPredictions: boolean;
  /** Maximum number of predictions to show */
  maxPredictions: number;
  /** Locale for predictions */
  locale: string;
  /** Theme: 'light' | 'dark' | 'auto' */
  theme: 'light' | 'dark' | 'auto';
  /** Key border radius */
  keyBorderRadius: number;
  /** Key gap in pixels */
  keyGap: number;
  /** Custom dictionary words */
  customWords: string[];
}

export interface KeyboardState {
  /** Current input text */
  text: string;
  /** Current composition (for multi-tap/T9) */
  composition: string;
  /** Prediction candidates */
  predictions: Prediction[];
  /** Whether keyboard is visible */
  isVisible: boolean;
  /** Current input mode */
  inputMode: KeyboardConfig['inputMode'];
  /** Caret position in text */
  caretPosition: number;
}

export interface Prediction {
  text: string;
  score: number;
  type: 'completion' | 'correction' | 'suggestion';
}

export interface KeyDefinition {
  /** Primary character */
  primary: string;
  /** Secondary characters (long press or multi-tap) */
  secondary?: string[];
  /** Key width multiplier (1 = normal) */
  width?: number;
  /** Key action type */
  action?: KeyAction;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

export type KeyAction =
  | 'character'
  | 'backspace'
  | 'enter'
  | 'space'
  | 'shift'
  | 'symbols'
  | 'numbers'
  | 'settings'
  | 'voice'
  | 'emoji'
  | 'mode-switch'
  | 'cursor-left'
  | 'cursor-right'
  | 'cursor-up'
  | 'cursor-down';

export interface KeyboardLayout {
  name: string;
  rows: KeyDefinition[][];
}

export interface KeyboardEvents {
  onTextChange: (text: string) => void;
  onKeyPress: (key: KeyDefinition, event: PointerEvent) => void;
  onCompositionChange: (composition: string) => void;
  onPredictionSelect: (prediction: Prediction) => void;
  onVisibilityChange: (visible: boolean) => void;
  onModeChange: (mode: KeyboardConfig['inputMode']) => void;
  onError: (error: KeyboardError) => void;
}

export interface KeyboardError {
  code: string;
  message: string;
  recoverable: boolean;
}

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeGesture {
  start: TouchPoint;
  end: TouchPoint;
  duration: number;
  distance: number;
  angle: number;
}

export interface KeyboardRef {
  focus: () => void;
  blur: () => void;
  setText: (text: string) => void;
  getText: () => string;
  insertText: (text: string) => void;
  deleteBackward: (count?: number) => void;
  setInputMode: (mode: KeyboardConfig['inputMode']) => void;
  show: () => void;
  hide: () => void;
  updateConfig: (config: Partial<KeyboardConfig>) => void;
}