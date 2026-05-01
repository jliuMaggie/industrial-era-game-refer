/** 联姻对象数据定义
 * 游戏中可与玩家家族联姻的角色池
 * 每个时代包含10个联姻对象：3普通 + 3稀有 + 2史诗 + 2传说
 * 共4个时代，总计40个联姻对象
 */

export interface MarriageCandidate {
  id: string;
  name: string;
  gender: 'male' | 'female';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  era: 'first' | 'second' | 'third' | 'fourth';
  icon: string;
  dowryRange: [number, number];
  dowryBonus: string;
  effects: { type: string; value: number; description: string }[];
  description: string;
  flavorText: string;
  specialEvent?: string;
}

// ==================== 时代一：蒸汽纪元 (1760-1840) ====================

const ERA1_CANDIDATES: MarriageCandidate[] = [
  {
    id: 'emma_merchant_e1',
    name: '艾玛·格林伍德',
    gender: 'female',
    rarity: 'common',
    era: 'first',
    icon: '👩‍🌾',
    dowryRange: [500, 1500],
    dowryBonus: '父亲赠送的一箱优质茶叶与丝绸样品，以及一本手写的《商路笔记》',
    effects: [
      { type: 'trade_bonus', value: 0.08, description: '贸易收益+8%' },
      { type: 'monthly_income', value: 30, description: '每月额外收入+30' },
    ],
    description: '一位朴实商人的女儿，从小在店铺中帮忙，对价格和行情有着敏锐的直觉。',
    flavorText:
      '艾玛在父亲的杂货铺里长大，能一眼看出顾客的需求和支付能力。她虽然不识字，但心算速度比大多数会计还快。她带着父亲半生的积蓄和对经商的本能嗅觉嫁入你的家族，将为你的商业版图带来最接地气的智慧。',
  },
  {
    id: 'mary_teacher_e1',
    name: '玛丽·温特斯',
    gender: 'female',
    rarity: 'common',
    era: 'first',
    icon: '👩‍🏫',
    dowryRange: [300, 800],
    dowryBonus: '一套珍贵的启蒙书籍和一位私人家庭教师的推荐信',
    effects: [
      { type: 'education_cost_reduction', value: 0.1, description: '教育开支-10%' },
      { type: 'heir_talent_rate', value: 0.05, description: '继承人天赋出现率+5%' },
    ],
    description: '乡村教师的女儿，受过基础教育，重视知识和教养。',
    flavorText:
      '玛丽的父亲是这个偏远村庄唯一能够读写的教师。尽管家里没有金银珠宝，但他们拥有最宝贵的财富——知识。玛丽熟读启蒙运动的著作，坚信教育是改变命运的唯一途径。她的嫁妆中那套珍贵书籍，将照亮下一代继承人的求学之路。',
  },
  {
    id: 'beth_farmer_e1',
    name: '贝丝·霍金斯',
    gender: 'female',
    rarity: 'common',
    era: 'first',
    icon: '🌾',
    dowryRange: [400, 1200],
    dowryBonus: '50英亩良田的地契和两头健壮的耕牛',
    effects: [
      { type: 'agriculture_bonus', value: 0.1, description: '农业投资回报率+10%' },
      { type: 'food_cost_reduction', value: 0.15, description: '家族日常开支-15%' },
    ],
    description: '农场主的女儿，勤劳朴实，懂得土地的脾气。',
    flavorText:
      '贝丝的家族在这片土地上耕种了五代。她知道什么样的天气预示着丰收，什么样的云层会带来冰雹。她的嫁妆——那50英亩最肥沃的土地和两头全村最好的耕牛——是你家族最可靠的根基。无论市场如何动荡，土地永远不会背叛它的主人。',
  },
  {
    id: 'victoria_banker_e1',
    name: '维多利亚·阿什沃思',
    gender: 'female',
    rarity: 'rare',
    era: 'first',
    icon: '💰',
    dowryRange: [3000, 8000],
    dowryBonus: '伦敦某私人银行的股份凭证和一套精密的复式记账账本',
    effects: [
      { type: 'banking_bonus', value: 0.15, description: '银行投资收益+15%' },
      { type: 'interest_rate', value: 0.03, description: '存款年利率+3%' },
      { type: 'loan_cost_reduction', value: 0.08, description: '贷款利息-8%' },
    ],
    description: '一位银行家的千金，在数字与票据中长大，对金融运作耳濡目染。',
    flavorText:
      '维多利亚的父亲是伦敦金融城里一位颇受人尊敬的私人银行家。她从十二岁起就在父亲的办公室里学习看账本，十五岁就能独立评估一份贷款申请的风险。她带来的不只是丰厚的嫁妆，还有进入上流金融圈的钥匙和足以改变家族命运的财务智慧。',
    specialEvent: '婚后第一个月，岳父的银行遭遇挤兑风波，你可以选择伸出援手或袖手旁观，这将影响你与银行家的关系。',
  },
  {
    id: 'isabella_factory_e1',
    name: '伊莎贝拉·克罗夫特',
    gender: 'female',
    rarity: 'rare',
    era: 'first',
    icon: '🏭',
    dowryRange: [2500, 7000],
    dowryBonus: '一家小型纺织厂的20%股份和三名熟练织工',
    effects: [
      { type: 'textile_bonus', value: 0.18, description: '纺织业投资收益+18%' },
      { type: 'production_speed', value: 0.1, description: '工厂生产效率+10%' },
      { type: 'worker_cost_reduction', value: 0.05, description: '工人薪资开支-5%' },
    ],
    description: '纺织工厂主的女儿，熟悉车间管理和生产调度。',
    flavorText:
      '伊莎贝拉从小在纺织厂的轰鸣声中长大。她不仅熟悉每一道工序，更懂得如何安抚工人的情绪、如何与供货商谈判。她带来的那三名织工是厂里技术最好的老师傅，他们的技艺能让你的新工厂在投产第一天就达到行业平均水准。',
    specialEvent: '伊莎贝拉偶尔会提出改良生产流程的建议，采纳后有机会触发工厂效率提升事件。',
  },
  {
    id: 'sophia_engineer_e1',
    name: '索菲亚·布莱克伍德',
    gender: 'female',
    rarity: 'rare',
    era: 'first',
    icon: '🔧',
    dowryRange: [2000, 6000],
    dowryBonus: '一台改良型蒸汽机的核心部件图纸和一名熟练的机械师',
    effects: [
      { type: 'steam_bonus', value: 0.2, description: '蒸汽相关投资收益+20%' },
      { type: 'invention_success_rate', value: 0.1, description: '发明成功率+10%' },
      { type: 'maintenance_cost_reduction', value: 0.12, description: '设备维护成本-12%' },
    ],
    description: '蒸汽机师的女儿，对机械有着天然的亲近感和理解力。',
    flavorText:
      '索菲亚的父亲是一名游走在工厂之间的蒸汽机维修师，他被誉为能让任何机器起死回生的魔法师。索菲亚继承了父亲对机械的直觉——她能听出蒸汽机运转时那0.5%的不和谐音，能在故障发生前三小时预测问题。她带来的图纸是父亲毕生改良蒸汽机的结晶。',
    specialEvent: '有概率触发「机械故障预警」事件，让你提前规避工厂设备损坏的巨额损失。',
  },
  {
    id: 'claire_noble_e1',
    name: '克莱尔·德·圣洛朗',
    gender: 'female',
    rarity: 'epic',
    era: 'first',
    icon: '👸',
    dowryRange: [15000, 30000],
    dowryBonus: '一座古老的庄园、世袭男爵夫人的头衔和一套价值连城的首饰',
    effects: [
      { type: 'prestige', value: 500, description: '家族声望+500' },
      { type: 'social_connection', value: 0.25, description: '社交关系获取速度+25%' },
      { type: 'noble_discount', value: 0.15, description: '购买贵族资产时价格-15%' },
      { type: 'tax_reduction', value: 0.1, description: '税收减免10%' },
    ],
    description: '没落贵族的独女，血统高贵却家道中落，正在寻找一个能重振家族荣光的夫家。',
    flavorText:
      '克莱尔出生时就拥有别人奋斗一生也无法企及的贵族身份，但法国大革命和家族经营的失误让这个古老的姓氏濒临破产。她美若天仙，受过最严格的上流社会教育，却不得不用自己的婚姻来换取家族的重生。娶了她，你的姓氏将获得贵族的光环，但你也背负起了复兴一个古老家族的沉重使命。',
    specialEvent: '克莱尔的远房表亲偶尔会邀请你参加贵族沙龙，这是结识高级人脉的绝佳机会。',
  },
  {
    id: 'amelia_eic_e1',
    name: '阿米莉亚·哈特利',
    gender: 'female',
    rarity: 'epic',
    era: 'first',
    icon: '🚢',
    dowryRange: [12000, 25000],
    dowryBonus: '东印度公司的贸易特许状副本和一支远洋商船队的护航合同',
    effects: [
      { type: 'overseas_trade', value: 0.22, description: '海外贸易收益+22%' },
      { type: 'piracy_protection', value: 0.3, description: '遭遇海盗损失-30%' },
      { type: 'spice_bonus', value: 0.15, description: '香料贸易利润+15%' },
      { type: 'market_access', value: 1, description: '解锁亚洲贸易航线' },
    ],
    description: '东印度公司高级商务官的女儿，掌握着跨越半个地球的贸易网络。',
    flavorText:
      '阿米莉亚的父亲是东印度公司加尔各答分部最年轻的商务官，掌握着从印度到中国的贸易命脉。阿米莉亚从小在码头和货舱中穿梭，能流利使用三种东方语言。她带来的特许状和护航合同意味着你的商船可以挂着东印度公司的旗帜航行，免受海盗和竞争对手的骚扰。',
    specialEvent: '阿米莉亚偶尔会收到来自远东的「特供货」，以极低价格购入后高价转手可获暴利。',
  },
  {
    id: 'margaret_princess_e1',
    name: '玛格丽特·冯·霍亨索伦',
    gender: 'female',
    rarity: 'legendary',
    era: 'first',
    icon: '👑',
    dowryRange: [50000, 100000],
    dowryBonus: '皇室珍藏的珠宝匣、普鲁士王室的友谊宣言和一份与皇室的秘密贸易协定',
    effects: [
      { type: 'prestige', value: 2000, description: '家族声望+2000' },
      { type: 'political_influence', value: 0.3, description: '政治影响力+30%' },
      { type: 'trade_monopoly', value: 0.25, description: '贸易垄断权收益+25%' },
      { type: 'military_protection', value: 1, description: '获得王室军事保护（免疫一次战争损失）' },
    ],
    description: '普鲁士王室的远亲，血统中流淌着皇家的骄傲与使命。',
    flavorText:
      '玛格丽特公主是腓特烈大帝的旁系后裔，虽然不属于王位继承序列，但她的血管里流淌着霍亨索伦家族三百年的荣光。从小在波茨坦的无忧宫中长大，她精通七国语言、擅长宫廷马术和钢琴。她的嫁妆中包含了一份秘密协定——普鲁士王室将优先采购你家族的产品，并在战争时期提供军事保护。这是一桩足以让任何商人摇身变为国家支柱的婚姻。',
    specialEvent: '玛格丽特的生日宴会上，你将以准王室成员的身份出席，有机会觐见真正的国王。',
  },
  {
    id: 'victoria_vanderbilt_widow_e1',
    name: '维多利亚·范德比尔特',
    gender: 'female',
    rarity: 'legendary',
    era: 'first',
    icon: '🌹',
    dowryRange: [80000, 150000],
    dowryBonus: '纽约至哈得孙河谷的铁路控股权、范德比尔特家族的姓氏使用权和三位铁路工程师',
    effects: [
      { type: 'railroad_empire', value: 0.35, description: '铁路投资收益+35%' },
      { type: 'transport_dominance', value: 0.2, description: '运输业控制力+20%' },
      { type: 'competitor_intimidation', value: 0.15, description: '竞争对手退出率+15%' },
      { type: 'name_bonus', value: 0.1, description: '家族名称带来的额外声望+10%' },
    ],
    description: '铁路大亨科尼利厄斯·范德比尔特的遗孀，继承了亡夫庞大的交通帝国遗产。',
    flavorText:
      '维多利亚的丈夫——「船长」范德比尔特——在几个月前的一场马车事故中意外离世，留下了纽约州最庞大的铁路和蒸汽船帝国。作为遗孀，维多利亚继承了大部分的遗产，但她深知一个女人无法在这个男人的世界里守住这一切。她需要一个强有力的家族作为依靠，而你正是她选中的那个人。娶了维多利亚，范德比尔特的名字将成为你扩张的通行证。',
    specialEvent: '亡夫的旧部可能会挑战你对铁路帝国的控制权，必须小心处理才能稳住这份庞大的遗产。',
  },
];

// ==================== 时代二：电气钢铁 (1840-1920) ====================

const ERA2_CANDIDATES: MarriageCandidate[] = [
  {
    id: 'anna_clerk_e2',
    name: '安娜·米勒',
    gender: 'female',
    rarity: 'common',
    era: 'second',
    icon: '📠',
    dowryRange: [1000, 3000],
    dowryBonus: '一台崭新的打字机和一家百货公司的供货商引荐信',
    effects: [
      { type: 'retail_bonus', value: 0.08, description: '零售业收益+8%' },
      { type: 'office_efficiency', value: 0.06, description: '办公效率+6%' },
    ],
    description: '百货公司职员的女儿，熟悉现代商业零售的运作方式。',
    flavorText:
      '安娜的父亲是芝加哥马歇尔百货公司最资深的柜台职员，他见证了美国零售业从杂货铺到百货公司的革命性转变。安娜从小耳濡目染，知道如何陈列商品、如何说服顾客、如何在月底盘账时找出那消失的5分钱。她带来的打字机将让你的办公室效率提升一个时代。',
  },
  {
    id: 'louisa_telegraph_e2',
    name: '路易莎·莫尔斯',
    gender: 'female',
    rarity: 'common',
    era: 'second',
    icon: '📡',
    dowryRange: [800, 2500],
    dowryBonus: '一台便携式电报机和一本摩斯电码速查手册',
    effects: [
      { type: 'communication_speed', value: 0.12, description: '信息传递速度+12%' },
      { type: 'market_intel', value: 0.08, description: '市场情报准确度+8%' },
    ],
    description: '电报员之女，手指灵活、反应敏捷，掌握着这个时代最快的通讯技术。',
    flavorText:
      '路易莎的父亲是横跨大陆电报线的第一批报务员。在那根铜线将美洲大陆连接起来的瞬间，信息传递的速度从「以周计算」变成了「以秒计算」。路易莎能在一分钟内敲出两百个单词的电报，她的手指比任何信使的马都更快。她带来的电报机意味着你可以在竞争对手之前半小时得知市场的涨跌。',
  },
  {
    id: 'grace_miner_e2',
    name: '格蕾丝·奥布莱恩',
    gender: 'female',
    rarity: 'common',
    era: 'second',
    icon: '⛏️',
    dowryRange: [1200, 3500],
    dowryBonus: '一座小型铁矿的开采权和五名经验丰富的矿工',
    effects: [
      { type: 'mining_bonus', value: 0.1, description: '矿业投资收益+10%' },
      { type: 'raw_material_cost', value: 0.08, description: '原材料采购成本-8%' },
    ],
    description: '矿工工头的女儿，在黑暗的矿井中长大，对地底的宝藏有着本能的嗅觉。',
    flavorText:
      '格蕾丝的父亲是宾夕法尼亚州一座铁矿的工头，他能在黑暗中凭手感判断出矿石的品位。格蕾丝从小听着矿车的轰鸣声入睡，她能看懂地质图上的每一条矿脉走向。她带来的开采权和五名老矿工是你进入钢铁时代最原始的资本——没有铁矿石，就没有钢铁；没有钢铁，就没有现代工业。',
  },
  {
    id: 'sophia_lawyer_e2',
    name: '索菲亚·哈兰德',
    gender: 'female',
    rarity: 'rare',
    era: 'second',
    icon: '⚖️',
    dowryRange: [5000, 12000],
    dowryBonus: '一份顶级律师事务所的常年法律顾问合同和全套公司法典籍',
    effects: [
      { type: 'legal_protection', value: 0.2, description: '法律诉讼胜率+20%' },
      { type: 'contract_bonus', value: 0.12, description: '合同收益+12%' },
      { type: 'regulatory_resistance', value: 0.15, description: '监管处罚减免15%' },
    ],
    description: '著名律师的掌上明珠，精通法律条文，擅长在规则的缝隙中寻找利益。',
    flavorText:
      '索菲亚的父亲是芝加哥最有名望的公司法律师，洛克菲勒家族和卡内基家族都是他的客户。索菲亚从哈佛法学院以最优等成绩毕业，她能在一百页的法案中找到那一个对你有利的逗号。她带来的法律顾问合同意味着当反垄断法案的利刃悬在头顶时，有人能帮你找到生路。',
    specialEvent: '当有监管或法律威胁时，索菲亚有50%概率提前预警并提供规避方案。',
  },
  {
    id: 'caroline_oil_e2',
    name: '卡罗琳·德雷克',
    gender: 'female',
    rarity: 'rare',
    era: 'second',
    icon: '🛢️',
    dowryRange: [6000, 15000],
    dowryBonus: '德克萨斯一处油田的地质勘测报告和一口高产油井的优先开采权',
    effects: [
      { type: 'oil_bonus', value: 0.2, description: '石油投资收益+20%' },
      { type: 'refinery_efficiency', value: 0.1, description: '炼油效率+10%' },
      { type: 'energy_dominance', value: 0.08, description: '能源市场控制力+8%' },
    ],
    description: '石油商人的女儿，对黑金的脉动有着天生的敏感。',
    flavorText:
      '卡罗琳的父亲是第一批在德克萨斯荒野中勘探石油的冒险者。当其他人还在嘲笑他的时候，他已经钻出了第一口喷油井。卡罗琳闻得出不同油品的品质差异，看得懂地质勘测报告上的每一条等高线。她带来的勘测报告标记了下一处可能爆发的「黑金喷泉」的位置。',
    specialEvent: '卡罗琳偶尔会发现父亲勘测报告中遗漏的「高产区」，触发额外的石油收入事件。',
  },
  {
    id: 'helen_electrical_e2',
    name: '海伦·特斯拉',
    gender: 'female',
    rarity: 'rare',
    era: 'second',
    icon: '⚡',
    dowryRange: [4000, 10000],
    dowryBonus: '一座小型水力发电站的设计方案和一名爱迪生公司跳槽的电气工程师',
    effects: [
      { type: 'electricity_bonus', value: 0.18, description: '电力投资收益+18%' },
      { type: 'factory_power_cost', value: 0.12, description: '工厂用电成本-12%' },
      { type: 'invention_boost', value: 0.08, description: '发明效率+8%' },
    ],
    description: '电气工程师的女儿，成长在电弧和线圈的魔法世界中。',
    flavorText:
      '海伦的父亲曾是爱迪生最器重的助手之一，后来因理念不合自立门户。他在尼亚加拉瀑布边建造了一座试验性水电站，证明了交流电的伟大前景。海伦从小在电流的嗡鸣声中长大，她能设计出让工厂运转效率翻倍的电力系统。她带来的工程师掌握了从爱迪生实验室带出的核心技术。',
    specialEvent: '海伦偶尔能改良你的工厂供电系统，触发一次性的生产成本大幅下降事件。',
  },
  {
    id: 'ada_steel_e2',
    name: '艾达·卡内基',
    gender: 'female',
    rarity: 'epic',
    era: 'second',
    icon: '🔩',
    dowryRange: [20000, 40000],
    dowryBonus: '匹兹堡一座大型炼钢厂的控股权和卡内基钢铁公司的内部采购价协议',
    effects: [
      { type: 'steel_bonus', value: 0.25, description: '钢铁业投资收益+25%' },
      { type: 'construction_cost', value: 0.15, description: '建筑成本-15%' },
      { type: 'industrial_scale', value: 0.12, description: '工业生产规模+12%' },
      { type: 'supply_chain', value: 0.1, description: '供应链效率+10%' },
    ],
    description: '钢铁大亨的侄女，血液中流淌着熔炉的温度。',
    flavorText:
      '艾达是安德鲁·卡内基的侄女，在匹兹堡的钢铁帝国中长大。她能通过钢水的颜色判断碳含量，知道如何在转炉和贝塞麦转炉之间做出最优选择。她的叔叔以冷酷著称，但对艾达却格外疼爱——因为她比任何高管都更懂钢铁。她带来的炼钢厂和内部采购协议意味着你可以用比市场价低15%的价格获得最好的钢材。',
    specialEvent: '艾达偶尔会说服叔叔卡内基与你展开「特殊合作」，提供一次性的钢铁业巨额订单。',
  },
  {
    id: 'josephine_finance_e2',
    name: '约瑟芬·摩根',
    gender: 'female',
    rarity: 'epic',
    era: 'second',
    icon: '🏦',
    dowryRange: [25000, 50000],
    dowryBonus: '摩根银行的VIP账户（无限透支额度）和一次J.P.摩根本人主持的私人晚宴邀请',
    effects: [
      { type: 'banking_empire', value: 0.22, description: '银行业收益+22%' },
      { type: 'merger_success', value: 0.2, description: '并购成功率+20%' },
      { type: 'capital_access', value: 0.15, description: '融资渠道+15%' },
      { type: 'crisis_bailout', value: 1, description: '金融危机时获得一次救助机会' },
    ],
    description: '金融世家的继承人之一，掌握着华尔街最隐秘的资金流向。',
    flavorText:
      '约瑟芬的父亲是J.P.摩根最信任的合伙人，掌握着摩根财团最核心的资本运作机密。约瑟芬从小在华尔街23号的豪华办公室里玩耍，看着无数企业的命运在谈判桌上被决定。她带来的VIP账户意味着你永远不必担心资金链断裂，而那场私人晚宴将让你接触到真正的金融权力核心。',
    specialEvent: 'J.P.摩根偶尔会通过约瑟芬传达「私人建议」，这些建议往往预示着市场的重大变动。',
  },
  {
    id: 'evelyn_rockefeller_e2',
    name: '伊芙琳·洛克菲勒',
    gender: 'female',
    rarity: 'legendary',
    era: 'second',
    icon: '💎',
    dowryRange: [100000, 200000],
    dowryBonus: '标准石油公司5%的原始股、全球石油定价委员会的一个席位和洛克菲勒家族百年石油帝国的联姻盟约',
    effects: [
      { type: 'oil_empire', value: 0.4, description: '石油投资收益+40%' },
      { type: 'market_control', value: 0.25, description: '市场控制力+25%' },
      { type: 'trust_bonus', value: 0.15, description: '托拉斯垄断收益+15%' },
      { type: 'global_access', value: 1, description: '解锁全球石油贸易网络' },
    ],
    description: '标准石油帝国的千金，世界上最富有的继承人之一。',
    flavorText:
      '伊芙琳的父亲约翰·洛克菲勒是这个星球上最富有的人，他控制着从油井到加油站的每一个环节。伊芙琳在第五大道的豪宅中长大，她的玩具马车镶着金边。但在这个黄金牢笼中长大的她，渴望找到一个不被她的姓氏吓倒的人。她带来的5%标准石油股份每年产生的分红超过多数企业一辈子的利润，而那个定价委员会席位意味着你可以参与决定全世界每一桶石油的价格。',
    specialEvent: '标准石油的反垄断诉讼中，伊芙琳可以动用家族影响力为你争取豁免或优先保护。',
  },
  {
    id: 'natasha_tesla_niece_e2',
    name: '娜塔莎·特斯拉',
    gender: 'female',
    rarity: 'legendary',
    era: 'second',
    icon: '🔮',
    dowryRange: [50000, 120000],
    dowryBonus: '尼古拉·特斯拉的全部未公开专利授权、沃登克里弗塔的设计蓝图和特斯拉实验室的参观权限',
    effects: [
      { type: 'innovation_boost', value: 0.5, description: '科技创新收益+50%' },
      { type: 'patent_income', value: 0.3, description: '专利授权收入+30%' },
      { type: 'future_tech', value: 0.2, description: '超前技术研发成功率+20%' },
      { type: 'electric_dominance', value: 0.15, description: '电气领域统治力+15%' },
    ],
    description: '天才发明家尼古拉·特斯拉的侄女，继承了叔叔那超越时代的科学梦想。',
    flavorText:
      '娜塔莎的叔叔尼古拉·特斯拉是这个时代最不可思议的天才，他的脑海中装着一个世纪后的科技。虽然特斯拉本人终身未婚，但他最疼爱的侄女娜塔莎继承了他所有的未公开研究。她带来的专利授权涵盖了从无线传输到远程能源的疯狂构想，而那座沃登克里弗塔的设计蓝图可能改变整个人类文明的能源格局。这是一桩赌上未来的婚姻。',
    specialEvent: '娜塔莎偶尔会触发「特斯拉的灵感」事件，随机解锁一项超时代技术的可能性。',
  },
];

export { ERA1_CANDIDATES, ERA2_CANDIDATES };
// ==================== 时代三：信息浪潮 (1920-2000) ====================

const ERA3_CANDIDATES: MarriageCandidate[] = [
  {
    id: 'lily_accountant_e3',
    name: '莉莉·张',
    gender: 'female',
    rarity: 'common',
    era: 'third',
    icon: '📊',
    dowryRange: [2000, 5000],
    dowryBonus: '一台最先进的电子计算器和一套完整的税务优化方案',
    effects: [
      { type: 'accounting_accuracy', value: 0.1, description: '财务核算精度+10%' },
      { type: 'tax_optimization', value: 0.08, description: '税务成本-8%' },
    ],
    description: '会计事务所所长的女儿，精通数字游戏和账目魔法。',
    flavorText:
      '莉莉的父亲是纽约华尔街附近一家著名会计事务所的创始人。在这个数字时代，会计不再只是打算盘——莉莉能用电子计算器在几分钟内完成过去需要一整个团队一整天才能做完的账目核对。她带来的税务优化方案能让你的合法税务负担降到最低，而审计人员永远找不到任何问题。',
  },
  {
    id: 'kate_secretary_e3',
    name: '凯特·威廉姆斯',
    gender: 'female',
    rarity: 'common',
    era: 'third',
    icon: '💼',
    dowryRange: [1500, 4000],
    dowryBonus: '一套IBM最新的电动打字机和一位经验丰富的高级秘书推荐信',
    effects: [
      { type: 'admin_efficiency', value: 0.12, description: '行政效率+12%' },
      { type: 'meeting_bonus', value: 0.08, description: '商务谈判成功率+8%' },
    ],
    description: '大企业CEO秘书的女儿，在董事会会议室的门外长大，熟悉权力运作的潜规则。',
    flavorText:
      '凯特的母亲是一家世界500强企业的首席秘书，她掌握着CEO的日程、知道每一次秘密会议的内容、甚至能在董事长开口之前递上他想要的文件。凯特继承了母亲那近乎超自然的组织能力——她知道如何在三个时区之间协调会议，如何在老板发火前化解危机。她带来的秘书推荐信意味着你也将拥有这样的「行政超能力」。',
  },
  {
    id: 'eileen_teacher_e3',
    name: '艾琳·高桥',
    gender: 'female',
    rarity: 'common',
    era: 'third',
    icon: '🎓',
    dowryRange: [1800, 4500],
    dowryBonus: '一套涵盖从幼儿园到大学教育的完整教育基金计划和一位哈佛教授的推荐信',
    effects: [
      { type: 'education_bonus', value: 0.1, description: '教育投资回报率+10%' },
      { type: 'heir_quality', value: 0.08, description: '继承人素质+8%' },
    ],
    description: '名校教授的女儿，坚信教育是打破阶层壁垒的唯一钥匙。',
    flavorText:
      '艾琳的父亲是哈佛商学院最早期的华裔教授之一，他的学生如今遍布华尔街。艾琳从小在学术氛围中长大，她知道什么时候应该鼓励孩子、什么时候应该严格要求。她带来的教育基金意味着你的每一个继承人都能接受最好的教育，而那封哈佛教授的推荐信则可能改变一个年轻人的一生。',
  },
  {
    id: 'vivian_programmer_e3',
    name: '薇薇安·陈',
    gender: 'female',
    rarity: 'rare',
    era: 'third',
    icon: '💻',
    dowryRange: [8000, 20000],
    dowryBonus: '一台IBM 360大型机的使用时段授权和一套自主研发的库存管理系统',
    effects: [
      { type: 'automation_bonus', value: 0.15, description: '自动化收益+15%' },
      { type: 'inventory_efficiency', value: 0.12, description: '库存管理效率+12%' },
      { type: 'data_processing', value: 0.1, description: '数据处理速度+10%' },
    ],
    description: '计算机先驱的女儿，在打孔卡片和磁带机的咔嗒声中长大。',
    flavorText:
      '薇薇安的父亲是IBM最早的一批系统程序员，他参与了第一台商用大型机的开发。薇薇安八岁就能写出简单的排序程序，十八岁已经能独立设计一套企业级库存管理系统。在那个大多数人还不知道「计算机」是什么的年代，她已经看到了自动化将彻底颠覆每一个行业的未来。她带来的库存管理系统能让你的仓储成本降低一半。',
    specialEvent: '薇薇安偶尔会开发出新的管理软件，触发一次性的全产业运营效率提升事件。',
  },
  {
    id: 'rachel_fund_e3',
    name: '瑞秋·高盛',
    gender: 'female',
    rarity: 'rare',
    era: 'third',
    icon: '📈',
    dowryRange: [10000, 25000],
    dowryBonus: '一份包含二十支潜力股票的精选投资组合和一位顶级股票分析师的人脉引荐',
    effects: [
      { type: 'stock_bonus', value: 0.18, description: '股票投资收益+18%' },
      { type: 'market_timing', value: 0.1, description: '市场时机把握+10%' },
      { type: 'portfolio_diversification', value: 0.08, description: '投资组合抗风险能力+8%' },
    ],
    description: '对冲基金经理的女儿，在K线图和财报分析的包围中长大。',
    flavorText:
      '瑞秋的父亲是华尔街最神秘的量化基金经理之一，他的基金在过去十年里从未亏损。瑞秋从小就能看懂资产负债表中的猫腻，能从季度财报的字里行间嗅出公司的真实状况。她带来的投资组合是她用父亲的方法论独立筛选出的——这些股票中的大多数将在未来几年暴涨十倍。',
    specialEvent: '瑞秋每个月都会提供一份「重点关注」清单，上面列出的投资机会往往有着异常高的回报率。',
  },
  {
    id: 'zoe_advertising_e3',
    name: '佐伊·奥格威',
    gender: 'female',
    rarity: 'rare',
    era: 'third',
    icon: '📺',
    dowryRange: [7000, 18000],
    dowryBonus: '一家顶级广告公司的创意总监团队三个月专属服务和一段黄金时段电视广告的播放合约',
    effects: [
      { type: 'brand_value', value: 0.15, description: '品牌价值提升速度+15%' },
      { type: 'marketing_roi', value: 0.12, description: '营销投资回报率+12%' },
      { type: 'consumer_loyalty', value: 0.1, description: '消费者忠诚度+10%' },
    ],
    description: '广告大师的女儿，深谙如何将一件商品变成人们心中的渴望。',
    flavorText:
      '佐伊的父亲是大卫·奥格威的学生，麦迪逊大道黄金时代最耀眼的创意总监之一。佐伊从小看着父亲团队将一瓶普通的洗发水变成「自信的象征」，将一辆普通的汽车变成「美国梦的载体」。她知道如何用三十秒的电视广告改变几百万人的消费决策。她带来的黄金时段广告合约将让你的品牌在一夜之间家喻户晓。',
    specialEvent: '佐伊偶尔能创造出「爆款广告」，触发一次性的产品销量暴涨事件。',
  },
  {
    id: 'fiona_silicon_e3',
    name: '菲奥娜·乔布斯',
    gender: 'female',
    rarity: 'epic',
    era: 'third',
    icon: '🍎',
    dowryRange: [30000, 60000],
    dowryBonus: '硅谷某未上市科技公司的15%创始股权和苹果创始人史蒂夫·沃兹尼亚克的私人友谊',
    effects: [
      { type: 'tech_startup_bonus', value: 0.25, description: '科技创业投资回报率+25%' },
      { type: 'innovation_speed', value: 0.2, description: '创新速度+20%' },
      { type: 'talent_recruitment', value: 0.15, description: '人才招募效率+15%' },
      { type: 'venture_capital', value: 0.12, description: '风险投资获取率+12%' },
    ],
    description: '硅谷新贵的女儿，在车库创业和风险投资的故事中长大。',
    flavorText:
      '菲奥娜的父亲是硅谷最早的天使投资人之一，他在惠普的车库时代就投资了惠普，在苹果的水果标志还只是一个草图时就成为了苹果的早期股东。菲奥娜在硅谷的泡沫与崛起中长大，她能一眼看出哪个程序员是下一个改变世界的创始人。她带来的科技公司股权和乔布斯的关系意味着你站在了个人电脑革命的风口浪尖。',
    specialEvent: '菲奥娜偶尔会引荐一位「 garage genius 」，投资后有机会获得百倍回报。',
  },
  {
    id: 'audrey_star_e3',
    name: '奥黛丽·梦露',
    gender: 'female',
    rarity: 'epic',
    era: 'third',
    icon: '🎬',
    dowryRange: [25000, 50000],
    dowryBonus: '好莱坞某顶级制片厂的股份、一张黄金时段综艺节目年度冠名权合约和一位奥斯卡导演的私人引荐',
    effects: [
      { type: 'entertainment_bonus', value: 0.22, description: '娱乐产业收益+22%' },
      { type: 'publicity_power', value: 0.2, description: '公众影响力+20%' },
      { type: 'brand_prestige', value: 0.15, description: '品牌声望提升速度+15%' },
      { type: 'global_recognition', value: 0.1, description: '全球知名度+10%' },
    ],
    description: '好莱坞黄金时代的巨星之女，美貌与才华并重，拥有让整个世界倾倒的魅力。',
    flavorText:
      '奥黛丽的母亲是这个星球上最知名的面孔之一，她的笑容印在亿万张海报上，她的每一次出场都会让整条街道瘫痪。奥黛丽继承了母亲的美貌，但她更渴望证明自己不只是「那个女人的女儿」。她带来的制片厂股份和冠名权意味着你的品牌将与好莱坞最耀眼的星光绑定在一起，而她的公众影响力可以让任何产品的销量在一夜之间翻倍。',
    specialEvent: '奥黛丽偶尔会出席你产品的发布会，触发一次性的品牌知名度飙升事件。',
  },
  {
    id: 'scarlett_media_e3',
    name: '斯嘉丽·默多克',
    gender: 'female',
    rarity: 'legendary',
    era: 'third',
    icon: '📰',
    dowryRange: [150000, 300000],
    dowryBonus: '全球媒体帝国的10%控股股份、数百家报纸电视台的编辑控制权和一个国家级别的舆论导向能力',
    effects: [
      { type: 'media_empire', value: 0.35, description: '媒体帝国收益+35%' },
      { type: 'public_opinion', value: 0.3, description: '舆论操控能力+30%' },
      { type: 'political_influence', value: 0.25, description: '政治影响力+25%' },
      { type: 'crisis_suppression', value: 0.2, description: '负面新闻压制能力+20%' },
    ],
    description: '传媒巨头的掌上明珠，掌握着塑造千万人认知的权力。',
    flavorText:
      '斯嘉丽的父亲是全球最大的媒体帝国的缔造者，从澳洲的偏远小镇出发，他建立起了一个横跨报纸、电视、电影和杂志的庞大王国。斯嘉丽从小就知道一条真理：谁控制了媒体，谁就控制了真相。她带来的媒体帝国股份意味着你的每一次商业行动都会得到最正面的报道，而你的竞争对手则可能在一篇负面报道中万劫不复。',
    specialEvent: '斯嘉丽可以在危机时刻发动「媒体封锁」，完全消除一次负面事件对你家族的冲击。',
  },
  {
    id: 'ellen_space_e3',
    name: '艾伦·阿姆斯特朗',
    gender: 'female',
    rarity: 'legendary',
    era: 'third',
    icon: '🚀',
    dowryRange: [80000, 180000],
    dowryBonus: 'NASA关键技术专利的民间授权、一家私人航天公司的全部股权和阿波罗计划工程师团队的核心成员名单',
    effects: [
      { type: 'aerospace_bonus', value: 0.3, description: '航天投资收益+30%' },
      { type: 'high_tech_boost', value: 0.25, description: '高科技产业全面增速+25%' },
      { type: 'defense_contract', value: 0.2, description: '国防合同获取率+20%' },
      { type: 'satellite_network', value: 1, description: '解锁全球通信卫星网络' },
    ],
    description: '登月英雄的女儿，血液中流淌着对星辰大海的渴望。',
    flavorText:
      '艾伦的父亲是第一个踏上月球的人。在他迈出那「一小步」的震撼时刻，全世界都屏住了呼吸。艾伦从小在航天中心和发射场长大，她最好的朋友都是火箭工程师和天体物理学家。她带来的NASA专利授权和航天公司意味着你的家族将参与人类历史上最昂贵也最荣耀的事业——太空探索。而当卫星网络环绕地球时，你将拥有通信领域的绝对霸权。',
    specialEvent: '艾伦偶尔会触发「航天突破」事件，解锁一项改变产业格局的航天应用技术。',
  },
];

// ==================== 时代四：智能纪元 (2000+) ====================

const ERA4_CANDIDATES: MarriageCandidate[] = [
  {
    id: 'maya_analyst_e4',
    name: '玛雅·陈',
    gender: 'female',
    rarity: 'common',
    era: 'fourth',
    icon: '📱',
    dowryRange: [3000, 8000],
    dowryBonus: '一套企业级商业智能分析软件的永久授权和一份大数据趋势预测报告',
    effects: [
      { type: 'data_driven_decision', value: 0.1, description: '数据驱动决策准确率+10%' },
      { type: 'market_prediction', value: 0.08, description: '市场预测准确度+8%' },
    ],
    description: '数据分析师的女儿，在这个信息爆炸的时代懂得如何让数据说话。',
    flavorText:
      '玛雅的父亲是硅谷一家独角兽企业的首席数据分析师，他能在PB级的数据中找出那个价值十亿美元的洞察。玛雅从小看着父亲用算法预测消费者的行为，用机器学习优化供应链。她带来的商业智能软件能将你所有的商业数据转化为可视化的决策依据——在这个时代，不懂数据的企业家就像盲人走在雷区。',
  },
  {
    id: 'luna_influencer_e4',
    name: '露娜·张',
    gender: 'female',
    rarity: 'common',
    era: 'fourth',
    icon: '🌙',
    dowryRange: [2500, 7000],
    dowryBonus: '一个拥有百万粉丝的社交媒体账号的年度商业推广权和一个MCN机构的独家合作协议',
    effects: [
      { type: 'social_media_marketing', value: 0.12, description: '社交媒体营销效果+12%' },
      { type: 'brand_viral_rate', value: 0.1, description: '品牌病毒传播率+10%' },
    ],
    description: '社交媒体红人的女儿，深谙流量经济的游戏规则。',
    flavorText:
      '露娜的母亲是社交媒体上最早期的「意见领袖」之一，她的一条推文能让一款产品在一小时内售罄。露娜在点赞、转发和直播的洪流中长大，她知道什么样的内容能在三秒钟内抓住人的眼球，什么样的梗能在一夜之间传遍全球。她带来的推广权意味着你的产品可以通过她的网络触达数百万潜在消费者。',
  },
  {
    id: 'ava_drone_e4',
    name: '艾娃·施密特',
    gender: 'female',
    rarity: 'common',
    era: 'fourth',
    icon: '🚁',
    dowryRange: [3500, 9000],
    dowryBonus: '一支由十架工业级无人机组成的物流飞行队和一套无人机调度管理系统',
    effects: [
      { type: 'logistics_speed', value: 0.1, description: '物流速度+10%' },
      { type: 'delivery_cost', value: 0.08, description: '配送成本-8%' },
    ],
    description: '无人机物流先驱的女儿，成长在螺旋桨的嗡嗡声和天空的广阔蓝图中。',
    flavorText:
      '艾娃的父亲是第一批尝试用无人机配送快递的创业者。当大多数人还在嘲笑「天上飞的快递」时，他已经在郊区建立起了第一个全自动空中配送网络。艾娃能操控无人机完成最复杂的编队飞行，知道如何用算法优化最后一公里的配送路线。她带来的无人机编队将让你的物流成本大幅降低，而速度则是竞争对手无法企及的优势。',
  },
  {
    id: 'chloe_vc_e4',
    name: '克洛伊·红杉',
    gender: 'female',
    rarity: 'rare',
    era: 'fourth',
    icon: '🦄',
    dowryRange: [15000, 35000],
    dowryBonus: '红杉资本的投资委员会观察席位和一份包含五十家种子期科技公司的内部评估报告',
    effects: [
      { type: 'startup_picking', value: 0.2, description: '早期投资命中率+20%' },
      { type: 'unicorn_rate', value: 0.15, description: '投出独角兽概率+15%' },
      { type: 'exit_multiple', value: 0.12, description: '退出估值倍数+12%' },
    ],
    description: '顶级风投家的女儿，在独角兽和IPO的故事中长大，眼光毒辣到可怕。',
    flavorText:
      '克洛伊的父亲是红杉资本最资深的合伙人之一，他投出了谷歌、苹果和思科。在硅谷，他的名字就是「点石成金」的代名词。克洛伊从小在董事会会议室和创业孵化器之间穿梭，她能在创业者的五分钟的pitch中判断出这个人是否能改变世界。她带来的评估报告涵盖了下一家可能爆发的「谷歌」——而你将是最早知道的人。',
    specialEvent: '克洛伊每个月都会分享一个「正在考虑」的投资标的，跟进投资往往有意想不到的收获。',
  },
  {
    id: 'elena_gene_e4',
    name: '艾琳娜·华生',
    gender: 'female',
    rarity: 'rare',
    era: 'fourth',
    icon: '🧬',
    dowryRange: [12000, 30000],
    dowryBonus: '一家基因测序公司的控股权和CRISPR基因编辑技术的非独家商业应用授权',
    effects: [
      { type: 'biotech_bonus', value: 0.18, description: '生物科技投资收益+18%' },
      { type: 'pharma_speed', value: 0.12, description: '药物研发周期缩短12%' },
      { type: 'patent_value', value: 0.1, description: '生物专利价值+10%' },
    ],
    description: '基因工程先驱的女儿，掌握着改写生命密码的技术。',
    flavorText:
      '艾琳娜的父亲是破解人类基因组计划的核心科学家之一。在那个人类第一次读懂自身「说明书」的历史性时刻，他就在实验室里。艾琳娜从小在显微镜和DNA测序仪之间长大，她相信基因技术将彻底改变人类对疾病、衰老甚至生命的理解。她带来的基因测序公司和CRISPR授权意味着你的家族站在了生命科学革命的最前沿。',
    specialEvent: '艾琳娜偶尔会触发「基因突破」事件，解锁一项具有颠覆性的生物技术应用。',
  },
  {
    id: 'naomi_blockchain_e4',
    name: '娜奥米·中本',
    gender: 'female',
    rarity: 'rare',
    era: 'fourth',
    icon: '⛓️',
    dowryRange: [10000, 28000],
    dowryBonus: '一套完整的区块链资产组合（包含早期比特币和以太坊）、一个去中心化金融协议的治理代币和一个加密货币矿场',
    effects: [
      { type: 'crypto_bonus', value: 0.2, description: '加密货币投资收益+20%' },
      { type: 'defi_yield', value: 0.15, description: '去中心化金融收益+15%' },
      { type: 'mining_output', value: 0.1, description: '矿场产出+10%' },
    ],
    description: '区块链世界的原住民，在这个去中心化的新金融秩序中游刃有余。',
    flavorText:
      '娜奥米的父亲是最早一批理解区块链革命性意义的人之一。当大多数人还在争论比特币是不是骗局时，他已经建立起了横跨三大洲的挖矿农场。娜奥米相信代码即法律、去中心化即自由。她带来的加密资产组合价值连城——那些早期的比特币和以太坊在最初只值几美元，如今每一枚都足以买下一座豪宅。',
    specialEvent: '娜奥米偶尔会预警「市场波动」，提前调整加密资产配置可以规避巨额损失或锁定暴利。',
  },
  {
    id: 'selena_ai_e4',
    name: '赛琳娜·图灵',
    gender: 'female',
    rarity: 'epic',
    era: 'fourth',
    icon: '🤖',
    dowryRange: [50000, 100000],
    dowryBonus: '一家人工智能独角兽公司20%的股权、GPT早期架构的衍生技术专利和一个由顶尖AI科学家组成的技术顾问团',
    effects: [
      { type: 'ai_bonus', value: 0.3, description: 'AI相关投资收益+30%' },
      { type: 'automation_level', value: 0.25, description: '全产业自动化程度+25%' },
      { type: 'decision_intelligence', value: 0.2, description: 'AI辅助决策准确率+20%' },
      { type: 'talent_magnet', value: 0.15, description: '顶级AI人才吸引力+15%' },
    ],
    description: 'AI巨头的女儿，在神经网络和深度学习的浪潮中长大。',
    flavorText:
      '赛琳娜的父亲是当今世界上最具影响力的AI公司创始人之一。从最初的小车库到如今的科技帝国，他让机器第一次「理解」了人类的语言。赛琳娜从小看着父亲训练第一个能识别猫的神经网络，她深信人工智能将重新定义每一个行业的边界。她带来的公司股权和技术顾问团意味着你的家族将直接参与这场比工业革命更深刻的技术变革。',
    specialEvent: '赛琳娜偶尔会触发「AI觉醒」事件，解锁一项足以颠覆现有产业格局的人工智能应用。',
  },
  {
    id: 'asha_energy_e4',
    name: '艾莎·马斯克',
    gender: 'female',
    rarity: 'epic',
    era: 'fourth',
    icon: '☀️',
    dowryRange: [40000, 85000],
    dowryBonus: '一家太阳能巨头的区域垄断经营权、一整套下一代电池技术的专利组合和一个全球清洁能源供应链的优先接入权',
    effects: [
      { type: 'clean_energy_bonus', value: 0.25, description: '清洁能源投资收益+25%' },
      { type: 'carbon_credit', value: 0.15, description: '碳积分交易收益+15%' },
      { type: 'energy_storage', value: 0.12, description: '储能技术成本-12%' },
      { type: 'government_subsidy', value: 0.2, description: '政府清洁能源补贴获取率+20%' },
    ],
    description: '清洁能源帝国的继承人，相信商业可以成为拯救地球的力量。',
    flavorText:
      '艾莎的父亲是清洁能源革命的先驱，他证明了可持续发展和巨额利润并不矛盾。从第一块太阳能板到覆盖半个国家的光伏电站，他建立起了一个属于新能源的帝国。艾莎在「拯救地球」和「赚很多钱」之间看不到任何矛盾。她带来的太阳能垄断经营权和电池专利意味着你的家族将在化石能源退出历史舞台的过程中获得前所未有的机会。',
    specialEvent: '每当有新的环保法规出台，艾莎都能提前获得政策动向，让你抢在所有人之前布局清洁能源。',
  },
  {
    id: 'evelyn_tech_empress_e4',
    name: '伊芙琳·库克',
    gender: 'female',
    rarity: 'legendary',
    era: 'fourth',
    icon: '👑',
    dowryRange: [300000, 600000],
    dowryBonus: '全球科技帝国12%的控股股份、苹果+谷歌+微软+亚马逊的联合供应商优先权和一个由科技巨头CEO组成的私人顾问委员会席位',
    effects: [
      { type: 'tech_empire', value: 0.4, description: '科技产业全面收益+40%' },
      { type: 'ecosystem_dominance', value: 0.3, description: '生态系统控制力+30%' },
      { type: 'global_reach', value: 0.25, description: '全球市场触达率+25%' },
      { type: 'platform_monopoly', value: 0.2, description: '平台垄断收益+20%' },
    ],
    description: '科技帝国的正统继承人，拥有让整个世界为之震颤的商业血统。',
    flavorText:
      '伊芙琳的父亲是全球市值最高科技公司的创始人兼CEO，他的产品存在于地球上三分之二人口的口袋里。伊芙琳从小在无限可能的科技乌托邦中长大，她的玩伴是全世界最聪明的一群人。她带来的帝国股份意味着你将成为科技世界权力结构的一部分——那些决定数十亿人生活方式的人将把你视为圈内人。这是一个跨越时代的联姻，它将把两个家族的姓氏刻进人类文明的数字基石。',
    specialEvent: '伊芙琳可以在关键时刻召集「巨头峰会」，联合其他科技巨头发起对你的竞争对手的行业围剿。',
  },
  {
    id: 'victoria_biotech_queen_e4',
    name: '维多利亚·弗兰克林',
    gender: 'female',
    rarity: 'legendary',
    era: 'fourth',
    icon: '🧪',
    dowryRange: [200000, 450000],
    dowryBonus: '一家生物科技巨头的全资控股权、诺贝尔奖得主的基因编辑团队和一个覆盖全球的医疗数据网络',
    effects: [
      { type: 'biotech_empire', value: 0.35, description: '生物科技帝国收益+35%' },
      { type: 'lifespan_tech', value: 0.3, description: '延寿技术突破概率+30%' },
      { type: 'pharma_dominance', value: 0.25, description: '制药市场统治力+25%' },
      { type: 'healthcare_monopoly', value: 0.2, description: '医疗垄断收益+20%' },
    ],
    description: '生物科技女王之女，掌握着生命本身最深层的商业密码。',
    flavorText:
      '维多利亚的母亲是生物科技时代最传奇的女性企业家，她从一间小小的实验室起步，建立起了一个能决定谁能活下去、谁必须死去的庞大帝国。维多利亚相信，在21世纪，控制生命科学的权力比控制石油的权力更加根本。她带来的生物科技巨头和基因编辑团队意味着你的家族将直接参与改写人类生命规则的进程——而这正是这个星球上最昂贵也最强大的权力。',
    specialEvent: '维多利亚偶尔会触发「生命突破」事件，解锁一项足以改变人类社会的生物技术创新。',
  },
];

// ==================== 合并所有时代数据 ====================

export const ALL_MARRIAGE_CANDIDATES: MarriageCandidate[] = [
  ...ERA1_CANDIDATES,
  ...ERA2_CANDIDATES,
  ...ERA3_CANDIDATES,
  ...ERA4_CANDIDATES,
];

/** 获取所有联姻对象 */
export function getAllMarriageCandidates(): MarriageCandidate[] {
  return [...ALL_MARRIAGE_CANDIDATES];
}

/** 根据ID获取联姻对象 */
export function getMarriageCandidateById(
  id: string
): MarriageCandidate | undefined {
  return ALL_MARRIAGE_CANDIDATES.find((c) => c.id === id);
}

/** 根据时代获取联姻池 */
export function getMarriageCandidatesByEra(
  era: 'first' | 'second' | 'third' | 'fourth'
): MarriageCandidate[] {
  return ALL_MARRIAGE_CANDIDATES.filter((c) => c.era === era);
}

/** 根据品质筛选联姻对象 */
export function getMarriageCandidatesByRarity(
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
): MarriageCandidate[] {
  return ALL_MARRIAGE_CANDIDATES.filter((c) => c.rarity === rarity);
}

/** 获取特定时代特定品质的联姻对象列表 */
export function getMarriageCandidatesByEraAndRarity(
  era: 'first' | 'second' | 'third' | 'fourth',
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
): MarriageCandidate[] {
  return ALL_MARRIAGE_CANDIDATES.filter(
    (c) => c.era === era && c.rarity === rarity
  );
}

/** 按嫁妆金额范围排序 */
export function getMarriageCandidatesByDowry(
  order: 'asc' | 'desc' = 'desc'
): MarriageCandidate[] {
  const sorted = [...ALL_MARRIAGE_CANDIDATES].sort(
    (a, b) => b.dowryRange[1] - a.dowryRange[1]
  );
  return order === 'asc' ? sorted.reverse() : sorted;
}

/** 品质概率权重配置（用于随机抽取） */
export const RARITY_WEIGHTS: Record<string, number> = {
  common: 50,
  rare: 30,
  epic: 15,
  legendary: 5,
};

/** 品质中文映射 */
export function getRarityLabel(rarity: MarriageCandidate['rarity']): string {
  const map: Record<string, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };
  return map[rarity] ?? rarity;
}

/** 品质颜色映射 */
export function getRarityColor(rarity: MarriageCandidate['rarity']): string {
  const map: Record<string, string> = {
    common: '#95a5a6',
    rare: '#3498db',
    epic: '#9b59b6',
    legendary: '#f1c40f',
  };
  return map[rarity] ?? '#95a5a6';
}

/** 时代中文映射 */
export function getEraLabel(era: MarriageCandidate['era']): string {
  const map: Record<string, string> = {
    first: '蒸汽纪元',
    second: '电气钢铁',
    third: '信息浪潮',
    fourth: '智能纪元',
  };
  return map[era] ?? era;
}

/** 统计各时代各品质数量（用于校验数据完整性） */
export function getMarriageStats(): Record<
  string,
  Record<string, number>
> {
  const stats: Record<string, Record<string, number>> = {};
  for (const c of ALL_MARRIAGE_CANDIDATES) {
    if (!stats[c.era]) stats[c.era] = {};
    stats[c.era][c.rarity] = (stats[c.era][c.rarity] ?? 0) + 1;
  }
  return stats;
}
