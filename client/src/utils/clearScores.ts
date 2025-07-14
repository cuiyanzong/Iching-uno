/**
 * 清理积分数据工具
 */

export function clearAllPermanentScores() {
  try {
    localStorage.removeItem('hexagram_uno_permanent_scores');
    console.log('✅ 已清理所有永久积分数据');
    return true;
  } catch (error) {
    console.error('❌ 清理积分数据失败:', error);
    return false;
  }
}

// 在浏览器控制台中添加清理功能
if (typeof window !== 'undefined') {
  (window as any).clearAllPermanentScores = clearAllPermanentScores;
}