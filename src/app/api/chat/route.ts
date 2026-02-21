import { NextRequest, NextResponse } from 'next/server';
import { chat, GeminiAPIError } from '@/services/geminiService';
import type { ChatMessage } from '@/types/chat';

interface ChatRequestBody {
    message: string;
    history?: ChatMessage[];
}

/**
 * POST /api/chat
 * Send a message to the AI chatbot
 */
export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as ChatRequestBody;

        if (!body.message?.trim()) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        const { reply, products } = await chat(body.message, body.history ?? []);

        return NextResponse.json({ reply, products });
    } catch (error) {
        console.error('Chat API error:', error);

        if (error instanceof GeminiAPIError) {
            const statusMap: Record<string, number> = {
                QUOTA_EXCEEDED: 429,
                INVALID_API_KEY: 401,
                TIMEOUT: 504,
            };
            return NextResponse.json(
                { error: error.message },
                { status: statusMap[error.code] ?? 500 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to get AI response' },
            { status: 500 }
        );
    }
}
