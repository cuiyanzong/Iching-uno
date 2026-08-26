// 临时修复同步问题的脚本
// 检查当前本地数据状态
const currentScores = JSON.parse(localStorage.getItem('hexagram_uno_permanent_scores') || '{}');
console.log('本地积分数据:', currentScores);

// 检查测试玩家的数据
const testPlayer = currentScores['human_测试'];
console.log('测试玩家本地数据:', testPlayer);

// 如果本地数据分数为0，但云端有100分，说明需要同步
if (testPlayer && testPlayer.totalScore === 0) {
  console.log('检测到同步问题：本地0分，云端100分');
  console.log('需要决定是上传本地数据还是下载云端数据');
}