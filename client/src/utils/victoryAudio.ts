/**
 * 特殊结算音效系统
 * 使用宫商角徵羽钟磬音效
 */

export type VictoryType = 'small_victory' | 'double_kill' | 'quad_kill' | 'defeat' | 'normal_win';

/**
 * 播放胜利音效
 */
export function playVictoryAudio(victoryType: VictoryType): void {
  try {
    const audioContext = new AudioContext();
    
    // 五音阶的频率：宫商角徵羽 (C D E G A)
    const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00]; // C4 D4 E4 G4 A4
    
    // 根据胜利类型选择音效模式
    let playOrder: number[];
    let noteInterval: number;
    let totalDuration: number;
    
    switch (victoryType) {
      case 'small_victory':
        // 小胜一局：宫商角（简单上升）
        playOrder = [0, 1, 2]; // 宫商角
        noteInterval = 0.3;
        totalDuration = 1.0;
        break;
        
      case 'double_kill':
        // 一箭双雕：宫商角徵羽（完整上升）
        playOrder = [0, 1, 2, 3, 4]; // 宫商角徵羽
        noteInterval = 0.25;
        totalDuration = 1.5;
        break;
        
      case 'quad_kill':
        // 大杀四方：宫商角徵羽 + 高音宫（双倍音）
        playOrder = [0, 1, 2, 3, 4, 0]; // 宫商角徵羽宫
        noteInterval = 0.2;
        totalDuration = 2.0;
        break;
        
      case 'defeat':
        // 遗憾败北：羽徵角商宫（下降）
        playOrder = [4, 3, 2, 1, 0]; // 羽徵角商宫
        noteInterval = 0.35;
        totalDuration = 1.8;
        break;
        
      case 'normal_win':
        // 普通胜利：宫徵羽（跳跃式）
        playOrder = [0, 3, 4]; // 宫徵羽
        noteInterval = 0.3;
        totalDuration = 1.0;
        break;
        
      default:
        playOrder = [0, 2, 4]; // 宫角羽
        noteInterval = 0.3;
        totalDuration = 1.0;
        break;
    }
    
    // 分开弹奏每个音符
    playOrder.forEach((noteIndex, i) => {
      const delay = i * noteInterval;
      const isLastNote = i === playOrder.length - 1;
      const isQuadKillLastNote = victoryType === 'quad_kill' && isLastNote;
      
      setTimeout(() => {
        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 钟磬音色
        osc.type = 'sine';
        
        // 大杀四方的最后一个音符使用双倍频率（高音宫）
        const frequency = isQuadKillLastNote ? frequencies[noteIndex] * 2 : frequencies[noteIndex];
        osc.frequency.setValueAtTime(frequency, audioContext.currentTime);
        
        // 钟磬声音效果
        const noteDuration = victoryType === 'defeat' ? 0.25 : 0.2; // 失败音效稍长
        const volume = isQuadKillLastNote ? 0.15 : 0.12; // 高音宫稍大声
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + noteDuration);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + noteDuration);
      }, delay * 1000);
    });
    
    // console.log(`🎵 播放${victoryType}音效，总时长${totalDuration}秒`);
  } catch (error) {
    // console.log('🔇 音效播放失败，静默处理');
  }
}

/**
 * 根据游戏结果确定音效类型
 */
export function getVictoryTypeFromResult(resultMessage: string, playerName: string, isPlayerWin: boolean): VictoryType {
  if (!isPlayerWin) {
    return 'defeat';
  }
  
  switch (resultMessage) {
    case '大杀四方':
    case '团灭':
      return 'quad_kill';
    case '一箭双雕':
      return 'double_kill';
    case '小胜一局':
      return 'small_victory';
    default:
      return 'normal_win';
  }
}