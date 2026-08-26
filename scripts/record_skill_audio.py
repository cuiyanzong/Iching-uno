#!/usr/bin/env python3
"""
技能语音录制脚本
使用腾讯云TTS免费API录制16段技能语音
"""

import json
import base64
import hashlib
import hmac
import time
import requests
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

# 腾讯云TTS语音配置
VOICE_CONFIG = {
    'yunxi': {
        'VoiceType': 1001,  # 云希
        'Speed': 0,
        'Volume': 0,
        'PrimaryLanguage': 1
    },
    'xiaoyi': {
        'VoiceType': 1002,  # 小艺 
        'Speed': 0,
        'Volume': 0,
        'PrimaryLanguage': 1
    }
}

class TencentTTSRecorder:
    def __init__(self):
        # 腾讯云TTS免费接口（无需密钥）
        self.endpoint = "https://tts.cloud.tencent.com/stream"
        self.headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
    def record_skill_audio(self, element, text, voice_type='yunxi'):
        """录制单个技能语音"""
        try:
            # 构建请求参数
            params = {
                'Action': 'TextToVoice',
                'Version': '2019-08-23',
                'Region': 'ap-beijing',
                'Text': text,
                'SessionId': f'skill_{element}_{voice_type}_{int(time.time())}',
                'ModelType': 1,
                'VoiceType': VOICE_CONFIG[voice_type]['VoiceType'],
                'Speed': VOICE_CONFIG[voice_type]['Speed'],
                'Volume': VOICE_CONFIG[voice_type]['Volume'],
                'PrimaryLanguage': VOICE_CONFIG[voice_type]['PrimaryLanguage'],
                'SampleRate': 16000,
                'Codec': 'mp3'
            }
            
            print(f"🎤 录制: {text} ({voice_type})")
            
            # 发送请求
            response = requests.post(self.endpoint, json=params, headers=self.headers)
            
            if response.status_code == 200:
                result = response.json()
                if 'Audio' in result:
                    # 返回BASE64音频数据
                    audio_base64 = result['Audio']
                    print(f"✅ 录制成功: skill_{element}_{voice_type}")
                    return audio_base64
                else:
                    print(f"❌ 录制失败: {result}")
                    return None
            else:
                print(f"❌ 请求失败: {response.status_code}")
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
                    time.sleep(0.5)  # 避免请求过快
                else:
                    print(f"⚠️ 跳过失败的录制: {key}")
        
        return audio_data

    def save_to_file(self, audio_data, filename='skill_audio_base64.js'):
        """保存音频数据到JS文件"""
        js_content = f"""// 技能语音BASE64数据 - 自动生成于 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
// 总计: {len(audio_data)} 段技能语音

export const skillAudioData = {json.dumps(audio_data, indent=2, ensure_ascii=False)};
"""
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"💾 音频数据已保存到: {filename}")
        print(f"📊 录制统计: {len(audio_data)} 段音频")
        
        # 计算总大小
        total_size = sum(len(data.encode()) for data in audio_data.values())
        print(f"📦 总大小: {total_size / 1024:.1f} KB")

def main():
    recorder = TencentTTSRecorder()
    
    print("=" * 50)
    print("🎭 I Ching UNO 技能语音录制系统")
    print("=" * 50)
    
    # 录制所有技能语音
    audio_data = recorder.record_all_skills()
    
    if audio_data:
        # 保存到文件
        recorder.save_to_file(audio_data)
        print(f"\n🎉 录制完成! 成功录制 {len(audio_data)} 段技能语音")
    else:
        print("\n❌ 录制失败，未获取到音频数据")

if __name__ == '__main__':
    main()