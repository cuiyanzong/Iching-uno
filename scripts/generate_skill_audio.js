// 技能语音生成脚本 - 使用Web Speech API或模拟数据
// 为了演示，我们创建16个技能语音的BASE64占位符

const SKILL_TEXTS = {
  'earth': '坤字·土河车',
  'sky': '乾字·百花缭乱', 
  'water': '坎字·渊澄取映',
  'fire': '离字·萤火流光',
  'thunder': '震字·八方雷电',
  'wind': '巽字·清风化煞',
  'mountain': '艮字·地龙游',
  'lake': '兑字·黑琉璃'
};

// 生成技能语音BASE64数据
function generateSkillAudioData() {
  const audioData = {};
  
  // 为每个技能生成两种语音版本
  Object.keys(SKILL_TEXTS).forEach(element => {
    ['yunxi', 'xiaoyi'].forEach(voice => {
      const key = `skill_${element}_${voice}`;
      
      // 创建一个短暂的音频数据占位符
      // 实际项目中这里应该是真实的TTS API生成的BASE64音频
      const mockAudioBase64 = generateMockAudioBase64(SKILL_TEXTS[element], voice);
      audioData[key] = `data:audio/mp3;base64,${mockAudioBase64}`;
    });
  });
  
  return audioData;
}

// 生成模拟的音频BASE64数据（用于演示）
function generateMockAudioBase64(text, voice) {
  // 这是一个非常短的MP3文件的BASE64编码（静音音频）
  // 实际项目中应该替换为真实的TTS生成音频
  const silentMp3Base64 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  
  // 为不同的技能和语音创建唯一标识
  const hash = btoa(text + voice).substring(0, 8);
  return silentMp3Base64 + hash;
}

// 保存到文件
function saveSkillAudioData() {
  const audioData = generateSkillAudioData();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  const jsContent = `// 技能语音BASE64数据 - 生成于 ${new Date().toLocaleString('zh-CN')}
// 注意: 这是演示数据，实际项目中应使用真实的TTS API生成
// 总计: ${Object.keys(audioData).length} 段技能语音

export const skillAudioData = ${JSON.stringify(audioData, null, 2)};

// 技能名称映射
export const skillNameMap = ${JSON.stringify(SKILL_TEXTS, null, 2)};
`;

  console.log('技能语音数据已生成:');
  console.log(`- 总计: ${Object.keys(audioData).length} 段语音`);
  console.log(`- 文件大小: ${(jsContent.length / 1024).toFixed(1)} KB`);
  console.log('- 包含技能: ', Object.keys(SKILL_TEXTS).join(', '));
  
  return jsContent;
}

// 在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
  const fs = require('fs');
  const content = saveSkillAudioData();
  fs.writeFileSync('skill_audio_base64.js', content, 'utf8');
  console.log('✅ 文件已保存: skill_audio_base64.js');
} else {
  // 浏览器环境
  console.log(saveSkillAudioData());
}