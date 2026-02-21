import { GoogleGenerativeAI, type Content } from '@google/generative-ai';
import { fetchProducts } from './productService';
import type { Product } from '@/types/product';
import type { ChatMessage, ChatResponse } from '@/types/chat';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const EMBEDDINGS_FILE = join(process.cwd(), 'data', 'embeddings.json');

const SYSTEM_PROMPT = `Bạn là trợ lý mua sắm thông minh của EStore. Nhiệm vụ của bạn:
- Giúp khách hàng tìm sản phẩm phù hợp dựa trên danh sách sản phẩm được cung cấp.
- Trả lời bằng tiếng Việt, ngắn gọn, thân thiện.
- Khi gợi ý sản phẩm, nêu tên, giá, và mô tả ngắn.
- Nếu không tìm thấy sản phẩm phù hợp, hãy nói rõ và gợi ý tìm kiếm khác.
- Không trả lời các câu hỏi không liên quan đến mua sắm.`;

// ── Embedding store ─────────────────────────────────────────────
interface ProductEmbedding {
    product: Product;
    vector: number[];
}

let store: ProductEmbedding[] | null = null;

function productToText(p: Product): string {
    return `${p.title} - ${p.brand ?? ''} - ${p.category} - $${p.price} - ${p.description} - ${(p.tags ?? []).join(', ')}`;
}

async function embedTexts(texts: string[]): Promise<number[][]> {
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const BATCH_SIZE = 100; // Gemini API limit: max 100 requests per batch
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
        if (i > 0) {
            // Wait 1 minute between batches to avoid RPM limit (100 RPM)
            console.log(`Waiting 60s before batch ${Math.floor(i / BATCH_SIZE) + 1}...`);
            await new Promise((resolve) => setTimeout(resolve, 60000));
        }

        const batch = texts.slice(i, i + BATCH_SIZE);
        const result = await model.batchEmbedContents({
            requests: batch.map((text) => ({
                content: { role: 'user', parts: [{ text }] },
            })),
        });
        allEmbeddings.push(...result.embeddings.map((e) => e.values));
    }

    return allEmbeddings;
}

async function getStore(): Promise<ProductEmbedding[]> {
    if (store) return store;

    // Check if embeddings.json exists
    if (existsSync(EMBEDDINGS_FILE)) {
        try {
            console.log('Loading embeddings from cache...');
            const data = readFileSync(EMBEDDINGS_FILE, 'utf-8');
            const cached = JSON.parse(data) as ProductEmbedding[];
            store = cached;
            console.log(`✅ Loaded ${store.length} embeddings from cache`);
            return store;
        } catch (error) {
            console.error('Failed to load embeddings cache:', error);
            // Fall through to compute embeddings
        }
    }

    console.log('Initializing product embeddings...');
    const data = await fetchProducts({ limit: 0, skip: 0 });
    const texts = data.products.map(productToText);
    console.log(`Embedding ${texts.length} products...`);
    const vectors = await embedTexts(texts);

    store = data.products.map((product, i) => ({
        product,
        vector: vectors[i],
    }));

    // Save to file for future use
    try {
        const dir = dirname(EMBEDDINGS_FILE);
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
        writeFileSync(EMBEDDINGS_FILE, JSON.stringify(store, null, 2));
        console.log(`✅ Saved ${store.length} embeddings to ${EMBEDDINGS_FILE}`);
    } catch (error) {
        console.error('Failed to save embeddings cache:', error);
        // Continue anyway - cache save is not critical
    }

    console.log(`✅ Product embeddings initialized: ${store.length} products`);
    return store;
}

// ── Vector search ───────────────────────────────────────────────
function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

async function searchProducts(query: string, topK = 10): Promise<Product[]> {
    const embeddings = await getStore();
    const [queryVector] = await embedTexts([query]);

    const scored = embeddings
        .map((entry) => ({
            product: entry.product,
            score: cosineSimilarity(queryVector, entry.vector),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);

    return scored.map((s) => s.product);
}

// ── Chat ────────────────────────────────────────────────────────
export class GeminiAPIError extends Error {
    constructor(
        message: string,
        public code: string
    ) {
        super(message);
        this.name = 'GeminiAPIError';
    }
}

function parseGeminiError(error: unknown): { message: string; code: string } {
    if (error instanceof Error) {
        const msg = error.message;
        // Check for quota/rate limit errors
        if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
            return {
                message: 'Gemini API quota exceeded. Please try again later.',
                code: 'QUOTA_EXCEEDED',
            };
        }
        if (msg.includes('PERMISSION_DENIED') || msg.includes('API key')) {
            return {
                message: 'Invalid Gemini API key. Please check your configuration.',
                code: 'INVALID_API_KEY',
            };
        }
        if (msg.includes('timeout') || msg.includes('DEADLINE_EXCEEDED')) {
            return {
                message: 'Gemini API request timeout. Please try again.',
                code: 'TIMEOUT',
            };
        }
        return { message: msg, code: 'UNKNOWN' };
    }
    return { message: 'Unknown error occurred', code: 'UNKNOWN' };
}

export async function chat(
    userMessage: string,
    history: ChatMessage[] = []
): Promise<ChatResponse> {
    try {
        // Semantic search: find the most relevant products for this query
        const relevantProducts = await searchProducts(userMessage);
        const productList = relevantProducts
            .map((p) => `[ID:${p.id}] ${p.title} - $${p.price} (${p.category}): ${p.description}`)
            .join('\n');

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: `${SYSTEM_PROMPT}

Sản phẩm liên quan nhất đến câu hỏi người dùng:
${productList}

Khi gợi ý sản phẩm, hãy đề cập ID sản phẩm dạng [ID:số] để hệ thống hiển thị thẻ sản phẩm tương ứng.`,
        });

        const geminiHistory: Content[] = history.map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.content }],
        }));

        const chatSession = model.startChat({ history: geminiHistory });
        const result = await chatSession.sendMessage(userMessage);
        const reply = result.response.text();

        // Extract mentioned product IDs from the reply (keep tags in text for inline rendering)
        const mentionedIds = [...reply.matchAll(/\[ID:(\d+)\]/g)].map((m) => Number(m[1]));
        const matchedProducts = mentionedIds.length > 0
            ? relevantProducts.filter((p) => mentionedIds.includes(p.id))
            : [];

        return { reply, products: matchedProducts };
    } catch (error) {
        const { message, code } = parseGeminiError(error);
        throw new GeminiAPIError(message, code);
    }
}

/**
 * Preload product embeddings at startup (background task)
 * Call this during server initialization
 */
export async function preloadStore(): Promise<void> {
    try {
        await getStore();
    } catch (error) {
        console.error('Failed to preload embeddings:', error);
        // Don't throw - let server continue even if preload fails
    }
}
