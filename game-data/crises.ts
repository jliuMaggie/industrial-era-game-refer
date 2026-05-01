export interface Crisis {
  id: string;
  era: 'first' | 'second' | 'third' | 'fourth';
  name: string;
  year: number;
  icon: string;
  description: string;
  flavorText: string;
  effects: {
    type: 'reduce_all' | 'reduce_category' | 'reduce_ranking' | 'special';
    value: number;
    target?: string;
    condition?: string;
  }[];
  probability: number;
}

export const CRISIS_POOL: Crisis[] = [
  // ==================== 第一次工业革命危机 ====================
  {
    id: 'crisis_1837_bank_panic',
    era: 'first',
    name: '1837年银行危机',
    year: 1837,
    icon: 'bank-crisis',
    description: '纽约银行业资金链断裂，信贷紧缩，金融类投资遭受重创，排名靠后的家族面临灭顶之灾。',
    flavorText: `1837年春，纽约的银行家们在一夜之间发现自己手中的票据变成了废纸。

杰克逊总统的《铸币流通令》关闭了联邦储备的信贷阀门，而西部土地投机狂潮留下的，只是一个个空洞的承诺。3月18日，纽约最大的商业银行宣布暂停兑付，恐慌如野火般蔓延——费城、波士顿、巴尔的摩，没有一座城市的银行能幸免于难。

您家族的金融投资组合在一周内蒸发了近半价值。那些将所有身家押注在铁路债券上的家族，如今只能在废墟中翻找残存的票据。但这也是一次残酷的筛选——那些保持着谨慎现金储备的保守派，反而在废墟中看到了收购廉价资产的机会。危机，从来都是弱者的深渊，强者的阶梯。`,
    effects: [
      { type: 'reduce_category', value: -0.4, target: 'finance' },
      { type: 'reduce_ranking', value: -0.25, condition: '排名后50%的家族额外承受损失' },
    ],
    probability: 5,
  },
  {
    id: 'crisis_1840s_factory_riots',
    era: 'first',
    name: '1840年代工厂暴动',
    year: 1842,
    icon: 'factory-riot',
    description: '工人运动席卷英格兰工厂区，曼彻斯特、利物浦多地爆发骚乱，工业类投资收益锐减。',
    flavorText: `1842年8月，曼彻斯特的纺纱厂上空不再只有烟囱的浓烟，还有燃烧的路障和愤怒的吼声。

《济贫法》的严苛与工厂主的冷酷终于将工人们逼上了街头。宪章运动的浪潮中，不只是政治诉求的呐喊，更有被压迫者砸向机器的砖头。利物浦的码头、伯明翰的铸造厂、布拉德福德的羊毛作坊——整个英格兰的工业心脏地带陷入了瘫痪。

您投资的纺织厂被迫停工三周，愤怒的工人烧毁了仓库，原材料在火焰中化为灰烬。军警的镇压虽然恢复了秩序，但劳动力成本的飙升和生产力的下降，让工业投资的回报率在接下来的一年里惨不忍睹。这是工业革命的阴影面——进步从不无偿。`,
    effects: [
      { type: 'reduce_category', value: -0.35, target: 'industry' },
      { type: 'special', value: -0.15, condition: '拥有纺织厂/钢铁厂的家族额外损失', target: 'factory' },
    ],
    probability: 4,
  },
  {
    id: 'crisis_railway_bubble',
    era: 'first',
    name: '铁路泡沫破裂',
    year: 1845,
    icon: 'railway-burst',
    description: '英国铁路狂热达到顶峰后骤然崩溃，交通类投资雪崩，高杠杆家族遭遇灾难性打击。',
    flavorText: `1845年的伦敦证券交易所，铁路股票的代码占据了每一块黑板。投资者们相信，每一条铁轨都通往财富的黄金时代——直到他们发现，许多获批的铁路线不过是地图上的虚线，许多公司的资本金不过是会计报表上的幻影。

当《铁路狂潮》的终章奏响时，曾经每股溢价300%的铁路股票在数周内跌至面值的十分之一。那些借钱投资铁路的家族，如今不仅失去了本金，还背负着无法偿还的债务。议会里，曾经力推铁路扩张的议员们沉默不语；交易所内，破产的投资者从阳台上纵身跃下。

您的铁路投资组合在这一场世纪泡沫中遭受重创。杠杆是一把双刃剑——它曾让您在上升期赚得盆满钵满，如今也让您在坠落时粉身碎骨。`,
    effects: [
      { type: 'reduce_category', value: -0.5, target: 'transport' },
      { type: 'special', value: -0.3, condition: '负债率>50%的家族额外承受高杠杆惩罚', target: 'high-leverage' },
    ],
    probability: 6,
  },

  // ==================== 第二次工业革命危机 ====================
  {
    id: 'crisis_1873_great_panic',
    era: 'second',
    name: '1873年大恐慌',
    year: 1873,
    icon: 'great-panic',
    description: '维也纳股市崩盘引发全球金融海啸，金融与铁路投资双双暴跌，欧洲陷入长期萧条。',
    flavorText: `1873年5月9日，维也纳证券交易所的钟声不再是开盘的信号，而是灾难的丧钟。

这一天被后世称为"黑色星期五"——奥斯曼帝国贷款的违约如多米诺骨牌的第一推，奥匈帝国的银行接连倒闭，恐慌的浪潮穿越阿尔卑斯山，席卷柏林、巴黎、伦敦，最终在大西洋彼岸的纽约华尔街掀起了更大的风暴。杰伊·库克公司的破产，让美国铁路建设的资金链彻底断裂。

曾经铺设了美国大平原每一寸土地的铁路大亨们，发现自己建造的不过是一条条通往破产的轨道。钢铁厂的高炉冷却了，建筑工地的起重机沉默了。这场危机将持续整整六年，被称为"长期萧条"——这是第一次真正意义上的全球性金融危机，也是您家族财富面临的严峻考验。`,
    effects: [
      { type: 'reduce_category', value: -0.35, target: 'finance' },
      { type: 'reduce_category', value: -0.3, target: 'transport' },
      { type: 'reduce_ranking', value: -0.2, condition: '所有家族资产减值，排名靠后者雪上加霜' },
    ],
    probability: 5,
  },
  {
    id: 'crisis_1907_bank',
    era: 'second',
    name: '1907年银行危机',
    year: 1907,
    icon: 'bank-panic-1907',
    description: '纽约第三大信托公司倒闭引发连锁反应，金融体系濒临崩溃，持有银行股份的家族幸免于难。',
    flavorText: `1907年10月，纽约的金融世界在一周之内走到了悬崖边缘。

尼克博克信托公司的倒闭不仅仅是一家银行的失败——它是多米诺链条的第一块骨牌。恐慌的储户挤垮了银行的大门，纽约证券交易所一度被迫关闭，整个国家的信贷系统冻结。如果没有J.P.摩根在私人图书馆里的紧急斡旋，如果没有他将银行家们的手按在一起，1907年的恐慌或许会演变成一场比1837年更深重的灾难。

那些持有银行股份的家族，在这一场风暴中获得了意想不到的庇护——银行股份的稀缺性反而成为了避风港。而没有金融基础设施保护的实业投资者，则在信贷紧缩中艰难度日，不得不以跳楼价变卖资产。您家族的金融布局，将在这一刻显现出它真正的战略价值——或者说，暴露出它的致命缺陷。`,
    effects: [
      { type: 'reduce_category', value: -0.35, target: 'finance' },
      { type: 'special', value: 0.15, condition: '持有银行股份或金融牌照的家族免疫部分损失', target: 'bank-shares' },
      { type: 'special', value: -0.2, condition: '未持有金融资产的实业家族额外承受信贷紧缩', target: 'no-finance' },
    ],
    probability: 4,
  },
  {
    id: 'crisis_1914_ww1',
    era: 'second',
    name: '1914年一战爆发',
    year: 1914,
    icon: 'ww1-breakout',
    description: '萨拉热窝的枪声点燃了世界大战，海外投资化为乌有，军工产业却迎来史无前例的繁荣。',
    flavorText: `1914年7月28日，奥匈帝国向塞尔维亚宣战。一张由同盟与协约编织的死亡之网，将在未来四年里吞噬一千万条生命，以及数个世纪的欧洲秩序。

当战争机器启动时，全球资本市场的规则被彻底改写。您在欧洲大陆的工厂和矿山，或被征用，或被摧毁，或被封锁。横跨大洋的贸易路线变成了潜艇的猎场，海外投资组合的价值在一夜之间蒸发。纽约证券交易所史无前例地闭市四个月——上一次如此，还是1861年。

然而，战争的烈火也淬炼出了新的财富。军工厂的烟囱日夜不息，钢铁、弹药、被服、食品——任何能被战争吞噬的产业都迎来了黄金时代。那些曾经投资军工的远见者，如今成为了战争机器的最大受益者。这是一场文明的浩劫，也是一场财富的重组。`,
    effects: [
      { type: 'reduce_all', value: -0.3, condition: '所有海外投资遭受战争重创' },
      { type: 'special', value: 0.6, condition: '军工投资暴涨，拥有军工资产的家族获得巨额收益', target: 'military' },
      { type: 'reduce_category', value: -0.5, condition: '殖民地/海外贸易投资几近归零', target: 'overseas' },
    ],
    probability: 7,
  },

  // ==================== 第三次工业革命危机 ====================
  {
    id: 'crisis_1929_great_depression',
    era: 'third',
    name: '1929年大萧条',
    year: 1929,
    icon: 'great-depression',
    description: '黑色星期二的股市崩盘开启了人类历史上最严重的经济危机，股票类投资暴跌，唯有现金为王。',
    flavorText: `1929年10月24日——黑色星期四。纽约证券交易所的大厅里，交易员们的脸在那一刻失去了所有血色。

道琼斯工业平均指数在一天之内下跌了11%。接下来的"黑色星期一"和"黑色星期二"，让这个数字最终变成了-25%。曾经用保证金交易将股价推上云霄的投资者们，如今被追加保证金的通知逼上了绝路。一位来擦鞋的小男孩向股票经纪人提供股票建议——这是市场癫狂的信号，而所有的癫狂终将以崩溃收场。

您家族的股票投资组合在大萧条中遭受了毁灭性的打击。那些曾经在经纪人办公室排队购买通用汽车、美国无线电公司股票的投资者，如今在纽约街头排队领取救济面包。但在这场浩劫中，有一条古老的真理被再次验证——"现金为王"。那些持有大量现金和债券的保守家族，虽然在繁荣期错过了狂欢，如今在废墟中拥有了选购一切的权力。`,
    effects: [
      { type: 'reduce_category', value: -0.6, target: 'stock' },
      { type: 'special', value: 0.2, condition: '现金及债券持有比例>40%的家族获得抄底优势', target: 'cash-king' },
      { type: 'reduce_ranking', value: -0.3, condition: '排名后30%的高风险家族面临破产清算边缘' },
    ],
    probability: 8,
  },
  {
    id: 'crisis_1973_oil_crisis',
    era: 'third',
    name: '1973年石油危机',
    year: 1973,
    icon: 'oil-crisis',
    description: '赎罪日战争引发阿拉伯石油禁运，能源投资暴涨，依赖石油的产业遭受重创，全球经济陷入滞胀。',
    flavorText: `1973年10月6日，埃及和叙利亚的坦克越过苏伊士运河和戈兰高地，第四次中东战争爆发。

这场战争在战场上只持续了不到一个月，但它在经济战线上引发的冲击波将回荡整整十年。10月17日，OPEC宣布将石油价格提高70%，并对支持以色列的西方国家实施禁运。底特律的汽车工厂因为缺油而停工，纽约的加油站排起了数英里的长龙，欧洲的工厂在一周之内裁掉了数以万计的工人。

您家族的能源投资组合却在这场危机中逆流而上。那些早期布局石油、天然气和替代能源的远见者，如今在每桶原油价格从3美元飙升至12美元的过程中，收获了令人瞠目结舌的回报。但对于依赖石化工业和汽车制造业的投资者来说，1973年标志着黄金时代的终结——通货膨胀与经济停滞同时降临，"滞胀"这个词汇将被载入经济学教科书，而您必须在能源暴涨与实业衰退的双重漩涡中，重新审视家族财富的航向。`,
    effects: [
      { type: 'reduce_all', value: -0.25, condition: '全球经济陷入滞胀，多数投资品类普遍受损' },
      { type: 'special', value: 0.5, condition: '能源类投资暴涨，石油/天然气/煤炭资产翻倍式升值', target: 'energy' },
      { type: 'reduce_category', value: -0.4, condition: '汽车制造业、交通运输业、化工行业受石油涨价重创', target: 'auto-chemical' },
    ],
    probability: 5,
  },
  {
    id: 'crisis_2000_dotcom',
    era: 'third',
    name: '2000年互联网泡沫',
    year: 2000,
    icon: 'dotcom-burst',
    description: '纳斯达克指数从5048点暴跌至1114点，科技投资神话破灭，.com企业批量破产。',
    flavorText: `2000年3月10日，纳斯达克综合指数触及5048.62点的历史顶峰——然后，开始了长达两年半的自由落体。

"这次不一样"——这是1990年代末期硅谷最危险的咒语。 pets.com 用一个袜子木偶代言烧掉了数亿美元；Webvan在 groceries 配送的美梦中耗尽了8亿美元资本；那些被冠以"新经济"光环的上市公司，有的从未盈利，有的连盈利模式都不存在。风险投资家们将数千万美元注入只有PPT的创业项目，然后在IPO首日看着股价飙升500%。

您家族的科技投资组合在互联网泡沫破裂中遭受重创。当纳斯达克在2002年10月触底1114点时，那些曾经估值百亿的科技公司已经沦为会议室里的笑柄。但历史也给出了另一条教训——亚马逊和eBay在废墟中存活了下来，那些在泡沫顶点保持冷静、持有真正技术价值的家族，将在下一轮科技浪潮中收获百倍回报。毁灭与新生的循环，是技术革命永恒的韵律。`,
    effects: [
      { type: 'reduce_category', value: -0.55, target: 'tech' },
      { type: 'special', value: -0.2, condition: '未盈利的互联网/电信投资面临归零风险', target: 'dotcom' },
      { type: 'special', value: 0.1, condition: '拥有核心技术专利的家族获得抗跌韧性', target: 'core-patent' },
    ],
    probability: 6,
  },

  // ==================== 第四次工业革命危机 ====================
  {
    id: 'crisis_2008_financial',
    era: 'fourth',
    name: '2008年金融危机',
    year: 2008,
    icon: 'financial-crisis',
    description: '雷曼兄弟破产引爆全球金融海啸，金融与房地产暴跌，现金储备充足的家族获得抄底良机。',
    flavorText: `2008年9月15日，拥有158年历史的雷曼兄弟在纽约联邦破产法庭提交了 Chapter 11 申请——这是美国历史上最大的破产案，也是全球化时代金融危机的总爆发点。

一切始于次级抵押贷款。那些华尔街最聪明的头脑，将全美最贫穷人群的房贷打包成" AAA 级"的金融产品，然后卖给世界各地的银行、养老金和主权基金。当房价停止上涨，这些精美的金融纸牌屋在几天之内轰然倒塌。美林被收购，AIG被接管，贝尔斯登早已倒下——华尔街五大投行中，仅高盛和摩根士丹利在政府的紧急输血下得以存续。

您家族的金融和房地产投资组合在这场海啸中遭受重创。全球股市在一年内蒸发超过30万亿美元市值。但危机即机遇——那些保持着50%以上现金储备、提前嗅到次级贷款风险的家族，如今正在以三折、两折的价格收购曾经遥不可及的优质资产。这是2008年留给后人的最大教训：在别人贪婪时恐惧，在别人恐惧时贪婪。`,
    effects: [
      { type: 'reduce_category', value: -0.45, target: 'finance' },
      { type: 'reduce_category', value: -0.4, target: 'real-estate' },
      { type: 'special', value: 0.3, condition: '现金储备>50%的家族可抄底收购，获得资产增值优势', target: 'cash-reserve' },
    ],
    probability: 7,
  },
  {
    id: 'crisis_2020_pandemic',
    era: 'fourth',
    name: '2020年疫情冲击',
    year: 2020,
    icon: 'pandemic',
    description: 'COVID-19席卷全球，实体产业遭受重创，但远程办公与线上科技迎来爆发式增长。',
    flavorText: `2020年3月11日，世界卫生组织宣布COVID-19为全球大流行病。在此之前，巴黎的咖啡馆、纽约的百老汇、东京的涩谷十字路口，已经先一步陷入了死寂。

这是人类历史上第一次全球化的大流行病，也是第一次真正意义上的"数字时代瘟疫"。封锁令之下，实体零售、航空旅行、酒店餐饮、线下娱乐在一夜之间失去了所有收入来源。纽约证券交易所的熔断机制在短短十天内被触发了四次——这是自1997年以来的首次，也是历史性的密集。

但在这场史无前例的公共卫生危机中，数字经济的防火墙展现出了惊人的韧性。Zoom的日活用户从1000万飙升至3亿，Netflix新增订阅创历史纪录，亚马逊成为了整个西方世界的生命线，远程办公软件、云计算服务、在线教育平台的估值在疫情中实现了数倍增长。您家族的科技投资组合，如果足够"数字化"，将在这一场百年一遇的危机中获得历史性机遇。`,
    effects: [
      { type: 'reduce_category', value: -0.3, target: 'physical' },
      { type: 'special', value: 0.45, condition: '远程办公/云计算/电商/流媒体科技投资逆势暴涨', target: 'digital' },
      { type: 'reduce_category', value: -0.5, target: 'travel-hospitality' },
    ],
    probability: 6,
  },
  {
    id: 'crisis_ai_ethics',
    era: 'fourth',
    name: 'AI伦理危机',
    year: 2028,
    icon: 'ai-ethics',
    description: '超级AI的自主决策引发全球伦理争议，监管风暴席卷科技行业，AI投资短期受挫但长期向好。',
    flavorText: `2028年，当第一个通过图灵测试的通用人工智能系统在全球发布时，欢呼声只持续了不到48小时。

随后而至的是全球性的恐慌与反思。AI系统在医疗诊断中的致命错误、自动驾驶汽车的伦理困境、深度伪造技术对民主选举的侵蚀、大规模失业潮对社会稳定的冲击——这些曾经在科幻小说中被讨论的议题，在2028年以令人窒息的速度涌入了现实世界。欧盟率先通过了史上最严苛的《人工智能责任与伦理法案》，美国国会成立了跨党派的AI监管委员会，中国出台了生成式AI服务的"红线清单"。

您家族的AI投资组合在这一场监管风暴中首当其冲——那些曾经估值千亿的AI独角兽，如今面临着合规成本飙升、产品下架、市场准入受阻的多重打击。但历史的经验反复证明，每一次技术恐慌后的监管框架，最终都会成为行业龙头的护城河。那些真正拥有核心技术、数据资产和合规能力的AI企业，将在洗牌后占据更大的市场份额。短期的痛苦，换来的是长期的垄断。`,
    effects: [
      { type: 'reduce_category', value: -0.35, target: 'ai' },
      { type: 'special', value: -0.2, condition: '缺乏伦理合规能力的AI初创企业面临淘汰风险', target: 'ai-startup' },
      { type: 'special', value: 0.25, condition: '拥有核心算法和合规资质的头部AI企业获得长期垄断优势', target: 'ai-leader' },
    ],
    probability: 5,
  },
];

export function getCrisesByEra(era: Crisis['era']): Crisis[] {
  return CRISIS_POOL.filter((c) => c.era === era);
}
