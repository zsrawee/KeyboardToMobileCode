package com.compactkb.keyboard

import android.os.Handler
import android.os.Looper

/**
 * Manages multi-tap (a→b→c→a) cycling with auto-commit timeout.
 *
 * When the user taps a key, if the same key is tapped within the
 * timeout window, the character cycles to the next in the list.
 * Tapping a different key commits the current character and starts
 * a new composition. The composition auto-commits after [timeoutMillis]
 * of inactivity.
 */
class MultiTapEngine(
    private val timeoutMillis: Long = 1200L,
    private val onCommit: (Char) -> Unit
) {
    private var activeKeyId: String? = null
    private var chars: List<Char> = emptyList()
    private var index: Int = 0
    private val handler = Handler(Looper.getMainLooper())
    private val timeoutRunnable = Runnable { commitInternal() }

    /** The character currently being composed, or null if idle. */
    val compositionChar: Char?
        get() = chars.getOrNull(index)

    /** Whether a multi-tap composition is in progress. */
    val isComposing: Boolean
        get() = activeKeyId != null

    /**
     * Handle a tap on a multi-tap key.
     *
     * @param keyId    Unique ID of the tapped key
     * @param tapChars Available characters on this key
     * @return The character at the current tap position (for display)
     */
    fun tap(keyId: String, tapChars: List<Char>): Char {
        require(tapChars.isNotEmpty()) { "tapChars must not be empty" }

        if (keyId == activeKeyId && tapChars == chars) {
            // Same key again — cycle to next character
            index = (index + 1) % tapChars.size
        } else {
            // Different key — commit previous and start new composition
            commitInternal()
            activeKeyId = keyId
            chars = tapChars
            index = 0
        }
        resetTimeout()
        return chars[index]
    }

    /** Force-commit the current composition character. */
    fun commit() {
        commitInternal()
        reset()
    }

    /** Abort the composition without committing anything. */
    fun abort() {
        reset()
    }

    private fun commitInternal() {
        val ch = compositionChar
        if (ch != null) {
            onCommit(ch)
        }
    }

    private fun reset() {
        activeKeyId = null
        chars = emptyList()
        index = 0
        handler.removeCallbacks(timeoutRunnable)
    }

    private fun resetTimeout() {
        handler.removeCallbacks(timeoutRunnable)
        handler.postDelayed(timeoutRunnable, timeoutMillis)
    }
}
