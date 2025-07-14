import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card as UICard } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Lightbulb, MousePointer, RotateCw } from "lucide-react";
import Card from "./Card";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTutorial: () => void;
}

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  highlight?: string;
  exampleCard?: string;
  action?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "欢迎来到易经UNO",
    content: "这是一个融合传统易经八卦与UNO规则的卡牌游戏。每张卡牌都代表64卦中的一卦，包含不同的元素组合。",
    highlight: "game-basics"
  },
  {
    id: 2,
    title: "认识卡牌元素",
    content: "每张卡牌包含两个元素：火🔥、水💧、山⛰️、泽🌊、地🌍、天☁️、雷⚡、风💨。你只能出与当前卡牌有相同元素的牌。",
    highlight: "card-elements",
    exampleCard: "fire_water_weiji"
  },
  {
    id: 3,
    title: "出牌规则",
    content: "点击手中的卡牌来出牌。只有当你的卡牌至少包含一个与桌面卡牌相同的元素时才能出牌。",
    highlight: "play-rules",
    action: "click-card",
    exampleCard: "fire_water_weiji"
  },
  {
    id: 4,
    title: "抽牌机制",
    content: "如果你没有可以出的牌，点击'抽牌'按钮从牌堆中抽取新牌。每次只能抽一张牌。",
    highlight: "draw-card",
    action: "click-draw",
    exampleCard: "mountain_earth_qian"
  },
  {
    id: 5,
    title: "特殊卡牌",
    content: "某些卦牌(如互卦)具有特殊效果，可以改变出牌方向。注意观察卡牌的特殊标记。",
    highlight: "special-cards",
    exampleCard: "water_wind_jing",
    action: "direction-change"
  },
  {
    id: 6,
    title: "UNO规则",
    content: "当你只剩1张牌时，会显示红色'UNO!'标志。最先出完所有牌的玩家获胜该轮。",
    highlight: "uno-rule",
    exampleCard: "water_thunder_zhun"
  },
  {
    id: 7,
    title: "计分系统",
    content: "每轮结束时，剩余卡牌越少得分越高。每张剩余卡牌扣10分。目标是在多轮游戏中获得最高总分。",
    highlight: "scoring"
  },
  {
    id: 8,
    title: "牌局结算",
    content: "当有玩家分数清零则回合战结束，并根据这一局击败玩家的数量结算战果，如果玩家被击败则判断为输。",
    highlight: "special-ending"
  }
];

export default function TutorialModal({ isOpen, onClose, onStartTutorial }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setShowSteps(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartTutorial = () => {
    setShowSteps(true);
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartTutorial();
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <UICard className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Lightbulb className="h-6 w-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">新手教程</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {!showSteps ? (
            /* Welcome Screen */
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-blue-400">欢迎来到易经UNO！</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  这是一个融合中国传统易经智慧与现代UNO游戏机制的独特卡牌游戏。
                  <br />
                  通过互动教程学习游戏规则，掌握八卦元素匹配的奥秘。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 my-8">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl mb-2">64</div>
                  <div className="text-sm text-gray-400">易经卦牌</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl mb-2">8</div>
                  <div className="text-sm text-gray-400">基本元素</div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={handleStartTutorial}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                >
                  开始教程
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleSkip}
                  className="px-8 py-3"
                >
                  跳过教程
                </Button>
              </div>
            </div>
          ) : (
            /* Tutorial Steps */
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>进度</span>
                  <span>{currentStep + 1} / {tutorialSteps.length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Step Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-blue-400">
                  {currentTutorialStep.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {currentTutorialStep.content}
                </p>

                {/* Visual Demonstrations */}
                {(currentTutorialStep.id === 3 || currentTutorialStep.id === 4) && (
                  <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                    {/* Card Matching Example for Step 3 */}
                    {currentTutorialStep.id === 3 && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white text-center">卡牌匹配示例</h4>
                        <div className="flex justify-center items-center space-x-8">
                          <div className="text-center space-y-2">
                            <Card cardId="fire_water_weiji" size="large" />
                            <p className="text-sm text-gray-400">桌面卡牌</p>
                            <p className="text-xs text-blue-300">火🔥 + 水💧</p>
                          </div>
                          <div className="text-2xl text-green-400">✓</div>
                          <div className="text-center space-y-2">
                            <Card cardId="fire_earth_jin" size="large" />
                            <p className="text-sm text-gray-400">可出卡牌</p>
                            <p className="text-xs text-green-300">火🔥 + 地🌍</p>
                          </div>
                        </div>
                        <div className="flex justify-center items-center space-x-8 mt-6">
                          <div className="text-center space-y-2">
                            <Card cardId="fire_water_weiji" size="large" />
                            <p className="text-sm text-gray-400">桌面卡牌</p>
                            <p className="text-xs text-blue-300">火🔥 + 水💧</p>
                          </div>
                          <div className="text-2xl text-red-400">✗</div>
                          <div className="text-center space-y-2">
                            <Card cardId="mountain_thunder_yi" size="large" />
                            <p className="text-sm text-gray-400">不可出卡牌</p>
                            <p className="text-xs text-red-300">山⛰️ + 雷⚡</p>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Draw Card Example for Step 4 */}
                    {currentTutorialStep.id === 4 && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white text-center">抽牌操作示例</h4>
                        <div className="flex justify-center items-center space-x-6">
                          <div className="text-center space-y-2">
                            <div className="w-20 h-28 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                              <div className="text-white text-2xl">☯</div>
                            </div>
                            <p className="text-sm text-gray-400">牌堆</p>
                          </div>
                          <div className="flex flex-col items-center space-y-2">
                            <MousePointer className="h-6 w-6 text-yellow-400 animate-pulse" />
                            <div className="bg-blue-600 text-white px-4 py-2 rounded text-sm">抽牌</div>
                          </div>
                          <div className="text-center space-y-2">
                            <Card cardId="mountain_earth_qian" size="large" />
                            <p className="text-sm text-gray-400">新抽的牌</p>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                )}

                {/* Special Card Direction Change for Step 5 */}
                {currentTutorialStep.id === 5 && (
                  <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                    <h4 className="text-lg font-semibold text-white text-center">特殊卡牌效果示例</h4>
                    <div className="flex justify-center items-center space-x-6">
                      <div className="text-center space-y-2">
                        <Card cardId="water_wind_jing" size="large" />
                        <p className="text-sm text-gray-400">水风井 (互卦)</p>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <RotateCw className="h-8 w-8 text-yellow-400 animate-spin" />
                        <p className="text-sm text-yellow-300 text-center">倒转乾坤</p>
                      </div>
                      <div className="text-center space-y-2">
                        <Card cardId="wind_water_huan" size="large" />
                        <p className="text-sm text-gray-400">风水涣 (互卦)</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Ending Scenarios for Step 8 */}
                {currentTutorialStep.id === 8 && (
                  <div className="bg-gray-800 rounded-lg p-6 space-y-6">
                    
                    {/* Small Victory */}
                    <div className="space-y-3">
                      <div className="flex justify-center items-center space-x-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">玩</div>
                          <p className="text-xs text-green-400 mt-1">120分</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                          <p className="text-xs text-red-400 mt-1">0分</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
                          <p className="text-xs text-gray-400 mt-1">80分</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">C</div>
                          <p className="text-xs text-gray-400 mt-1">90分</p>
                        </div>
                      </div>
                      <p className="text-center text-yellow-400 font-semibold">🏆 小胜一局</p>
                    </div>

                    {/* Double Victory */}
                    <div className="space-y-3">
                      <div className="flex justify-center items-center space-x-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">玩</div>
                          <p className="text-xs text-green-400 mt-1">150分</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                          <p className="text-xs text-red-400 mt-1">-10分</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
                          <p className="text-xs text-red-400 mt-1">0分</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">C</div>
                          <p className="text-xs text-gray-400 mt-1">70分</p>
                        </div>
                      </div>
                      <p className="text-center text-yellow-400 font-semibold">🏆 一箭双雕</p>
                    </div>

                    {/* Triple Victory */}
                    <div className="space-y-3">
                      <div className="flex justify-center items-center space-x-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">玩</div>
                          <p className="text-xs text-green-400 mt-1">200分</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                          <p className="text-xs text-red-400 mt-1">-20分</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
                          <p className="text-xs text-red-400 mt-1">-10分</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">C</div>
                          <p className="text-xs text-red-400 mt-1">0分</p>
                        </div>
                      </div>
                      <p className="text-center text-yellow-400 font-semibold">🏆 大杀四方</p>
                    </div>

                    {/* Defeat */}
                    <div className="space-y-3">
                      <div className="flex justify-center items-center space-x-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">玩</div>
                          <p className="text-xs text-red-400 mt-1">-10分</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                          <p className="text-xs text-green-400 mt-1">120分</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
                          <p className="text-xs text-gray-400 mt-1">80分</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">C</div>
                          <p className="text-xs text-gray-400 mt-1">90分</p>
                        </div>
                      </div>
                      <p className="text-center text-yellow-400 font-semibold">遗憾败北</p>
                    </div>
                  </div>
                )}



                {/* UNO Rule Example for Step 6 */}
                {currentTutorialStep.id === 6 && (
                  <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                    <h4 className="text-lg font-semibold text-white text-center">UNO提示示例</h4>
                    <div className="flex justify-center">
                      <div className="relative">
                        <Card cardId="water_thunder_zhun" size="large" />
                        <div className="absolute -top-2 -right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                          UNO!
                        </div>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-red-400 font-semibold">只剩最后一张牌！</p>
                      <p className="text-gray-300 text-sm">红色UNO标志会自动显示</p>
                    </div>
                  </div>
                )}

                {/* Simple Card Display for Steps 1-2 and 7 */}
                {currentTutorialStep.exampleCard && (currentTutorialStep.id < 3 || currentTutorialStep.id === 7) && (
                  <div className="flex justify-center py-4">
                    <div className="text-center space-y-2">
                      <Card 
                        cardId={currentTutorialStep.exampleCard} 
                        size="large"
                      />
                      <p className="text-sm text-gray-400">示例卡牌</p>
                    </div>
                  </div>
                )}


              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>上一步</span>
                </Button>

                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                >
                  <span>
                    {currentStep === tutorialSteps.length - 1 ? "开始游戏" : "下一步"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Skip Option */}
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  跳过教程
                </Button>
              </div>
            </div>
          )}
        </div>
      </UICard>
    </div>
  );
}