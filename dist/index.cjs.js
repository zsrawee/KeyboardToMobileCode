
/* ---- auto-injected keyboard styles ---- */
(function(){
  if (typeof document === 'undefined') return;
  var id = '__ckb_styles';
  if (document.getElementById(id)) return;
  var s = document.createElement('style');
  s.id = id;
  s.textContent = `/* ============================================================
   Compact Mobile Keyboard – Professional Styles
   Minimal vertical footprint, fully responsive.
   ============================================================ */

/* ---- CSS Variables (theme) ---- */
:root {
  --ckb-height: 44px;
  --ckb-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --ckb-bg: #f2f2f7;
  --ckb-key-bg: #ffffff;
  --ckb-key-bg-active: #e5e5ea;
  --ckb-key-text: #1c1c1e;
  --ckb-key-text-secondary: #636366;
  --ckb-key-border-radius: 6px;
  --ckb-key-gap: 2px;
  --ckb-prediction-bg: #e5e5ea;
  --ckb-prediction-text: #007aff;
  --ckb-special-key-bg: #d1d1d6;
  --ckb-caret-color: #007aff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --ckb-bg: #1c1c1e;
    --ckb-key-bg: #2c2c2e;
    --ckb-key-bg-active: #3a3a3c;
    --ckb-key-text: #ffffff;
    --ckb-key-text-secondary: #8e8e93;
    --ckb-prediction-bg: #2c2c2e;
    --ckb-prediction-text: #0a84ff;
    --ckb-special-key-bg: #3a3a3c;
    --ckb-caret-color: #0a84ff;
  }
}

/* ---- Root container ---- */
.ckb-container {
  font-family: var(--ckb-font-family);
  -webkit-user-select: none;
  user-select: none;
  touch-action: manipulation;
  width: 100%;
  max-width: 100%;
  direction: ltr;
}

/* ---- Prediction bar ---- */
.ckb-predictions {
  display: flex;
  gap: 4px;
  padding: 4px 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  background: var(--ckb-bg);
  border-bottom: 1px solid rgba(128, 128, 128, 0.15);
  min-height: 32px;
}
.ckb-predictions::-webkit-scrollbar { display: none; }

.ckb-prediction-btn {
  flex-shrink: 0;
  padding: 2px 10px;
  border: none;
  border-radius: 12px;
  background: var(--ckb-prediction-bg);
  color: var(--ckb-prediction-text);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.1s;
}
.ckb-prediction-btn:active {
  opacity: 0.7;
}

/* ---- Keyboard body ---- */
.ckb-body {
  background: var(--ckb-bg);
  padding: 2px 2px;
  display: flex;
  flex-direction: column;
  gap: var(--ckb-key-gap);
  height: var(--ckb-height);
  box-sizing: border-box;
  overflow: hidden;
}

/* ---- Single compact row ---- */
.ckb-row {
  display: flex;
  gap: var(--ckb-key-gap);
  flex: 1;
  justify-content: center;
}

.ckb-row-single {
  display: flex;
  gap: 1px;
  flex: 1;
  align-items: stretch;
  justify-content: space-evenly;
}

/* ---- Key base ---- */
.ckb-key {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: var(--ckb-key-bg);
  color: var(--ckb-key-text);
  border: none;
  border-radius: var(--ckb-key-border-radius);
  font-size: 11px;
  font-weight: 500;
  padding: 0 1px;
  cursor: pointer;
  position: relative;
  transition: background 0.05s, transform 0.05s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  outline: none;
  min-width: 0;
  font-family: var(--ckb-font-family);
  line-height: 1;
}

.ckb-key:active,
.ckb-key-active {
  background: var(--ckb-key-bg-active) !important;
  transform: scale(0.95);
}

.ckb-key-special {
  background: var(--ckb-special-key-bg);
  font-size: 14px;
}

.ckb-key-wide {
  flex: 1.5;
}

.ckb-key-space {
  flex: 2.5;
}

/* ---- Multi-tap indicator ---- */
.ckb-key-multitap {
  font-size: 10px;
  color: var(--ckb-key-text-secondary);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* ---- Active multi-tap highlight ---- */
.ckb-key-tap-active .ckb-key-multitap {
  color: var(--ckb-prediction-text);
  font-weight: 600;
}

/* ---- Compact row key (very small, shows 2-3 letters) ---- */
.ckb-key-compact {
  font-size: 9px;
  letter-spacing: -0.3px;
  flex-direction: column;
  padding: 1px 0;
}
.ckb-key-compact .ckb-key-primary {
  font-size: 12px;
  font-weight: 600;
}
.ckb-key-compact .ckb-key-secondary {
  font-size: 7px;
  color: var(--ckb-key-text-secondary);
  letter-spacing: -0.2px;
}

/* ---- Swipe hint ---- */
.ckb-swipe-hint {
  position: absolute;
  bottom: 1px;
  right: 3px;
  font-size: 6px;
  color: var(--ckb-key-text-secondary);
  opacity: 0.4;
}

/* ---- Active mode indicator ---- */
.ckb-mode-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: var(--ckb-key-text-secondary);
  padding: 2px 4px;
  background: var(--ckb-special-key-bg);
  border-radius: 4px;
  margin: 0 2px;
}

/* ---- Accessibility ---- */
.ckb-key:focus-visible {
  outline: 2px solid var(--ckb-caret-color);
  outline-offset: -2px;
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .ckb-key {
    transition: none;
  }
}`;
  document.head.appendChild(s);
})();

"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  CompactKeyboard: () => CompactKeyboard,
  DEFAULT_CONFIG: () => DEFAULT_CONFIG,
  getPredictions: () => getPredictions,
  getSwipeDirection: () => getSwipeDirection,
  recognizeSwipe: () => recognizeSwipe,
  swipeToAction: () => swipeToAction,
  t9ToWords: () => t9ToWords,
  useCompactKeyboard: () => useCompactKeyboard
});
module.exports = __toCommonJS(src_exports);

// src/keyboard.tsx
var import_react = require("react");

// src/defaults.ts
var DEFAULT_CONFIG = {
  height: 44,
  hapticFeedback: true,
  audioFeedback: false,
  inputMode: "compact",
  showPredictions: true,
  maxPredictions: 3,
  locale: "en-US",
  theme: "auto",
  keyBorderRadius: 6,
  keyGap: 2,
  customWords: []
};
var FREQUENCY_DICT = {
  "the": 1,
  "be": 0.98,
  "to": 0.97,
  "of": 0.96,
  "and": 0.95,
  "a": 0.94,
  "in": 0.93,
  "that": 0.92,
  "have": 0.91,
  "it": 0.9,
  "for": 0.89,
  "not": 0.88,
  "on": 0.87,
  "with": 0.86,
  "he": 0.85,
  "as": 0.84,
  "you": 0.83,
  "do": 0.82,
  "at": 0.81,
  "this": 0.8,
  "but": 0.79,
  "his": 0.78,
  "by": 0.77,
  "from": 0.76,
  "they": 0.75,
  "we": 0.74,
  "say": 0.73,
  "her": 0.72,
  "she": 0.71,
  "or": 0.7,
  "an": 0.69,
  "will": 0.68,
  "my": 0.67,
  "one": 0.66,
  "all": 0.65,
  "would": 0.64,
  "there": 0.63,
  "their": 0.62,
  "what": 0.61,
  "so": 0.6,
  "up": 0.59,
  "out": 0.58,
  "if": 0.57,
  "about": 0.56,
  "who": 0.55,
  "get": 0.54,
  "which": 0.53,
  "go": 0.52,
  "me": 0.51,
  "when": 0.5,
  "make": 0.49,
  "can": 0.48,
  "like": 0.47,
  "time": 0.46,
  "no": 0.45,
  "just": 0.44,
  "him": 0.43,
  "know": 0.42,
  "take": 0.41,
  "people": 0.4,
  "into": 0.39,
  "year": 0.38,
  "your": 0.37,
  "good": 0.36,
  "some": 0.35,
  "could": 0.34,
  "them": 0.33,
  "see": 0.32,
  "other": 0.31,
  "than": 0.3,
  "then": 0.29,
  "now": 0.28,
  "look": 0.27,
  "only": 0.26,
  "come": 0.25,
  "its": 0.24,
  "over": 0.23,
  "think": 0.22,
  "also": 0.21,
  "back": 0.2,
  "after": 0.19,
  "use": 0.18,
  "two": 0.17,
  "how": 0.16,
  "our": 0.15,
  "work": 0.14,
  "first": 0.13,
  "well": 0.12,
  "way": 0.11,
  "even": 0.1,
  "new": 0.09,
  "want": 0.08,
  "because": 0.07,
  "any": 0.06,
  "these": 0.05,
  "give": 0.04,
  "day": 0.03,
  "most": 0.02,
  "us": 0.01
};

// src/prediction.ts
var TrieNode = class {
  children = /* @__PURE__ */ new Map();
  score = 0;
  isWord = false;
};
var cachedTrie = /* @__PURE__ */ new Map();
function getTrie(locale) {
  if (cachedTrie.has(locale))
    return cachedTrie.get(locale);
  const root = new TrieNode();
  for (const [word, freq] of Object.entries(FREQUENCY_DICT)) {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch))
        node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isWord = true;
    node.score = freq;
  }
  cachedTrie.set(locale, root);
  return root;
}
function getPredictions(prefix, max = 3, locale = "en-US") {
  if (!prefix)
    return [];
  const root = getTrie(locale);
  const lower = prefix.toLowerCase();
  let node = root;
  for (const ch of lower) {
    if (!node.children.has(ch))
      return [];
    node = node.children.get(ch);
  }
  const results = [];
  const stack = [{ node, suffix: "" }];
  const prefixLen = prefix.length;
  while (stack.length > 0 && results.length < max) {
    const { node: n, suffix } = stack.pop();
    if (n.isWord && n.score > 0) {
      const full = prefix.slice(0, prefixLen - lower.length) + lower + suffix;
      results.push({
        text: full,
        score: n.score,
        type: prefix.length >= 2 ? "completion" : "suggestion"
      });
    }
    const entries = Array.from(n.children.entries()).sort(
      ([, a], [, b]) => (b.score || 0) - (a.score || 0)
    );
    for (let i = entries.length - 1; i >= 0; i--) {
      const [ch, childNode] = entries[i];
      stack.push({ node: childNode, suffix: ch + suffix });
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, max);
}
var T9_MAP = {
  "2": ["a", "b", "c"],
  "3": ["d", "e", "f"],
  "4": ["g", "h", "i"],
  "5": ["j", "k", "l"],
  "6": ["m", "n", "o"],
  "7": ["p", "q", "r", "s"],
  "8": ["t", "u", "v"],
  "9": ["w", "x", "y", "z"],
  "0": [" "]
};
function t9ToWords(digits) {
  if (!digits)
    return [];
  const options = [];
  for (const d of digits) {
    const chars = T9_MAP[d];
    if (chars)
      options.push(chars);
  }
  if (options.length === 0)
    return [];
  const dict = FREQUENCY_DICT;
  const candidates = [];
  function dfs(idx, current) {
    if (idx === options.length) {
      if (dict[current] || current.length <= 2) {
        candidates.push(current);
      }
      return;
    }
    for (const ch of options[idx]) {
      dfs(idx + 1, current + ch);
    }
  }
  dfs(0, "");
  return candidates.sort((a, b) => (dict[b] || 0) - (dict[a] || 0));
}

// src/gesture.ts
var SWIPE_THRESHOLD_PX = 30;
var SWIPE_MAX_DURATION_MS = 500;
function recognizeSwipe(events) {
  if (events.length < 2)
    return null;
  const start = events[0];
  const end = events[events.length - 1];
  const duration = end.timestamp - start.timestamp;
  if (duration > SWIPE_MAX_DURATION_MS)
    return null;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < SWIPE_THRESHOLD_PX)
    return null;
  return {
    start,
    end,
    duration,
    distance,
    angle: Math.atan2(dy, dx) * (180 / Math.PI)
  };
}
function getSwipeDirection(swipe) {
  const { angle } = swipe;
  const a = (angle % 360 + 360) % 360;
  if (a >= 67.5 && a < 112.5)
    return "down";
  if (a >= 112.5 && a < 157.5)
    return "downleft";
  if (a >= 157.5 && a < 202.5)
    return "left";
  if (a >= 202.5 && a < 247.5)
    return "upleft";
  if (a >= 247.5 && a < 292.5)
    return "up";
  if (a >= 292.5 && a < 337.5)
    return "upright";
  if (a >= 337.5 || a < 22.5)
    return "right";
  return "downright";
}
function swipeToAction(dir) {
  switch (dir) {
    case "left":
      return "backspace";
    case "right":
      return "space";
    case "up":
      return "shift";
    case "down":
      return "enter";
    case "upleft":
      return null;
    case "upright":
      return null;
    case "downleft":
      return null;
    case "downright":
      return "mode-switch";
  }
}
function isTap(events) {
  if (events.length < 2)
    return true;
  const start = events[0];
  const end = events[events.length - 1];
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const duration = end.timestamp - start.timestamp;
  return distance < 15 && duration < 300;
}

// src/keyboard.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var COMPACT_ROW = [
  { primary: "abc", secondary: ["a", "b", "c"], ariaLabel: "a b c" },
  { primary: "def", secondary: ["d", "e", "f"], ariaLabel: "d e f" },
  { primary: "ghi", secondary: ["g", "h", "i"], ariaLabel: "g h i" },
  { primary: "jkl", secondary: ["j", "k", "l"], ariaLabel: "j k l" },
  { primary: "mno", secondary: ["m", "n", "o"], ariaLabel: "m n o" },
  { primary: "pqrs", secondary: ["p", "q", "r", "s"], ariaLabel: "p q r s" },
  { primary: "tuv", secondary: ["t", "u", "v"], ariaLabel: "t u v" },
  { primary: "wxyz", secondary: ["w", "x", "y", "z"], ariaLabel: "w x y z" },
  { primary: "/", action: "character", ariaLabel: "Forward slash" },
  { primary: "#", action: "character", ariaLabel: "Hash" },
  { primary: "\u2190", action: "cursor-left", ariaLabel: "Cursor left" },
  { primary: "\u2191", action: "cursor-up", ariaLabel: "Cursor up" },
  { primary: "\u2193", action: "cursor-down", ariaLabel: "Cursor down" },
  { primary: "\u2192", action: "cursor-right", ariaLabel: "Cursor right" },
  { primary: "\u232B", action: "backspace", ariaLabel: "Backspace" },
  { primary: "\u25C9", action: "mode-switch", ariaLabel: "Switch input mode" }
];
var T9_LAYOUT = [
  [
    { primary: "abc", secondary: ["a", "b", "c"], ariaLabel: "2 a b c" },
    { primary: "def", secondary: ["d", "e", "f"], ariaLabel: "3 d e f" },
    { primary: "ghi", secondary: ["g", "h", "i"], ariaLabel: "4 g h i" }
  ],
  [
    { primary: "jkl", secondary: ["j", "k", "l"], ariaLabel: "5 j k l" },
    { primary: "mno", secondary: ["m", "n", "o"], ariaLabel: "6 m n o" },
    { primary: "pqrs", secondary: ["p", "q", "r", "s"], ariaLabel: "7 p q r s" }
  ],
  [
    { primary: "tuv", secondary: ["t", "u", "v"], ariaLabel: "8 t u v" },
    { primary: "wxyz", secondary: ["w", "x", "y", "z"], ariaLabel: "9 w x y z" },
    { primary: "\u232B", action: "backspace", ariaLabel: "Backspace" }
  ],
  [
    { primary: "\u25C9", action: "mode-switch", ariaLabel: "Switch mode", width: 1.2 },
    { primary: " ", action: "space", ariaLabel: "Space", width: 1.5 },
    { primary: "\u21B5", action: "enter", ariaLabel: "Enter" }
  ]
];
var SWIPE_DIRECTIONS = [
  { dir: "\u2190", label: "left", letters: "ABCD" },
  { dir: "\u2192", label: "right", letters: "EFGH" },
  { dir: "\u2191", label: "up", letters: "IJKLM" },
  { dir: "\u2193", label: "down", letters: "NOPQR" },
  { dir: "\u2199", label: "downleft", letters: "ST" },
  { dir: "\u2198", label: "downright", letters: "UV" },
  { dir: "\u2196", label: "upleft", letters: "WX" },
  { dir: "\u2197", label: "upright", letters: "YZ" }
];
function CompactKeyboard({
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
  onModeChange
}) {
  const [internalText, setInternalText] = (0, import_react.useState)("");
  const [cursorPos, setCursorPos] = (0, import_react.useState)(0);
  const [composition, setComposition] = (0, import_react.useState)("");
  const [predictions, setPredictions] = (0, import_react.useState)([]);
  const [inputMode, setInputMode] = (0, import_react.useState)(initialInputMode);
  const [activeKeyIdx, setActiveKeyIdx] = (0, import_react.useState)(null);
  const isControlled = controlledValue !== void 0;
  const text = isControlled ? controlledValue : internalText;
  const effectiveCursor = isControlled ? text.length : cursorPos;
  const touchPoints = (0, import_react.useRef)([]);
  const containerRef = (0, import_react.useRef)(null);
  const tapTimeoutRef = (0, import_react.useRef)(null);
  const compositionTimeoutRef = (0, import_react.useRef)(null);
  const updatePredictions = (0, import_react.useCallback)((currentText) => {
    if (!showPredictions) {
      setPredictions([]);
      return;
    }
    const words = currentText.split(/\s+/);
    const lastWord = words[words.length - 1] ?? "";
    if (lastWord.length > 0) {
      setPredictions(getPredictions(lastWord, maxPredictions, locale));
    } else {
      setPredictions([]);
    }
  }, [showPredictions, maxPredictions, locale]);
  const insertText = (0, import_react.useCallback)((t) => {
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
    if (hapticFeedback && navigator.vibrate)
      navigator.vibrate(10);
  }, [isControlled, onChange, cursorPos, text, internalText, updatePredictions, hapticFeedback]);
  const deleteBackward = (0, import_react.useCallback)(() => {
    if (isControlled && onChange) {
      const currentText = text;
      const newText = currentText.slice(0, -1);
      onChange(newText);
      updatePredictions(newText);
    } else {
      const pos = cursorPos;
      if (pos <= 0)
        return;
      const newText = internalText.slice(0, pos - 1) + internalText.slice(pos);
      setInternalText(newText);
      setCursorPos(pos - 1);
      updatePredictions(newText);
    }
    if (hapticFeedback && navigator.vibrate)
      navigator.vibrate(15);
  }, [isControlled, onChange, cursorPos, text, internalText, updatePredictions, hapticFeedback]);
  const moveCursor = (0, import_react.useCallback)((dir) => {
    if (isControlled)
      return;
    const pos = cursorPos;
    const len = internalText.length;
    let newPos = pos;
    switch (dir) {
      case "left":
        newPos = Math.max(0, pos - 1);
        break;
      case "right":
        newPos = Math.min(len, pos + 1);
        break;
      case "up": {
        const before = internalText.slice(0, pos);
        const lastNewline = before.lastIndexOf("\n");
        if (lastNewline > 0) {
          newPos = lastNewline;
        } else if (lastNewline === 0) {
          newPos = 0;
        }
        break;
      }
      case "down": {
        const after = internalText.slice(pos);
        const nextNewline = after.indexOf("\n");
        if (nextNewline >= 0) {
          newPos = pos + nextNewline + 1;
        } else {
          newPos = len;
        }
        break;
      }
    }
    setCursorPos(newPos);
    if (hapticFeedback && navigator.vibrate)
      navigator.vibrate(5);
  }, [isControlled, cursorPos, internalText, hapticFeedback]);
  const commitComposition = (0, import_react.useCallback)(() => {
    if (composition) {
      insertText(composition);
      setComposition("");
      if (onCompositionChange)
        onCompositionChange("");
    }
  }, [composition, insertText, onCompositionChange]);
  const handleMultiTapKey = (0, import_react.useCallback)((key) => {
    if (!key.secondary || key.secondary.length === 0)
      return;
    const allChars = key.secondary;
    const currentComp = composition;
    let idx = allChars.indexOf(currentComp);
    if (idx >= 0 && idx < allChars.length - 1) {
      const nextChar = allChars[idx + 1];
      setComposition(nextChar);
      if (onCompositionChange)
        onCompositionChange(nextChar);
      if (compositionTimeoutRef.current)
        clearTimeout(compositionTimeoutRef.current);
      compositionTimeoutRef.current = setTimeout(() => {
        commitComposition();
      }, 1200);
    } else {
      commitComposition();
      const firstChar = allChars[0];
      setComposition(firstChar);
      if (onCompositionChange)
        onCompositionChange(firstChar);
      if (compositionTimeoutRef.current)
        clearTimeout(compositionTimeoutRef.current);
      compositionTimeoutRef.current = setTimeout(() => {
        commitComposition();
      }, 1200);
    }
  }, [composition, commitComposition, onCompositionChange]);
  const handleKeyPress = (0, import_react.useCallback)((key, event) => {
    if (onKeyPress)
      onKeyPress(key, event ?? new PointerEvent("pointerdown"));
    const action = key.action ?? "character";
    switch (action) {
      case "character": {
        if (inputMode === "swipe")
          return;
        if (key.secondary && key.secondary.length > 0 && inputMode !== "t9") {
          handleMultiTapKey(key);
        } else if (inputMode === "t9" && key.secondary) {
          handleMultiTapKey(key);
        } else {
          insertText(key.primary);
        }
        break;
      }
      case "backspace":
        if (composition) {
          setComposition("");
          if (onCompositionChange)
            onCompositionChange("");
        } else {
          deleteBackward();
        }
        break;
      case "space":
        commitComposition();
        insertText(" ");
        break;
      case "enter":
        commitComposition();
        insertText("\n");
        break;
      case "cursor-left":
        moveCursor("left");
        break;
      case "cursor-right":
        moveCursor("right");
        break;
      case "cursor-up":
        moveCursor("up");
        break;
      case "cursor-down":
        moveCursor("down");
        break;
      case "mode-switch": {
        commitComposition();
        const modes = ["compact", "t9", "swipe"];
        const curIdx = modes.indexOf(inputMode);
        const nextMode = modes[(curIdx + 1) % modes.length];
        setInputMode(nextMode);
        setPredictions([]);
        if (onModeChange)
          onModeChange(nextMode);
        break;
      }
    }
  }, [inputMode, insertText, deleteBackward, commitComposition, handleMultiTapKey, moveCursor, onKeyPress, onCompositionChange, onModeChange, composition]);
  const handlePredictionSelect = (0, import_react.useCallback)((pred) => {
    if (onPredictionSelect)
      onPredictionSelect(pred);
    const words = text.split(/\s+/);
    words[words.length - 1] = pred.text;
    const newText = words.join(" ") + " ";
    if (isControlled && onChange) {
      onChange(newText);
    } else {
      setInternalText(newText);
    }
    setComposition("");
    setPredictions([]);
  }, [text, isControlled, onChange, onPredictionSelect]);
  const handleTouchStart = (0, import_react.useCallback)((e) => {
    if (inputMode !== "swipe")
      return;
    const touch = e.touches[0];
    if (!touch)
      return;
    touchPoints.current = [{
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }];
  }, [inputMode]);
  const handleTouchMove = (0, import_react.useCallback)((e) => {
    if (inputMode !== "swipe")
      return;
    const touch = e.touches[0];
    if (!touch)
      return;
    touchPoints.current.push({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    });
  }, [inputMode]);
  const handleTouchEnd = (0, import_react.useCallback)((e) => {
    if (inputMode !== "swipe")
      return;
    const points = touchPoints.current;
    if (points.length < 2)
      return;
    if (isTap(points)) {
      insertText(" ");
      return;
    }
    const gesture = recognizeSwipe(points);
    if (!gesture)
      return;
    const dir = getSwipeDirection(gesture);
    const dirMap = {
      "left": ["a", "b", "c", "d"],
      "right": ["e", "f", "g", "h"],
      "up": ["i", "j", "k", "l", "m"],
      "down": ["n", "o", "p", "q", "r"],
      "downleft": ["s", "t"],
      "downright": ["u", "v"],
      "upleft": ["w", "x"],
      "upright": ["y", "z"]
    };
    const letters = dirMap[dir];
    if (!letters)
      return;
    const currentComp = composition;
    const idx = currentComp ? letters.indexOf(currentComp) : -1;
    if (idx >= 0 && idx < letters.length - 1) {
      setComposition(letters[idx + 1]);
      if (onCompositionChange)
        onCompositionChange(letters[idx + 1]);
    } else {
      commitComposition();
      setComposition(letters[0]);
      if (onCompositionChange)
        onCompositionChange(letters[0]);
    }
    if (compositionTimeoutRef.current)
      clearTimeout(compositionTimeoutRef.current);
    compositionTimeoutRef.current = setTimeout(() => {
      commitComposition();
    }, 1200);
    if (hapticFeedback && navigator.vibrate)
      navigator.vibrate(10);
  }, [inputMode, insertText, composition, commitComposition, onCompositionChange, hapticFeedback]);
  (0, import_react.useEffect)(() => {
    return () => {
      if (compositionTimeoutRef.current)
        clearTimeout(compositionTimeoutRef.current);
    };
  }, []);
  (0, import_react.useEffect)(() => {
    if (onTextChange)
      onTextChange(text);
  }, [text, onTextChange]);
  (0, import_react.useEffect)(() => {
    if (theme === "auto") {
      document.documentElement.style.removeProperty("color-scheme");
    } else {
      document.documentElement.style.setProperty("color-scheme", theme);
    }
  }, [theme]);
  const renderKey = (0, import_react.useCallback)((key, idx) => {
    const isAction = key.action && key.action !== "character";
    const isSpace = key.action === "space";
    const isActive = activeKeyIdx === idx && composition.length > 0;
    const classNames = [
      "ckb-key",
      isAction && !isSpace ? "ckb-key-special" : "",
      isSpace ? "ckb-key-space" : "",
      key.width && key.width > 1 ? "ckb-key-wide" : "",
      isActive ? "ckb-key-tap-active" : "",
      inputMode === "compact" ? "ckb-key-compact" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        className: classNames,
        "aria-label": key.ariaLabel ?? key.primary,
        onPointerDown: (e) => {
          if (inputMode === "swipe")
            return;
          e.preventDefault();
          setActiveKeyIdx(idx);
          handleKeyPress(key);
        },
        onPointerUp: () => setActiveKeyIdx(null),
        onPointerLeave: () => setActiveKeyIdx(null),
        style: {
          borderRadius: keyBorderRadius,
          fontSize: inputMode === "compact" ? "9px" : void 0
        },
        children: inputMode === "compact" && key.secondary ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ckb-key-primary", children: composition && key.secondary.includes(composition) ? composition : key.primary[0] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ckb-key-secondary", children: key.primary })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          key.primary,
          key.secondary && key.secondary.length > 1 && inputMode === "t9" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ckb-key-multitap", children: composition && key.secondary.includes(composition) ? composition : "" })
        ] })
      },
      `k-${idx}`
    );
  }, [activeKeyIdx, inputMode, composition, handleKeyPress, keyBorderRadius]);
  const renderSwipeMode = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: "ckb-body",
      style: {
        height,
        "--ckb-height": height + "px",
        "--ckb-key-border-radius": keyBorderRadius + "px",
        "--ckb-key-gap": keyGap + "px"
      },
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ckb-row", style: { flexWrap: "wrap", padding: "2px" }, children: [
        SWIPE_DIRECTIONS.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "div",
          {
            className: "ckb-key ckb-key-special ckb-key-compact",
            style: {
              flex: "1 1 22%",
              margin: "1px",
              borderRadius: keyBorderRadius,
              fontSize: "8px",
              flexDirection: "column",
              gap: "1px",
              padding: "1px"
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: "14px" }, children: d.dir }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: "7px", opacity: 0.5 }, children: d.letters })
            ]
          },
          i
        )),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            className: "ckb-key ckb-key-special",
            style: {
              flex: "1 1 30%",
              margin: "1px",
              borderRadius: keyBorderRadius,
              fontSize: "10px"
            },
            onPointerDown: () => deleteBackward(),
            "aria-label": "Backspace",
            children: "\u232B"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            className: "ckb-key ckb-key-special",
            style: {
              flex: "1 1 22%",
              margin: "1px",
              borderRadius: keyBorderRadius,
              fontSize: "9px"
            },
            onPointerDown: () => {
              commitComposition();
              insertText(" ");
            },
            "aria-label": "Space",
            children: "\u2423"
          }
        )
      ] })
    }
  );
  const renderCompactMode = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: "ckb-body",
      style: {
        height,
        "--ckb-height": height + "px",
        "--ckb-key-border-radius": keyBorderRadius + "px",
        "--ckb-key-gap": keyGap + "px"
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ckb-row-single", children: COMPACT_ROW.map((key, idx) => renderKey(key, idx)) })
    }
  );
  const renderT9Mode = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: "ckb-body",
      style: {
        height: height * 2.2,
        "--ckb-height": height * 2.2 + "px",
        "--ckb-key-border-radius": keyBorderRadius + "px",
        "--ckb-key-gap": keyGap + "px"
      },
      children: T9_LAYOUT.map((row, ri) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ckb-row", children: row.map((key, idx) => renderKey(key, ri * 4 + idx)) }, `r-${ri}`))
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      ref: containerRef,
      className: ["ckb-container", className].filter(Boolean).join(" "),
      style: {
        "--ckb-height": height + "px",
        "--ckb-key-border-radius": keyBorderRadius + "px",
        "--ckb-key-gap": keyGap + "px"
      },
      children: [
        showPredictions && predictions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ckb-predictions", children: predictions.map((pred, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            className: "ckb-prediction-btn",
            onPointerDown: (e) => {
              e.preventDefault();
              handlePredictionSelect(pred);
            },
            children: pred.text
          },
          `p-${i}`
        )) }),
        composition && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            style: {
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--ckb-prediction-bg)",
              color: "var(--ckb-prediction-text)",
              fontSize: "12px",
              padding: "1px 8px",
              borderRadius: "0 0 8px 8px",
              zIndex: 10,
              fontWeight: 600
            },
            children: composition
          }
        ),
        inputMode === "swipe" && renderSwipeMode(),
        inputMode === "compact" && renderCompactMode(),
        inputMode === "t9" && renderT9Mode()
      ]
    }
  );
}

// src/useCompactKeyboard.ts
var import_react2 = require("react");
function useCompactKeyboard(initialConfig = {}) {
  const configRef = (0, import_react2.useRef)({ ...DEFAULT_CONFIG, ...initialConfig });
  const [state, setState] = (0, import_react2.useState)({
    text: "",
    composition: "",
    predictions: [],
    isVisible: true,
    inputMode: configRef.current.inputMode,
    caretPosition: 0
  });
  const updatePredictions = (0, import_react2.useCallback)((text) => {
    const cfg = configRef.current;
    if (!cfg.showPredictions) {
      setState((s) => ({ ...s, predictions: [] }));
      return;
    }
    const words = text.split(/\s+/);
    const lastWord = words[words.length - 1] ?? "";
    if (lastWord.length > 0) {
      const preds = getPredictions(lastWord, cfg.maxPredictions, cfg.locale);
      setState((s) => ({ ...s, predictions: preds }));
    } else {
      setState((s) => ({ ...s, predictions: [] }));
    }
  }, []);
  const insertText = (0, import_react2.useCallback)((text) => {
    setState((prev) => {
      const pos = prev.caretPosition;
      const newText = prev.text.slice(0, pos) + text + prev.text.slice(pos);
      const newPos = pos + text.length;
      setTimeout(() => updatePredictions(newText), 0);
      return {
        ...prev,
        text: newText,
        composition: "",
        caretPosition: newPos
      };
    });
  }, [updatePredictions]);
  const deleteBackward = (0, import_react2.useCallback)((count = 1) => {
    setState((prev) => {
      const pos = prev.caretPosition;
      const delCount = Math.min(count, pos);
      const newText = prev.text.slice(0, pos - delCount) + prev.text.slice(pos);
      setTimeout(() => updatePredictions(newText), 0);
      return {
        ...prev,
        text: newText,
        composition: "",
        caretPosition: pos - delCount
      };
    });
  }, [updatePredictions]);
  const setInputMode = (0, import_react2.useCallback)((mode) => {
    configRef.current.inputMode = mode;
    setState((prev) => ({ ...prev, composition: "", inputMode: mode }));
  }, []);
  const handleKeyPress = (0, import_react2.useCallback)((key) => {
    const action = key.action ?? "character";
    switch (action) {
      case "character": {
        const secondary = key.secondary;
        if (secondary && secondary.length > 0) {
          setState((prev) => {
            const comp = prev.composition || key.primary;
            const all = [key.primary, ...secondary];
            let nextComp;
            if (prev.composition) {
              const idx = all.indexOf(prev.composition);
              if (idx >= 0 && idx < all.length - 1) {
                nextComp = all[idx + 1];
              } else {
                const newText = prev.text + prev.composition;
                setTimeout(() => updatePredictions(newText), 0);
                return {
                  ...prev,
                  text: newText,
                  composition: "",
                  caretPosition: prev.caretPosition + prev.composition.length
                };
              }
            } else {
              nextComp = all[0];
            }
            return { ...prev, composition: nextComp };
          });
        } else {
          insertText(key.primary);
        }
        break;
      }
      case "backspace":
        deleteBackward();
        break;
      case "space":
        insertText(" ");
        break;
      case "enter":
        insertText("\n");
        break;
      case "mode-switch": {
        const modes = ["compact", "t9", "swipe"];
        const currentIdx = modes.indexOf(configRef.current.inputMode);
        const nextMode = modes[(currentIdx + 1) % modes.length];
        setInputMode(nextMode);
        break;
      }
    }
  }, [insertText, deleteBackward, setInputMode, updatePredictions]);
  const setConfig = (0, import_react2.useCallback)((patch) => {
    configRef.current = { ...configRef.current, ...patch };
    setState((prev) => ({ ...prev }));
  }, []);
  const ref = {
    focus: () => {
    },
    blur: () => {
    },
    setText: (text) => {
      setState((prev) => ({ ...prev, text }));
      updatePredictions(text);
    },
    getText: () => state.text,
    insertText,
    deleteBackward,
    setInputMode,
    show: () => setState((prev) => ({ ...prev, isVisible: true })),
    hide: () => setState((prev) => ({ ...prev, isVisible: false })),
    updateConfig: setConfig
  };
  return {
    state,
    config: configRef.current,
    ref,
    setConfig,
    insertText,
    deleteBackward,
    setInputMode,
    handleKeyPress
  };
}
