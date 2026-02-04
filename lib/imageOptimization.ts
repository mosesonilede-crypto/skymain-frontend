/**
 * Image Optimization Utilities
 * Helps optimize Figma asset loading and caching
 */

// Cache for image URLs to reduce repeated Figma API calls
const imageCache = new Map<string, string>();

/**
 * Get optimized image URL with caching
 * @param assetId - Figma asset ID
 * @param fallback - Fallback image URL
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
    assetId: string,
    fallback?: string
): string {
    if (imageCache.has(assetId)) {
        return imageCache.get(assetId)!;
    }

    const url = fallback || `https://www.figma.com/api/mcp/asset/${assetId}`;
    imageCache.set(assetId, url);
    return url;
}

/**
 * Preload images for better perceived performance
 */
export function preloadImages(imageUrls: string[]): void {
    if (typeof window === "undefined") return;

    imageUrls.forEach((url) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = url;
        document.head.appendChild(link);
    });
}

/**
 * Load image with retry logic
 */
export async function loadImageWithRetry(
    url: string,
    maxRetries: number = 3
): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url, { method: "HEAD" });
            if (response.ok) {
                return url;
            }
        } catch (error) {
            lastError = error as Error;
            await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        }
    }

    throw (
        lastError ||
        new Error(`Failed to load image after ${maxRetries} retries: ${url}`)
    );
}

/**
 * Clear image cache
 */
export function clearImageCache(): void {
    imageCache.clear();
}

/**
 * Get cache statistics
 */
export function getImageCacheStats(): {
    size: number;
    entries: string[];
} {
    return {
        size: imageCache.size,
        entries: Array.from(imageCache.keys()),
    };
}
