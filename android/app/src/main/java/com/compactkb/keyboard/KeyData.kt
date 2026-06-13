package com.compactkb.keyboard

/**
 * Possible actions a keyboard key can trigger.
 */
sealed interface KeyAction {
    data object Backspace : KeyAction
    data object Space : KeyAction
    data object Enter : KeyAction
    data object ModeSwitch : KeyAction
    data class CommitPrediction(val word: String) : KeyAction
    data class MoveCursor(val direction: CursorDirection) : KeyAction
    data class Char(val char: kotlin.Char) : KeyAction
}

enum class CursorDirection { LEFT, RIGHT }

enum class KeyboardMode { COMPACT, T9, SWIPE }

/**
 * One physical key on the screen.
 *
 * @param id            Unique identifier for hit-testing and multi-tap tracking
 * @param label         Primary label displayed on the key
 * @param secondaryLabel Smaller label shown beneath the primary label (optional)
 * @param characters    For multi-tap keys: list of characters to cycle through (e.g. ['a','b','c']).
 *                      For single-char keys: single-element list ['x'].
 *                      Empty for action-only keys.
 * @param action        Non-character action this key performs (backspace, space, mode switch, etc.)
 * @param weight        Width proportion relative to a normal key (1.0 = normal, 2.5 = wide space)
 * @param isSpecial     If true, rendered with a special (darker) background color
 */
data class KeyData(
    val id: String,
    val label: String,
    val secondaryLabel: String = "",
    val characters: List<Char> = emptyList(),
    val action: KeyAction? = null,
    val weight: Float = 1f,
    val isSpecial: Boolean = false
)

// ============================================================
// Layout providers – each returns a list of rows, each row is a list of keys
// ============================================================

fun compactLayout(): List<List<KeyData>> = listOf(
    // Row 1 – letters + symbols
    listOf(
        KeyData("abc", "abc", "abc", characters = listOf('a', 'b', 'c')),
        KeyData("def", "def", "def", characters = listOf('d', 'e', 'f')),
        KeyData("ghi", "ghi", "ghi", characters = listOf('g', 'h', 'i')),
        KeyData("jkl", "jkl", "jkl", characters = listOf('j', 'k', 'l')),
        KeyData("mno", "mno", "mno", characters = listOf('m', 'n', 'o')),
        KeyData("pqrs", "pqrs", "pqrs", characters = listOf('p', 'q', 'r', 's')),
        KeyData("tuv", "tuv", "tuv", characters = listOf('t', 'u', 'v')),
        KeyData("wxyz", "wxyz", "wxyz", characters = listOf('w', 'x', 'y', 'z')),
        KeyData("slash", "/", isSpecial = true, characters = listOf('/')),
        KeyData("hash", "#", isSpecial = true, characters = listOf('#')),
    ),
    // Row 2 – navigation + space + mode
    listOf(
        KeyData("left", "←", action = KeyAction.MoveCursor(CursorDirection.LEFT)),
        KeyData("up", "↑"),
        KeyData("down", "↓"),
        KeyData("right", "→", action = KeyAction.MoveCursor(CursorDirection.RIGHT)),
        KeyData("backspace", "⌫", isSpecial = true, action = KeyAction.Backspace),
        KeyData("space", "␣", weight = 2.5f, isSpecial = true, action = KeyAction.Space),
        KeyData("mode", "◉", isSpecial = true, action = KeyAction.ModeSwitch),
    )
)

fun t9Layout(): List<List<KeyData>> = listOf(
    listOf(
        KeyData("abc", "abc", characters = listOf('a', 'b', 'c')),
        KeyData("def", "def", characters = listOf('d', 'e', 'f')),
        KeyData("ghi", "ghi", characters = listOf('g', 'h', 'i')),
    ),
    listOf(
        KeyData("jkl", "jkl", characters = listOf('j', 'k', 'l')),
        KeyData("mno", "mno", characters = listOf('m', 'n', 'o')),
        KeyData("pqrs", "pqrs", characters = listOf('p', 'q', 'r', 's')),
    ),
    listOf(
        KeyData("tuv", "tuv", characters = listOf('t', 'u', 'v')),
        KeyData("wxyz", "wxyz", characters = listOf('w', 'x', 'y', 'z')),
        KeyData("backspace", "⌫", isSpecial = true, action = KeyAction.Backspace),
    ),
    listOf(
        KeyData("mode", "◉", isSpecial = true, action = KeyAction.ModeSwitch),
        KeyData("space", "␣", weight = 2f, isSpecial = true, action = KeyAction.Space),
        KeyData("enter", "↵", isSpecial = true, action = KeyAction.Enter),
    )
)

fun swipeLayout(): List<List<KeyData>> = listOf(
    // Row 1 – 4 direction pads
    listOf(
        KeyData("sw-left", "←", secondaryLabel = "ABCD"),
        KeyData("sw-right", "→", secondaryLabel = "EFGH"),
        KeyData("sw-up", "↑", secondaryLabel = "IJKLM"),
        KeyData("sw-down", "↓", secondaryLabel = "NOPQR"),
    ),
    // Row 2 – 4 more direction pads
    listOf(
        KeyData("sw-dl", "↙", secondaryLabel = "ST"),
        KeyData("sw-dr", "↘", secondaryLabel = "UV"),
        KeyData("sw-ul", "↖", secondaryLabel = "WX"),
        KeyData("sw-ur", "↗", secondaryLabel = "YZ"),
    ),
    // Row 3 – backspace + space + mode
    listOf(
        KeyData("sw-backspace", "⌫", isSpecial = true, action = KeyAction.Backspace),
        KeyData("sw-space", "␣", weight = 2f, isSpecial = true, action = KeyAction.Space),
        KeyData("sw-mode", "◉", isSpecial = true, action = KeyAction.ModeSwitch),
    )
)
