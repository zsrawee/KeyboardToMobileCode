package com.compactkb

import android.inputmethodservice.InputMethodService
import android.util.Log
import android.view.KeyEvent
import android.view.View
import com.compactkb.keyboard.CursorDirection
import com.compactkb.keyboard.KeyAction
import com.compactkb.keyboard.NativeKeyboardView

/**
 * Compact Keyboard – Android IME (Input Method Service)
 *
 * Uses a custom Canvas-drawn [NativeKeyboardView] — no WebView, no HTML, no JavaScript.
 * All keyboard rendering and touch handling is native Kotlin code.
 */
class CompactKeyboardIME : InputMethodService() {

    private lateinit var keyboardView: NativeKeyboardView

    override fun onCreateInputView(): View {
        keyboardView = NativeKeyboardView(this).apply {
            onAction = { action -> onKeyAction(action) }
        }
        return keyboardView
    }

    /**
     * Route keyboard actions to the current InputConnection.
     */
    private fun onKeyAction(action: KeyAction) {
        val ic = currentInputConnection
        if (ic == null) {
            Log.w("CompactKB", "currentInputConnection is null, action=$action")
            return
        }

        Log.d("CompactKB", "action: $action")

        when (action) {
            is KeyAction.Char -> {
                ic.commitText(action.char.toString(), 1)
                keyboardView.onCharTyped(action.char)
            }
            is KeyAction.Backspace -> {
                ic.deleteSurroundingText(1, 0)
            }
            is KeyAction.Space -> {
                ic.commitText(" ", 1)
                keyboardView.onCharTyped(' ')
            }
            is KeyAction.Enter -> {
                ic.commitText("\n", 1)
            }
            is KeyAction.MoveCursor -> {
                moveCursor(action.direction)
            }
            is KeyAction.ModeSwitch -> {
                // Handled by the view itself
            }
            is KeyAction.CommitPrediction -> {
                // Replace the current word with the prediction + space
                // Get text before cursor to find current word boundaries
                val beforeCursor = ic.getTextBeforeCursor(50, 0) ?: ""
                val wordStart = beforeCursor.lastIndexOf(' ') + 1
                if (wordStart < beforeCursor.length) {
                    ic.deleteSurroundingText(beforeCursor.length - wordStart, 0)
                }
                ic.commitText(action.word + " ", 1)
                keyboardView.onCharTyped(' ')
            }
        }
    }

    private fun moveCursor(direction: CursorDirection) {
        val ic = currentInputConnection ?: return
        try {
            val sel = ic.getTextBeforeCursor(1000, 0)?.length ?: 0
            when (direction) {
                CursorDirection.LEFT -> if (sel > 0) ic.setSelection(sel - 1, sel - 1)
                CursorDirection.RIGHT -> {
                    val len = ic.getTextAfterCursor(1000, 0)?.length ?: 0
                    ic.setSelection(sel + 1, sel + 1)
                }
            }
        } catch (e: Exception) {
            Log.w("CompactKB", "moveCursor error: ${e.message}")
        }
    }

    override fun onDestroy() {
        super.onDestroy()
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        return super.onKeyDown(keyCode, event)
    }

    override fun onEvaluateInputViewShown(): Boolean {
        return true
    }
}
