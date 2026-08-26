export interface GameCard {
  id: string;
  name: string;
  elements: string[];
  type: string;
  color: string;
  description: string;
  divination: string;
  interpretation: string;
}

// 64 hexagrams data optimized for performance
export const hexagramsData: GameCard[] = [
  // 乾为天 (Pure Sky)
  {
    id: "sky_sky_qian",
    name: "乾",
    elements: ["sky", "sky"],
    type: "normal",
    color: "white",
    description: "乾为天",
    divination: "天行健，君子以自强不息",
    interpretation: "天道运行刚健有力，永不停息，象征刚健有力，启示人们要像天体运行般刚毅不屈，不断进取。"
  },
  
  // 坤为地 (Pure Earth)
  {
    id: "earth_earth_kun",
    name: "坤",
    elements: ["earth", "earth"],
    type: "normal",
    color: "black",
    description: "坤为地",
    divination: "地势坤，君子以厚德载物",
    interpretation: "大地宽厚，象征包容和承载，启示人们要有宽广的胸怀和深厚的品德。"
  },
  
  // 水雷屯
  {
    id: "water_thunder_zhun",
    name: "屯",
    elements: ["water", "thunder"],
    type: "normal",
    color: "blue",
    description: "水雷屯",
    divination: "雷水相动，君子以经纶",
    interpretation: "初创时期充满困难，但蕴含着生机与希望，需要耐心积累，厚积薄发。"
  },
  
  // 山水蒙
  {
    id: "mountain_water_meng",
    name: "蒙",
    elements: ["mountain", "water"],
    type: "normal",
    color: "green",
    description: "山水蒙",
    divination: "山下出泉，君子以果行育德",
    interpretation: "求学启蒙的阶段，需要虚心学习，去除蒙昧，以诚待师，方能获得智慧。"
  },
  
  // 水天需
  {
    id: "water_sky_xu",
    name: "需",
    elements: ["water", "sky"],
    type: "normal",
    color: "blue",
    description: "水天需",
    divination: "云上于天，君子以饮食宴乐",
    interpretation: "等待时机的智慧，不急躁进取，养精蓄锐，时机成熟自然水到渠成。"
  },
  
  // 天水讼
  {
    id: "sky_water_song",
    name: "讼",
    elements: ["sky", "water"],
    type: "normal",
    color: "white",
    description: "天水讼",
    divination: "天与水违行，君子以作事谋始",
    interpretation: "争端纷扰之象，劝人慎重行事，凡事三思而后行，避免无谓的争论。"
  },
  
  // 地水师
  {
    id: "earth_water_shi",
    name: "师",
    elements: ["earth", "water"],
    type: "normal",
    color: "black",
    description: "地水师",
    divination: "地中有水，君子以容民畜众",
    interpretation: "统率军旅之道，强调纪律与仁爱并重，以德服人，方能众志成城。"
  },
  
  // 水地比
  {
    id: "water_earth_bi",
    name: "比",
    elements: ["water", "earth"],
    type: "normal",
    color: "blue",
    description: "水地比",
    divination: "地上有水，君子以建万国亲诸侯",
    interpretation: "亲近团结的象征，强调和谐相处，互助合作，共同进步的重要性。"
  },
  
  // 风天小畜
  {
    id: "wind_sky_xiaoxu",
    name: "小畜",
    elements: ["wind", "sky"],
    type: "normal",
    color: "cyan",
    description: "风天小畜",
    divination: "风行天上，君子以懿文德",
    interpretation: "小有积蓄之意，提醒人们要节制欲望，积累实力，养成良好品德。"
  },
  
  // 天泽履
  {
    id: "sky_lake_lv",
    name: "履",
    elements: ["sky", "lake"],
    type: "normal",
    color: "white",
    description: "天泽履",
    divination: "上天下泽，君子以辨上下定民志",
    interpretation: "谨慎践行的智慧，强调做人做事要有分寸，知进退，守礼仪。"
  },
  
  // 地天泰
  {
    id: "earth_sky_tai",
    name: "泰",
    elements: ["earth", "sky"],
    type: "normal",
    color: "black",
    description: "地天泰",
    divination: "天地交泰，君子以财成天地之道",
    interpretation: "通达顺畅之象，天地和谐，万物生长，是繁荣昌盛的美好时期。"
  },
  
  // 天地否
  {
    id: "sky_earth_pi",
    name: "否",
    elements: ["sky", "earth"],
    type: "normal",
    color: "white",
    description: "天地否",
    divination: "天地不交，君子以俭德辟难",
    interpretation: "阻塞不通之象，提醒人们在困难时期要修养品德，等待转机。"
  },
  
  // 天火同人
  {
    id: "sky_fire_tongren",
    name: "同人",
    elements: ["sky", "fire"],
    type: "normal",
    color: "white",
    description: "天火同人",
    divination: "天与火，君子以类族辨物",
    interpretation: "和谐团结之象，强调志同道合，携手共进，众人一心的力量。"
  },
  
  // 火天大有
  {
    id: "fire_sky_dayou",
    name: "大有",
    elements: ["fire", "sky"],
    type: "normal",
    color: "red",
    description: "火天大有",
    divination: "火在天上，君子以遏恶扬善",
    interpretation: "大有所获之象，光明正大，丰收富足，但要居安思危，以德配天。"
  },
  
  // 地山谦
  {
    id: "earth_mountain_qian",
    name: "谦",
    elements: ["earth", "mountain"],
    type: "normal",
    color: "black",
    description: "地山谦",
    divination: "地中有山，君子以裒多益寡",
    interpretation: "谦逊有礼之德，高山藏于地下，教导人们要谦虚谨慎，不骄不躁。"
  },
  
  // 雷地豫
  {
    id: "thunder_earth_yu",
    name: "豫",
    elements: ["thunder", "earth"],
    type: "normal",
    color: "yellow",
    description: "雷地豫",
    divination: "雷出地奋，君子以作乐崇德",
    interpretation: "欢乐和谐之象，春雷出地，万物复苏，享受当下的美好时光。"
  },
  
  // 泽雷随
  {
    id: "lake_thunder_sui",
    name: "随",
    elements: ["lake", "thunder"],
    type: "normal",
    color: "amber",
    description: "泽雷随",
    divination: "泽中有雷，随。君子以向晦入宴息",
    interpretation: "顺从跟随的智慧，动而悦就是随，彼此沟通但须有原则和条件，以坚贞为前提。"
  },
  
  // 山风蛊
  {
    id: "mountain_wind_gu",
    name: "蛊",
    elements: ["mountain", "wind"],
    type: "normal",
    color: "green",
    description: "山风蛊",
    divination: "山下有风，蛊。君子以振民育德",
    interpretation: "腐败之象需振救整顿，除旧布新挽救危机，重新创造治理整顿。"
  },
  
  // 地泽临
  {
    id: "earth_lake_lin",
    name: "临",
    elements: ["earth", "lake"],
    type: "normal",
    color: "black",
    description: "地泽临",
    divination: "泽上有地，临。君子以教思无穷，容保民无疆",
    interpretation: "君临监督指导，高监下为临，阳气上升但需提防阴气渐长，以德临人。"
  },
  
  // 风地观
  {
    id: "wind_earth_guan",
    name: "观",
    elements: ["wind", "earth"],
    type: "normal",
    color: "cyan",
    description: "风地观",
    divination: "风行地上，观。先王以省方观民设教",
    interpretation: "观察审视之象，通过观察了解民情设立教化，宣布德教施于下。"
  },
  
  // 火雷噬嗑
  {
    id: "fire_thunder_shike",
    name: "噬嗑",
    elements: ["fire", "thunder"],
    type: "normal",
    color: "red",
    description: "火雷噬嗑",
    divination: "雷电，噬嗑。先王以明罚敕法",
    interpretation: "咬合排除障碍，适宜断狱执法，雷电威严明察秋毫。"
  },
  
  // 山火贲
  {
    id: "mountain_fire_bi",
    name: "贲",
    elements: ["mountain", "fire"],
    type: "normal",
    color: "green",
    description: "山火贲",
    divination: "山下有火，贲。君子以明庶政，无敢折狱",
    interpretation: "文饰修饰之象，要注意内容与形式的结合，以文明治政但不轻易断狱。"
  },
  
  // 山地剥
  {
    id: "mountain_earth_bo",
    name: "剥",
    elements: ["mountain", "earth"],
    type: "normal",
    color: "green",
    description: "山地剥",
    divination: "山附于地，剥。上以厚下安宅",
    interpretation: "剥落衰败之象，阴盛阳衰不宜行动，上位者应厚待下民安定居所。"
  },
  
  // 地雷复
  {
    id: "earth_thunder_fu",
    name: "复",
    elements: ["earth", "thunder"],
    type: "normal",
    color: "black",
    description: "地雷复",
    divination: "雷在地中，复。先王以至日闭关，商旅不行",
    interpretation: "阳气复返之象，一阳来复事物开始恢复，冬至时节应当静养生息。"
  },
  
  // 天雷无妄
  {
    id: "sky_thunder_wuwang",
    name: "无妄",
    elements: ["sky", "thunder"],
    type: "normal",
    color: "white",
    description: "天雷无妄",
    divination: "天下雷行，无妄。先王以茂对时育万物",
    interpretation: "纯真无妄之象，顺应天道自然而行，不可有虚假妄为之心。"
  },
  
  // 山天大畜
  {
    id: "mountain_sky_daxu",
    name: "大畜",
    elements: ["mountain", "sky"],
    type: "normal",
    color: "green",
    description: "山天大畜",
    divination: "天在山中，大畜。君子以多识前言往行以畜其德",
    interpretation: "大有积蓄之象，山能止住天，以德蓄才，博学厚德以养成大器。"
  },
  
  // 山雷颐
  {
    id: "mountain_thunder_yi",
    name: "颐",
    elements: ["mountain", "thunder"],
    type: "normal",
    color: "green",
    description: "山雷颐",
    divination: "山下有雷，颐。君子以慎言语，节饮食",
    interpretation: "养育颐养之道，如口颌咀嚼，提醒要谨慎言语，节制饮食，修身养性。"
  },
  
  // 泽风大过
  {
    id: "lake_wind_daguo",
    name: "大过",
    elements: ["lake", "wind"],
    type: "normal",
    color: "amber",
    description: "泽风大过",
    divination: "泽灭木，大过。君子以独立不惧，遁世无闷",
    interpretation: "大有过度之象，栋梁之材承受过重，需要独立坚强面对非常时期。"
  },
  
  // 坎为水
  {
    id: "water_water_kan",
    name: "坎",
    elements: ["water", "water"],
    type: "normal",
    color: "blue",
    description: "坎为水",
    divination: "水洊至，习坎。君子以常德行，习教事",
    interpretation: "重重困险之象，如水流不息，君子应当持守常德，反复学习磨练。"
  },
  
  // 离为火
  {
    id: "fire_fire_li",
    name: "离",
    elements: ["fire", "fire"],
    type: "normal",
    color: "red",
    description: "离为火",
    divination: "明两作，离。大人以继明照于四方",
    interpretation: "光明重叠之象，双重光明普照大地，大人应当延续光明照耀四方。"
  },
  
  // 泽山咸
  {
    id: "lake_mountain_xian",
    name: "咸",
    elements: ["lake", "mountain"],
    type: "normal",
    color: "amber",
    description: "泽山咸",
    divination: "山上有泽，咸。君子以虚受人",
    interpretation: "感应相通之象，山泽通气，万物感应，君子应当虚心接受他人意见。"
  },
  
  // 雷风恒
  {
    id: "thunder_wind_heng",
    name: "恒",
    elements: ["thunder", "wind"],
    type: "normal",
    color: "yellow",
    description: "雷风恒",
    divination: "雷风，恒。君子以立不易方",
    interpretation: "恒久不变之象，雷风相助持之以恒，君子应当坚守正道不轻易改变方向。"
  },
  
  // 天山遁
  {
    id: "sky_mountain_dun",
    name: "遁",
    elements: ["sky", "mountain"],
    type: "normal",
    color: "white",
    description: "天山遁",
    divination: "天下有山，遁。君子以远小人，不恶而严",
    interpretation: "隐退避让之象，君子远离小人但不恶言相向，以退为进保全自身。"
  },
  
  // 雷天大壮
  {
    id: "thunder_sky_dazhuang",
    name: "大壮",
    elements: ["thunder", "sky"],
    type: "normal",
    color: "yellow",
    description: "雷天大壮",
    divination: "雷在天上，大壮。君子以非礼弗履",
    interpretation: "刚强过度需自律，阳气壮盛应以正道行事，君子不做违背礼法之事。"
  },
  
  // 火地晋
  {
    id: "fire_earth_jin",
    name: "晋",
    elements: ["fire", "earth"],
    type: "normal",
    color: "red",
    description: "火地晋",
    divination: "明出地上，晋。君子以自昭明德",
    interpretation: "光明上进之象，如日出地面象征进步发展，君子应当彰显自己的明德。"
  },
  
  // 地火明夷
  {
    id: "earth_fire_mingyi",
    name: "明夷",
    elements: ["earth", "fire"],
    type: "normal",
    color: "black",
    description: "地火明夷",
    divination: "明入地中，明夷。君子以莅众，用晦而明",
    interpretation: "光明隐晦之象，处于困难时期需要韬光养晦，保存实力等待时机。"
  },
  
  // 风火家人
  {
    id: "wind_fire_jiaren",
    name: "家人",
    elements: ["wind", "fire"],
    type: "normal",
    color: "cyan",
    description: "风火家人",
    divination: "风自火出，家人。君子以言有物，而行有恒",
    interpretation: "家庭和睦之象，内外有序女主内男主外，君子说话有根据行为有恒心。"
  },
  
  // 火泽睽
  {
    id: "fire_lake_kui",
    name: "睽",
    elements: ["fire", "lake"],
    type: "normal",
    color: "red",
    description: "火泽睽",
    divination: "上火下泽，睽。君子以同而异",
    interpretation: "分离背违之象，但在小事上可获吉利，君子要求同存异。"
  },
  
  // 水山蹇
  {
    id: "water_mountain_jian",
    name: "蹇",
    elements: ["water", "mountain"],
    type: "normal",
    color: "blue",
    description: "水山蹇",
    divination: "山上有水，蹇。君子以反身修德",
    interpretation: "艰难险阻之象，前路不顺需要反省自身修养品德。"
  },
  
  // 雷水解
  {
    id: "thunder_water_jie",
    name: "解",
    elements: ["thunder", "water"],
    type: "normal",
    color: "yellow",
    description: "雷水解",
    divination: "雷雨作，解。君子以赦过宥罪",
    interpretation: "解脱困难之象，化险为夷，君子应当宽恕过错化解矛盾。"
  },
  
  // 山泽损
  {
    id: "mountain_lake_sun",
    name: "损",
    elements: ["mountain", "lake"],
    type: "normal",
    color: "green",
    description: "山泽损",
    divination: "山下有泽，损。君子以惩忿窒欲",
    interpretation: "减损节制之象，需要克制欲望以俭朴为美，君子应当抑制愤怒控制欲望。"
  },
  
  // 风雷益
  {
    id: "wind_thunder_yi",
    name: "益",
    elements: ["wind", "thunder"],
    type: "normal",
    color: "cyan",
    description: "风雷益",
    divination: "风雷，益。君子以见善则迁，有过则改",
    interpretation: "增益进步之象，有利于行动和发展，君子见到善行就学习有过错就改正。"
  },
  
  // 泽天夬
  {
    id: "lake_sky_guai",
    name: "夬",
    elements: ["lake", "sky"],
    type: "normal",
    color: "amber",
    description: "泽天夬",
    divination: "泽上于天，夬。君子以施禄及下，居德则忌",
    interpretation: "决断之象，阴盛必衰需要果断行动，君子应当施恩于下但不可恃德而骄。"
  },
  
  // 天风姤
  {
    id: "sky_wind_gou",
    name: "姤",
    elements: ["sky", "wind"],
    type: "normal",
    color: "white",
    description: "天风姤",
    divination: "天下有风，姤。后以施命诰四方",
    interpretation: "相遇邂逅之象，但需要谨慎选择，君主应当发布政令通告四方。"
  },
  
  // 泽地萃
  {
    id: "lake_earth_cui",
    name: "萃",
    elements: ["lake", "earth"],
    type: "normal",
    color: "amber",
    description: "泽地萃",
    divination: "泽上于地，萃。君子以除戎器，戒不虞",
    interpretation: "聚合团结之象，众人聚集需要防备意外，君子应当整治武备防范不测。"
  },
  
  // 地风升
  {
    id: "earth_wind_sheng",
    name: "升",
    elements: ["earth", "wind"],
    type: "normal",
    color: "black",
    description: "地风升",
    divination: "地中生木，升。君子以顺德，积小以高大",
    interpretation: "上升进步之象，循序渐进积累成就，君子应当顺应品德从小事积累成大业。"
  },
  
  // 泽水困
  {
    id: "lake_water_kun",
    name: "困",
    elements: ["lake", "water"],
    type: "normal",
    color: "amber",
    description: "泽水困",
    divination: "泽无水，困。君子以致命遂志",
    interpretation: "困顿窘迫之象，但坚持正道可获吉利，君子应当以生命完成志向。"
  },
  
  // 水风井
  {
    id: "water_wind_jing",
    name: "井",
    elements: ["water", "wind"],
    type: "normal",
    color: "blue",
    description: "水风井",
    divination: "木上有水，井。君子以劳民劝相",
    interpretation: "恒久不变的德行之象，如井水不竭不溢与世无争，君子应当勤劳为民相互勉励。"
  },
  
  // 泽火革
  {
    id: "lake_fire_ge",
    name: "革",
    elements: ["lake", "fire"],
    type: "normal",
    color: "amber",
    description: "泽火革",
    divination: "泽中有火，革。君子以治历明时",
    interpretation: "变革改革之象，水火相克必然变革，这是宇宙基本规律，君子应当修治历法明确时令。"
  },
  
  // 火风鼎
  {
    id: "fire_wind_ding",
    name: "鼎",
    elements: ["fire", "wind"],
    type: "normal",
    color: "red",
    description: "火风鼎",
    divination: "木上有火，鼎。君子以正位凝命",
    interpretation: "改革稳定图变之象，鼎为重宝权力法制象征，君子应当端正地位凝聚使命。"
  },
  
  // 震为雷
  {
    id: "thunder_thunder_zhen",
    name: "震",
    elements: ["thunder", "thunder"],
    type: "normal",
    color: "yellow",
    description: "震为雷",
    divination: "洊雷，震。君子以恐惧修省",
    interpretation: "双震相叠雷声阵阵，令人惊惧但有德者不失镇定，君子应当在震动中恐惧修省反思。"
  },
  
  // 艮为山
  {
    id: "mountain_mountain_gen",
    name: "艮",
    elements: ["mountain", "mountain"],
    type: "normal",
    color: "green",
    description: "艮为山",
    divination: "兼山，艮。君子以思不出其位",
    interpretation: "双山相重象征止静，止于其背不见其身，君子应当安守本分思虑不越出职位。"
  },
  
  // 风山渐
  {
    id: "wind_mountain_jian",
    name: "渐",
    elements: ["wind", "mountain"],
    type: "normal",
    color: "cyan",
    description: "风山渐",
    divination: "山上有木，渐。君子以居贤德善俗",
    interpretation: "循序渐进如女子出嫁，山上有木渐进发展，君子应当培养贤德改善风俗。"
  },
  
  // 雷泽归妹
  {
    id: "thunder_lake_guimei",
    name: "归妹",
    elements: ["thunder", "lake"],
    type: "normal",
    color: "yellow",
    description: "雷泽归妹",
    divination: "泽上有雷，归妹。君子以永终知敝",
    interpretation: "女子出嫁之象，但急于行动则凶无所利，君子应当深谋远虑知道事物弊端。"
  },
  
  // 雷火丰
  {
    id: "thunder_fire_feng",
    name: "丰",
    elements: ["thunder", "fire"],
    type: "normal",
    color: "yellow",
    description: "雷火丰",
    divination: "雷电皆至，丰。君子以折狱致刑",
    interpretation: "雷电皆至象征丰盛繁荣，如日中天般盛大，君子应当明断刑狱执法公正。"
  },
  
  // 火山旅
  {
    id: "fire_mountain_lv",
    name: "旅",
    elements: ["fire", "mountain"],
    type: "normal",
    color: "red",
    description: "火山旅",
    divination: "山上有火，旅。君子以明慎用刑而不留狱",
    interpretation: "旅行在外小有亨通，山上有火象征旅居，君子应当明智谨慎使用刑法不滞留案件。"
  },
  
  // 巽为风
  {
    id: "wind_wind_xun",
    name: "巽",
    elements: ["wind", "wind"],
    type: "normal",
    color: "cyan",
    description: "巽为风",
    divination: "随风，巽。君子以申命行事",
    interpretation: "双重巽风相叠风行无阻，无孔不入象征柔顺深入渐进，君子应当反复申明教义颁行政令。"
  },
  
  // 兑为泽
  {
    id: "lake_lake_dui",
    name: "兑",
    elements: ["lake", "lake"],
    type: "normal",
    color: "amber",
    description: "兑为泽",
    divination: "丽泽，兑。君子以朋友讲习",
    interpretation: "喜悦和悦之象，两泽相连滋润万物，象征喜悦交流口才，君子应当与朋友相互学习讨论。"
  },
  
  // 风水涣
  {
    id: "wind_water_huan",
    name: "涣",
    elements: ["wind", "water"],
    type: "normal",
    color: "cyan",
    description: "风水涣",
    divination: "风行水上，涣。先王以享于帝立庙",
    interpretation: "涣散离散之象，风行水面使水面涣散，象征化解疏通团结，先王应当享祭上帝建立宗庙。"
  },
  
  // 水泽节
  {
    id: "water_lake_jie",
    name: "节",
    elements: ["water", "lake"],
    type: "normal",
    color: "blue",
    description: "水泽节",
    divination: "泽上有水，节。君子以制数度，议德行",
    interpretation: "节制节约之象，泽上有水水有限度，象征节制适度规范，君子应当制定法度讨论德行。"
  },
  
  // 风泽中孚
  {
    id: "wind_lake_zhongfu",
    name: "中孚",
    elements: ["wind", "lake"],
    type: "normal",
    color: "cyan",
    description: "风泽中孚",
    divination: "泽上有风，中孚。君子以议狱缓死",
    interpretation: "诚信诚实之象，风在泽上影响深远，象征诚信感化沟通，连豚鱼都能感化，君子应当审议案件缓解死刑。"
  },
  
  // 雷山小过
  {
    id: "thunder_mountain_xiaoguo",
    name: "小过",
    elements: ["thunder", "mountain"],
    type: "normal",
    color: "yellow",
    description: "雷山小过",
    divination: "山上有雷，小过。君子以行过乎恭，丧过乎哀，用过乎俭",
    interpretation: "小有过越适度越分之象，山上有雷雷声受阻，君子应当行为过分恭敬，居丧过分哀伤，用度过分节俭。"
  },
  
  // 水火既济
  {
    id: "water_fire_jiji",
    name: "既济",
    elements: ["water", "fire"],
    type: "normal",
    color: "blue",
    description: "水火既济",
    divination: "水在火上，既济。君子以思患而豫防之",
    interpretation: "已经成功完成之象，水在火上相互调济象征成功完满平衡，但君子应当思虑患难预先防范。"
  },
  
  // 火水未济
  {
    id: "fire_water_weiji",
    name: "未济",
    elements: ["fire", "water"],
    type: "normal",
    color: "red",
    description: "火水未济",
    divination: "火在水上，未济。君子以慎辨物居方",
    interpretation: "尚未完成充满可能之象，火在水上难以相济，象征未完成发展中，君子应当谨慎辨别事物安居其位。"
  }
];