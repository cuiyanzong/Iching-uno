/**
 * 重置积分系统工具
 */

export function resetScoreSystem() {
  try {
    // 清除localStorage数据
    localStorage.removeItem('hexagram_uno_permanent_scores');
    
    // 刷新页面以重置所有状态
    window.location.reload();
    
    return true;
  } catch (error) {
    console.error('重置积分系统失败:', error);
    return false;
  }
}

// 在浏览器控制台中添加重置功能
if (typeof window !== 'undefined') {
  (window as any).resetScoreSystem = resetScoreSystem;
}