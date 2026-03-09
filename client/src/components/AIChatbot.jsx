import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendChatMessage } from '../utils/chatApi';

// Role display config
const ROLE_CONFIG = {
    patient: {
        label: 'Patient Assistant',
        emoji: '🏥',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
    },
    hospital: {
        label: 'Hospital Assistant',
        emoji: '🏨',
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    },
    supporter: {
        label: 'Donor Assistant',
        emoji: '💚',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
    donor: {
        label: 'Donor Assistant',
        emoji: '💚',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
    admin: {
        label: 'Admin AI',
        emoji: '📊',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    },
    guest: {
        label: 'Jivandan Assistant',
        emoji: '🤝',
        color: '#e11d48',
        gradient: 'linear-gradient(135deg, #e11d48, #be123c)',
    },
};

const QUICK_QUESTIONS = {
    patient: ['How do I submit a case?', 'What documents do I need?', 'How long does verification take?'],
    hospital: ['How do I approve a case?', 'How are cases assigned to us?', 'How do I update milestones?'],
    supporter: ['Which cases are most urgent?', 'How are funds used?', 'How do I donate?'],
    donor: ['Which cases are most urgent?', 'How are funds used?', 'How do I donate?'],
    admin: ['How do I handle flagged cases?', 'How does fraud detection work?', 'How do I verify a case?'],
    guest: ['What is Jivandan?', 'How do I register?', 'How does the platform work?'],
};

const TypingDots = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 0' }}>
        {[0, 1, 2].map(i => (
            <span key={i} style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#94a3b8', display: 'inline-block',
                animation: 'jivanTyping 1.2s infinite',
                animationDelay: `${i * 0.2}s`
            }} />
        ))}
    </div>
);

const AIChatbot = () => {
    const { user } = useAuth();
    const role = user?.role || 'guest';
    const config = ROLE_CONFIG[role] || ROLE_CONFIG.guest;
    const quickQ = QUICK_QUESTIONS[role] || QUICK_QUESTIONS.guest;

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]); // {role: 'user'|'assistant', content: string}
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            if (!hasGreeted) {
                const greeting = user
                    ? `Hi ${user.name?.split(' ')[0] || 'there'}! 👋 I'm your ${config.label} ${config.emoji}\n\nI'm here to help you navigate Jivandan. What would you like to know?`
                    : `Hi there! 👋 Welcome to Jivandan ${config.emoji}\n\nI'm your AI assistant. I can help you understand how our platform works. What would you like to know?`;
                setMessages([{ role: 'assistant', content: greeting }]);
                setHasGreeted(true);
            }
        }
    }, [isOpen]);

    const sendMessage = async (text) => {
        const userText = text || input.trim();
        if (!userText || isLoading) return;

        const newMessages = [...messages, { role: 'user', content: userText }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Only send actual chat messages (not the greeting) to API
            const apiMessages = newMessages.filter(m =>
                !(m.role === 'assistant' && newMessages.indexOf(m) === 0)
            );
            const { reply } = await sendChatMessage(apiMessages);
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch {
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '⚠️ Sorry, I\'m having trouble connecting. Please try again in a moment.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatMessage = (text) => {
        // Convert **bold**, newlines
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <>
            {/* Inject keyframe animation */}
            <style>{`
                @keyframes jivanTyping {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-5px); opacity: 1; }
                }
                @keyframes jivanPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(225,29,72,0.4); }
                    50% { box-shadow: 0 0 0 10px rgba(225,29,72,0); }
                }
                @keyframes jivanSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .jivan-chat-panel { animation: jivanSlideUp 0.25s ease; }
                .jivan-msg-user { animation: jivanSlideUp 0.15s ease; }
                .jivan-msg-ai { animation: jivanSlideUp 0.15s ease; }
                .jivan-quick-btn:hover { background: #f1f5f9 !important; transform: translateY(-1px); }
                .jivan-send-btn:hover:not(:disabled) { opacity: 0.85; transform: scale(1.05); }
                .jivan-fab:hover { transform: scale(1.1) !important; }
            `}</style>

            {/* Chat Panel */}
            {isOpen && (
                <div className="jivan-chat-panel" style={{
                    position: 'fixed', bottom: '88px', right: '20px',
                    width: '360px', maxHeight: '560px',
                    background: '#ffffff', borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 20px rgba(0,0,0,0.08)',
                    display: 'flex', flexDirection: 'column',
                    zIndex: 9999, overflow: 'hidden',
                    fontFamily: "'Inter', -apple-system, sans-serif",
                }}>
                    {/* Header */}
                    <div style={{
                        background: config.gradient,
                        padding: '16px 18px', display: 'flex',
                        alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '38px', height: '38px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '18px',
                            }}>{config.emoji}</div>
                            <div>
                                <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                                    {config.label}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#86efac', display: 'inline-block' }} />
                                    Powered by Groq AI
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'rgba(255,255,255,0.2)', border: 'none',
                                borderRadius: '50%', width: '30px', height: '30px',
                                color: '#fff', cursor: 'pointer', fontSize: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.2s',
                            }}
                        >×</button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1, overflowY: 'auto', padding: '16px',
                        display: 'flex', flexDirection: 'column', gap: '12px',
                        background: '#f8fafc',
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx}
                                className={msg.role === 'user' ? 'jivan-msg-user' : 'jivan-msg-ai'}
                                style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                            >
                                {msg.role === 'assistant' && (
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        background: config.gradient, flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '13px', marginRight: '8px', alignSelf: 'flex-end',
                                    }}>{config.emoji}</div>
                                )}
                                <div style={{
                                    maxWidth: '78%',
                                    padding: '10px 14px',
                                    borderRadius: msg.role === 'user'
                                        ? '18px 18px 4px 18px'
                                        : '18px 18px 18px 4px',
                                    background: msg.role === 'user' ? config.gradient : '#ffffff',
                                    color: msg.role === 'user' ? '#fff' : '#1e293b',
                                    fontSize: '13.5px', lineHeight: '1.5',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                }}
                                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                                />
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isLoading && (
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: config.gradient,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '13px',
                                }}>{config.emoji}</div>
                                <div style={{
                                    background: '#fff', padding: '10px 14px',
                                    borderRadius: '18px 18px 18px 4px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                }}>
                                    <TypingDots />
                                </div>
                            </div>
                        )}

                        {/* Quick question chips (only before first user message) */}
                        {messages.length === 1 && !isLoading && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Quick questions
                                </div>
                                {quickQ.map((q, i) => (
                                    <button key={i} className="jivan-quick-btn"
                                        onClick={() => sendMessage(q)}
                                        style={{
                                            background: '#fff', border: `1px solid #e2e8f0`,
                                            borderRadius: '10px', padding: '8px 12px',
                                            fontSize: '12.5px', color: '#475569',
                                            cursor: 'pointer', textAlign: 'left',
                                            transition: 'all 0.15s', fontFamily: 'inherit',
                                        }}
                                    >💬 {q}</button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '12px 14px',
                        borderTop: '1px solid #f1f5f9',
                        background: '#fff',
                        display: 'flex', gap: '8px', alignItems: 'flex-end',
                    }}>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your question..."
                            rows={1}
                            style={{
                                flex: 1, border: '1.5px solid #e2e8f0',
                                borderRadius: '12px', padding: '10px 14px',
                                fontSize: '13.5px', outline: 'none', resize: 'none',
                                fontFamily: 'inherit', lineHeight: '1.4',
                                maxHeight: '100px', color: '#1e293b',
                                background: '#f8fafc', transition: 'border-color 0.2s',
                            }}
                            onFocus={e => e.target.style.borderColor = config.color}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                        <button
                            className="jivan-send-btn"
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isLoading}
                            style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: (!input.trim() || isLoading) ? '#cbd5e1' : config.gradient,
                                border: 'none', cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s', flexShrink: 0,
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                className="jivan-fab"
                onClick={() => setIsOpen(prev => !prev)}
                style={{
                    position: 'fixed', bottom: '20px', right: '20px',
                    width: '58px', height: '58px', borderRadius: '50%',
                    background: config.gradient,
                    border: 'none', cursor: 'pointer', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    animation: !isOpen ? 'jivanPulse 2.5s infinite' : 'none',
                }}
                title="Chat with Jivandan AI"
            >
                {isOpen ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6L18 18M18 6L6 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 10h8M8 14h4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                )}
            </button>
        </>
    );
};

export default AIChatbot;
