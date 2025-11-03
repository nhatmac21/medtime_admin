// Performance monitoring utilities

export const measurePerformance = (label: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
};

export const measureAsync = async <T,>(label: string, promise: Promise<T>): Promise<T> => {
  const start = performance.now();
  try {
    const result = await promise;
    const end = performance.now();
    console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const end = performance.now();
    console.error(`❌ ${label} failed after ${(end - start).toFixed(2)}ms`);
    throw error;
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Cache utility with TTL
export class CacheManager<T> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map();
  private ttl: number;

  constructor(ttlMinutes: number = 2) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  get(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    console.log(`📦 Cache HIT for key: ${key}`);
    return cached.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
    console.log(`💾 Cache SAVED for key: ${key}`);
  }

  clear(): void {
    this.cache.clear();
    console.log('🗑️ Cache CLEARED');
  }

  delete(key: string): void {
    this.cache.delete(key);
    console.log(`🗑️ Cache DELETED for key: ${key}`);
  }

  size(): number {
    return this.cache.size;
  }
}
