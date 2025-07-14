import type { GameCard } from "./schema";

// 64 hexagrams data optimized for performance
export const hexagramsData: GameCard[] = [
  // 乾为天 (Pure Sky)
  {
    id: "sky_sky_qian",
    name: "乾",
    elements: ["sky", "sky"],
    type: "normal",
    color: "white",
    description: "乾为天"
  },
  
  // 坤为地 (Pure Earth)
  {
    id: "earth_earth_kun",
    name: "坤",
    elements: ["earth", "earth"],
    type: "normal",
    color: "black",
    description: "坤为地"
  },
  
  // 水雷屯
  {
    id: "water_thunder_zhun",
    name: "屯",
    elements: ["water", "thunder"],
    type: "normal",
    color: "blue",
    description: "水雷屯"
  },
  
  // 山水蒙
  {
    id: "mountain_water_meng",
    name: "蒙",
    elements: ["mountain", "water"],
    type: "normal",
    color: "green",
    description: "山水蒙"
  },
  
  // 水天需
  {
    id: "water_sky_xu",
    name: "需",
    elements: ["water", "sky"],
    type: "normal",
    color: "blue",
    description: "水天需"
  },
  
  // 天水讼
  {
    id: "sky_water_song",
    name: "讼",
    elements: ["sky", "water"],
    type: "normal",
    color: "white",
    description: "天水讼"
  },
  
  // 地水师
  {
    id: "earth_water_shi",
    name: "师",
    elements: ["earth", "water"],
    type: "normal",
    color: "black",
    description: "地水师"
  },
  
  // 水地比
  {
    id: "water_earth_bi",
    name: "比",
    elements: ["water", "earth"],
    type: "normal",
    color: "blue",
    description: "水地比"
  },
  
  // 风天小畜
  {
    id: "wind_sky_xiaoxu",
    name: "小畜",
    elements: ["wind", "sky"],
    type: "normal",
    color: "cyan",
    description: "风天小畜"
  },
  
  // 天泽履
  {
    id: "sky_lake_lv",
    name: "履",
    elements: ["sky", "lake"],
    type: "normal",
    color: "white",
    description: "天泽履"
  },
  
  // 地天泰
  {
    id: "earth_sky_tai",
    name: "泰",
    elements: ["earth", "sky"],
    type: "normal",
    color: "black",
    description: "地天泰"
  },
  
  // 天地否
  {
    id: "sky_earth_pi",
    name: "否",
    elements: ["sky", "earth"],
    type: "normal",
    color: "white",
    description: "天地否"
  },
  
  // 天火同人
  {
    id: "sky_fire_tongren",
    name: "同人",
    elements: ["sky", "fire"],
    type: "normal",
    color: "white",
    description: "天火同人"
  },
  
  // 火天大有
  {
    id: "fire_sky_dayou",
    name: "大有",
    elements: ["fire", "sky"],
    type: "normal",
    color: "red",
    description: "火天大有"
  },
  
  // 地山谦
  {
    id: "earth_mountain_qian",
    name: "谦",
    elements: ["earth", "mountain"],
    type: "normal",
    color: "black",
    description: "地山谦"
  },
  
  // 雷地豫
  {
    id: "thunder_earth_yu",
    name: "豫",
    elements: ["thunder", "earth"],
    type: "normal",
    color: "yellow",
    description: "雷地豫"
  },
  
  // 泽雷随
  {
    id: "lake_thunder_sui",
    name: "随",
    elements: ["lake", "thunder"],
    type: "normal",
    color: "amber",
    description: "泽雷随"
  },
  
  // 山风蛊
  {
    id: "mountain_wind_gu",
    name: "蛊",
    elements: ["mountain", "wind"],
    type: "normal",
    color: "green",
    description: "山风蛊"
  },
  
  // 地泽临
  {
    id: "earth_lake_lin",
    name: "临",
    elements: ["earth", "lake"],
    type: "normal",
    color: "black",
    description: "地泽临"
  },
  
  // 风地观
  {
    id: "wind_earth_guan",
    name: "观",
    elements: ["wind", "earth"],
    type: "normal",
    color: "cyan",
    description: "风地观"
  },
  
  // 火雷噬嗑
  {
    id: "fire_thunder_shike",
    name: "噬嗑",
    elements: ["fire", "thunder"],
    type: "normal",
    color: "red",
    description: "火雷噬嗑"
  },
  
  // 山火贲
  {
    id: "mountain_fire_bi",
    name: "贲",
    elements: ["mountain", "fire"],
    type: "normal",
    color: "green",
    description: "山火贲"
  },
  
  // 山地剥
  {
    id: "mountain_earth_bo",
    name: "剥",
    elements: ["mountain", "earth"],
    type: "normal",
    color: "green",
    description: "山地剥"
  },
  
  // 地雷复
  {
    id: "earth_thunder_fu",
    name: "复",
    elements: ["earth", "thunder"],
    type: "normal",
    color: "black",
    description: "地雷复"
  },
  
  // 天雷无妄
  {
    id: "sky_thunder_wuwang",
    name: "无妄",
    elements: ["sky", "thunder"],
    type: "normal",
    color: "white",
    description: "天雷无妄"
  },
  
  // 山天大畜
  {
    id: "mountain_sky_daxu",
    name: "大畜",
    elements: ["mountain", "sky"],
    type: "normal",
    color: "green",
    description: "山天大畜"
  },
  
  // 山雷颐
  {
    id: "mountain_thunder_yi",
    name: "颐",
    elements: ["mountain", "thunder"],
    type: "normal",
    color: "green",
    description: "山雷颐"
  },
  
  // 泽风大过
  {
    id: "lake_wind_daguo",
    name: "大过",
    elements: ["lake", "wind"],
    type: "normal",
    color: "amber",
    description: "泽风大过"
  },
  
  // 坎为水
  {
    id: "water_water_kan",
    name: "坎",
    elements: ["water", "water"],
    type: "normal",
    color: "blue",
    description: "坎为水"
  },
  
  // 离为火
  {
    id: "fire_fire_li",
    name: "离",
    elements: ["fire", "fire"],
    type: "normal",
    color: "red",
    description: "离为火"
  },
  
  // 泽山咸
  {
    id: "lake_mountain_xian",
    name: "咸",
    elements: ["lake", "mountain"],
    type: "normal",
    color: "amber",
    description: "泽山咸"
  },
  
  // 雷风恒
  {
    id: "thunder_wind_heng",
    name: "恒",
    elements: ["thunder", "wind"],
    type: "normal",
    color: "yellow",
    description: "雷风恒"
  },
  
  // 天山遁
  {
    id: "sky_mountain_dun",
    name: "遁",
    elements: ["sky", "mountain"],
    type: "normal",
    color: "white",
    description: "天山遁"
  },
  
  // 雷天大壮
  {
    id: "thunder_sky_dazhuang",
    name: "大壮",
    elements: ["thunder", "sky"],
    type: "normal",
    color: "yellow",
    description: "雷天大壮"
  },
  
  // 火地晋
  {
    id: "fire_earth_jin",
    name: "晋",
    elements: ["fire", "earth"],
    type: "normal",
    color: "red",
    description: "火地晋"
  },
  
  // 地火明夷
  {
    id: "earth_fire_mingyi",
    name: "明夷",
    elements: ["earth", "fire"],
    type: "normal",
    color: "black",
    description: "地火明夷"
  },
  
  // 风火家人
  {
    id: "wind_fire_jiaren",
    name: "家人",
    elements: ["wind", "fire"],
    type: "normal",
    color: "cyan",
    description: "风火家人"
  },
  
  // 火泽睽
  {
    id: "fire_lake_kui",
    name: "睽",
    elements: ["fire", "lake"],
    type: "normal",
    color: "red",
    description: "火泽睽"
  },
  
  // 水山蹇
  {
    id: "water_mountain_jian",
    name: "蹇",
    elements: ["water", "mountain"],
    type: "normal",
    color: "blue",
    description: "水山蹇"
  },
  
  // 雷水解
  {
    id: "thunder_water_jie",
    name: "解",
    elements: ["thunder", "water"],
    type: "normal",
    color: "yellow",
    description: "雷水解"
  },
  
  // 山泽损
  {
    id: "mountain_lake_sun",
    name: "损",
    elements: ["mountain", "lake"],
    type: "normal",
    color: "green",
    description: "山泽损"
  },
  
  // 风雷益
  {
    id: "wind_thunder_yi",
    name: "益",
    elements: ["wind", "thunder"],
    type: "normal",
    color: "cyan",
    description: "风雷益"
  },
  
  // 泽天夬
  {
    id: "lake_sky_guai",
    name: "夬",
    elements: ["lake", "sky"],
    type: "normal",
    color: "amber",
    description: "泽天夬"
  },
  
  // 天风姤
  {
    id: "sky_wind_gou",
    name: "姤",
    elements: ["sky", "wind"],
    type: "normal",
    color: "white",
    description: "天风姤"
  },
  
  // 泽地萃
  {
    id: "lake_earth_cui",
    name: "萃",
    elements: ["lake", "earth"],
    type: "normal",
    color: "amber",
    description: "泽地萃"
  },
  
  // 地风升
  {
    id: "earth_wind_sheng",
    name: "升",
    elements: ["earth", "wind"],
    type: "normal",
    color: "black",
    description: "地风升"
  },
  
  // 泽水困
  {
    id: "lake_water_kun",
    name: "困",
    elements: ["lake", "water"],
    type: "normal",
    color: "amber",
    description: "泽水困"
  },
  
  // 水风井
  {
    id: "water_wind_jing",
    name: "井",
    elements: ["water", "wind"],
    type: "normal",
    color: "blue",
    description: "水风井"
  },
  
  // 泽火革
  {
    id: "lake_fire_ge",
    name: "革",
    elements: ["lake", "fire"],
    type: "normal",
    color: "amber",
    description: "泽火革"
  },
  
  // 火风鼎
  {
    id: "fire_wind_ding",
    name: "鼎",
    elements: ["fire", "wind"],
    type: "normal",
    color: "red",
    description: "火风鼎"
  },
  
  // 震为雷
  {
    id: "thunder_thunder_zhen",
    name: "震",
    elements: ["thunder", "thunder"],
    type: "normal",
    color: "yellow",
    description: "震为雷"
  },
  
  // 艮为山
  {
    id: "mountain_mountain_gen",
    name: "艮",
    elements: ["mountain", "mountain"],
    type: "normal",
    color: "green",
    description: "艮为山"
  },
  
  // 风山渐
  {
    id: "wind_mountain_jian",
    name: "渐",
    elements: ["wind", "mountain"],
    type: "normal",
    color: "cyan",
    description: "风山渐"
  },
  
  // 雷泽归妹
  {
    id: "thunder_lake_guimei",
    name: "归妹",
    elements: ["thunder", "lake"],
    type: "normal",
    color: "yellow",
    description: "雷泽归妹"
  },
  
  // 雷火丰
  {
    id: "thunder_fire_feng",
    name: "丰",
    elements: ["thunder", "fire"],
    type: "normal",
    color: "yellow",
    description: "雷火丰"
  },
  
  // 火山旅
  {
    id: "fire_mountain_lv",
    name: "旅",
    elements: ["fire", "mountain"],
    type: "normal",
    color: "red",
    description: "火山旅"
  },
  
  // 巽为风
  {
    id: "wind_wind_xun",
    name: "巽",
    elements: ["wind", "wind"],
    type: "normal",
    color: "cyan",
    description: "巽为风"
  },
  
  // 兑为泽
  {
    id: "lake_lake_dui",
    name: "兑",
    elements: ["lake", "lake"],
    type: "normal",
    color: "amber",
    description: "兑为泽"
  },
  
  // 风水涣
  {
    id: "wind_water_huan",
    name: "涣",
    elements: ["wind", "water"],
    type: "normal",
    color: "cyan",
    description: "风水涣"
  },
  
  // 水泽节
  {
    id: "water_lake_jie",
    name: "节",
    elements: ["water", "lake"],
    type: "normal",
    color: "blue",
    description: "水泽节"
  },
  
  // 风泽中孚
  {
    id: "wind_lake_zhongfu",
    name: "中孚",
    elements: ["wind", "lake"],
    type: "normal",
    color: "cyan",
    description: "风泽中孚"
  },
  
  // 雷山小过
  {
    id: "thunder_mountain_xiaoguo",
    name: "小过",
    elements: ["thunder", "mountain"],
    type: "normal",
    color: "yellow",
    description: "雷山小过"
  },
  
  // 水火既济
  {
    id: "water_fire_jiji",
    name: "既济",
    elements: ["water", "fire"],
    type: "normal",
    color: "blue",
    description: "水火既济"
  },
  
  // 火水未济
  {
    id: "fire_water_weiji",
    name: "未济",
    elements: ["fire", "water"],
    type: "normal",
    color: "red",
    description: "火水未济"
  }
];