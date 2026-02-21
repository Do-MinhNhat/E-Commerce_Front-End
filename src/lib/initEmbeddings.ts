import { preloadStore } from '@/services/geminiService';

let initialized = false;

/**
 * Initialize embeddings on server startup
 * Runs as background task - does not block
 */
export function initializeEmbeddings(): void {
    if (initialized) return;
    initialized = true;

    // Fire and forget - don't await
    console.log('🔄 Preloading embeddings in background...');
    preloadStore()
        .then(() => console.log('✅ Embeddings ready'))
        .catch((error) => console.error('❌ Embeddings preload failed:', error));
}
