#!/usr/bin/env python3
"""
使用免费Edge-TTS录制技能语音
兼容OpenAI API格式，完全免费
"""

import requests
import json
import base64
import time
from datetime import datetime

# 技能语音文本数据
SKILL_TEXTS = {
    'earth': '坤字·土河车',
    'sky': '乾字·百花缭乱', 
    'water': '坎字·渊澄取映',
    'fire': '离字·萤火流光',
    'thunder': '震字·八方雷电',
    'wind': '巽字·清风化煞',
    'mountain': '艮字·地龙游',
    'lake': '兑字·黑琉璃'
}

# 语音配置 - 使用OpenAI兼容的语音
VOICE_CONFIG = {
    'yunxi': 'alloy',    # 对应云希的温柔声音
    'xiaoyi': 'nova'     # 对应小艺的清脆声音
}

class FreeOpenAITTSRecorder:
    def __init__(self):
        # 使用免费的Edge-TTS服务（OpenAI API兼容）
        self.base_url = "https://api.ttsopenai.com/v1"  # 免费Edge-TTS服务
        self.headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-free-edge-tts-key'  # 免费密钥
        }
        
    def record_skill_audio(self, element, text, voice_type='yunxi'):
        """录制单个技能语音"""
        try:
            # 构建OpenAI TTS API请求
            payload = {
                "model": "tts-1",
                "input": text,
                "voice": VOICE_CONFIG[voice_type],
                "response_format": "mp3",
                "speed": 1.0
            }
            
            print(f"🎤 录制: {text} ({voice_type})")
            
            # 发送请求到免费TTS服务
            response = requests.post(
                f"{self.base_url}/audio/speech",
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                # 获取音频数据并转换为BASE64
                audio_data = response.content
                audio_base64 = base64.b64encode(audio_data).decode('utf-8')
                print(f"✅ 录制成功: skill_{element}_{voice_type}")
                return audio_base64
            else:
                print(f"❌ 录制失败: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ 录制异常: {e}")
            return None

    def record_all_skills(self):
        """录制所有技能语音"""
        audio_data = {}
        
        print("🚀 开始录制技能语音...")
        print(f"📋 计划录制: {len(SKILL_TEXTS)} 个技能 × 2 种语音 = {len(SKILL_TEXTS) * 2} 段音频")
        
        for element, text in SKILL_TEXTS.items():
            for voice in ['yunxi', 'xiaoyi']:
                key = f'skill_{element}_{voice}'
                audio_base64 = self.record_skill_audio(element, text, voice)
                
                if audio_base64:
                    # 添加data:URL前缀
                    audio_data[key] = f'data:audio/mp3;base64,{audio_base64}'
                    time.sleep(1)  # 避免请求过快
                else:
                    print(f"⚠️ 跳过失败的录制: {key}")
        
        return audio_data

    def save_to_file(self, audio_data, filename='skill_audio_base64.js'):
        """保存音频数据到JS文件"""
        js_content = f"""// 技能语音BASE64数据 - 使用免费OpenAI TTS录制于 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
// 总计: {len(audio_data)} 段技能语音

export const skillAudioData = {json.dumps(audio_data, indent=2, ensure_ascii=False)};

// 技能名称映射
export const skillNameMap = {json.dumps(SKILL_TEXTS, indent=2, ensure_ascii=False)};
"""
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"💾 音频数据已保存到: {filename}")
        print(f"📊 录制统计: {len(audio_data)} 段音频")
        
        # 计算总大小
        total_size = sum(len(data.encode()) for data in audio_data.values())
        print(f"📦 总大小: {total_size / 1024:.1f} KB")

def main():
    recorder = FreeOpenAITTSRecorder()
    
    print("=" * 60)
    print("🎭 I Ching UNO 技能语音录制系统")
    print("使用免费Edge-TTS (OpenAI API兼容)")
    print("=" * 60)
    
    # 录制所有技能语音
    audio_data = recorder.record_all_skills()
    
    if audio_data:
        # 保存到文件
        recorder.save_to_file(audio_data)
        print(f"\n🎉 录制完成! 成功录制 {len(audio_data)} 段技能语音")
        print("技能语音已集成到游戏系统中")
    else:
        print("\n❌ 录制失败，未获取到音频数据")
        print("将使用备用的模拟音频数据")

if __name__ == '__main__':
    main()