/**
 * Fast prediction engine for compact keyboard
 * Uses trie with frequency ranking for O(n) prefix matching
 */

import { FREQUENCY_DICT, TWO_LETTER_PROBS } from './defaults';
import type { Prediction } from './types';

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  score: number = 0;
  isWord: boolean = false;
}

const cachedTrie: Map<string, TrieNode> = new Map();

function getTrie(locale: string): TrieNode {
  if (cachedTrie.has(locale)) return cachedTrie.get(locale)!;
  const root = new TrieNode();
  for (const [word, freq] of Object.entries(FREQUENCY_DICT)) {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.isWord = true;
    node.score = freq;
  }
  cachedTrie.set(locale, root);
  return root;
}

/** Get predictions for a given prefix */
export function getPredictions(
  prefix: string,
  max: number = 3,
  locale: string = 'en-US'
): Prediction[] {
  if (!prefix) return [];
  const root = getTrie(locale);
  const lower = prefix.toLowerCase();
  let node = root;
  for (const ch of lower) {
    if (!node.children.has(ch)) return [];
    node = node.children.get(ch)!;
  }

  const results: Prediction[] = [];
  const stack: Array<{ node: TrieNode; suffix: string }> = [{ node, suffix: '' }];
  const prefixLen = prefix.length;

  while (stack.length > 0 && results.length < max) {
    const { node: n, suffix } = stack.pop()!;
    if (n.isWord && n.score > 0) {
      const full = prefix.slice(0, prefixLen - lower.length) + lower + suffix;
      results.push({
        text: full,
        score: n.score,
        type: prefix.length >= 2 ? 'completion' : 'suggestion',
      });
    }
    // Process children in reverse for frequency ordering (most frequent first doesn't need reverse, but stack is LIFO)
    const entries = Array.from(n.children.entries()).sort(
      ([, a], [, b]) => (b.score || 0) - (a.score || 0)
    );
    // Push in reverse for correct prioritization
    for (let i = entries.length - 1; i >= 0; i--) {
      const [ch, childNode] = entries[i]!;
      stack.push({ node: childNode, suffix: ch + suffix });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, max);
}

/** Get next character probabilities based on last character typed */
export function getNextCharProbs(lastChar: string): Array<{ char: string; prob: number }> {
  if (!lastChar) return [];
  const pair = lastChar.toLowerCase();
  const results: Array<{ char: string; prob: number }> = [];
  for (const [bigram, prob] of Object.entries(TWO_LETTER_PROBS)) {
    if (bigram[0] === pair) {
      results.push({ char: bigram[1]!, prob });
    }
  }
  return results.sort((a, b) => b.prob - a.prob).slice(0, 5);
}

/** T9 multi-tap mapping */
const T9_MAP: Record<string, string[]> = {
  '2': ['a', 'b', 'c'],
  '3': ['d', 'e', 'f'],
  '4': ['g', 'h', 'i'],
  '5': ['j', 'k', 'l'],
  '6': ['m', 'n', 'o'],
  '7': ['p', 'q', 'r', 's'],
  '8': ['t', 'u', 'v'],
  '9': ['w', 'x', 'y', 'z'],
  '0': [' '],
};

/** T9 multi-tap: map digit sequence to possible word completions */
export function t9ToWords(digits: string): string[] {
  if (!digits) return [];
  const options: string[][] = [];
  for (const d of digits) {
    const chars = T9_MAP[d];
    if (chars) options.push(chars);
  }
  if (options.length === 0) return [];

  const dict = FREQUENCY_DICT;
  const candidates: string[] = [];

  function dfs(idx: number, current: string) {
    if (idx === options.length) {
      if (dict[current] || current.length <= 2) {
        candidates.push(current);
      }
      return;
    }
    for (const ch of options[idx]!) {
      dfs(idx + 1, current + ch);
    }
  }

  dfs(0, '');
  return candidates.sort((a, b) => (dict[b] || 0) - (dict[a] || 0));
}