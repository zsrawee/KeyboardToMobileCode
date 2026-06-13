export { CompactKeyboard } from './keyboard';
export { useCompactKeyboard } from './useCompactKeyboard';
export type {
  KeyboardConfig, KeyboardState, KeyboardRef,
  KeyDefinition, KeyAction, Prediction,
  SwipeGesture, TouchPoint, KeyboardEvents,
} from './types';
export { DEFAULT_CONFIG } from './defaults';
export { getPredictions, t9ToWords } from './prediction';
export { recognizeSwipe, getSwipeDirection, swipeToAction } from './gesture';
