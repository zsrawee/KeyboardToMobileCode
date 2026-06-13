/**
 * Swipe gesture recognizer for compact keyboard
 * Supports directional swipes for fast text entry
 */

import type { SwipeGesture, TouchPoint } from './types';

const SWIPE_THRESHOLD_PX = 30;
const SWIPE_MAX_DURATION_MS = 500;

/** Direction a swipe was made */
export type SwipeDirection =
  | 'left' | 'right' | 'up' | 'down'
  | 'upleft' | 'upright' | 'downleft' | 'downright';

/** Recognize a swipe from a series of touch points */
export function recognizeSwipe(events: TouchPoint[]): SwipeGesture | null {
  if (events.length < 2) return null;
  const start = events[0]!;
  const end = events[events.length - 1]!;
  const duration = end.timestamp - start.timestamp;
  if (duration > SWIPE_MAX_DURATION_MS) return null;

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < SWIPE_THRESHOLD_PX) return null;

  return {
    start,
    end,
    duration,
    distance,
    angle: Math.atan2(dy, dx) * (180 / Math.PI),
  };
}

/** Get direction of a swipe */
export function getSwipeDirection(swipe: SwipeGesture): SwipeDirection {
  const { angle } = swipe;
  // Normalize angle to 0-360
  const a = ((angle % 360) + 360) % 360;

  if (a >= 67.5 && a < 112.5) return 'down';
  if (a >= 112.5 && a < 157.5) return 'downleft';
  if (a >= 157.5 && a < 202.5) return 'left';
  if (a >= 202.5 && a < 247.5) return 'upleft';
  if (a >= 247.5 && a < 292.5) return 'up';
  if (a >= 292.5 && a < 337.5) return 'upright';
  if (a >= 337.5 || a < 22.5) return 'right';
  return 'downright';
}

/** Map swipe direction to a keyboard action */
export function swipeToAction(dir: SwipeDirection): string | null {
  switch (dir) {
    case 'left':    return 'backspace';
    case 'right':   return 'space';
    case 'up':      return 'shift';
    case 'down':    return 'enter';
    case 'upleft':   return null; // could be undo
    case 'upright':  return null;
    case 'downleft': return null;
    case 'downright':return 'mode-switch';
  }
}

/**
 * Swipe-to-type: map a continuous swipe path to a word.
 * Simplified: each direction segment maps to a letter cluster.
 * This is a basic implementation; production would use ML.
 */
const DIRECTION_LETTER_MAP: Partial<Record<SwipeDirection, string[]>> = {
  'left':  ['a', 'b', 'c', 'd'],
  'right': ['e', 'f', 'g', 'h'],
  'up':    ['i', 'j', 'k', 'l', 'm'],
  'down':  ['n', 'o', 'p', 'q', 'r'],
  'downleft':  ['s', 't'],
  'downright': ['u', 'v'],
  'upleft':    ['w', 'x'],
  'upright':   ['y', 'z'],
};

/** Get possible letters for a given swipe direction */
export function swipeDirectionToLetters(dir: SwipeDirection): string[] {
  return DIRECTION_LETTER_MAP[dir] ?? [];
}

/** Check if a touch event sequence looks like typing (short tap) vs swipe */
export function isTap(events: TouchPoint[]): boolean {
  if (events.length < 2) return true;
  const start = events[0]!;
  const end = events[events.length - 1]!;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const duration = end.timestamp - start.timestamp;
  return distance < 15 && duration < 300;
}