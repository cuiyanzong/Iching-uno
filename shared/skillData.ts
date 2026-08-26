import type { Element } from "./schema";

export const PURE_HEXAGRAMS = {
  "earth": "earth_earth_kun",
  "sky": "sky_sky_qian", 
  "water": "water_water_kan",
  "fire": "fire_fire_li",
  "thunder": "thunder_thunder_zhen",
  "wind": "wind_wind_xun",
  "mountain": "mountain_mountain_gen",
  "lake": "lake_lake_dui"
} as const;

export interface SkillDefinition {
  id: string;
  name: string;
  element: Element;
  pureCard: string;
  requiredCount: number;
  description: string;
  color: string;
  iconClass: string;
}

export const SKILL_DEFINITIONS: SkillDefinition[] = [
  {
    id: "kun_earth_skill",
    name: "坤字·土河车",
    element: "earth",
    pureCard: "earth_earth_kun",
    requiredCount: 1,
    description: "大地承载万物，如江河般推进",
    color: "bg-amber-600",
    iconClass: "text-amber-100"
  },
  {
    id: "qian_sky_skill", 
    name: "乾字·百花缭乱",
    element: "sky",
    pureCard: "sky_sky_qian",
    requiredCount: 1,
    description: "天道变化，繁花似锦般多样",
    color: "bg-blue-200",
    iconClass: "text-blue-800"
  },
  {
    id: "kan_water_skill",
    name: "坎字·渊澄取映", 
    element: "water",
    pureCard: "water_water_kan",
    requiredCount: 1,
    description: "深渊澄澈，倒影清晰",
    color: "bg-blue-600",
    iconClass: "text-blue-100"
  },
  {
    id: "li_fire_skill",
    name: "离字·萤火流光",
    element: "fire", 
    pureCard: "fire_fire_li",
    requiredCount: 1,
    description: "火光流转，点点萤火汇聚",
    color: "bg-red-600",
    iconClass: "text-red-100"
  },
  {
    id: "zhen_thunder_skill",
    name: "震字·八方雷电",
    element: "thunder",
    pureCard: "thunder_thunder_zhen", 
    requiredCount: 1,
    description: "雷电四起，震撼八方",
    color: "bg-yellow-500",
    iconClass: "text-yellow-100"
  },
  {
    id: "xun_wind_skill",
    name: "巽字·香檀功德",
    element: "wind",
    pureCard: "wind_wind_xun",
    requiredCount: 1,
    description: "风送檀香，功德无量", 
    color: "bg-cyan-400",
    iconClass: "text-cyan-800"
  },
  {
    id: "gen_mountain_skill",
    name: "艮字·地龙游",
    element: "mountain",
    pureCard: "mountain_mountain_gen",
    requiredCount: 1,
    description: "山脉蜿蜒，如龙游走大地",
    color: "bg-green-700",
    iconClass: "text-green-100"
  },
  {
    id: "dui_lake_skill", 
    name: "兑字·黑琉璃",
    element: "lake",
    pureCard: "lake_lake_dui",
    requiredCount: 1,
    description: "湖水深邃，如黑色琉璃",
    color: "bg-indigo-500",
    iconClass: "text-indigo-100"
  }
];

export function getSkillByElement(element: Element): SkillDefinition | undefined {
  return SKILL_DEFINITIONS.find(skill => skill.element === element);
}

export function getSkillById(skillId: string): SkillDefinition | undefined {
  return SKILL_DEFINITIONS.find(skill => skill.id === skillId);
}