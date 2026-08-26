#!/usr/bin/env python3
"""
使用免费Edge-TTS录制技能语音
真正的Edge-TTS实现，不需要API密钥
"""

import asyncio
import edge_tts
import base64
import os
import tempfile
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

# Edge-TTS语音配置
VOICE_CONFIG = {
    'yunxi': 'zh-CN-YunxiNeural',   # 云希 - 温和男声
    'xiaoyi': 'zh-CN-XiaoyiNeural'  # 小艺 - 温柔女声
}

class EdgeTTSRecorder:
    def __init__(self):
        self.audio_data = {}
        
    async def record_skill_audio(self, element, text, voice_type='yunxi'):
        """录制单个技能语音"""
        try:
            voice_name = VOICE_CONFIG[voice_type]
            print(f"🎤 录制: {text} ({voice_type} - {voice_name})")
            
            # 创建TTS通信对象
            communicate = edge_tts.Communicate(text, voice_name)
            
            # 创建临时文件来保存音频
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_file:
                temp_path = temp_file.name
                
            # 保存音频到临时文件
            await communicate.save(temp_path)
            
            # 读取音频文件并转换为base64
            with open(temp_path, 'rb') as audio_file:
                audio_bytes = audio_file.read()
                audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
                
            # 清理临时文件
            os.unlink(temp_path)
            
            print(f"✅ 录制成功: skill_{element}_{voice_type} ({len(audio_base64)} chars)")
            return f"data:audio/mp3;base64,{audio_base64}"
            
        except Exception as e:
            print(f"❌ 录制失败: {e}")
            return None
    
    async def record_all_skills(self):
        """录制所有技能语音"""
        print("============================================================")
        print("🎭 I Ching UNO 技能语音录制系统")
        print("使用免费Edge-TTS (真正的微软语音服务)")
        print("============================================================")
        
        total_count = len(SKILL_TEXTS) * len(VOICE_CONFIG)
        print(f"🚀 开始录制技能语音...")
        print(f"📋 计划录制: {len(SKILL_TEXTS)} 个技能 × {len(VOICE_CONFIG)} 种语音 = {total_count} 段音频")
        
        for element, text in SKILL_TEXTS.items():
            for voice_type in VOICE_CONFIG.keys():
                audio_base64 = await self.record_skill_audio(element, text, voice_type)
                
                if audio_base64:
                    key = f"skill_{element}_{voice_type}"
                    self.audio_data[key] = audio_base64
                else:
                    print(f"⚠️ 跳过失败的录制: skill_{element}_{voice_type}")
        
        return self.audio_data
    
    def generate_js_file(self, audio_data):
        """生成JavaScript文件"""
        if not audio_data:
            print("❌ 录制失败，未获取到音频数据")
            print("将使用备用的模拟音频数据")
            
            # 生成模拟数据
            fallback_data = {}
            for element in SKILL_TEXTS.keys():
                for voice_type in VOICE_CONFIG.keys():
                    key = f"skill_{element}_{voice_type}"
                    # 使用简短的MP3头作为占位符
                    fallback_data[key] = "data:audio/mp3;base64,//NkxAAAAANIAAAAAExBTUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"
            
            audio_data = fallback_data
        
        # 生成当前时间戳
        timestamp = datetime.now().isoformat()
        
        # 生成JavaScript文件内容
        js_content = f'''// 自动生成的技能语音Base64数据
// 生成时间: {timestamp}
// 文件总数: {len(audio_data)}

export const skillAudioData = {{
'''
        
        for key, data in audio_data.items():
            js_content += f'  "{key}": "{data}",\n'
        
        js_content += '};\n'
        
        # 写入文件
        output_file = '../skill_audio_base64.js'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"📁 技能语音数据已保存到: {output_file}")
        print(f"📊 共生成 {len(audio_data)} 段技能语音")
        
        # 显示生成的语音列表
        print("\n🎭 生成的技能语音列表:")
        for element in SKILL_TEXTS.keys():
            for voice_type in VOICE_CONFIG.keys():
                key = f"skill_{element}_{voice_type}"
                if key in audio_data:
                    status = "✅"
                    size = len(audio_data[key])
                else:
                    status = "❌"
                    size = 0
                print(f"  {status} {key} ({size} chars)")

async def main():
    """主函数"""
    recorder = EdgeTTSRecorder()
    audio_data = await recorder.record_all_skills()
    recorder.generate_js_file(audio_data)
    
    print("\n🎉 技能语音录制完成！")
    print("现在可以在游戏中使用技能语音功能了。")

if __name__ == "__main__":
    asyncio.run(main())