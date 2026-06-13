import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { CompactKeyboard } from './keyboard';

function MobileChatApp() {
  const [text, setText] = useState('');
  const [modeLabel, setModeLabel] = useState('compact');
  const [messages, setMessages] = useState<Array<{ text: string; type: 'sent' | 'received' }>>([
    { text: "This keyboard is only 52px tall!", type: 'received' },
    { text: "Tap a key to cycle through letters.", type: 'received' },
    { text: "Tap ◉ to switch modes.", type: 'received' },
  ]);
  const chatRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChange = useCallback((val: string) => {
    if (val.endsWith('\n')) {
      const msg = val.slice(0, -1).trim();
      if (msg) {
        setMessages(prev => [...prev, { text: msg, type: 'sent' }]);
        // Simulate a reply after a short delay
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: `Got: "${msg}"`,
            type: 'received',
          }]);
        }, 600);
      }
      setText('');
    } else {
      setText(val);
    }
  }, []);

  const handleModeChange = useCallback((mode: string) => {
    setModeLabel(mode);
    if (wrapperRef.current) {
      wrapperRef.current.className = 'keyboard-wrapper ' + mode + '-mode';
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h1 style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.3px' }}>⌨️ Compact KB</h1>
        <span style={{
          fontSize: '10px', padding: '2px 8px',
          background: '#007aff', borderRadius: '10px', fontWeight: 500
        }}>ultra-low</span>
      </header>

      {/* Chat area */}
      <div ref={chatRef} style={{
        flex: 1, overflowY: 'auto', padding: '16px',
        display: 'flex', flexDirection: 'column', gap: '8px',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            maxWidth: '80%',
            padding: '10px 14px',
            borderRadius: msg.type === 'sent' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            fontSize: '15px',
            lineHeight: 1.4,
            wordBreak: 'break-word',
            alignSelf: msg.type === 'sent' ? 'flex-end' : 'flex-start',
            background: msg.type === 'sent' ? '#007aff' : '#2c2c2e',
            color: '#fff',
          }}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div style={{
        padding: '8px 16px 4px 16px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <div style={{
          flex: 1, background: '#1c1c1e', border: '1px solid #3a3a3c',
          borderRadius: '20px', padding: '8px 14px',
          fontSize: '16px', color: '#fff',
          minHeight: '36px', display: 'flex', alignItems: 'center',
          overflowX: 'auto', whiteSpace: 'nowrap',
        }}>
          <span>{text || 'Type something...'}</span>
          <span style={{
            display: 'inline-block', width: '2px', height: '18px',
            background: '#007aff', marginLeft: '2px',
            animation: 'blink 1s step-end infinite',
          }} />
        </div>
        <span style={{
          fontSize: '10px', color: '#8e8e93',
          padding: '4px 8px', background: '#1c1c1e',
          borderRadius: '10px', whiteSpace: 'nowrap',
          border: '1px solid #3a3a3c',
        }}>
          {modeLabel}
        </span>
      </div>

      {/* Keyboard */}
      <div
        ref={wrapperRef}
        className="keyboard-wrapper compact-mode"
      >
        <CompactKeyboard
          value={text}
          onChange={handleChange}
          height={52}
          showPredictions={true}
          maxPredictions={3}
          inputMode="compact"
          hapticFeedback={false}
          onModeChange={handleModeChange}
        />
      </div>
    </div>
  );
}

// Mount
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<MobileChatApp />);
}
