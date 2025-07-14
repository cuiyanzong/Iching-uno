import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Download } from "lucide-react";
import { audioManager } from "@/lib/localAudio";

const VOICE_PACKS = [
  { value: "yunxi", label: "云希 (男声)" },
  { value: "xiaoyi", label: "小艺 (女声)" }
];

export default function VoiceSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<{ enabled: boolean; voice: 'yunxi' | 'xiaoyi'; volume: number }>({ 
    enabled: audioManager.isEnabled(), 
    voice: audioManager.getVoice(), 
    volume: audioManager.getVolume() 
  });
  const [loadingProgress, setLoadingProgress] = useState({ loaded: 128, total: 128, isComplete: true });

  useEffect(() => {
    // 从LocalAudioManager获取当前设置
    setSettings({
      enabled: audioManager.isEnabled(),
      voice: audioManager.getVoice(),
      volume: audioManager.getVolume()
    });
    setLoadingProgress({
      loaded: 128,
      total: 128,
      isComplete: true
    });
  }, []);

  const handleVoiceChange = (voiceName: 'yunxi' | 'xiaoyi') => {
    const newSettings = { ...settings, voice: voiceName };
    setSettings(newSettings);
    
    // 更新LocalAudioManager的设置
    audioManager.setVoice(voiceName);
  };

  const handleEnabledChange = (enabled: boolean) => {
    const newSettings = { ...settings, enabled };
    setSettings(newSettings);
    
    // 更新LocalAudioManager的设置
    audioManager.setEnabled(enabled);
  };

  const handleVolumeChange = (volume: number[]) => {
    const newSettings = { ...settings, volume: volume[0] };
    setSettings(newSettings);
    
    // 更新LocalAudioManager的设置
    audioManager.setVolume(volume[0]);
  };

  const testVoice = () => {
    // 播放测试音效
    audioManager.playTestSound();
  };

  const reloadVoicePacks = () => {
    // 刷新页面重新加载音频系统
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white border-purple-500"
        >
          {settings.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>语音包设置</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {!loadingProgress.isComplete && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">
                预加载语音包: {loadingProgress.loaded}/{loadingProgress.total}
              </Label>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(loadingProgress.loaded / loadingProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="voice-enabled">启用语音</Label>
            <Switch
              id="voice-enabled"
              checked={settings.enabled}
              onCheckedChange={handleEnabledChange}
            />
          </div>

          {settings.enabled && (
            <>
              <div className="space-y-2">
                <Label>语音包选择</Label>
                <Select value={settings.voice} onValueChange={handleVoiceChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_PACKS.map((voice) => (
                      <SelectItem key={voice.value} value={voice.value}>
                        {voice.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>音量: {Math.round(settings.volume * 100)}%</Label>
                <Slider
                  value={[settings.volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={testVoice} className="flex-1">
                  测试语音
                </Button>
                <Button 
                  onClick={reloadVoicePacks} 
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              {loadingProgress.isComplete && (
                <div className="text-sm text-green-600 text-center">
                  ✓ 语音包已就绪，支持即时播放
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}