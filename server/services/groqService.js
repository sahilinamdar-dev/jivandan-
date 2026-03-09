const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Send a multi-turn conversation to Groq and get a reply.
 * @param {Array} messages  - Array of {role, content} objects (system + history + user)
 * @returns {string}        - AI reply text
 */
const askGroq = async (messages) => {
    const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
    });
    return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
};

module.exports = { askGroq };
