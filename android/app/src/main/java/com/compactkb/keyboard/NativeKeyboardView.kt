package com.compactkb.keyboard

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Typeface
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.MotionEvent
import android.view.View
import android.view.ViewConfiguration
import kotlin.math.roundToInt

/**
 * A fully native, Canvas-drawn keyboard View.
 *
 * No HTML, no WebView, no JavaScript bridge.
 * Draws keys, handles touch, manages multi-tap, and shows predictions.
 * Reports key actions via [onAction] callback.
 */
class NativeKeyboardView(context: Context) : View(context) {

    // ============================================================
    // Types
    // ============================================================

    /** A key with its calculated screen position and size. */
    data class LayoutKey(val data: KeyData, val bounds: RectF)

    // ============================================================
    // Configuration
    // ============================================================

    var onAction: ((KeyAction) -> Unit)? = null

    var mode: KeyboardMode = KeyboardMode.COMPACT
        private set

    /** The last few characters typed (for word prediction). */
    private val typedBuffer = StringBuilder()

    // ============================================================
    // Colors
    // ============================================================

    private val backgroundColor = Color.parseColor("#1c1c1e")
    private val keyBgColor = Color.parseColor("#2c2c2e")
    private val keyBgActive = Color.parseColor("#3a3a3c")
    private val keyTextColor = Color.WHITE
    private val secondaryTextColor = Color.parseColor("#8e8e93")
    private val accentColor = Color.parseColor("#0a84ff")
    private val specialKeyBg = Color.parseColor("#3a3a3c")
    private val predictionBg = Color.parseColor("#2c2c2e")
    private val predictionTextColor = Color.parseColor("#0a84ff")
    private val borderColor = Color.argb(30, 255, 255, 255)
    private val compPopupBg = Color.parseColor("#2c2c2e")
    private val compPopupText = Color.parseColor("#0a84ff")
    private val modeIndicatorBg = Color.argb(60, 0, 0, 0)
    private val modeIndicatorText = Color.parseColor("#555555")

    // ============================================================
    // Paints
    // ============================================================

    private val bgPaint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val keyPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { isAntiAlias = true }
    private val keyActivePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { isAntiAlias = true }
    private val specialPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { isAntiAlias = true }
    private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = keyTextColor
        textAlign = Paint.Align.CENTER
        typeface = Typeface.DEFAULT
    }
    private val secondaryTextPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = secondaryTextColor
        textAlign = Paint.Align.CENTER
        typeface = Typeface.DEFAULT
    }
    private val accentPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = accentColor
        textAlign = Paint.Align.CENTER
    }
    private val compPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = compPopupText
        textAlign = Paint.Align.CENTER
        isFakeBoldText = true
    }
    private val compBgPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = compPopupBg
        isAntiAlias = true
    }
    private val borderPaint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val modeTextPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = modeIndicatorText
        textAlign = Paint.Align.RIGHT
        textSize = 24f
    }

    // ============================================================
    // Layout state
    // ============================================================

    private val layoutKeys = mutableListOf<LayoutKey>()
    private var rowCount = 0
    private var rowHeight = 0f
    private var keyGap = 2f // dp, converted to px in init
    private var keyCorner = 6f
    private var predictionBarHeight = 0f
    private var keyAreaTop = 0f
    private var density = 1f

    // Prediction chip rects (for hit testing)
    private val predictionChips = mutableListOf<Pair<RectF, String>>()

    // ============================================================
    // Touch state
    // ============================================================

    private var pressedKeyId: String? = null
    private var touchStartX = 0f
    private var touchStartY = 0f
    private var touchStartKeyId: String? = null
    private var touchSlop = 0
    private var swipeThreshold = 12f // dp, converted in init

    // ============================================================
    // Multi-tap engine (used only for T9 mode)
    // ============================================================

    private val multiTapEngine = MultiTapEngine(
        timeoutMillis = 1200L,
        onCommit = { ch ->
            typedBuffer.append(ch)
            onAction?.invoke(KeyAction.Char(ch))
            invalidate()
        }
    )

    private val predictionEngine = PredictionEngine()

    // ============================================================
    // Init
    // ============================================================

    init {
        density = resources.displayMetrics.density
        keyGap *= density
        keyCorner *= density
        predictionBarHeight = (32 * density).roundToInt().toFloat()

        textPaint.textSize = (11 * density)
        secondaryTextPaint.textSize = (7 * density)
        compPaint.textSize = (14 * density)

        touchSlop = ViewConfiguration.get(context).scaledTouchSlop
        swipeThreshold *= density

        keyPaint.color = keyBgColor
        keyActivePaint.color = keyBgActive
        specialPaint.color = specialKeyBg
    }

    // ============================================================
    // Public API
    // ============================================================

    fun switchMode() {
        multiTapEngine.abort()
        typedBuffer.clear()
        mode = when (mode) {
            KeyboardMode.COMPACT -> KeyboardMode.T9
            KeyboardMode.T9 -> KeyboardMode.SWIPE
            KeyboardMode.SWIPE -> KeyboardMode.COMPACT
        }
        calculateLayout()
        invalidate()
    }

    fun setMode(newMode: KeyboardMode) {
        if (newMode != mode) {
            multiTapEngine.abort()
            typedBuffer.clear()
            mode = newMode
            calculateLayout()
            invalidate()
        }
    }

    /** Append a character to the typed buffer (used for prediction). */
    fun onCharTyped(ch: Char) {
        if (ch == ' ') {
            typedBuffer.clear()
        } else {
            typedBuffer.append(ch)
            if (typedBuffer.length > 30) {
                typedBuffer.delete(0, typedBuffer.length - 30)
            }
        }
        invalidate()
    }

    // ============================================================
    // Layout calculation
    // ============================================================

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        keyAreaTop = predictionBarHeight
        calculateLayout()
    }

    private fun calculateLayout() {
        layoutKeys.clear()
        predictionChips.clear()

        val w = width.toFloat()
        val h = height.toFloat()
        if (w <= 0 || h <= 0) return

        val availableHeight = h - predictionBarHeight
        val rows: List<List<KeyData>>

        when (mode) {
            KeyboardMode.COMPACT -> rows = compactLayout()
            KeyboardMode.T9 -> rows = t9Layout()
            KeyboardMode.SWIPE -> rows = swipeLayout()
        }

        rowCount = rows.size
        rowHeight = (availableHeight - (rowCount - 1) * keyGap) / rowCount

        updatePredictions()

        var y = keyAreaTop
        for (rowData in rows) {
            val totalWeight = rowData.sumOf { it.weight.toDouble() }.toFloat()
            val availableWidth = w - (rowData.size + 1) * keyGap
            var x = keyGap

            for (keyData in rowData) {
                val keyWidth = availableWidth * (keyData.weight / totalWeight)
                val bounds = RectF(x, y, x + keyWidth, y + rowHeight)
                layoutKeys.add(LayoutKey(keyData, bounds))
                x += keyWidth + keyGap
            }
            y += rowHeight + keyGap
        }
    }

    private fun updatePredictions() {
        predictionChips.clear()
        val prefix = getCurrentWord()
        if (prefix.length < 1) return

        val suggestions = predictionEngine.suggest(prefix)
        if (suggestions.isEmpty()) return

        val w = width.toFloat()
        var chipX = keyGap
        val chipY = 2f * density
        val chipH = predictionBarHeight - 4f * density

        for (word in suggestions) {
            val textW = word.length * textPaint.textSize * 0.7f + 16f * density
            val chipW = textW.coerceAtMost(w - chipX - keyGap)

            if (chipX + chipW > w - keyGap) break

            val chipRect = RectF(chipX, chipY, chipX + chipW, chipY + chipH)
            predictionChips.add(chipRect to word)
            chipX += chipW + 4f * density
        }
    }

    /** Extract the current word being typed (last whitespace-delimited token). */
    private fun getCurrentWord(): String {
        val s = typedBuffer.toString()
        val lastSpace = s.lastIndexOf(' ')
        return if (lastSpace >= 0) s.substring(lastSpace + 1) else s
    }

    // ============================================================
    // Drawing
    // ============================================================

    override fun onDraw(canvas: Canvas) {
        canvas.drawColor(backgroundColor)
        drawPredictionBar(canvas)
        canvas.drawLine(0f, keyAreaTop, width.toFloat(), keyAreaTop, borderPaint)

        for (lk in layoutKeys) {
            drawKey(canvas, lk)
        }

        drawModeIndicator(canvas)
        drawCompositionPopup(canvas)
    }

    private fun drawKey(canvas: Canvas, lk: LayoutKey) {
        val isPressed = lk.data.id == pressedKeyId
        val isComposing = mode == KeyboardMode.T9 && multiTapEngine.isComposing &&
            lk.data.characters.size > 1 &&
            lk.data.characters.contains(multiTapEngine.compositionChar)

        val bgColor = when {
            isPressed || isComposing -> keyBgActive
            lk.data.isSpecial -> specialKeyBg
            else -> keyBgColor
        }

        keyPaint.color = bgColor
        canvas.drawRoundRect(lk.bounds, keyCorner, keyCorner, keyPaint)

        val cx = lk.bounds.centerX()
        val cy = lk.bounds.centerY()

        if (isComposing) {
            // Show composition char in accent color (T9 mode only)
            val comp = multiTapEngine.compositionChar
            textPaint.color = accentColor
            canvas.drawText(comp.toString(), cx, cy + textPaint.textSize * 0.35f, textPaint)
            textPaint.color = keyTextColor
        } else if (lk.data.characters.isNotEmpty() && lk.data.secondaryLabel.isNotEmpty()) {
            // Multi-tap key with primary + secondary labels
            textPaint.textSize = (12 * density)
            canvas.drawText(
                lk.data.label.first().uppercaseChar().toString(),
                cx, cy - 4f * density, textPaint
            )
            textPaint.textSize = (11 * density)
            secondaryTextPaint.textSize = (7 * density)
            canvas.drawText(lk.data.secondaryLabel, cx, cy + 8f * density, secondaryTextPaint)
        } else {
            // Normal key label
            canvas.drawText(lk.data.label, cx, cy + textPaint.textSize * 0.35f, textPaint)
        }
    }

    private fun drawPredictionBar(canvas: Canvas) {
        val predRect = RectF(0f, 0f, width.toFloat(), keyAreaTop)
        canvas.drawRect(predRect, bgPaint)

        for ((chipRect, word) in predictionChips) {
            keyPaint.color = predictionBg
            canvas.drawRoundRect(chipRect, keyCorner, keyCorner, keyPaint)
            accentPaint.textSize = (11 * density)
            canvas.drawText(
                word,
                chipRect.centerX(),
                chipRect.centerY() + accentPaint.textSize * 0.35f,
                accentPaint
            )
        }
    }

    private fun drawCompositionPopup(canvas: Canvas) {
        // Only show composition popup in T9 mode
        if (mode != KeyboardMode.T9) return
        val ch = multiTapEngine.compositionChar ?: return
        val activeKey = layoutKeys.firstOrNull { it.data.id == pressedKeyId }
            ?: layoutKeys.firstOrNull { lk ->
                lk.data.characters.size > 1 &&
                    lk.data.characters.contains(ch)
            }
        val keyBounds = activeKey?.bounds ?: return

        val popupW = 36f * density
        val popupH = 30f * density
        val popupX = keyBounds.centerX() - popupW / 2
        val popupY = keyBounds.top - popupH - 4f * density

        compBgPaint.color = compPopupBg
        canvas.drawRoundRect(
            RectF(popupX, popupY, popupX + popupW, popupY + popupH),
            keyCorner, keyCorner, compBgPaint
        )

        compPaint.textSize = (16 * density)
        canvas.drawText(
            ch.toString(),
            popupX + popupW / 2,
            popupY + popupH / 2 + compPaint.textSize * 0.35f,
            compPaint
        )
    }

    private fun drawModeIndicator(canvas: Canvas) {
        val modeText = when (mode) {
            KeyboardMode.COMPACT -> "compact"
            KeyboardMode.T9 -> "T9"
            KeyboardMode.SWIPE -> "swipe"
        }
        modeTextPaint.textSize = (8 * density)
        canvas.drawText(
            "⌨ $modeText",
            width - 4f * density,
            height - 4f * density,
            modeTextPaint
        )
    }

    // ============================================================
    // Touch handling
    // ============================================================

    override fun onTouchEvent(event: MotionEvent): Boolean {
        parent?.requestDisallowInterceptTouchEvent(true)
        val x = event.x
        val y = event.y

        when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                pressedKeyId = null
                touchStartKeyId = null
                if (y < keyAreaTop) {
                    return handlePredictionTap(x, y)
                }
                val hit = findKeyAt(x, y)
                if (hit != null) {
                    touchStartX = x
                    touchStartY = y
                    touchStartKeyId = hit.data.id
                    pressedKeyId = hit.data.id
                    invalidate()
                }
                return true
            }
            MotionEvent.ACTION_MOVE -> {
                if (pressedKeyId != null) {
                    val hit = findKeyAt(x, y)
                    val newId = hit?.data?.id
                    if (newId != pressedKeyId) {
                        pressedKeyId = null
                        invalidate()
                    }
                }
                return true
            }
            MotionEvent.ACTION_UP -> {
                if (pressedKeyId != null && touchStartKeyId != null) {
                    val lk = layoutKeys.firstOrNull { it.data.id == pressedKeyId }
                    if (lk != null) {
                        if (mode == KeyboardMode.COMPACT) {
                            handleCompactGesture(lk, x, y)
                        } else {
                            handleKeyRelease(lk)
                        }
                    }
                    pressedKeyId = null
                    touchStartKeyId = null
                    invalidate()
                }
                return true
            }
            MotionEvent.ACTION_CANCEL -> {
                pressedKeyId = null
                touchStartKeyId = null
                invalidate()
                return true
            }
        }
        return super.onTouchEvent(event)
    }

    private fun findKeyAt(x: Float, y: Float): LayoutKey? {
        return layoutKeys.firstOrNull { it.bounds.contains(x, y) }
    }

    private fun handlePredictionTap(x: Float, y: Float): Boolean {
        for ((chipRect, word) in predictionChips) {
            if (chipRect.contains(x, y)) {
                onAction?.invoke(KeyAction.CommitPrediction(word))
                // Update typed buffer: replace current word with prediction
                val s = typedBuffer.toString()
                val lastSpace = s.lastIndexOf(' ')
                if (lastSpace >= 0) {
                    typedBuffer.replace(lastSpace + 1, typedBuffer.length, word + " ")
                } else {
                    typedBuffer.clear()
                    typedBuffer.append(word).append(' ')
                }
                invalidate()
                performHapticFeedback(10)
                return true
            }
        }
        return true
    }

    private fun handleCompactGesture(lk: LayoutKey, upX: Float, upY: Float) {
        val data = lk.data
        val dx = upX - touchStartX
        val dy = upY - touchStartY
        val absDx = kotlin.math.abs(dx)
        val absDy = kotlin.math.abs(dy)

        performHapticFeedback(10)

        // Action keys (⌫ ␣ ◉ arrows) - tap only, no swipe
        if (data.action != null) {
            if (absDx < swipeThreshold && absDy < swipeThreshold) {
                handleActionNow(data.action)
            }
            return
        }

        // Character keys
        if (data.characters.isEmpty()) return

        val charIndex: Int = when {
            absDx > swipeThreshold && absDx > absDy && dx > 0 -> 1 // swipe right → 2nd char
            absDx > swipeThreshold && absDx > absDy && dx < 0 -> 2 // swipe left → 3rd char
            absDy > swipeThreshold && absDy > absDx && dy > 0 -> 3 // swipe down → 4th char
            else -> 0                                              // tap → 1st char
        }

        val ch = data.characters.getOrNull(charIndex) ?: data.characters[0]
        typedBuffer.append(ch)
        onAction?.invoke(KeyAction.Char(ch))
        invalidate()
    }

    private fun handleActionNow(action: KeyAction) {
        when (action) {
            is KeyAction.Backspace -> {
                if (typedBuffer.isNotEmpty()) typedBuffer.deleteCharAt(typedBuffer.length - 1)
                onAction?.invoke(KeyAction.Backspace)
            }
            is KeyAction.Space -> {
                typedBuffer.append(' ')
                onAction?.invoke(KeyAction.Space)
            }
            is KeyAction.Enter -> {
                typedBuffer.clear()
                onAction?.invoke(KeyAction.Enter)
            }
            is KeyAction.ModeSwitch -> {
                typedBuffer.clear()
                switchMode()
            }
            is KeyAction.MoveCursor -> {
                onAction?.invoke(action)
            }
            else -> {}
        }
        invalidate()
    }

    private fun handleKeyRelease(lk: LayoutKey) {
        val data = lk.data
        val action = data.action

        if (action != null) {
            performHapticFeedback(15)
            when (action) {
                is KeyAction.Backspace -> {
                    multiTapEngine.abort()
                    if (typedBuffer.isNotEmpty()) typedBuffer.deleteCharAt(typedBuffer.length - 1)
                    onAction?.invoke(KeyAction.Backspace)
                }
                is KeyAction.Space -> {
                    multiTapEngine.commit()
                    typedBuffer.append(' ')
                    onAction?.invoke(KeyAction.Space)
                }
                is KeyAction.Enter -> {
                    multiTapEngine.commit()
                    typedBuffer.clear()
                    onAction?.invoke(KeyAction.Enter)
                }
                is KeyAction.ModeSwitch -> {
                    multiTapEngine.abort()
                    typedBuffer.clear()
                    switchMode()
                }
                is KeyAction.MoveCursor -> {
                    multiTapEngine.abort()
                    onAction?.invoke(action)
                }
                else -> {}
            }
            invalidate()
        } else if (data.characters.isNotEmpty()) {
            performHapticFeedback(10)
            multiTapEngine.tap(data.id, data.characters)
            invalidate()
        }
    }

    // ============================================================
    // Haptic feedback
    // ============================================================

    private fun performHapticFeedback(ms: Long) {
        try {
            val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vm = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                vm.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                vibrator.vibrate(ms)
            }
        } catch (_: Exception) {
            // Device may not have vibrator
        }
    }

    // ============================================================
    // Measure
    // ============================================================

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val width = MeasureSpec.getSize(widthMeasureSpec)
        val heightMode = MeasureSpec.getMode(heightMeasureSpec)
        val heightSize = MeasureSpec.getSize(heightMeasureSpec)

        // Compact keyboard: cap height at 200dp (fits all modes)
        // 32dp prediction bar + up to 4 rows @ 38dp + gaps + indicator
        val maxHeight = (200 * density).roundToInt()
        val height = when (heightMode) {
            MeasureSpec.EXACTLY -> minOf(heightSize, maxHeight)
            MeasureSpec.AT_MOST -> minOf(heightSize, maxHeight)
            else -> maxHeight
        }
        setMeasuredDimension(width, height)
    }
}
