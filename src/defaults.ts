import type { KeyboardConfig } from './types';

export const DEFAULT_CONFIG: KeyboardConfig = {
  height: 44,
  hapticFeedback: true,
  audioFeedback: false,
  inputMode: 'compact',
  showPredictions: true,
  maxPredictions: 3,
  locale: 'en-US',
  theme: 'auto',
  keyBorderRadius: 6,
  keyGap: 2,
  customWords: [],
};

/** English unigram frequency dictionary for predictions (top ~200 words) */
export const FREQUENCY_DICT: Record<string, number> = {
  'the': 1.0, 'be': 0.98, 'to': 0.97, 'of': 0.96, 'and': 0.95,
  'a': 0.94, 'in': 0.93, 'that': 0.92, 'have': 0.91, 'it': 0.90,
  'for': 0.89, 'not': 0.88, 'on': 0.87, 'with': 0.86, 'he': 0.85,
  'as': 0.84, 'you': 0.83, 'do': 0.82, 'at': 0.81, 'this': 0.80,
  'but': 0.79, 'his': 0.78, 'by': 0.77, 'from': 0.76, 'they': 0.75,
  'we': 0.74, 'say': 0.73, 'her': 0.72, 'she': 0.71, 'or': 0.70,
  'an': 0.69, 'will': 0.68, 'my': 0.67, 'one': 0.66, 'all': 0.65,
  'would': 0.64, 'there': 0.63, 'their': 0.62, 'what': 0.61, 'so': 0.60,
  'up': 0.59, 'out': 0.58, 'if': 0.57, 'about': 0.56, 'who': 0.55,
  'get': 0.54, 'which': 0.53, 'go': 0.52, 'me': 0.51, 'when': 0.50,
  'make': 0.49, 'can': 0.48, 'like': 0.47, 'time': 0.46, 'no': 0.45,
  'just': 0.44, 'him': 0.43, 'know': 0.42, 'take': 0.41, 'people': 0.40,
  'into': 0.39, 'year': 0.38, 'your': 0.37, 'good': 0.36, 'some': 0.35,
  'could': 0.34, 'them': 0.33, 'see': 0.32, 'other': 0.31, 'than': 0.30,
  'then': 0.29, 'now': 0.28, 'look': 0.27, 'only': 0.26, 'come': 0.25,
  'its': 0.24, 'over': 0.23, 'think': 0.22, 'also': 0.21, 'back': 0.20,
  'after': 0.19, 'use': 0.18, 'two': 0.17, 'how': 0.16, 'our': 0.15,
  'work': 0.14, 'first': 0.13, 'well': 0.12, 'way': 0.11, 'even': 0.10,
  'new': 0.09, 'want': 0.08, 'because': 0.07, 'any': 0.06, 'these': 0.05,
  'give': 0.04, 'day': 0.03, 'most': 0.02, 'us': 0.01,
};

export const TWO_LETTER_PROBS: Record<string, number> = {
  'th': 0.12, 'he': 0.10, 'in': 0.09, 'er': 0.08, 'an': 0.07,
  're': 0.06, 'es': 0.05, 'on': 0.04, 'st': 0.04, 'nt': 0.03,
  'en': 0.03, 'at': 0.03, 'ed': 0.03, 'nd': 0.03, 'to': 0.03,
  'or': 0.02, 'ea': 0.02, 'ti': 0.02, 'ar': 0.02, 'te': 0.02,
};