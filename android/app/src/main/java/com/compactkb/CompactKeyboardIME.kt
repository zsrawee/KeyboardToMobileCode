package com.compactkb

import android.annotation.SuppressLint
import android.annotation.TargetApi
import android.inputmethodservice.InputMethodService
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.KeyEvent
import android.view.View
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

/**
 * Compact Keyboard – Android IME (Input Method Service)
 *
 * This is the main keyboard service. Android treats this as a system keyboard.
 * It uses a WebView to render our compact HTML keyboard and communicates
 * via a JavaScript bridge.
 */
class CompactKeyboardIME : InputMethodService() {

    private lateinit var webView: WebView
    private var caps = false

    override fun onCreate() {
        super.onCreate()
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreateInputView(): View {
        webView = WebView(this).apply {
            settings.apply {
                javaScriptEnabled = true
                javaScriptCanOpenWindowsAutomatically = false
                cacheMode = WebSettings.LOAD_NO_CACHE
                allowFileAccess = true
                allowFileAccessFromFileURLs = true
                domStorageEnabled = true
                builtInZoomControls = false
                displayZoomControls = false
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            }

            setWebChromeClient(object : WebChromeClient() {
                override fun onConsoleMessage(cmsg: ConsoleMessage): Boolean {
                    android.util.Log.d("CompactKB", "JS[" + cmsg.sourceId() + ":" + cmsg.lineNumber() + "]: " + cmsg.message())
                    return true
                }
            })
            setWebViewClient(object : WebViewClient() {
                override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                    super.onPageStarted(view, url, favicon)
                    android.util.Log.d("CompactKB", "Page started: $url")
                }

                @Suppress("DEPRECATION")
                override fun onReceivedError(view: WebView?, errorCode: Int, desc: String?, url: String?) {
                    android.util.Log.e("CompactKB", "WebView error(legacy) [$errorCode]: $desc url=$url")
                }

                @TargetApi(android.os.Build.VERSION_CODES.M)
                override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                    val reqUrl = request?.url?.toString() ?: "unknown"
                    val errCode = error?.errorCode ?: 0
                    val desc = error?.description?.toString() ?: ""
                    android.util.Log.e("CompactKB", "WebView error(api23) [$errCode]: $desc url=$reqUrl")
                    // Only show error page for main frame errors
                    if (request?.isForMainFrame == true) {
                        // Stop the error page from appearing - load a simple fallback
                        val fallback = """
                            <!DOCTYPE html><html><body style="background:#1c1c1e;color:#fff;padding:10px;font:14px sans-serif">
                            <h3>Compact KB</h3>
                            <p>Loading error: $errCode</p>
                            <p>Try switching keyboards and back</p>
                            </body></html>
                        """.trimIndent()
                        view?.loadDataWithBaseURL(null, fallback, "text/html", "UTF-8", null)
                    }
                }

                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    android.util.Log.d("CompactKB", "Page loaded: $url")
                }
            })

            // Add JavaScript bridge for keyboard -> IME communication
            addJavascriptInterface(KeyboardBridge(), "Android")

            // Load the keyboard HTML from assets
            loadUrl("file:///android_asset/keyboard.html")
        }

        return webView
    }

    /**
     * JavaScript bridge that the WebView keyboard calls to send text to the IME.
     */
    inner class KeyboardBridge {

        @JavascriptInterface
        fun commitText(text: String) {
            val ic = currentInputConnection ?: return
            ic.commitText(text, 1)
        }

        @JavascriptInterface
        fun commitChar(char: String) {
            val ic = currentInputConnection ?: return
            ic.commitText(char, 1)
        }

        @JavascriptInterface
        fun deleteBackward() {
            val ic = currentInputConnection ?: return
            ic.deleteSurroundingText(1, 0)
        }

        @JavascriptInterface
        fun sendEnter() {
            val ic = currentInputConnection ?: return
            ic.commitText("\n", 1)
        }

        @JavascriptInterface
        fun moveCursor(direction: String) {
            val ic = currentInputConnection ?: return
            try {
                val sel = ic.getTextBeforeCursor(1000, 0)?.length ?: 0
                when (direction) {
                    "left" -> if (sel > 0) ic.setSelection(sel - 1, sel - 1)
                    "right" -> {
                        val len = ic.getTextAfterCursor(1000, 0)?.length ?: 0
                        ic.setSelection(sel + 1, sel + 1)
                    }
                    "up", "down" -> { /* ignore vertical movement */ }
                }
            } catch (e: Exception) { /* ignore cursor errors */ }
        }

        @JavascriptInterface
        fun performBack() {
            // Close the keyboard
            requestHideSelf(0)
        }

        @JavascriptInterface
        fun vibrate(ms: Long) {
            try {
                val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    val vm = getSystemService(VIBRATOR_MANAGER_SERVICE) as VibratorManager
                    vm.defaultVibrator
                } else {
                    @Suppress("DEPRECATION")
                    getSystemService(VIBRATOR_SERVICE) as Vibrator
                }

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE))
                } else {
                    @Suppress("DEPRECATION")
                    vibrator.vibrate(ms)
                }
            } catch (e: Exception) {
                // Device may not have vibrator
            }
        }

        @JavascriptInterface
        fun switchToNextIME() {
            switchToNextInputMethod(false)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (::webView.isInitialized) {
            webView.removeAllViews()
            webView.destroy()
        }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        // Handle physical keyboard keys if needed
        return super.onKeyDown(keyCode, event)
    }

    override fun onEvaluateInputViewShown(): Boolean {
        return true
    }
}
