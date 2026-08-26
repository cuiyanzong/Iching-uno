import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card as UICard } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Lightbulb, MousePointer, RotateCw, Globe } from "lucide-react";
import Card from "./Card";
import SkillAnimation from "./SkillAnimation";

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
    content: "如果你没有可以出的牌，点击\"抽牌\"按钮从牌堆抽取新牌，一直到抽到有可以出的牌为止。",
    highlight: "draw-card",
    action: "click-draw",
    exampleCard: "mountain_earth_qian"
  },
  {
    id: 5,
    title: "特殊卡牌",
    content: "某些卦牌（如互卦）具有特殊效果，可以改变出牌方向，打出与台面卡牌对应的互卦牌即可触发转向效果。",
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
    title: "战斗分系统",
    content: "每局游戏开始玩家都有基础的战斗分用于对战，快意恩仇模式50分，运筹帷幄模式150分，玩家完成清牌为一个回合，每回合剩余一张卡牌扣10分，多回合对战直到有玩家战斗分清零为一局游戏结束。",
    highlight: "scoring"
  },
  {
    id: 8,
    title: "牌局结算",
    content: "当玩家战斗分清零则回合战结束，并根据这一局击败玩家的数量结算战果，战斗分最高的玩家胜出，如果玩家战斗分为0或负数判断为输。",
    highlight: "special-ending"
  },
  {
    id: 9,
    title: "永久积分系统",
    content: "当有玩家战斗分清零时结算永久积分，游戏过程中的积分变化会自动上传到游戏排行榜。",
    highlight: "permanent-scoring"
  },
  {
    id: 10,
    title: "技能系统",
    content: "技能系统基于传统八卦元素，每种元素都有对应的特殊技能。技能可以帮助你更快速地清理手中的卡牌，是游戏的高级策略之一。",
    highlight: "skill-introduction",
    exampleCard: "earth_earth_kun"
  },
  {
    id: 11,
    title: "技能触发条件",
    content: "释放技能需要满足三个条件：手中有1张纯色卦+ 1张相同元素卦 + 台面卡牌也有相同元素。满足条件时技能按钮会出现在你的操作区域。",
    highlight: "skill-conditions",
    exampleCard: "earth_earth_kun"
  },
  {
    id: 12,
    title: "技能清牌奖励",
    content: "使用技能清完所有手牌时，会获得额外的战斗分奖励：每通过技能清掉一张卡牌+10分，战斗分增加可以影响最终排名，实现极限反杀。",
    highlight: "skill-rewards",
    exampleCard: "earth_earth_kun"
  }
];

export default function TutorialModal({ isOpen, onClose, onStartTutorial }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [showSkillAnimation, setShowSkillAnimation] = useState(false);
  const [skillActivated, setSkillActivated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setShowSteps(false);
      setSkillActivated(false);
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

  const handleSkillButtonClick = () => {
    if (!skillActivated) {
      setShowSkillAnimation(true);
    }
  };

  const handleAnimationComplete = () => {
    setShowSkillAnimation(false);
    setSkillActivated(true);
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <UICard className="bg-gray-900 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
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

              <div className="grid grid-cols-3 gap-4 my-8">
                <button 
                  onClick={() => {
                    setCurrentStep(0);
                    setShowSteps(true);
                  }}
                  className="text-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="text-2xl mb-2">1-6</div>
                  <div className="text-sm text-gray-400">基础玩法</div>
                </button>
                <button 
                  onClick={() => {
                    setCurrentStep(6);
                    setShowSteps(true);
                  }}
                  className="text-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="text-2xl mb-2">7-9</div>
                  <div className="text-sm text-gray-400">计分系统</div>
                </button>
                <button 
                  onClick={() => {
                    setCurrentStep(9);
                    setShowSteps(true);
                  }}
                  className="text-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="text-2xl mb-2">10-12</div>
                  <div className="text-sm text-gray-400">技能系统</div>
                </button>
              </div>

              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={handleStartTutorial}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-2"
                >
                  完整教程
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleSkip}
                  className="px-6 py-2"
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
                        <div className="space-y-4">
                          {/* 上排：牌堆和台面卡牌 */}
                          <div className="flex justify-center items-center space-x-8">
                            <div className="text-center space-y-2">
                              <div className="w-16 h-24 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                                <div className="text-white text-xl">☯</div>
                              </div>
                              <p className="text-sm text-gray-400">牌堆</p>
                            </div>
                            <div className="text-center space-y-2">
                              <Card cardId="fire_earth_jin" size="medium" />
                              <p className="text-sm text-gray-400">新抽的牌</p>
                            </div>
                          </div>
                          
                          {/* 下排：抽牌按钮 */}
                          <div className="flex justify-center">
                            <div className="relative">
                              <Button
                                disabled={false}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-sm"
                              >
                                抽牌
                              </Button>
                              <MousePointer className="absolute top-8 left-1/2 transform -translate-x-1/2 h-5 w-5 text-yellow-400 animate-bounce" style={{transform: 'translateX(-50%) rotate(-45deg)'}} />
                            </div>
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

                {/* Battle Score System for Step 7 */}
                {currentTutorialStep.id === 7 && (
                  <div className="bg-gray-800 rounded-lg p-6 space-y-6">
                    {/* 回合扣分示例 */}
                    <div className="space-y-4">
                      <h5 className="text-center text-yellow-400 font-semibold">回合扣分示例</h5>
                      <div className="flex justify-center items-center space-x-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">50</div>
                          <p className="text-sm text-blue-300 mt-1">初始分</p>
                        </div>
                        <div className="text-lg text-red-400">-</div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">30</div>
                          <p className="text-sm text-red-400 mt-1">3张剩余</p>
                        </div>
                        <div className="text-lg text-white">=</div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">20</div>
                          <p className="text-sm text-yellow-400 mt-1">剩余分</p>
                        </div>
                      </div>
                      <p className="text-center text-gray-400 text-sm">每张剩余卡牌扣10分</p>
                    </div>

                    {/* 第一回合 */}
                    <div className="space-y-4">
                      <h5 className="text-center text-yellow-400 font-semibold">第一回合</h5>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <p className="text-center text-blue-300 text-sm mb-3">基础分50分</p>
                        <div className="grid grid-cols-4 gap-3 text-sm">
                          <div className="text-center">
                            <div className="relative">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto">50</div>
                            </div>
                            <div className="text-green-400 mt-1">玩家A</div>
                            <div className="text-green-400">(清牌)</div>
                          </div>
                          <div className="text-center">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto">30</div>
                              <div className="absolute -top-1 -right-1 text-red-400 text-sm font-bold">-20</div>
                            </div>
                            <div className="text-gray-400 mt-1">玩家B</div>
                            <div className="text-gray-400">剩2张牌</div>
                          </div>
                          <div className="text-center">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto">40</div>
                              <div className="absolute -top-1 -right-1 text-red-400 text-sm font-bold">-10</div>
                            </div>
                            <div className="text-gray-400 mt-1">玩家C</div>
                            <div className="text-gray-400">剩1张牌</div>
                          </div>
                          <div className="text-center">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto">10</div>
                              <div className="absolute -top-1 -right-1 text-red-400 text-sm font-bold">-40</div>
                            </div>
                            <div className="text-gray-400 mt-1">玩家D</div>
                            <div className="text-gray-400">剩4张牌</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 第二回合 */}
                    <div className="space-y-4">
                      <h5 className="text-center text-yellow-400 font-semibold">第二回合</h5>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="grid grid-cols-4 gap-3 text-sm mb-4">
                          <div className="text-center">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto">20</div>
                              <div className="absolute -top-1 -right-1 text-red-400 text-sm font-bold">-30</div>
                            </div>
                            <div className="text-gray-400 mt-1">玩家A</div>
                            <div className="text-gray-400">剩3张牌</div>
                          </div>
                          <div className="text-center">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto">20</div>
                              <div className="absolute -top-1 -right-1 text-red-400 text-sm font-bold">-10</div>
                            </div>
                            <div className="text-gray-400 mt-1">玩家B</div>
                            <div className="text-gray-400">剩1张牌</div>
                          </div>
                          <div className="text-center">
                            <div className="relative">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto">40</div>
                            </div>
                            <div className="text-green-400 mt-1">玩家C</div>
                            <div className="text-green-400">(清牌)</div>
                          </div>
                          <div className="text-center">
                            <div className="relative">
                              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto">-10</div>
                              <div className="absolute -top-1 -right-1 text-red-400 text-sm font-bold">-20</div>
                            </div>
                            <div className="text-red-400 mt-1">玩家D</div>
                            <div className="text-gray-400">剩2张牌</div>
                          </div>
                        </div>
                        <div className="flex justify-center space-x-8">
                          <p className="text-green-400 text-sm font-semibold">🏆 玩家C胜利</p>
                          <p className="text-red-400 text-sm font-semibold">💀 玩家D败北</p>
                        </div>
                      </div>
                    </div>

                    {/* 一局游戏结束 */}
                    <div className="space-y-4">
                      <h5 className="text-center text-yellow-400 font-semibold">一局游戏结束</h5>
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

                {/* Permanent Scoring System for Step 9 */}
                {currentTutorialStep.id === 9 && (
                  <div className="bg-gray-800 rounded-lg p-6 space-y-6">
                    <h4 className="text-lg font-semibold text-white text-center">一箭双雕结算示例</h4>
                    
                    {/* 战斗分数展示 */}
                    <div className="space-y-4">
                      <h5 className="text-center text-yellow-400 font-semibold">战斗分数情况</h5>
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

                    {/* 胜利玩家积分变化 */}
                    <div className="space-y-3">
                      <h5 className="text-center text-green-400 font-semibold">胜利玩家</h5>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-center items-center space-x-2">
                          <div className="text-center">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">300</div>
                            <p className="text-xs text-blue-300 mt-1">原积分</p>
                          </div>
                          <div className="text-lg text-green-400">+</div>
                          <div className="text-center">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">200</div>
                            <p className="text-xs text-green-400 mt-1">双雕</p>
                          </div>
                          <div className="text-lg text-green-400">+</div>
                          <div className="text-center">
                            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">10</div>
                            <p className="text-xs text-blue-300 mt-1">奖励</p>
                          </div>
                          <div className="text-lg text-white">=</div>
                          <div className="text-center">
                            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">510</div>
                            <p className="text-xs text-yellow-400 mt-1">新积分</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 非负分玩家积分变化 */}
                    <div className="space-y-3">
                      <h5 className="text-center text-blue-400 font-semibold">非负分玩家</h5>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-center items-center space-x-3">
                          <div className="text-center">
                            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-xs">300</div>
                            <p className="text-xs text-blue-300 mt-1">原积分</p>
                          </div>
                          <div className="text-lg text-blue-400">+</div>
                          <div className="text-center">
                            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">10</div>
                            <p className="text-xs text-blue-300 mt-1">奖励</p>
                          </div>
                          <div className="text-lg text-white">=</div>
                          <div className="text-center">
                            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">310</div>
                            <p className="text-xs text-yellow-400 mt-1">新积分</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 负分玩家积分变化 */}
                    <div className="space-y-3">
                      <h5 className="text-center text-red-400 font-semibold">负分玩家</h5>
                      <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                        <div className="flex justify-center items-center space-x-3">
                          <div className="text-center">
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">300</div>
                            <p className="text-xs text-blue-300 mt-1">原积分</p>
                          </div>
                          <div className="text-lg text-red-400">-</div>
                          <div className="text-center">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">110</div>
                            <p className="text-xs text-red-400 mt-1">100+10</p>
                          </div>
                          <div className="text-lg text-white">=</div>
                          <div className="text-center">
                            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">190</div>
                            <p className="text-xs text-yellow-400 mt-1">新积分</p>
                          </div>
                        </div>
                        <div className="flex justify-center items-center space-x-3">
                          <div className="text-center">
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">300</div>
                            <p className="text-xs text-blue-300 mt-1">原积分</p>
                          </div>
                          <div className="text-lg text-red-400">-</div>
                          <div className="text-center">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">100</div>
                            <p className="text-xs text-red-400 mt-1">100+0</p>
                          </div>
                          <div className="text-lg text-white">=</div>
                          <div className="text-center">
                            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">200</div>
                            <p className="text-xs text-yellow-400 mt-1">新积分</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 10: Skill System */}
                {currentTutorialStep.id === 10 && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    {/* 滑动技能卡牌展示 */}
                    <div className="relative">
                      <div 
                        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
                        onWheel={(e) => {
                          e.preventDefault();
                          e.currentTarget.scrollLeft += e.deltaY;
                        }}
                      >
                        {/* 坤字·土河车 */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className="w-24 h-32 text-center p-3 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg border border-gray-600 shadow-lg flex flex-col justify-center">
                            <div 
                              className="font-bold"
                              style={{
                                fontFamily: '"HanYiYanKai", serif',
                                color: '#cc8f5b',
                                textShadow: `
                                  2px 2px 8px rgba(0,0,0,0.9),
                                  -1px -1px 4px rgba(0,0,0,0.6),
                                  0 0 6px rgba(255,255,255,0.3)
                                `,
                                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.7))'
                              }}
                            >
                              <div className="mb-1 text-sm">坤字</div>
                              <div className="text-lg flex flex-col items-center leading-tight">
                                <div className="mb-0.5">土</div>
                                <div className="mb-0.5">河</div>
                                <div>车</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-amber-300 text-xs mt-1">土元素技能</div>
                        </div>

                        {/* 乾字·百花缭乱 */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className="w-24 h-32 text-center p-3 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg border border-gray-600 shadow-lg flex flex-col justify-center">
                            <div 
                              className="font-bold"
                              style={{
                                fontFamily: '"HanYiYanKai", serif',
                                color: '#f1f5f9',
                                textShadow: `
                                  2px 2px 8px rgba(0,0,0,0.9),
                                  -1px -1px 4px rgba(0,0,0,0.6),
                                  0 0 6px rgba(255,255,255,0.3)
                                `,
                                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.7))'
                              }}
                            >
                              <div className="mb-1 text-sm">乾字</div>
                              <div className="text-lg flex flex-col items-center leading-tight">
                                <div className="mb-0.5">百花</div>
                                <div>缭乱</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-slate-300 text-xs mt-1">天元素技能</div>
                        </div>

                        {/* 坎字·渊澄取映 */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className="w-24 h-32 text-center p-3 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg border border-gray-600 shadow-lg flex flex-col justify-center">
                            <div 
                              className="font-bold"
                              style={{
                                fontFamily: '"HanYiYanKai", serif',
                                color: '#90bcfc',
                                textShadow: `
                                  2px 2px 8px rgba(0,0,0,0.9),
                                  -1px -1px 4px rgba(0,0,0,0.6),
                                  0 0 6px rgba(255,255,255,0.3)
                                `,
                                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.7))'
                              }}
                            >
                              <div className="mb-1 text-sm">坎字</div>
                              <div className="text-lg flex flex-col items-center leading-tight">
                                <div className="mb-0.5">渊澄</div>
                                <div>取映</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-blue-300 text-xs mt-1">水元素技能</div>
                        </div>

                        {/* 离字·萤火流光 */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className="w-24 h-32 text-center p-3 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg border border-gray-600 shadow-lg flex flex-col justify-center">
                            <div 
                              className="font-bold"
                              style={{
                                fontFamily: '"HanYiYanKai", serif',
                                color: '#ff3838',
                                textShadow: `
                                  2px 2px 8px rgba(0,0,0,0.9),
                                  -1px -1px 4px rgba(0,0,0,0.6),
                                  0 0 6px rgba(255,255,255,0.3)
                                `,
                                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.7))'
                              }}
                            >
                              <div className="mb-1 text-sm">离字</div>
                              <div className="text-lg flex flex-col items-center leading-tight">
                                <div className="mb-0.5">萤火</div>
                                <div>流光</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-red-300 text-xs mt-1">火元素技能</div>
                        </div>

                        {/* 震字·八方雷电 */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className="w-24 h-32 text-center p-3 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg border border-gray-600 shadow-lg flex flex-col justify-center">
                            <div 
                              className="font-bold"
                              style={{
                                fontFamily: '"HanYiYanKai", serif',
                                color: '#facc15',
                                textShadow: `
                                  2px 2px 8px rgba(0,0,0,0.9),
                                  -1px -1px 4px rgba(0,0,0,0.6),
                                  0 0 6px rgba(255,255,255,0.3)
                                `,
                                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.7))'
                              }}
                            >
                              <div className="mb-1 text-sm">震字</div>
                              <div className="text-lg flex flex-col items-center leading-tight">
                                <div className="mb-0.5">八方</div>
                                <div>雷电</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-yellow-300 text-xs mt-1">雷元素技能</div>
                        </div>

                        {/* 巽字·香檀功德 */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className="w-24 h-32 text-center p-3 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg border border-gray-600 shadow-lg flex flex-col justify-center">
                            <div 
                              className="font-bold"
                              style={{
                                fontFamily: '"HanYiYanKai", serif',
                                color: '#14b8a6',
                                textShadow: `
                                  2px 2px 8px rgba(0,0,0,0.9),
                                  -1px -1px 4px rgba(0,0,0,0.6),
                                  0 0 6px rgba(255,255,255,0.3)
                                `,
                                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.7))'
                              }}
                            >
                              <div className="mb-1 text-sm">巽字</div>
                              <div className="text-lg flex flex-col items-center leading-tight">
                                <div className="mb-0.5">香檀</div>
                                <div>功德</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-teal-300 text-xs mt-1">风元素技能</div>
                        </div>

                        {/* 艮字·地龙游 */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className="w-24 h-32 text-center p-3 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg border border-gray-600 shadow-lg flex flex-col justify-center">
                            <div 
                              className="font-bold"
                              style={{
                                fontFamily: '"HanYiYanKai", serif',
                                color: '#44e850',
                                textShadow: `
                                  2px 2px 8px rgba(0,0,0,0.9),
                                  -1px -1px 4px rgba(0,0,0,0.6),
                                  0 0 6px rgba(255,255,255,0.3)
                                `,
                                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.7))'
                              }}
                            >
                              <div className="mb-1 text-sm">艮字</div>
                              <div className="text-lg flex flex-col items-center leading-tight">
                                <div className="mb-0.5">地</div>
                                <div className="mb-0.5">龙</div>
                                <div>游</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-green-300 text-xs mt-1">山元素技能</div>
                        </div>

                        {/* 兑字·黑琉璃 */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className="w-24 h-32 text-center p-3 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg border border-gray-600 shadow-lg flex flex-col justify-center">
                            <div 
                              className="font-bold"
                              style={{
                                fontFamily: '"HanYiYanKai", serif',
                                color: '#977ee7',
                                textShadow: `
                                  2px 2px 8px rgba(0,0,0,0.9),
                                  -1px -1px 4px rgba(0,0,0,0.6),
                                  0 0 6px rgba(255,255,255,0.3)
                                `,
                                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.7))'
                              }}
                            >
                              <div className="mb-1 text-sm">兑字</div>
                              <div className="text-lg flex flex-col items-center leading-tight">
                                <div className="mb-0.5">黑</div>
                                <div className="mb-0.5">琉</div>
                                <div>璃</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-indigo-300 text-xs mt-1">泽元素技能</div>
                        </div>
                      </div>
                      
                      {/* 滑动提示 */}
                      <div className="flex justify-center mt-2">
                        <p className="text-sm text-gray-500">← 滑动查看更多技能 →</p>
                      </div>
                    </div>
                    
                    {/* 技能触发说明 */}
                    <div className="mt-4 space-y-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-300 leading-relaxed">
                          触发技能打出所有同元素牌同时留下一张纯色牌在台面。
                        </p>
                      </div>
                      
                      {/* 游戏示例：台面卡牌 */}
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-center items-center">
                          {/* 台面卡牌 - 叠加效果居中 */}
                          <div className="text-center">
                            <div className="relative inline-block">
                              {/* 底层卡牌背面 */}
                              <div className="absolute top-2 left-2 w-16 h-24 bg-gray-900 border-2 border-gray-600 rounded-lg shadow-lg flex items-center justify-center">
                                <div 
                                  className="text-gray-400 text-lg font-bold"
                                  style={{
                                    fontFamily: '"HanYiYanKai", serif',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                                  }}
                                >
                                  易
                                </div>
                              </div>
                              <div className="absolute top-1 left-1 w-16 h-24 bg-gray-800 border-2 border-gray-500 rounded-lg shadow-lg flex items-center justify-center">
                                <div 
                                  className="text-gray-300 text-lg font-bold"
                                  style={{
                                    fontFamily: '"HanYiYanKai", serif',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                                  }}
                                >
                                  易
                                </div>
                              </div>
                              {/* 顶层台面卡牌 */}
                              <div className="relative">
                                <Card cardId="earth_earth_kun" size="medium" />
                              </div>
                            </div>
                            <p className="text-xs text-amber-400 mt-2">台面卡牌</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 11: Skill Trigger Conditions */}
                {currentTutorialStep.id === 11 && (
                  <div className="bg-gray-800 rounded-lg p-6 space-y-6">
                    <h5 className="text-lg font-semibold text-white text-center">技能触发条件</h5>
                    
                    {/* 简化的技能触发示例 */}
                    <div className="space-y-6">
                      {/* 台面卡牌 */}
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="text-center">
                          <h6 className="text-sm text-blue-400 font-semibold mb-3">台面卡牌</h6>
                          <div className="flex justify-center items-center">
                            <div className="text-center space-y-2 game-table-center">
                              <div className="flex justify-center">
                                <Card cardId={skillActivated ? "earth_earth_kun" : "fire_earth_jin"} size="medium" />
                              </div>
                              <p className="text-xs text-blue-400">
                                {skillActivated ? "坤为地" : "火地晋"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {skillActivated ? "技能使用后的台面卡牌" : "包含地🌍元素"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 技能触发按钮 - 基于真实游戏组件 */}
                      <div className="flex justify-center">
                        <div className="text-center space-y-2">
                          <div className="relative">
                            <button
                              onClick={handleSkillButtonClick}
                              disabled={skillActivated}
                              className={`
                                relative w-16 h-16 rounded-full
                                ${skillActivated 
                                  ? 'bg-gradient-to-br from-gray-500 to-gray-700 cursor-not-allowed' 
                                  : 'bg-gradient-to-br from-amber-500 to-amber-700 hover:scale-110 cursor-pointer animate-pulse ring-2 ring-yellow-400'
                                }
                                border-2 border-white shadow-lg transition-all duration-300
                                skill-position-bottom flex items-center justify-center
                              `}
                              title={skillActivated ? "技能已使用" : "坤字·土河车 - 2张牌\n土元素技能"}
                            >
                              <Globe className="w-6 h-6 text-amber-200" />
                              
                              {/* 技能就绪指示器 */}
                              {!skillActivated && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                              )}
                              
                              {/* 卡牌数量指示 */}
                              <div className={`
                                absolute -bottom-1 -right-1 w-4 h-4 rounded-full 
                                text-xs text-white flex items-center justify-center font-bold
                                ${skillActivated ? 'bg-gray-600' : 'bg-blue-500'}
                              `}>
                                {skillActivated ? '0' : '2'}
                              </div>
                              
                              {/* 共鸣效果 */}
                              {!skillActivated && (
                                <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-pulse" />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-yellow-400">
                            {skillActivated ? "技能已释放" : "土元素共鸣"}
                          </p>
                          <p className="text-xs text-gray-300">
                            {skillActivated ? "卡牌已清除" : "点击释放技能"}
                          </p>
                        </div>
                      </div>

                      {/* 玩家手牌 */}
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="text-center">
                          <h6 className="text-sm text-green-400 font-semibold mb-3">玩家手牌</h6>
                          <div className="flex justify-center items-center space-x-4">
                            {!skillActivated ? (
                              <>
                                <div className="text-center space-y-2">
                                  <Card cardId="earth_earth_kun" size="medium" />
                                  <p className="text-xs text-amber-400">纯色卦</p>
                                  <p className="text-xs text-gray-300">坤为地</p>
                                </div>
                                <div className="text-center space-y-2">
                                  <Card cardId="earth_mountain_qian" size="medium" />
                                  <p className="text-xs text-amber-400">同元素卦</p>
                                  <p className="text-xs text-gray-300">地山谦</p>
                                </div>
                                <div className="text-center space-y-2">
                                  <Card cardId="water_thunder_zhun" size="medium" />
                                  <p className="text-xs text-gray-400">其他手牌</p>
                                  <p className="text-xs text-gray-500">水雷屯</p>
                                </div>
                              </>
                            ) : (
                              <div className="flex justify-center">
                                <div className="text-center space-y-2">
                                  <Card cardId="water_thunder_zhun" size="medium" />
                                  <p className="text-xs text-green-400">剩余手牌</p>
                                  <p className="text-xs text-gray-300">水雷屯</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* 重置按钮 */}
                      {skillActivated && (
                        <div className="text-center mt-6">
                          <button
                            onClick={() => setSkillActivated(false)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                          >
                            重新演示
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 12: Skill Clear Rewards */}
                {currentTutorialStep.id === 12 && (
                  <div className="bg-gray-800 rounded-lg p-6 space-y-6">
                    <h5 className="text-lg font-semibold text-white text-center">技能清牌奖励</h5>
                    
                    {/* 奖励计算公式 */}
                    <div className="bg-gray-700 rounded-lg p-6">
                      <div className="flex justify-center items-end space-x-4 text-center">
                        {/* 清牌数量 */}
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-1">清牌数量</p>
                          <p className="text-2xl font-bold text-yellow-400">5</p>
                        </div>
                        
                        {/* 乘号 */}
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-1 text-right">奖励分</p>
                          <div className="text-2xl font-bold text-white">×10</div>
                        </div>
                        
                        {/* 等号 */}
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-1 opacity-0">占位</p>
                          <div className="text-2xl font-bold text-white">=</div>
                        </div>
                        
                        {/* 清牌奖励 */}
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-1">清牌奖励</p>
                          <p className="text-2xl font-bold text-green-400">50</p>
                        </div>
                      </div>
                      
                      {/* 模式封顶说明 */}
                      <div className="text-center mt-4">
                        <p className="text-sm text-gray-300">
                          快意恩仇模式奖励50分封顶，运筹帷幄模式奖励150分封顶
                        </p>
                      </div>
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

              {/* Skip Option and Home Button */}
              <div className="flex justify-center space-x-4 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowSteps(false)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  返回目录
                </Button>
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
      
      {/* Skill Animation for Tutorial Step 11 */}
      {currentTutorialStep.id === 11 && (
        <SkillAnimation
          isVisible={showSkillAnimation}
          skillName="坤字·土河车"
          element="earth"
          cardIds={["earth_earth_kun", "earth_mountain_qian"]}
          onComplete={handleAnimationComplete}
          sourcePosition="bottom"
        />
      )}
    </div>
  );
}