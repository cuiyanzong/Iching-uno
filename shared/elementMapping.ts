import type { Element } from "./schema";
import { hexagramsData } from "./hexagrams";

// 完整的元素映射表 - 基于64卦数据自动生成
export const ELEMENT_CARD_MAPPING: Record<Element, string[]> = {
  earth: [
    "earth_earth_kun",      // 坤为地
    "earth_water_shi",      // 地水师
    "sky_earth_pi",         // 天地否
    "earth_lake_lin",       // 地泽临
    "earth_mountain_qian",  // 地山谦
    "earth_fire_mingyi",    // 地火明夷
    "earth_thunder_fu",     // 地雷复
    "earth_wind_sheng",     // 地风升
    "water_earth_bi",       // 水地比
    "mountain_earth_bo",    // 山地剥
    "fire_earth_jin",       // 火地晋
    "lake_earth_cui",       // 泽地萃
    "thunder_earth_yu",     // 雷地豫
    "wind_earth_guan",      // 风地观
    "earth_sky_tai"         // 地天泰
  ],
  sky: [
    "sky_sky_qian",         // 乾为天
    "water_sky_xu",         // 水天需
    "sky_water_song",       // 天水讼
    "wind_sky_xiaoxu",      // 风天小畜
    "sky_lake_lv",          // 天泽履
    "earth_sky_tai",        // 地天泰
    "sky_earth_pi",         // 天地否
    "sky_fire_tongren",     // 天火同人
    "fire_sky_dayou",       // 火天大有
    "sky_mountain_dun",     // 天山遁
    "thunder_sky_dazhuang", // 雷天大壮
    "lake_sky_guai",        // 泽天夬
    "mountain_sky_daxu",    // 山天大畜
    "sky_thunder_wuwang",   // 天雷无妄
    "sky_wind_gou"          // 天风姤
  ],
  water: [
    "water_water_kan",      // 坎为水
    "water_thunder_zhun",   // 水雷屯
    "mountain_water_meng",  // 山水蒙
    "water_sky_xu",         // 水天需
    "sky_water_song",       // 天水讼
    "earth_water_shi",      // 地水师
    "water_earth_bi",       // 水地比
    "water_mountain_jian",  // 水山蹇
    "thunder_water_jie",    // 雷水解
    "lake_water_jie",       // 泽水困
    "fire_water_weiji",     // 火水未济
    "water_fire_jiji",      // 水火既济
    "wind_water_huan",      // 风水涣
    "water_lake_jie",       // 水泽节
    "water_wind_jing"       // 水风井
  ],
  fire: [
    "fire_fire_li",         // 离为火
    "sky_fire_tongren",     // 天火同人
    "fire_sky_dayou",       // 火天大有
    "earth_fire_mingyi",    // 地火明夷
    "fire_earth_jin",       // 火地晋
    "mountain_fire_bi",     // 山火贲
    "fire_mountain_lv",     // 火山旅
    "fire_thunder_shike",   // 火雷噬嗑
    "thunder_fire_feng",    // 雷火丰
    "fire_water_weiji",     // 火水未济
    "water_fire_jiji",      // 水火既济
    "lake_fire_ge",         // 泽火革
    "fire_lake_kui",        // 火泽睽
    "wind_fire_jiaren",     // 风火家人
    "fire_wind_ding"        // 火风鼎
  ],
  thunder: [
    "thunder_thunder_zhen", // 震为雷
    "water_thunder_zhun",   // 水雷屯
    "earth_thunder_fu",     // 地雷复
    "thunder_earth_yu",     // 雷地豫
    "mountain_thunder_yi",  // 山雷颐
    "thunder_mountain_xiaoguo", // 雷山小过
    "thunder_water_jie",    // 雷水解
    "lake_thunder_sui",     // 泽雷随
    "fire_thunder_shike",   // 火雷噬嗑
    "thunder_fire_feng",    // 雷火丰
    "sky_thunder_wuwang",   // 天雷无妄
    "thunder_sky_dazhuang", // 雷天大壮
    "wind_thunder_yi",      // 风雷益
    "thunder_wind_heng",    // 雷风恒
    "thunder_lake_guimei"   // 雷泽归妹
  ],
  wind: [
    "wind_wind_xun",        // 巽为风
    "wind_sky_xiaoxu",      // 风天小畜
    "mountain_wind_gu",     // 山风蛊
    "wind_earth_guan",      // 风地观
    "earth_wind_sheng",     // 地风升
    "wind_mountain_jian",   // 风山渐
    "lake_wind_daguo",      // 泽风大过
    "wind_lake_zhongfu",    // 风泽中孚
    "fire_wind_ding",       // 火风鼎
    "wind_fire_jiaren",     // 风火家人
    "water_wind_jing",      // 水风井
    "wind_water_huan",      // 风水涣
    "thunder_wind_heng",    // 雷风恒
    "wind_thunder_yi",      // 风雷益
    "sky_wind_gou"          // 天风姤
  ],
  mountain: [
    "mountain_mountain_gen", // 艮为山
    "mountain_water_meng",   // 山水蒙
    "earth_mountain_qian",   // 地山谦
    "mountain_earth_bo",     // 山地剥
    "mountain_fire_bi",      // 山火贲
    "fire_mountain_lv",      // 火山旅
    "mountain_wind_gu",      // 山风蛊
    "wind_mountain_jian",    // 风山渐
    "water_mountain_jian",   // 水山蹇
    "mountain_thunder_yi",   // 山雷颐
    "thunder_mountain_xiaoguo", // 雷山小过
    "lake_mountain_xian",    // 泽山咸
    "mountain_lake_sun",     // 山泽损
    "sky_mountain_dun",      // 天山遁
    "mountain_sky_daxu"      // 山天大畜
  ],
  lake: [
    "lake_lake_dui",        // 兑为泽
    "sky_lake_lv",          // 天泽履
    "earth_lake_lin",       // 地泽临
    "lake_earth_cui",       // 泽地萃
    "mountain_lake_sun",    // 山泽损
    "lake_mountain_xian",   // 泽山咸
    "wind_lake_zhongfu",    // 风泽中孚
    "lake_wind_daguo",      // 泽风大过
    "thunder_lake_guimei",  // 雷泽归妹
    "lake_thunder_sui",     // 泽雷随
    "fire_lake_kui",        // 火泽睽
    "lake_fire_ge",         // 泽火革
    "water_lake_jie",       // 水泽节
    "lake_water_kun",       // 泽水困
    "lake_sky_guai"         // 泽天夬
  ]
};

// 辅助函数
export function getCardElements(cardId: string): Element[] {
  const hexagram = hexagramsData.find(h => h.id === cardId);
  return hexagram ? hexagram.elements as Element[] : [];
}

export function hasElement(cardId: string, element: Element): boolean {
  return getCardElements(cardId).includes(element);
}

export function countElementCards(cards: string[], element: Element): number {
  return cards.filter(cardId => hasElement(cardId, element)).length;
}

export function findPureCard(cards: string[], element: Element): string | null {
  const pureCardId = `${element}_${element}_` + getPureCardSuffix(element);
  return cards.includes(pureCardId) ? pureCardId : null;
}

function getPureCardSuffix(element: Element): string {
  const suffixMap = {
    earth: "kun",
    sky: "qian", 
    water: "kan",
    fire: "li",
    thunder: "zhen",
    wind: "xun",
    mountain: "gen",
    lake: "dui"
  };
  return suffixMap[element];
}

export function findElementCards(cards: string[], element: Element, excludePure = true): string[] {
  const pureCard = findPureCard(cards, element);
  return cards.filter(cardId => {
    if (excludePure && cardId === pureCard) return false;
    return hasElement(cardId, element);
  });
}