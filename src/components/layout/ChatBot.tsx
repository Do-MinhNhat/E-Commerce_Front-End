'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { useChat } from '@/hooks/useChat';
import type { ChatMessage } from '@/types/chat';
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils';
import { PATH } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

const BOT_GREETING: ChatMessage = {
    id: 'greeting',
    role: 'model',
    content: 'Xin chào! 👋 Tôi là trợ lý mua sắm của EStore. Tôi có thể giúp gì cho bạn hôm nay?',
    timestamp: new Date(),
};

export function ChatBot() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<ChatMessage[]>([BOT_GREETING]);
    const [input, setInput] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { sendMessage } = useChat();

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSend = async (e?: FormEvent) => {
        e?.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || isTyping) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: trimmed,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const { reply, products } = await sendMessage(trimmed);
            const botReply: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: reply,
                products: products.length > 0 ? products : undefined,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botReply]);
        } catch {
            const errorReply: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: 'Xin lỗi, tôi gặp sự cố khi trả lời. Vui lòng thử lại sau! 🙏',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorReply]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    /** Strip [ID:x] tags and clean up whitespace */
    const cleanContent = (text: string) =>
        text.replace(/\[ID:\d+\]/g, '').replace(/\s{2,}/g, ' ').trim();

    /** Render simple markdown-like formatting */
    const renderText = (text: string) => {
        return text.split('\n').map((line, i) => {
            // Bold: **text**
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
                <span key={i}>
                    {i > 0 && <br />}
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        return <span key={j}>{part}</span>;
                    })}
                </span>
            );
        });
    };

    return (
        <>
            {/* Floating toggle button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? 'Đóng chat' : 'Mở chat'}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )}
            </button>

            {/* Chat popup */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 flex w-90 max-h-130 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
                    {/* Header */}
                    <div className="flex items-center gap-3 bg-primary px-4 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a3.121 3.121 0 01-4.06 0L10 14.5" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-primary-foreground">EStore Assistant</h3>
                            <p className="text-xs text-primary-foreground/70">Luôn sẵn sàng hỗ trợ bạn</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-1 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/20 hover:text-primary-foreground cursor-pointer"
                            aria-label="Đóng chat"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4" style={{ maxHeight: '360px' }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                {/* Text bubble */}
                                <div
                                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                                        : 'bg-muted text-foreground rounded-bl-sm'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap">
                                        {renderText(cleanContent(msg.content))}
                                    </div>
                                    <span
                                        className={`mt-1.5 block text-[10px] ${msg.role === 'user'
                                            ? 'text-primary-foreground/50'
                                            : 'text-muted-foreground/70'
                                            }`}
                                    >
                                        {msg.timestamp && formatTime(msg.timestamp)}
                                    </span>
                                </div>

                                {/* Product cards - separate from bubble */}
                                {msg.products && msg.products.length > 0 && (
                                    <div className="mt-2 w-full max-w-[85%] space-y-1.5">
                                        {msg.products.map((product) => {
                                            const discounted = calculateDiscountedPrice(product.price, product.discountPercentage);
                                            return (
                                                <Link
                                                    key={product.id}
                                                    href={PATH.productDetail(product.id)}
                                                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
                                                >
                                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800">
                                                        <Image
                                                            src={product.thumbnail}
                                                            alt={product.title}
                                                            fill
                                                            className="object-contain p-0.5"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="truncate text-xs font-medium text-foreground">
                                                            {product.title}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <span className="text-xs font-bold text-primary">
                                                                {formatPrice(discounted)}
                                                            </span>
                                                            {product.discountPercentage > 0 && (
                                                                <span className="text-[10px] text-muted-foreground line-through">
                                                                    {formatPrice(product.price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <form
                        onSubmit={handleSend}
                        className="flex items-center gap-2 border-t border-border px-3 py-2.5"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            aria-label="Gửi tin nhắn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
