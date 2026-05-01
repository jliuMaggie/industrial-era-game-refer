/** 继承人天赋数据定义
 * 描述家族继承人可能携带的先天或后天天赋
 * 品质分布概率：普通40%、稀有30%、史诗20%、传说10%
 * 每个时代都有时代特色的天赋池
 * 共37个天赋：12普通 + 9稀有 + 6史诗 + 4传说 + 6负面
 */

export interface HeirTalent {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  description: string;
  flavorText: string;
  effects: { type: string; value: number }[];
  inheritMultiplier: number;
  inheritLine: string;
  warning?: string;
}

// ==================== 普通天赋 (12个，每时代3个) ====================

const COMMON_TALENTS: HeirTalent[] = [
  // --- 时代一：蒸汽纪元 ---
  {
    id: 'merchants_son_e1',
    name: '商人之子',
    rarity: 'common',
    icon: '📦',
    description: '从小在商铺中长大，对买卖有着朴素的直觉。',
    flavorText: '他在柜台后面学会了人生的第一课：低买高卖。虽然没有什么惊天动地的才能，但那份踏实和勤勉，足以守住父辈留下的基业。',
    effects: [
      { type: 'trade_income', value: 0.05 },
      { type: 'shop_efficiency', value: 0.03 },
    ],
    inheritMultiplier: 1.0,
    inheritLine: '父亲，我会守住这家店铺的。',
  },
  {
    id: 'honest_man_e1',
    name: '老实人',
    rarity: 'common',
    icon: '😐',
    description: '诚实可靠，不会耍心眼，但有时容易吃亏。',
    flavorText: '在这个尔虞我诈的商场里，他的诚实像一块顽固的石头。人们信任他，竞争对手也敬重他——虽然偶尔会有人利用这份诚实。',
    effects: [
      { type: 'reputation_gain', value: 0.08 },
      { type: 'fraud_loss', value: -0.05 },
    ],
    inheritMultiplier: 0.95,
    inheritLine: '我只赚该赚的钱，父亲。',
  },
  {
    id: 'ordinary_person_e1',
    name: '普通人',
    rarity: 'common',
    icon: '🙂',
    description: '没有任何特别的天赋，但也没有任何明显的短板。',
    flavorText: '他不是天才，也不是蠢材。他就像千千万万普通人中的一员，有着平凡的梦想和踏实的步伐。有时候，平凡本身就是一种福气。',
    effects: [
      { type: 'all_income', value: 0.02 },
    ],
    inheritMultiplier: 1.0,
    inheritLine: '我会尽力而为的，父亲。',
  },
  // --- 时代二：电气钢铁 ---
  {
    id: 'diligent_apprentice_e2',
    name: '勤奋学徒',
    rarity: 'common',
    icon: '🔨',
    description: '从基层做起，在车间和办公室之间积累了扎实的经验。',
    flavorText: '他的双手磨出了茧子，他的笔记本记满了每一个技术细节。在这个需要实干家的时代，勤奋比天赋更加可靠。',
    effects: [
      { type: 'factory_output', value: 0.06 },
      { type: 'worker_morale', value: 0.04 },
    ],
    inheritMultiplier: 1.02,
    inheritLine: '我知道每一台机器是怎么运转的，父亲。',
  },
  {
    id: 'foreman_e2',
    name: '车间工头',
    rarity: 'common',
    icon: '📋',
    description: '擅长管理生产线和调度工人，是工厂运转的中坚力量。',
    flavorText: '他记得每一个工人的名字，知道哪台机器需要润滑，哪条流水线需要调整。工人们服他，因为他在车间里比任何人都待得更久。',
    effects: [
      { type: 'production_efficiency', value: 0.05 },
      { type: 'labor_cost', value: -0.03 },
    ],
    inheritMultiplier: 1.0,
    inheritLine: '工人们会听我的，父亲。',
  },
  {
    id: 'bookkeeper_e2',
    name: '记账员',
    rarity: 'common',
    icon: '📒',
    description: '精通复式记账法，能确保每一分钱都有来龙去脉。',
    flavorText: '在钢铁与石油的轰鸣声中，他守护着家族最脆弱的命脉——账目。当所有人都在追逐利润时，他默默地确保数字不会撒谎。',
    effects: [
      { type: 'accounting_accuracy', value: 0.1 },
      { type: 'expense_control', value: 0.04 },
    ],
    inheritMultiplier: 1.0,
    inheritLine: '账本上的每一个数字我都记得，父亲。',
  },
  // --- 时代三：信息浪潮 ---
  {
    id: 'office_newbie_e3',
    name: '白领新人',
    rarity: 'common',
    icon: '👔',
    description: '刚刚踏入现代企业体系，正在学习这个时代的商业规则。',
    flavorText: '他穿着人生中第一套西装，手里拿着第一台电子计算器。在这个由数据驱动的世界里，他是最典型的「组织人」。',
    effects: [
      { type: 'corporate_bonus', value: 0.05 },
      { type: 'admin_efficiency', value: 0.03 },
    ],
    inheritMultiplier: 1.0,
    inheritLine: '我会努力适应这个新世界的，父亲。',
  },
  {
    id: 'coder_apprentice_e3',
    name: '程序员学徒',
    rarity: 'common',
    icon: '⌨️',
    description: '刚开始学习编程，能用代码解决一些基础的商业问题。',
    flavorText: '他在打孔卡片和终端屏幕之间找到了自己的位置。虽然还写不出改变世界的程序，但他已经能让计算机为家族企业做一些简单的计算。',
    effects: [
      { type: 'automation_bonus', value: 0.04 },
      { type: 'data_processing', value: 0.05 },
    ],
    inheritMultiplier: 1.0,
    inheritLine: '代码会替我工作的，父亲。',
  },
  {
    id: 'salesman_e3',
    name: '销售员',
    rarity: 'common',
    icon: '📞',
    description: '拥有三寸不烂之舌，能把产品卖给不需要的人。',
    flavorText: '他的电话簿上有上千个号码，他认识每一个客户的妻子和孩子的名字。在这个消费主义兴起的时代，他就是家族最好的商业武器。',
    effects: [
      { type: 'sales_conversion', value: 0.08 },
      { type: 'customer_retention', value: 0.04 },
    ],
    inheritMultiplier: 1.0,
    inheritLine: '没有我卖不出去的东西，父亲。',
  },
  // --- 时代四：智能纪元 ---
  {
    id: 'data_novice_e4',
    name: '数据新手',
    rarity: 'common',
    icon: '📊',
    description: '刚开始接触大数据分析，对数字世界有着朴素的热情。',
    flavorText: '他下载了人生第一个数据分析APP，学会了制作第一张电子表格。在这个算法统治一切的时代，他是最普通的数字化原住民。',
    effects: [
      { type: 'data_driven_bonus', value: 0.04 },
      { type: 'market_insight', value: 0.03 },
    ],
    inheritMultiplier: 1.0,
    inheritLine: '数据会告诉我们答案的，父亲。',
  },
  {
    id: 'content_creator_e4',
    name: '自媒体人',
    rarity: 'common',
    icon: '📱',
    description: '擅长在社交媒体上传播内容，懂得流量的基本规律。',
    flavorText: '他发布的每一条推文都能获得几百个点赞，他的直播间里有稳定的观众。在这个注意力经济时代，他知道如何让人停下来看一眼。',
    effects: [
      { type: 'brand_awareness', value: 0.06 },
      { type: 'viral_chance', value: 0.03 },
    ],
    inheritMultiplier: 1.0,
    inheritLine: '大家会喜欢我们的故事的，父亲。',
  },
  {
    id: 'logistics_specialist_e4',
    name: '物流专员',
    rarity: 'common',
    icon: '📦',
    description: '熟悉现代物流体系，能确保货物准时到达每一个目的地。',
    flavorText: '他在GPS和条形码之间运筹帷幄，知道哪条路最快、哪个仓库最空。在这个万物互联的时代，他让家族的商流运转如丝般顺滑。',
    effects: [
      { type: 'logistics_speed', value: 0.05 },
      { type: 'shipping_cost', value: -0.04 },
    ],
    inheritMultiplier: 1.0,
    inheritLine: '包裹一定会准时到达的，父亲。',
  },
];

// ==================== 稀有天赋 (9个) ====================

const RARE_TALENTS: HeirTalent[] = [
  // --- 时代一 ---
  {
    id: 'business_wizard_e1',
    name: '商业奇才',
    rarity: 'rare',
    icon: '💡',
    description: '天生具备敏锐的商业嗅觉，能在复杂的交易中发现别人看不见的商机。',
    flavorText: '他第一次参加集市贸易就赚了三倍利润。商人们说他被财神亲吻过额头，但他只是比任何人都更早看懂了供需之间的那条缝隙。',
    effects: [
      { type: 'trade_profit', value: 0.15 },
      { type: 'negotiation_bonus', value: 0.1 },
      { type: 'market_opportunity', value: 0.08 },
    ],
    inheritMultiplier: 1.15,
    inheritLine: '我看到了一条别人还没发现的路，父亲。',
  },
  {
    id: 'math_genius_e1',
    name: '数学天才',
    rarity: 'rare',
    icon: '🧮',
    description: '拥有超凡的数学天赋，能在脑中完成复杂的财务计算。',
    flavorText: '他能在一分钟内算出复利二十年的精确结果，能从一堆杂乱的账目中发现那个被精心隐藏的舞弊。数字对他来说是另一种语言——而他精通这种语言。',
    effects: [
      { type: 'financial_accuracy', value: 0.2 },
      { type: 'investment_return', value: 0.08 },
      { type: 'fraud_detection', value: 0.12 },
    ],
    inheritMultiplier: 1.12,
    inheritLine: '数字不会说谎，父亲。',
  },
  // --- 时代二 ---
  {
    id: 'engineering_intuition_e2',
    name: '工程直觉',
    rarity: 'rare',
    icon: '⚙️',
    description: '对机械和工程有着近乎本能的理解，能一眼看出生产流程中的瓶颈。',
    flavorText: '他第一次走进工厂就指出了那条让产量损失20%的隐蔽瓶颈。工程师们花了三个月都没找到的问题，他三分钟就解决了。',
    effects: [
      { type: 'factory_efficiency', value: 0.18 },
      { type: 'maintenance_cost', value: -0.1 },
      { type: 'upgrade_speed', value: 0.12 },
    ],
    inheritMultiplier: 1.18,
    inheritLine: '这机器哪里不对，我一眼就能看出来，父亲。',
  },
  {
    id: 'oil_nose_e2',
    name: '石油嗅觉',
    rarity: 'rare',
    icon: '🛢️',
    description: '对地质和石油分布有着神秘的天赋，能凭直觉判断哪里地下藏着黑金。',
    flavorText: '有人说是迷信，有人说是地质学的最高境界。无论如何，当他指着一片荒芜的土地说「下面有石油」时，钻头应该立刻跟上。',
    effects: [
      { type: 'oil_discovery_rate', value: 0.25 },
      { type: 'drilling_success', value: 0.15 },
      { type: 'oil_field_value', value: 0.1 },
    ],
    inheritMultiplier: 1.15,
    inheritLine: '我闻到了，下面有石油，父亲。',
  },
  // --- 时代三 ---
  {
    id: 'finance_prodigy_e3',
    name: '金融新秀',
    rarity: 'rare',
    icon: '📈',
    description: '对金融市场有着天生的敏感，能在K线图中读出市场的呼吸。',
    flavorText: '当别人还在看财报时，他已经从股价波动中读出了管理层的焦虑。当别人恐慌抛售时，他已经建仓完毕。华尔街说他太年轻——但他们追不上他的回报。',
    effects: [
      { type: 'stock_return', value: 0.2 },
      { type: 'market_timing', value: 0.15 },
      { type: 'risk_assessment', value: 0.1 },
    ],
    inheritMultiplier: 1.2,
    inheritLine: '市场在说话，父亲，您听到了吗？',
  },
  {
    id: 'coding_master_e3',
    name: '编程高手',
    rarity: 'rare',
    icon: '💻',
    description: '代码在他手中如同音符，能编写出改变商业规则的软件。',
    flavorText: '他能用三百行代码替代三十个人的工作。在这个数字化浪潮席卷一切的时代，他就是家族最强大的技术武器。',
    effects: [
      { type: 'software_profit', value: 0.18 },
      { type: 'automation_speed', value: 0.15 },
      { type: 'tech_adoption', value: 0.12 },
    ],
    inheritMultiplier: 1.15,
    inheritLine: '给我一台电脑，我能重写规则，父亲。',
  },
  // --- 时代四 ---
  {
    id: 'algorithm_expert_e4',
    name: '算法专家',
    rarity: 'rare',
    icon: '🤖',
    description: '精通机器学习和数据算法，能用人工智能优化每一个商业决策。',
    flavorText: '他训练的预测模型比人类分析师准确三倍。在这个算法决定一切的时代，他的存在本身就是家族最大的竞争优势。',
    effects: [
      { type: 'ai_efficiency', value: 0.22 },
      { type: 'prediction_accuracy', value: 0.18 },
      { type: 'decision_speed', value: 0.12 },
    ],
    inheritMultiplier: 1.22,
    inheritLine: 'AI告诉我，下一步应该这样走，父亲。',
  },
  {
    id: 'investment_star_e4',
    name: '投资新星',
    rarity: 'rare',
    icon: '⭐',
    description: '在风投和私募领域崭露头角，眼光独到到令人恐惧。',
    flavorText: '他投的每一轮种子轮都在下一轮翻倍。在这个创业泡沫与机遇并存的时代，他是家族最锋利的投资之刃。',
    effects: [
      { type: 'venture_return', value: 0.25 },
      { type: 'unicorn_spotting', value: 0.15 },
      { type: 'exit_timing', value: 0.12 },
    ],
    inheritMultiplier: 1.2,
    inheritLine: '下一个独角兽，我已经找到了，父亲。',
  },
  {
    id: 'network_builder_e3',
    name: '人脉构建者',
    rarity: 'rare',
    icon: '🌐',
    description: '天生具有建立人际网络的天赋，认识各行各业的关键人物。',
    flavorText: '他的名片夹里有议员、记者、银行家和黑帮老大的号码。在这个关系即权力的时代，他的通讯录本身就是一座金矿。',
    effects: [
      { type: 'connection_gain', value: 0.2 },
      { type: 'deal_closure_rate', value: 0.1 },
      { type: 'information_access', value: 0.15 },
    ],
    inheritMultiplier: 1.1,
    inheritLine: '我认识能帮我们的人，父亲。',
  },
];

// ==================== 史诗天赋 (6个) ====================

const EPIC_TALENTS: HeirTalent[] = [
  {
    id: 'finance_tycoon_e1',
    name: '金融大亨',
    rarity: 'epic',
    icon: '🏦',
    description: '天生的金融霸主，能在货币市场翻云覆雨。',
    flavorText: '他十二岁就用自己的压岁钱在股市中赚到了第一桶金。二十岁时，他已经能让整个城市的银行家们为之侧目。有人说他是罗斯柴尔德转世——虽然这可能只是恭维，但他的确拥有让财富呈指数增长的可怕能力。',
    effects: [
      { type: 'banking_profit', value: 0.3 },
      { type: 'currency_trading', value: 0.25 },
      { type: 'interest_leverage', value: 0.2 },
      { type: 'crisis_profit', value: 0.15 },
    ],
    inheritMultiplier: 1.3,
    inheritLine: '父亲，我要让这个家族的财富翻十倍。',
  },
  {
    id: 'industrial_titan_e2',
    name: '工业巨子',
    rarity: 'epic',
    icon: '🏭',
    description: '拥有统治工业帝国的气魄与能力，工厂在他手中如同精密运转的钟表。',
    flavorText: '他接管的第一座工厂在一年内产能翻了三倍。他裁掉了冗余的管理层，用工程师取代官僚。工人们恨他的严厉，但更爱那翻倍的工资。在他三十岁时，媒体已经开始用「钢铁大王第二」来称呼他。',
    effects: [
      { type: 'industrial_profit', value: 0.3 },
      { type: 'factory_capacity', value: 0.25 },
      { type: 'supply_chain_control', value: 0.2 },
      { type: 'labor_productivity', value: 0.15 },
    ],
    inheritMultiplier: 1.35,
    inheritLine: '我要建造世界上最大的工厂，父亲。',
  },
  {
    id: 'visionary_e3',
    name: '远见者',
    rarity: 'epic',
    icon: '🔮',
    description: '能看到常人看不见的远方，在商业变革到来之前就做好准备。',
    flavorText: '他在个人电脑还是玩具的时候就预见到了它改变世界的可能。当所有人都在嘲笑他的「疯狂构想」时，他已经买下了那片未来最值钱的土地。他不是算命先生——他只是比任何人都看得更远。',
    effects: [
      { type: 'early_adoption_bonus', value: 0.35 },
      { type: 'trend_prediction', value: 0.3 },
      { type: 'strategic_positioning', value: 0.2 },
      { type: 'pioneer_profit', value: 0.15 },
    ],
    inheritMultiplier: 1.4,
    inheritLine: '父亲，我已经看到了二十年后的世界。',
  },
  {
    id: 'ai_pioneer_e4',
    name: 'AI先驱',
    rarity: 'epic',
    icon: '🧠',
    description: '站在人工智能革命的最前沿，掌握着定义未来的技术力量。',
    flavorText: '他在AlphaGo击败李世石的那一天就明白：一个新时代已经到来。他不再只是把AI当作工具——他在思考如何让AI重新定义商业、社会和人类本身。在他手中，算法不仅是赚钱的机器，更是塑造未来的刻刀。',
    effects: [
      { type: 'ai_revenue', value: 0.35 },
      { type: 'tech_disruption', value: 0.3 },
      { type: 'automation_empire', value: 0.25 },
      { type: 'future_tech_access', value: 0.2 },
    ],
    inheritMultiplier: 1.45,
    inheritLine: '父亲，我们要用AI重写这个世界的规则。',
  },
  {
    id: 'energy_mogul_e4',
    name: '能源霸主',
    rarity: 'epic',
    icon: '⚡',
    description: '掌控着新旧能源交替时代的命脉，从石油到太阳能都是他的棋盘。',
    flavorText: '当别人还在为石油枯竭而恐慌时，他已经布局了全球可再生能源网络。他的能源帝国横跨化石燃料和清洁能源，无论世界走向何方，他都已经站在了胜利的一边。',
    effects: [
      { type: 'energy_profit', value: 0.3 },
      { type: 'transition_bonus', value: 0.25 },
      { type: 'grid_dominance', value: 0.2 },
      { type: 'carbon_credit_profit', value: 0.15 },
    ],
    inheritMultiplier: 1.35,
    inheritLine: '能源就是权力，父亲，我要掌控它。',
  },
  {
    id: 'media_magnate_e3',
    name: '传媒巨子',
    rarity: 'epic',
    icon: '📺',
    description: '拥有塑造公众认知的力量，能让整个社会的目光转向你想让他们看的方向。',
    flavorText: '他不生产产品——他生产欲望。一条由他策划的广告能让数百万人在一夜之间排队购买；一个由他导演的新闻故事能改变选举的结果。在这个注意力即货币的时代，他就是家族最不可估量的软实力。',
    effects: [
      { type: 'media_revenue', value: 0.3 },
      { type: 'public_influence', value: 0.25 },
      { type: 'brand_power', value: 0.2 },
      { type: 'crisis_pr_management', value: 0.15 },
    ],
    inheritMultiplier: 1.3,
    inheritLine: '我会让全世界都记住我们的名字，父亲。',
  },
];

// ==================== 传说天赋 (4个) ====================

const LEGENDARY_TALENTS: HeirTalent[] = [
  {
    id: 'business_napoleon',
    name: '商业拿破仑',
    rarity: 'legendary',
    icon: '👑',
    description: '拥有征服商业世界的雄心与手段，如同拿破仑征服欧洲般横扫每一个市场。',
    flavorText: '他二十岁时从父亲手中接过家族生意，三十岁时已经建立起横跨三大洲的商业帝国。他的竞争对手不是在谈判桌上被收购，就是在法庭上被击垮。商业记者说他「没有道德底线」，但投资者说他是「这个时代最伟大的商业天才」。',
    effects: [
      { type: 'all_business_profit', value: 0.4 },
      { type: 'acquisition_success', value: 0.35 },
      { type: 'market_conquest', value: 0.3 },
      { type: 'competitor_elimination', value: 0.25 },
      { type: 'empire_building', value: 0.2 },
    ],
    inheritMultiplier: 1.8,
    inheritLine: '父亲，这不是生意——这是战争，而我生来就是为了征服。',
  },
  {
    id: 'father_of_industry',
    name: '工业之父',
    rarity: 'legendary',
    icon: '⚒️',
    description: '注定要开创一个工业时代，他的工厂将定义一个世纪的工业标准。',
    flavorText: '他建造的工厂是这个星球上最先进的，他设计的生产流程被全世界的商学院当作教科书。工人们爱戴他——不是因为他的仁慈，而是因为他让他们的工资比同行高出三倍。在他去世时，半个国家的工厂都降半旗致哀。',
    effects: [
      { type: 'industrial_dominance', value: 0.45 },
      { type: 'production_revolution', value: 0.4 },
      { type: 'worker_loyalty', value: 0.35 },
      { type: 'standard_setting', value: 0.3 },
      { type: 'legacy_profit', value: 0.2 },
    ],
    inheritMultiplier: 1.75,
    inheritLine: '我要让全世界都用我们工厂生产的东西，父亲。',
  },
  {
    id: 'godfather_of_finance',
    name: '金融教父',
    rarity: 'legendary',
    icon: '🎩',
    description: '掌握着货币与资本的终极秘密，能让整个金融系统为己所用。',
    flavorText: '他从不亲自出面——但每一次金融危机背后都有他的影子。中央银行行长是他的学生，华尔街巨头是他的门徒。有人说他是这个世界的「影子财政部长」，因为当真正的财政部长还在开会讨论时，他已经用三通电话决定了市场的走向。',
    effects: [
      { type: 'financial_empire', value: 0.5 },
      { type: 'market_manipulation', value: 0.4 },
      { type: 'capital_control', value: 0.35 },
      { type: 'crisis_profit', value: 0.3 },
      { type: 'banking_dominance', value: 0.25 },
    ],
    inheritMultiplier: 1.8,
    inheritLine: '父亲，金钱只是工具——我要控制的是整个系统。',
  },
  {
    id: 'prophet_of_tech',
    name: '科技先知',
    rarity: 'legendary',
    icon: '🚀',
    description: '拥有预见技术变革的上帝视角，每一次技术浪潮到来之前他已经在浪尖等候。',
    flavorText: '他在互联网还是军方的内部项目时就预见到了它的商业潜力。他在智能手机还是科幻概念时就已经画好了设计图。当全世界都在追赶今天的技术时，他已经在投资明天的梦想。他不是发明家——他是那个知道该在什么时候投资什么发明家的人。',
    effects: [
      { type: 'tech_empire', value: 0.5 },
      { type: 'innovation_speed', value: 0.45 },
      { type: 'disruption_creation', value: 0.4 },
      { type: 'future_monopoly', value: 0.35 },
      { type: 'technological_immortality', value: 0.2 },
    ],
    inheritMultiplier: 2.0,
    inheritLine: '父亲，我不是在看未来——我是在创造未来。',
  },
];

// ==================== 负面天赋 (6个) ====================

const NEGATIVE_TALENTS: HeirTalent[] = [
  {
    id: 'prodigal_son_e1',
    name: '败家子',
    rarity: 'common',
    icon: '💸',
    description: '挥霍无度，对金钱没有任何概念。',
    flavorText: '他把家族的银子当成流水，在赌桌上一夜之间输掉父亲一年的利润。最可怕的不是他的浪费——而是他真心相信自己「只是运气不好」。',
    effects: [
      { type: 'all_income', value: -0.15 },
      { type: 'expense_increase', value: 0.2 },
      { type: 'gambling_loss', value: 0.15 },
    ],
    inheritMultiplier: 0.6,
    inheritLine: '父亲，再给我一次机会……',
    warning: '⚠️ 此继承人携带负面天赋，可能导致家族资产大幅缩水。建议在继承前进行「驯化教育」或考虑跳过继承。',
  },
  {
    id: 'gambler_e2',
    name: '赌徒',
    rarity: 'common',
    icon: '🎲',
    description: '沉迷投机，总是试图用最大的赌注换取最刺激的回报。',
    flavorText: '他的口头禅是「要么翻倍，要么归零」。问题是，大多数时候结果都是归零。他偶尔会赢一次大的——但那只会让下一次输得更惨。',
    effects: [
      { type: 'investment_volatility', value: 0.3 },
      { type: 'stable_income', value: -0.2 },
      { type: 'risk_exposure', value: 0.25 },
    ],
    inheritMultiplier: 0.7,
    inheritLine: '这次我一定押对了，父亲！',
    warning: '⚠️ 此继承人将大幅提高投资风险，可能导致稳定的收入来源遭受重创。',
  },
  {
    id: 'speculator_e3',
    name: '投机客',
    rarity: 'common',
    icon: '📉',
    description: '追逐泡沫，永远在市场最疯狂的时候冲进去。',
    flavorText: '他总是在别人的贪婪达到顶峰时加入游戏，在别人的恐惧达到顶点时仓皇出逃——只不过方向总是反的。他的投资哲学是：如果大家都在买，那一定有赚钱的机会。可悲的是，这也是大多数人的哲学。',
    effects: [
      { type: 'bubble_loss', value: 0.3 },
      { type: 'herd_mentality', value: 0.25 },
      { type: 'long_term_growth', value: -0.15 },
    ],
    inheritMultiplier: 0.65,
    inheritLine: '大家都在赚，不入场就晚了，父亲！',
    warning: '⚠️ 此继承人在泡沫破裂时将遭受额外30%的损失，且容易被市场狂热裹挟。',
  },
  {
    id: 'bubble_chaser_e4',
    name: '泡沫追逐者',
    rarity: 'common',
    icon: '🫧',
    description: '总是被最新的概念和炒作吸引，在加密货币、元宇宙、NFT之间不断跳跃。',
    flavorText: '他追逐过每一个热点，从区块链到Web3.0，从元宇宙到AI概念币。他的数字钱包里有上百种「下一个比特币」，但每一种最终都成了「下一个空气」。他最大的本事是把FOMO（错失恐惧）变成一场接一场的财务灾难。',
    effects: [
      { type: 'hype_loss', value: 0.35 },
      { type: 'fomo_damage', value: 0.3 },
      { type: 'core_business', value: -0.2 },
    ],
    inheritMultiplier: 0.6,
    inheritLine: ' father，这是下一个万亿美元的机会！',
    warning: '⚠️ 此继承人将分散大量资源追逐热门概念，核心资产可能被严重稀释。',
  },
  {
    id: 'weak_constitution',
    name: '病弱之躯',
    rarity: 'common',
    icon: '🤒',
    description: '从小体弱多病，无法承受高强度的工作压力。',
    flavorText: '他有着敏锐的商业头脑，但身体却不允许他施展才华。频繁的病痛让他错过了一次又一次重要的商业机会。医生说他需要休养，但商业世界从不等人。',
    effects: [
      { type: 'work_capacity', value: -0.3 },
      { type: 'event_participation', value: -0.25 },
      { type: 'decision_speed', value: -0.15 },
    ],
    inheritMultiplier: 0.75,
    inheritLine: '我很想帮忙，父亲……但我需要休息……',
    warning: '⚠️ 此继承人的工作效率大幅降低，且可能因健康原因突然中断管理。',
  },
  {
    id: 'rebel_heir',
    name: '叛逆继承人',
    rarity: 'common',
    icon: '🔥',
    description: '对家族事业毫无兴趣，一心想要走自己的路。',
    flavorText: '他拒绝穿西装，拒绝参加董事会，拒绝学习任何与生意有关的东西。他想当艺术家、音乐家、或者只是一名流浪者。家族的血脉在他这一代面临断裂的危险——除非有人能让他回心转意。',
    effects: [
      { type: 'inheritance_refusal', value: 0.4 },
      { type: 'family_harmony', value: -0.3 },
      { type: 'succession_risk', value: 0.25 },
    ],
    inheritMultiplier: 0.5,
    inheritLine: '我不要你的钱，父亲，也不要你的帝国。',
    warning: '⚠️ 此继承人有40%概率拒绝继承家族事业，导致传承中断或失败。',
  },
];

// ==================== 合并所有天赋 ====================

export const ALL_TALENTS: HeirTalent[] = [
  ...COMMON_TALENTS,
  ...RARE_TALENTS,
  ...EPIC_TALENTS,
  ...LEGENDARY_TALENTS,
  ...NEGATIVE_TALENTS,
];

/** 品质抽取概率配置 */
export const TALENT_RARITY_WEIGHTS: Record<string, number> = {
  common: 40,
  rare: 30,
  epic: 20,
  legendary: 10,
};

/** 负面天赋触发概率（在普通品质中） */
export const NEGATIVE_TALENT_CHANCE = 0.15;

/** 获取所有天赋 */
export function getAllTalents(): HeirTalent[] {
  return [...ALL_TALENTS];
}

/** 根据ID获取天赋 */
export function getTalentById(id: string): HeirTalent | undefined {
  return ALL_TALENTS.find((t) => t.id === id);
}

/** 根据品质筛选天赋 */
export function getTalentsByRarity(
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
): HeirTalent[] {
  return ALL_TALENTS.filter((t) => t.rarity === rarity);
}

/** 获取所有正面天赋（排除负面） */
export function getPositiveTalents(): HeirTalent[] {
  return ALL_TALENTS.filter((t) => !t.warning);
}

/** 获取所有负面天赋 */
export function getNegativeTalents(): HeirTalent[] {
  return ALL_TALENTS.filter((t) => t.warning !== undefined);
}

/** 根据传承倍率排序 */
export function getTalentsByMultiplier(
  order: 'asc' | 'desc' = 'desc'
): HeirTalent[] {
  const sorted = [...ALL_TALENTS].sort(
    (a, b) => b.inheritMultiplier - a.inheritMultiplier
  );
  return order === 'asc' ? sorted.reverse() : sorted;
}

/** 品质中文映射 */
export function getTalentRarityLabel(
  rarity: HeirTalent['rarity']
): string {
  const map: Record<string, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };
  return map[rarity] ?? rarity;
}

/** 获取随机天赋（按品质权重） */
export function getRandomTalentByRarity(): HeirTalent {
  const roll = Math.random() * 100;
  let cumulative = 0;
  let selectedRarity: HeirTalent['rarity'] = 'common';

  for (const [rarity, weight] of Object.entries(TALENT_RARITY_WEIGHTS)) {
    cumulative += weight;
    if (roll <= cumulative) {
      selectedRarity = rarity as HeirTalent['rarity'];
      break;
    }
  }

  const pool = getTalentsByRarity(selectedRarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** 统计天赋数量 */
export function getTalentStats(): Record<string, number> {
  const stats: Record<string, number> = {};
  for (const t of ALL_TALENTS) {
    stats[t.rarity] = (stats[t.rarity] ?? 0) + 1;
  }
  stats['negative'] = getNegativeTalents().length;
  stats['positive'] = getPositiveTalents().length;
  return stats;
}
