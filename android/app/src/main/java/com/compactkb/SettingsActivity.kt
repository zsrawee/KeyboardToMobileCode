package com.compactkb

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.View
import androidx.appcompat.app.AppCompatActivity

/**
 * Settings / Info activity for the Compact Keyboard.
 * Shows how to enable the keyboard and opens system keyboard settings.
 */
class SettingsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
    }

    /** Opens the system keyboard settings so user can enable this IME */
    fun openKeyboardSettings(view: View) {
        startActivity(Intent(Settings.ACTION_INPUT_METHOD_SETTINGS))
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}
