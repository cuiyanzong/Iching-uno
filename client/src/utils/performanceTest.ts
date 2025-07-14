/**
 * 性能测试工具
 * 用于测试网络请求对游戏性能的影响
 */

// 测试网络请求的性能影响
export function testNetworkPerformance() {
  console.log('🧪 开始网络性能测试...');
  
  const startTime = performance.now();
  
  // 模拟应用启动时的网络请求
  const networkTasks = [
    // 1. 检查排行榜
    fetch('/api/leaderboard', { method: 'HEAD' }).catch(e => e),
    
    // 2. 检查待上传数据
    fetch('/api/leaderboard', { method: 'HEAD' }).catch(e => e),
    
    // 3. 网络连接测试
    fetch('/api/leaderboard', { method: 'HEAD' }).catch(e => e)
  ];
  
  Promise.all(networkTasks).then(() => {
    const endTime = performance.now();
    console.log(`📊 网络请求总耗时: ${endTime - startTime}ms`);
    console.log('🔍 网络请求对游戏启动的影响:', endTime - startTime > 100 ? '较大' : '较小');
  });
}

// 测试无网络请求时的性能
export function testOfflinePerformance() {
  console.log('🧪 开始离线性能测试...');
  
  const startTime = performance.now();
  
  // 模拟纯本地操作
  const localTasks = [
    Promise.resolve('local1'),
    Promise.resolve('local2'),
    Promise.resolve('local3')
  ];
  
  Promise.all(localTasks).then(() => {
    const endTime = performance.now();
    console.log(`📊 本地操作总耗时: ${endTime - startTime}ms`);
  });
}

// 添加到全局供测试使用
if (typeof window !== 'undefined') {
  (window as any).testNetworkPerformance = testNetworkPerformance;
  (window as any).testOfflinePerformance = testOfflinePerformance;
  console.log('🧪 性能测试工具已加载:');
  console.log('  - testNetworkPerformance() 测试网络性能');
  console.log('  - testOfflinePerformance() 测试离线性能');
}