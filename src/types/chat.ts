import type { Product } from './product';

export interface ChatMessage {
    id?: string;
    role: 'user' | 'model';
    content: string;
    products?: Product[];
    timestamp?: Date;
}

export interface ChatResponse {
    reply: string;
    products: Product[];
}