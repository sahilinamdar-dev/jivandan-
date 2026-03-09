/**
 * Sends the conversation messages to the backend Groq chat endpoint.
 * Works for both authenticated users (passes JWT) and guests.
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const sendChatMessage = async (messages) => {
    const token = localStorage.getItem('token'); // AuthContext stores as 'token'

    const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
        throw new Error('Failed to get AI response');
    }

    return res.json(); // { reply, role }
};
