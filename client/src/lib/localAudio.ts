/**
 * 本地音频管理系统
 * 真正的静态音频播放，零网络请求
 * 使用Vite静态资源导入，完全本地化
 */

export type VoiceOption = 'yunxi' | 'xiaoyi';

// 使用import导入audioBase64.js中的完整数据
import { audioBase64Data } from '../../../audioBase64.js';

// 完整的音频数据
const audioFiles: Record<string, string> = audioBase64Data;

class LocalAudioManager {
  private currentVoice: VoiceOption = 'yunxi';
  private volume = 0.8;
  private enabled = true;
  private audioCache = new Map<string, HTMLAudioElement>();

  constructor() {
    // 从localStorage恢复设置
    const saved = localStorage.getItem('audio-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        this.currentVoice = settings.voice || 'yunxi';
        this.volume = settings.volume || 0.8;
        this.enabled = settings.enabled !== false;
      } catch (e) {
        console.warn('音频设置恢复失败:', e);
      }
    }
    
    // 单机模式下确保音频默认启用
    if (this.enabled === undefined || this.enabled === null) {
      this.enabled = true;
      this.saveSettings();
    }
  }

  /**
   * 播放音频 - 真正的静态资源，零网络请求
   */
  playAudio(cardId: string, voice?: VoiceOption): void {
    if (!this.enabled) return;
    
    const voiceToUse = voice || this.currentVoice;
    const key = `${cardId}_${voiceToUse}`;
    
    // 获取静态资源URL
    let audioUrl = audioFiles[key];
    let finalKey = key;
    
    if (!audioUrl) {
      console.warn(`音频文件不存在: ${key}`);
      // 基础卦象应该都有，如果没有就用备用方案
      const fallbackKey = `${cardId}_yunxi`;
      const fallbackUrl = audioFiles[fallbackKey];
      if (!fallbackUrl) {
        console.log(`🔊 音频文件缺失: ${key}, 总数: ${Object.keys(audioFiles).length}`);
        return;
      }
      audioUrl = fallbackUrl;
      finalKey = fallbackKey;
    }

    try {
      // 使用缓存的音频元素
      let audio = this.audioCache.get(finalKey);
      
      if (!audio) {
        // 创建新的音频元素
        audio = new Audio();
        audio.src = audioUrl;
        audio.volume = this.volume;
        audio.preload = 'auto';
        
        // 添加到缓存
        this.audioCache.set(finalKey, audio);
      }
      
      // 播放音频
      audio.currentTime = 0;
      audio.volume = this.volume;
      audio.play().catch(err => {
        console.warn('音频播放失败:', err);
      });
      
      console.log(`🔊 真实音频播放: ${finalKey}`);
    } catch (error) {
      console.warn('音频播放错误:', error);
    }
  }

  /**
   * 设置语音选项
   */
  setVoice(voice: VoiceOption): void {
    this.currentVoice = voice;
    this.saveSettings();
  }

  /**
   * 获取当前语音选项
   */
  getVoice(): VoiceOption {
    return this.currentVoice;
  }

  /**
   * 设置音量
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
    
    // 更新缓存中的音频音量
    this.audioCache.forEach(audio => {
      audio.volume = this.volume;
    });
  }

  /**
   * 获取音量
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * 启用/禁用音频
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.saveSettings();
  }

  /**
   * 获取音频是否启用
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * 播放测试音效
   */
  playTestSound(): void {
    // 播放乾卦测试音效
    this.playAudio('sky_sky_qian');
  }

  /**
   * 保存设置到localStorage
   */
  private saveSettings(): void {
    try {
      const settings = {
        voice: this.currentVoice,
        volume: this.volume,
        enabled: this.enabled
      };
      localStorage.setItem('audio-settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('音频设置保存失败:', e);
    }
  }
}

export const audioManager = new LocalAudioManager();