/** 成就系统数据定义
 * 记录玩家在游戏中的各种里程碑和特殊成就
 * 共42个成就：时代成就20个 + 财富里程碑8个 + 传承成就7个 + 特殊成就7个
 */

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  flavorText: string;
  condition: string;
  era?: 'first' | 'second' | 'third' | 'fourth';
  hidden?: boolean;
}

// ==================== 时代成就：蒸汽纪元 (5个) ====================

const ERA1_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'steam_pioneer',
    name: '蒸汽先驱',
    icon: '🚂',
    description: '在蒸汽时代成功建立第一家蒸汽动力工厂。',
    flavorText: '当第一台蒸汽机在你的工厂中发出第一声轰鸣时，一个新时代就此开启。浓烟从烟囱中升腾而起，那是工业文明的第一个 breath。工人们敬畏地看着这个由钢铁和火焰组成的巨兽，而你知道——这只是开始。',
    condition: '在时代一中建立至少一座蒸汽动力工厂',
    era: 'first',
  },
  {
    id: 'railroad_tycoon',
    name: '铁路大亨',
    icon: '🛤️',
    description: '控制超过100英里的铁路网络。',
    flavorText: '你的铁轨横跨了山谷和河流，将一座座城市连接在一起。当最后一根道钉被钉入枕木时，你站在 locomotive 的车头，看着蒸汽将远方吞没。你不仅控制了交通——你控制了时间和距离本身。',
    condition: '在时代一中拥有总长度超过100英里的铁路资产',
    era: 'first',
  },
  {
    id: 'coal_magnate',
    name: '煤矿巨头',
    icon: '⛏️',
    description: '控制年产量超过10万吨的煤矿帝国。',
    flavorText: '地底深处的黑色黄金源源不断地涌出你的矿井。每一吨煤炭都是一团凝固的远古阳光，而你将它们转化为推动世界的力量。你的矿井是那个时代最深的人工洞穴，你的矿工们是最勇敢的探险者。',
    condition: '在时代一中煤矿年产量达到10万吨',
    era: 'first',
  },
  {
    id: 'banking_dynasty',
    name: '银行世家',
    icon: '🏛️',
    description: '建立一家在三个城市设有分行的私人银行。',
    flavorText: '你的银行凭证是这个城市最值得信赖的财富象征。当商人们从你手中接过那张印着家族纹章的票据时，他们交换的不只是货币——而是对你这个姓氏的绝对信任。三个城市的分行意味着你的金融触手已经覆盖了这个国家的经济命脉。',
    condition: '在时代一中建立至少一家拥有三个分行的私人银行',
    era: 'first',
  },
  {
    id: 'watt_legacy',
    name: '瓦特传承者',
    icon: '⚙️',
    description: '改良蒸汽机效率超过瓦特原始设计的150%。',
    flavorText: '詹姆斯·瓦特改变了世界，但你超越了他。你的改良型蒸汽机燃烧更少的煤炭，产生更多的马力。当老工匠们看到你的设计图纸时，他们说这是不可能的——直到机器运转起来，发出比瓦特原版更强劲、更稳定的轰鸣。',
    condition: '在时代一中将蒸汽机运行效率提升至原始瓦特设计的150%以上',
    era: 'first',
  },
];

// ==================== 时代成就：电气钢铁 (5个) ====================

const ERA2_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'heart_of_steel',
    name: '钢铁之心',
    icon: '🛡️',
    description: '建造一座年产超过100万吨的巨型炼钢厂。',
    flavorText: '你的炼钢厂是这个国家工业的脊梁。当高炉中的钢水倾泻而出时，它流淌的不仅是金属——而是一个民族的工业梦想。从桥梁到铁轨，从轮船到摩天大楼，这个国家的每一寸钢铁骨架中都流淌着你的名字。',
    condition: '在时代二中炼钢厂年产量达到100万吨',
    era: 'second',
  },
  {
    id: 'oil_baron',
    name: '石油大亨',
    icon: '🛢️',
    description: '控制超过50口高产油井，日产原油超过10万桶。',
    flavorText: '黑色黄金从你的油田中喷涌而出，染黑了天空也照亮了文明。洛克菲勒看到你的名字时会皱起眉头——因为你在他的游戏中打败了他。你的油井是这个时代最深的伤口，也是最耀眼的财富。',
    condition: '在时代二中控制日产原油超过10万桶的油田',
    era: 'second',
  },
  {
    id: 'automotive_pioneer',
    name: '汽车先锋',
    icon: '🚗',
    description: '建立第一条汽车量产流水线，年产量突破10万辆。',
    flavorText: '当第一辆汽车从流水线的末端驶下时，你知道世界从此不再一样。普通人也能拥有曾经只有贵族才能享受的交通工具——而你，就是让这一切成为可能的幕后推手。福特是个伟大的名字，但在这个时代，你的名字同样闪耀。',
    condition: '在时代二中建立汽车量产流水线并年产超过10万辆',
    era: 'second',
  },
  {
    id: 'age_of_electricity',
    name: '电气时代',
    icon: '💡',
    description: '为全国超过50座城市提供电力供应。',
    flavorText: '当爱迪生的灯泡第一次照亮你的城市时，你看到了未来的轮廓。如今，超过五十座城市在你的电网中闪烁，数千万人在你的光明中生活、工作和相爱。你不仅卖电——你卖的是现代文明的入场券。',
    condition: '在时代二中为超过50座城市建立电力供应网络',
    era: 'second',
  },
  {
    id: 'father_of_trust',
    name: '托拉斯之父',
    icon: '🏢',
    description: '成功建立并运营一个横跨三个行业的垄断托拉斯。',
    flavorText: '你用一纸合约将三个行业的命脉绑在了一起。反垄断律师们夜不能寐地研究你的结构，参议员们在国会中愤怒地呼喊你的名字——但他们无法否认，你的托拉斯是这个时代最高效、最赚钱的商业机器。你就是新时代的帝王。',
    condition: '在时代二中建立并运营横跨三个行业的托拉斯垄断组织',
    era: 'second',
  },
];

// ==================== 时代成就：信息浪潮 (5个) ====================

const ERA3_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'silicon_dream',
    name: '硅谷之梦',
    icon: '🌉',
    description: '在硅谷建立一家估值超过10亿美元的科技公司。',
    flavorText: '你从一个车库开始，用代码和咖啡构建起一个数字帝国。当风险投资人将你的公司估值标上那个令人眩晕的数字时，你从窗户望向硅谷的天际线——那里曾经只有果园，如今矗立着改变世界的梦想。',
    condition: '在时代三中建立估值超过10亿美元的硅谷科技公司',
    era: 'third',
  },
  {
    id: 'space_pioneer',
    name: '太空先驱',
    icon: '🚀',
    description: '投资并成功发射第一颗商业通信卫星。',
    flavorText: '当火箭拖着长长的尾焰冲向苍穹时，你的心跳与引擎的轰鸣同步。那不是政府的火箭——那是你的火箭，那颗卫星上印着家族的纹章。从那一刻起，你不再只是一个商人——你是一个星际拓荒者。',
    condition: '在时代三中投资并成功发射商业通信卫星',
    era: 'third',
  },
  {
    id: 'media_empire',
    name: '传媒帝国',
    icon: '📡',
    description: '控制超过十家电视台和五家全国性报纸的传媒集团。',
    flavorText: '当清晨的阳光照亮这个国家的千家万户时，超过一半的人正在消费你的内容。你决定他们看什么新闻、追什么剧、买什么产品。在这个信息爆炸的时代，你就是那个决定什么信息值得被看见的人。',
    condition: '在时代三中建立拥有超过十家电视台和五家全国性报纸的传媒集团',
    era: 'third',
  },
  {
    id: 'digital_pioneer',
    name: '数字先锋',
    icon: '💾',
    description: '率先完成企业全面数字化转型，生产效率提升超过200%。',
    flavorText: '当竞争对手还在用纸质账本和电话线时，你的公司已经运行在光纤和云计算之上。你用一行行代码替代了堆积如山的文件柜，用算法优化了曾经需要百人团队才能完成的工作。你是数字时代的第一个原住民。',
    condition: '在时代三中完成企业全面数字化转型且效率提升超过200%',
    era: 'third',
  },
  {
    id: 'real_estate_mogul',
    name: '地产大亨',
    icon: '🏙️',
    description: '在全国十大城市各拥有至少一栋地标性摩天大楼。',
    flavorText: '你的摩天大楼是这个国家天际线上最醒目的存在。从纽约到上海，从伦敦到东京，每一座地标建筑都刻着家族的姓氏。你卖的不仅是钢筋水泥——你卖的是城市中心最昂贵的梦想。',
    condition: '在时代三中在全国十大城市各拥有一栋地标性摩天大楼',
    era: 'third',
  },
];

// ==================== 时代成就：智能纪元 (5个) ====================

const ERA4_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ai_godfather',
    name: 'AI教父',
    icon: '🧠',
    description: '建立一家拥有自主AI核心技术的全球领先人工智能公司。',
    flavorText: '你创建的AI不仅能下棋、能翻译、能画图——它能做出比人类更精准的商业决策。当世界还在为AI是否会取代人类而争论时，你的AI已经在替你管理着这个帝国的每一个角落。你是人工智能时代最不可或缺的布道者。',
    condition: '在时代四中建立拥有自主核心AI技术的全球领先公司',
    era: 'fourth',
  },
  {
    id: 'clean_energy',
    name: '清洁能源',
    icon: '☀️',
    description: '可再生能源发电量超过化石能源，成为世界第一大清洁能源供应商。',
    flavorText: '你的太阳能农场覆盖了曾经的沙漠，你的风力发电机在海平线上划出优雅的弧线。当化石能源巨头们还在国会中挣扎时，你已经让阳光和风成为了这个星球上最便宜的电力来源。你不是在赚钱——你是在拯救地球的同时赚钱。',
    condition: '在时代四中可再生能源发电量超过化石能源且成为全球第一供应商',
    era: 'fourth',
  },
  {
    id: 'master_of_life',
    name: '生命主宰',
    icon: '🧬',
    description: '投资并成功商业化至少一项改变人类寿命的基因治疗技术。',
    flavorText: '你的基因治疗技术让绝症成为历史，让衰老变成可选。当第一位接受治疗的百岁老人重新长出黑发时，整个世界都知道了——你不仅改变了商业，你改变了人类的生命规则。上帝用七天创造生命，你用一项专利延长了它。',
    condition: '在时代四中投资并成功商业化改变人类寿命的基因治疗技术',
    era: 'fourth',
  },
  {
    id: 'mobile_king',
    name: '移动王者',
    icon: '📱',
    description: '你的移动平台覆盖全球超过50%的智能手机用户。',
    flavorText: '全球一半以上的人每天睁开眼睛第一件事就是打开你的应用。你控制了人类注意力的入口，你是数字世界的新地主——只不过你收的不是地租，而是流量。从社交到购物，从支付到娱乐，人们在拇指的滑动中穿越了你的帝国。',
    condition: '在时代四中移动平台覆盖全球超过50%的智能手机用户',
    era: 'fourth',
  },
  {
    id: 'smart_empire',
    name: '智能帝国',
    icon: '🌐',
    description: '建立起一个由AI全面管理的自动化商业帝国，人类决策占比低于10%。',
    flavorText: '你的帝国已经不需要董事会了。AI管理着供应链，AI谈判着合同，AI分配着资源，而人类只是偶尔按下确认键的那个存在。这不是科幻——这是你的日常。你创造了历史上第一个由机器智慧统治的商业文明。',
    condition: '在时代四中建立AI管理占比超过90%的自动化商业帝国',
    era: 'fourth',
  },
];

// ==================== 财富里程碑成就 (8个) ====================

const WEALTH_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ten_thousand_household',
    name: '万元户',
    icon: '💵',
    description: '家族资产首次突破1万元。',
    flavorText: '在这个大多数人还在为温饱挣扎的时代，你的家族已经积累了一万元的财富。这笔钱足以买下一个小型商铺，或者一艘在河上讨生活的驳船。虽然听起来不多，但这万里长征的第一步，将引领你走向一个 unimaginable 的未来。',
    condition: '家族总资产首次达到10,000',
  },
  {
    id: 'hundred_thousand_rich',
    name: '十万富翁',
    icon: '💰',
    description: '家族资产首次突破10万元。',
    flavorText: '十万！这个数字足以让你在街坊邻里之间成为传奇。你可以买下整条街的商铺，或者建立一座小型的手工工厂。财富的增长已经开始呈现加速度，你站在了一个临界点——前方是更辽阔的蓝海。',
    condition: '家族总资产首次达到100,000',
  },
  {
    id: 'millionaire',
    name: '百万富翁',
    icon: '💎',
    description: '家族资产首次突破100万元。',
    flavorText: '一百万！你是这个国家最富有的那1%。你的豪宅是这个城市最显眼的建筑，你的马车全城最高级。商人们以能进入你的会客厅为荣，政治家们开始认真倾听你的意见。你终于拥有了「不可忽视」的力量。',
    condition: '家族总资产首次达到1,000,000',
  },
  {
    id: 'ten_million_rich',
    name: '千万富豪',
    icon: '🏛️',
    description: '家族资产首次突破1000万元。',
    flavorText: '一千万！你已经不再是一个城市的富翁——你是有全国性影响力的人物。你的工厂遍布三个省份，你的商船队穿越了大洋。财富对你来说不再是一个目标，而是一种工具——一种重塑世界的工具。',
    condition: '家族总资产首次达到10,000,000',
  },
  {
    id: 'billionaire',
    name: '亿万富豪',
    icon: '🏰',
    description: '家族资产首次突破1亿元。',
    flavorText: '一亿！你是这个时代的商业贵族。你的名字出现在报纸的头版，你的肖像被挂在商会的大厅。你的一句话可以让股市震动，你的一笔投资可以改变一个行业的格局。在这个金钱定义一切的世界里，你是国王。',
    condition: '家族总资产首次达到100,000,000',
  },
  {
    id: 'ten_billion_clan',
    name: '十亿豪门',
    icon: '👑',
    description: '家族资产首次突破10亿元。',
    flavorText: '十亿！你建立的不再只是一个家族——而是一个王朝。你的后代将继承的不仅是金钱，还有权力、声望和影响力。从石油到银行，从铁路到钢铁，你的帝国已经渗透到这个国家经济运转的每一个齿轮之中。',
    condition: '家族总资产首次达到1,000,000,000',
  },
  {
    id: 'hundred_billion_tycoon',
    name: '百亿财阀',
    icon: '🌍',
    description: '家族资产首次突破100亿元。',
    flavorText: '一百亿！你是这个星球上最有权势的少数人之一。政府需要你的投资来创造就业，媒体需要你的广告来维持运转，甚至战争都需要你的工厂来生产武器。你已经超越了「富人」的范畴——你是一个国家的经济基础设施。',
    condition: '家族总资产首次达到10,000,000,000',
  },
  {
    id: 'trillion_empire',
    name: '万亿帝国',
    icon: '✨',
    description: '家族资产首次突破1万亿元。',
    flavorText: '一万亿！这不是财富——这是权力，是历史，是人类文明的一个注脚。你的资产超过了许多国家的GDP，你的决策影响着数十亿人的生活。在这个星球上，只有少数几个名字能与你并列。你已经不再是一个商人——你是人类商业史上的一座丰碑。',
    condition: '家族总资产首次达到1,000,000,000,000',
  },
];

// ==================== 传承成就 (7个) ====================

const LEGACY_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'four_generations',
    name: '四代同堂',
    icon: '👨‍👩‍👧‍👦',
    description: '家族成功传承至第四代继承人。',
    flavorText: '曾祖父在蒸汽机旁开始了这一切，祖父在钢铁厂中将它壮大，父亲在摩天大楼中将它扩展——如今，第四代的继承人站在了智能时代的入口。四代同堂不仅是一个家族事件，更是一个商业传奇的延续。',
    condition: '成功培养并让第四代继承人接管家族事业',
  },
  {
    id: 'century_clan',
    name: '百年世家',
    icon: '📜',
    description: '家族事业持续经营超过100年。',
    flavorText: '一百年。四个时代。无数的危机、战争、革命和技术颠覆。多少帝国崛起又衰落，多少名字被遗忘——但你的家族依然在。百年世家的徽章不仅代表着财富，更代表着一种能够穿越时间周期的商业智慧。',
    condition: '家族事业持续经营时间达到100年',
  },
  {
    id: 'industrial_witness',
    name: '工业见证者',
    icon: '⏳',
    description: '家族完整经历了从蒸汽时代到智能时代的全部四个工业时代。',
    flavorText: '从蒸汽机的轰鸣到AI的低语，你的家族见证了人类工业文明的完整历程。你们不是旁观者——你们是参与者、建设者、定义者。当历史学家书写这个时代时，你们的名字将出现在每一页的脚注中。',
    condition: '家族在所有四个时代都至少拥有一项核心业务',
  },
  {
    id: 'duke_prestige',
    name: '公爵之尊',
    icon: '🎖️',
    description: '家族声望达到公爵级别，获得世袭贵族头衔。',
    flavorText: '国王的敕令将世袭公爵的头衔赐予你的家族。从此以后，你的姓氏后面将永远跟着「阁下」二字。商业的成功终于获得了最古老权力体系的认可——这不是终点，而是一个新时代的起点。',
    condition: '家族声望达到「公爵」级别',
  },
  {
    id: 'royal_marriage',
    name: '皇室联姻',
    icon: '💍',
    description: '成功与皇室成员联姻。',
    flavorText: '当继承人挽着皇室成员的手臂走过大教堂的红毯时，商业与血统完成了最神圣的联姻。你的姓氏将与世界上最古老、最尊贵的血脉融合在一起。这是商人的终极梦想——用金钱购买永恒。',
    condition: '完成至少一次与皇室成员的联姻',
  },
  {
    id: 'bloodline_eternal',
    name: '血脉永续',
    icon: '🧬',
    description: '家族每一代都至少培养了一名合格的继承人，从未断代。',
    flavorText: '多少家族在传承中衰落，多少财富在继承中消散。但你的家族不同——每一代都有合格的继承人接过权杖，每一次交接都平稳而顺利。这不是运气，而是制度，是智慧，是对「传承」二字最深刻的理解。',
    condition: '连续十代均成功培养出合格继承人',
  },
  {
    id: 'prestigious_clan',
    name: '名门望族',
    icon: '🏛️',
    description: '家族同时达到声望、财富、传承三项顶级评价。',
    flavorText: '财富让你强大，声望让你崇高，传承让你不朽。当三者齐聚于一身时，你的家族终于成为了「名门望族」——一个值得被历史铭记的名字。未来的孩子们将在教科书中读到你的故事，而你的后代将永远为这个姓氏感到骄傲。',
    condition: '声望、总资产、传承代际三项指标均达到顶级评价',
  },
];

// ==================== 特殊成就 (7个) ====================

const SPECIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'combo_king',
    name: '连击王者',
    icon: '🔥',
    description: '连续十次商业决策全部成功，无一失败。',
    flavorText: '十次。十次商业决策，十次胜利。在变幻莫测的商场上，这样的连胜概率小到可以忽略不计。有人说你开了挂，有人说你走了狗屎运——但只有你自己知道，这背后是无数个不眠之夜和近乎偏执的准备。',
    condition: '连续十次商业决策全部获得正收益',
    hidden: true,
  },
  {
    id: 'legend_hunter',
    name: '传说猎人',
    icon: '🏆',
    description: '累计获得五个传说品质的继承人天赋。',
    flavorText: '传说天赋的出现概率不到10%，而你已经在五代人身上看到了它的光芒。有人说是你的教育投入起了作用，有人说是你的配偶选择恰到好处——但无论如何，你的家族似乎被命运眷顾着，每一代都有可能诞生改变世界的商业天才。',
    condition: '累计触发5次传说品质的继承人天赋',
    hidden: true,
  },
  {
    id: 'comeback_king',
    name: '逆袭之王',
    icon: '📈',
    description: '在资产跌破10%之后，成功恢复到原有水平的200%。',
    flavorText: '你曾跌入谷底，资产蒸发了九成以上。所有人都以为你的故事到此为止——债权人上门，合作伙伴离去，连最忠诚的员工也递交了辞呈。但你从废墟中站了起来，用比原来更大的规模、更强的力量重新征服了这个世界。',
    condition: '资产跌破原有水平的10%后恢复至200%以上',
    hidden: true,
  },
  {
    id: 'perfect_legacy',
    name: '完美传承',
    icon: '⭐',
    description: '某位继承人的所有天赋效果叠加后传承倍率达到3.0以上。',
    flavorText: '那是你家族历史上最完美的一代继承人。他的天赋如此闪耀，以至于你都不忍心看着他老去。当他从父亲手中接过权杖时，传承倍率突破了3.0——意味着他的能力将完整地、甚至放大后传递给下一代。这是商业基因工程的最高成就。',
    condition: '单次继承人传承倍率达到3.0以上',
    hidden: true,
  },
  {
    id: 'dominance_king',
    name: '霸榜王者',
    icon: '🥇',
    description: '在一个时代中，连续五年位居财富排行榜首位。',
    flavorText: '五年。整整五年，没有任何人能够撼动你在财富榜首的位置。你的竞争对手们换了一茬又一茬，新的商业新星冉冉升起又黯然陨落——而你始终站在那里，如同一座不可逾越的高山。',
    condition: '连续五年位居财富排行榜第一名',
    hidden: true,
  },
  {
    id: 'miracle_chance',
    name: '小概率奇迹',
    icon: '🎲',
    description: '触发了一项概率低于1%的稀有正面随机事件。',
    flavorText: '概率低于1%——这意味着在理论上，你需要尝试一百次才可能遇到一次。但你遇到了。也许是一口井喷出十倍的原油，也许是一项投资在一夜之间暴涨百倍，也许是传说中的联姻对象恰好出现在你的面前。命运之轮在你身上停留了一瞬，而那一瞬改变了一切。',
    condition: '触发概率低于1%的稀有正面随机事件',
    hidden: true,
  },
  {
    id: 'ultimate_grand_slam',
    name: '终极大满贯',
    icon: '🏅',
    description: '同时完成所有四个时代的时代成就、全部财富里程碑、全部传承成就和全部特殊成就。',
    flavorText: '你已经完成了这个游戏中的每一个成就。蒸汽、钢铁、信息、智能——你征服了整个工业文明的历程。万亿财富、百年传承、皇室联姻——你触及了一个商业家族所能触及的一切巅峰。在这个游戏中，你已经没有未竟之事。你的名字将永远被铭记——作为那个完成了「不可能」的玩家。',
    condition: '完成全部42个成就（除本成就外）',
    hidden: true,
  },
];

// ==================== 合并所有成就 ====================

export const ALL_ACHIEVEMENTS: Achievement[] = [
  ...ERA1_ACHIEVEMENTS,
  ...ERA2_ACHIEVEMENTS,
  ...ERA3_ACHIEVEMENTS,
  ...ERA4_ACHIEVEMENTS,
  ...WEALTH_ACHIEVEMENTS,
  ...LEGACY_ACHIEVEMENTS,
  ...SPECIAL_ACHIEVEMENTS,
];

/** 获取所有成就 */
export function getAllAchievements(): Achievement[] {
  return [...ALL_ACHIEVEMENTS];
}

/** 根据ID获取成就 */
export function getAchievementById(id: string): Achievement | undefined {
  return ALL_ACHIEVEMENTS.find((a) => a.id === id);
}

/** 根据时代获取成就 */
export function getAchievementsByEra(
  era: 'first' | 'second' | 'third' | 'fourth'
): Achievement[] {
  return ALL_ACHIEVEMENTS.filter((a) => a.era === era);
}

/** 获取财富里程碑成就 */
export function getWealthAchievements(): Achievement[] {
  return WEALTH_ACHIEVEMENTS;
}

/** 获取传承成就 */
export function getLegacyAchievements(): Achievement[] {
  return LEGACY_ACHIEVEMENTS;
}

/** 获取特殊成就（含隐藏成就） */
export function getSpecialAchievements(): Achievement[] {
  return SPECIAL_ACHIEVEMENTS;
}

/** 获取隐藏成就 */
export function getHiddenAchievements(): Achievement[] {
  return ALL_ACHIEVEMENTS.filter((a) => a.hidden === true);
}

/** 获取非隐藏成就 */
export function getVisibleAchievements(): Achievement[] {
  return ALL_ACHIEVEMENTS.filter((a) => a.hidden !== true);
}

/** 时代中文映射 */
export function getAchievementEraLabel(
  era: Achievement['era']
): string {
  const map: Record<string, string> = {
    first: '蒸汽纪元',
    second: '电气钢铁',
    third: '信息浪潮',
    fourth: '智能纪元',
  };
  return era ? (map[era] ?? era) : '通用';
}

/** 统计成就数量 */
export function getAchievementStats(): Record<string, number> {
  const stats: Record<string, number> = {
    total: ALL_ACHIEVEMENTS.length,
    era: ERA1_ACHIEVEMENTS.length + ERA2_ACHIEVEMENTS.length +
      ERA3_ACHIEVEMENTS.length + ERA4_ACHIEVEMENTS.length,
    wealth: WEALTH_ACHIEVEMENTS.length,
    legacy: LEGACY_ACHIEVEMENTS.length,
    special: SPECIAL_ACHIEVEMENTS.length,
    hidden: getHiddenAchievements().length,
    visible: getVisibleAchievements().length,
  };
  return stats;
}

/** 按类别获取成就列表 */
export function getAchievementsByCategory(): Record<string, Achievement[]> {
  return {
    era1: ERA1_ACHIEVEMENTS,
    era2: ERA2_ACHIEVEMENTS,
    era3: ERA3_ACHIEVEMENTS,
    era4: ERA4_ACHIEVEMENTS,
    wealth: WEALTH_ACHIEVEMENTS,
    legacy: LEGACY_ACHIEVEMENTS,
    special: SPECIAL_ACHIEVEMENTS,
  };
}
