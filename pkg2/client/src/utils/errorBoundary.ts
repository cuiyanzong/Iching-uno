/**
 * 错误边界工具类 - 提供统一的错误处理和恢复机制
 */

export class ErrorBoundary {
  private static errorCount = 0;
  private static lastError: Error | null = null;
  private static errorTimestamp = 0;

  /**
   * 统一的错误处理函数
   */
  static handleError(error: Error, context: string): void {
    const now = Date.now();
    
    // 防止重复错误记录
    if (this.lastError?.message === error.message && now - this.errorTimestamp < 1000) {
      return;
    }
    
    this.lastError = error;
    this.errorTimestamp = now;
    this.errorCount++;
    
    console.error(`[${context}] Error caught:`, error);
    
    // 错误恢复策略
    if (this.errorCount > 5) {
      console.warn('Too many errors, implementing recovery strategy');
      this.performRecovery();
    }
  }

  /**
   * Promise rejection处理
   */
  static handlePromiseRejection(reason: any, context: string): void {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    this.handleError(error, `Promise:${context}`);
  }

  /**
   * 异步操作包装器
   */
  static async wrapAsync<T>(
    operation: () => Promise<T>,
    context: string,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error as Error, context);
      return fallback;
    }
  }

  /**
   * 错误恢复机制
   */
  private static performRecovery(): void {
    // 清除错误计数
    this.errorCount = 0;
    this.lastError = null;
    
    // 触发垃圾回收
    if (global.gc) {
      global.gc();
    }
    
    // 清理sessionStorage
    try {
      sessionStorage.removeItem('tempData');
      sessionStorage.removeItem('pageState');
    } catch (error) {
      console.warn('Failed to clear session storage:', error);
    }
  }

  /**
   * 获取错误统计
   */
  static getErrorStats() {
    return {
      errorCount: this.errorCount,
      lastError: this.lastError?.message,
      lastErrorTime: this.errorTimestamp
    };
  }
}

// 全局错误处理器
window.addEventListener('error', (event) => {
  ErrorBoundary.handleError(event.error, 'Global');
});

window.addEventListener('unhandledrejection', (event) => {
  ErrorBoundary.handlePromiseRejection(event.reason, 'Global');
  event.preventDefault(); // 阻止默认的控制台错误输出
});