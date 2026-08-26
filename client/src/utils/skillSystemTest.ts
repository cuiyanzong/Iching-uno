/**
 * 技能系统测试工具
 * 用于验证八卦元素技能系统功能
 */

import { SkillDetector, SkillExecutor, SkillAnalyzer } from "@/lib/skillSystem";
import { getCardElements, findPureCard, findElementCards } from "@shared/elementMapping";
import { SKILL_DEFINITIONS } from "@shared/skillData";
import type { Element, GameState } from "@shared/schema";

export interface TestResult {
  testName: string;
  passed: boolean;
  details: string;
  data?: any;
}

export class SkillSystemTester {
  /**
   * 运行完整的技能系统测试套件
   */
  static runCompleteTest(): TestResult[] {
    const results: TestResult[] = [];
    
    console.log("🧪 开始技能系统测试套件");
    
    // 测试1: 技能定义验证
    results.push(this.testSkillDefinitions());
    
    // 测试2: 元素映射验证
    results.push(this.testElementMappings());
    
    // 测试3: 技能检测逻辑
    results.push(this.testSkillDetection());
    
    // 测试4: 技能执行逻辑
    results.push(this.testSkillExecution());
    
    // 测试5: AI决策逻辑
    results.push(this.testAIDecision());
    
    console.log("🎯 技能系统测试完成");
    return results;
  }

  /**
   * 测试技能定义完整性
   */
  static testSkillDefinitions(): TestResult {
    try {
      const expectedElements: Element[] = ["earth", "sky", "water", "fire", "thunder", "wind", "mountain", "lake"];
      const definedElements = SKILL_DEFINITIONS.map(skill => skill.element);
      
      const missingElements = expectedElements.filter(el => !definedElements.includes(el));
      const extraElements = definedElements.filter(el => !expectedElements.includes(el));
      
      if (missingElements.length > 0 || extraElements.length > 0) {
        return {
          testName: "技能定义验证",
          passed: false,
          details: `缺少元素: ${missingElements.join(", ")}, 额外元素: ${extraElements.join(", ")}`
        };
      }
      
      // 验证技能名称不重复
      const skillNames = SKILL_DEFINITIONS.map(skill => skill.name);
      const uniqueNames = new Set(skillNames);
      
      if (skillNames.length !== uniqueNames.size) {
        return {
          testName: "技能定义验证",
          passed: false,
          details: "存在重复的技能名称"
        };
      }
      
      return {
        testName: "技能定义验证",
        passed: true,
        details: `验证通过: ${SKILL_DEFINITIONS.length}个技能定义完整`,
        data: { skillCount: SKILL_DEFINITIONS.length, elements: definedElements }
      };
    } catch (error) {
      return {
        testName: "技能定义验证",
        passed: false,
        details: `测试失败: ${error.message}`
      };
    }
  }

  /**
   * 测试元素映射完整性
   */
  static testElementMappings(): TestResult {
    try {
      // 测试样本卡牌
      const testCards = [
        "earth_earth_kun",     // 坤卦 - 纯土
        "sky_sky_qian",        // 乾卦 - 纯天
        "earth_sky_tai",       // 泰卦 - 地天
        "water_fire_jiji"      // 既济卦 - 水火
      ];
      
      const results = testCards.map(cardId => {
        const elements = getCardElements(cardId);
        return { cardId, elements, count: elements.length };
      });
      
      // 验证每张卡都有元素
      const invalidCards = results.filter(r => r.count === 0);
      if (invalidCards.length > 0) {
        return {
          testName: "元素映射验证",
          passed: false,
          details: `以下卡牌没有元素映射: ${invalidCards.map(c => c.cardId).join(", ")}`
        };
      }
      
      return {
        testName: "元素映射验证",
        passed: true,
        details: `验证通过: ${testCards.length}张测试卡牌都有正确的元素映射`,
        data: results
      };
    } catch (error) {
      return {
        testName: "元素映射验证",
        passed: false,
        details: `测试失败: ${error.message}`
      };
    }
  }

  /**
   * 测试技能检测逻辑
   */
  static testSkillDetection(): TestResult {
    try {
      // 模拟玩家手牌：包含土元素技能条件
      const playerCards = [
        "earth_earth_kun",    // 坤卦 - 纯土
        "earth_sky_tai",      // 泰卦 - 土天
        "earth_water_lin",    // 临卦 - 土水
        "earth_fire_jin",     // 晋卦 - 土火
        "earth_thunder_yu",   // 豫卦 - 土雷
        "earth_wind_guan",    // 观卦 - 土风
        "earth_mountain_qian", // 谦卦 - 土山
        "earth_lake_cui",     // 萃卦 - 土泽
        "sky_water_song"      // 其他卡牌
      ];
      
      // 台面卡牌：包含土元素（触发共鸣）
      const currentCard = "earth_sky_tai";
      
      const opportunities = SkillDetector.checkElementResonance(currentCard, playerCards);
      
      // 应该检测到土元素技能
      const earthSkill = opportunities.find(opp => opp.element === "earth");
      if (!earthSkill || !earthSkill.canTrigger) {
        return {
          testName: "技能检测逻辑",
          passed: false,
          details: "未能检测到土元素技能机会"
        };
      }
      
      if (earthSkill.totalCards !== 5) { // 1张纯土 + 4张土元素
        return {
          testName: "技能检测逻辑",
          passed: false,
          details: `土元素卡牌数量错误: 期待5张，实际${earthSkill.totalCards}张`
        };
      }
      
      return {
        testName: "技能检测逻辑",
        passed: true,
        details: `验证通过: 正确检测到${opportunities.length}个技能机会`,
        data: { opportunities, earthSkill }
      };
    } catch (error) {
      return {
        testName: "技能检测逻辑",
        passed: false,
        details: `测试失败: ${error.message}`
      };
    }
  }

  /**
   * 测试技能执行逻辑
   */
  static testSkillExecution(): TestResult {
    try {
      // 模拟游戏状态
      const mockGameState: Partial<GameState> = {
        players: [
          { id: 1, name: "测试玩家", cards: [], score: 150, isAI: false }
        ]
      };
      
      // 测试手牌
      const playerCards = [
        "earth_earth_kun",    // 坤卦 - 纯土
        "earth_sky_tai",      // 泰卦 - 土天
        "earth_water_lin",    // 临卦 - 土水
        "earth_fire_jin",     // 晋卦 - 土火
        "earth_thunder_yu",   // 豫卦 - 土雷
        "earth_wind_guan",    // 观卦 - 土风
        "earth_mountain_qian", // 谦卦 - 土山
        "earth_lake_cui",     // 萃卦 - 土泽
        "sky_water_song"      // 其他卡牌
      ];
      
      // 执行技能
      const result = SkillExecutor.executeElementSkill("earth", playerCards, mockGameState as GameState);
      
      // 验证结果
      if (result.cardsPlayed.length !== 5) {
        return {
          testName: "技能执行逻辑",
          passed: false,
          details: `打出卡牌数量错误: 期待5张，实际${result.cardsPlayed.length}张`
        };
      }
      
      if (!result.finalCard || result.finalCard !== "earth_earth_kun") {
        return {
          testName: "技能执行逻辑",
          passed: false,
          details: `最终卡牌错误: 期待earth_earth_kun，实际${result.finalCard}`
        };
      }
      
      if (result.cardsRemaining.length !== 1) {
        return {
          testName: "技能执行逻辑",
          passed: false,
          details: `剩余卡牌数量错误: 期待1张，实际${result.cardsRemaining.length}张`
        };
      }
      
      if (result.scoreBonus !== 20) { // 4张 * 5分
        return {
          testName: "技能执行逻辑",
          passed: false,
          details: `积分奖励错误: 期待20分，实际${result.scoreBonus}分`
        };
      }
      
      return {
        testName: "技能执行逻辑",
        passed: true,
        details: `验证通过: 技能执行结果正确`,
        data: result
      };
    } catch (error) {
      return {
        testName: "技能执行逻辑",
        passed: false,
        details: `测试失败: ${error.message}`
      };
    }
  }

  /**
   * 测试AI决策逻辑
   */
  static testAIDecision(): TestResult {
    try {
      // 模拟游戏状态
      const mockGameState: Partial<GameState> = {
        players: [
          { id: 1, name: "人类玩家", cards: Array(5).fill("test_card"), score: 150, isAI: false },
          { id: 2, name: "AI玩家", cards: Array(15).fill("test_card"), score: 150, isAI: true }
        ]
      };
      
      // 模拟技能机会
      const skillOpportunity = {
        element: "earth" as Element,
        skillName: "坤字·土河车",
        canTrigger: true,
        pureCard: "earth_earth_kun",
        elementCards: Array(7).fill("earth_element_card"),
        resonanceMatch: true,
        totalCards: 8
      };
      
      // 分析技能价值
      const analysis = SkillAnalyzer.analyzeSkillValue(skillOpportunity, mockGameState as GameState, "2");
      
      // 验证分析结果
      if (typeof analysis.handReduction !== "number" || analysis.handReduction <= 0) {
        return {
          testName: "AI决策逻辑",
          passed: false,
          details: "手牌减少计算错误"
        };
      }
      
      if (typeof analysis.strategicValue !== "number" || analysis.strategicValue < 0) {
        return {
          testName: "AI决策逻辑",
          passed: false,
          details: "战略价值计算错误"
        };
      }
      
      if (typeof analysis.shouldUse !== "boolean") {
        return {
          testName: "AI决策逻辑",
          passed: false,
          details: "决策结果类型错误"
        };
      }
      
      return {
        testName: "AI决策逻辑",
        passed: true,
        details: `验证通过: AI决策逻辑正常工作`,
        data: analysis
      };
    } catch (error) {
      return {
        testName: "AI决策逻辑",
        passed: false,
        details: `测试失败: ${error.message}`
      };
    }
  }

  /**
   * 创建测试报告
   */
  static generateTestReport(results: TestResult[]): string {
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    const passRate = Math.round((passedCount / totalCount) * 100);
    
    let report = `
🧪 技能系统测试报告
==================
总测试数: ${totalCount}
通过测试: ${passedCount}
失败测试: ${totalCount - passedCount}
通过率: ${passRate}%

详细结果:
`;
    
    results.forEach(result => {
      const status = result.passed ? "✅" : "❌";
      report += `${status} ${result.testName}: ${result.details}\n`;
    });
    
    return report;
  }
}

// 将测试工具暴露到全局以便调试
declare global {
  interface Window {
    testSkillSystem: () => void;
    skillSystemTester: typeof SkillSystemTester;
  }
}

if (typeof window !== "undefined") {
  window.testSkillSystem = () => {
    console.log("🧪 开始技能系统测试");
    const results = SkillSystemTester.runCompleteTest();
    const report = SkillSystemTester.generateTestReport(results);
    console.log(report);
    return results;
  };
  
  window.skillSystemTester = SkillSystemTester;
  
  console.log("🧪 技能系统测试工具已就绪:");
  console.log("  - testSkillSystem() 运行完整测试");
  console.log("  - skillSystemTester 访问测试类");
}