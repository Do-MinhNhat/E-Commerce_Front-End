import { useState, useCallback } from 'react';
import type { ChatMessage, ChatResponse } from '@/types/chat';

interface UseChatReturn {
    sendMessage: (text: string) => Promise<ChatResponse>;
    history: ChatMessage[];
    loading: boolean;
    error: string | null;
    clearHistory: () => void;
}

export function useChat(): UseChatReturn {
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (text: string): Promise<ChatResponse> => {
        setLoading(true);
        setError(null);

        const updatedHistory: ChatMessage[] = [...history, { role: 'user', content: text }];

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Server error: ${res.status}`);
            }

            const { reply, products } = (await res.json()) as ChatResponse;

            setHistory([...updatedHistory, { role: 'model', content: reply }]);

            return { reply, products: products ?? [] };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            setError(message);
            setHistory(updatedHistory);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [history]);

    const clearHistory = useCallback(() => {
        setHistory([]);
        setError(null);
    }, []);

    return { sendMessage, history, loading, error, clearHistory };
}