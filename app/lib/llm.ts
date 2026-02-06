import { Message, Provider } from './store';

interface LLMResponse {
    content: string;
    error?: string;
}

export async function submitPrompt(
    messages: Message[],
    systemPrompt: string,
    apiKey: string,
    provider: Provider
): Promise<LLMResponse> {
    if (!apiKey) {
        return { content: '', error: 'API Key is missing. Please add it in settings.' };
    }

    try {
        if (provider === 'gemini') {
            return await submitGemini(messages, systemPrompt, apiKey);
        } else if (provider === 'groq') {
            return await submitGroq(messages, systemPrompt, apiKey);
        } else {
            return await submitOpenAI(messages, systemPrompt, apiKey);
        }
    } catch (err) {
        return { content: '', error: 'Network error or invalid API endpoint.' };
    }
}

async function submitOpenAI(messages: Message[], systemPrompt: string, apiKey: string): Promise<LLMResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 150
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        return { content: '', error: errorData.error?.message || 'OpenAI API request failed' };
    }

    const data = await response.json();
    return { content: data.choices[0].message.content };
}

async function submitGroq(messages: Message[], systemPrompt: string, apiKey: string): Promise<LLMResponse> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 150
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        return { content: '', error: errorData.error?.message || 'Groq API request failed' };
    }

    const data = await response.json();
    return { content: data.choices[0].message.content };
}

async function submitGemini(messages: Message[], systemPrompt: string, apiKey: string): Promise<LLMResponse> {
    // Gemini REST API format
    // Map roles: system -> not directly supported in 'generateContent' the same way, usually passed as context or part of history.
    // Actually, v1beta models now support system_instruction.

    const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
    })).filter(m => m.role !== 'system'); // Filter system messages from the 'contents' array as they are separate

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            system_instruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: contents,
            generationConfig: {
                maxOutputTokens: 150,
                temperature: 0.7
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        return { content: '', error: errorData.error?.message || 'Gemini API request failed' };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        return { content: '', error: 'Empty response from Gemini' };
    }

    return { content: text };
}
