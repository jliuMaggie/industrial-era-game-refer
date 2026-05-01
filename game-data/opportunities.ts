export interface Opportunity {
  id: string;
  era: 'first' | 'second' | 'third' | 'fourth';
  name: string;
  icon: string;
  description: string;
  flavorText: string;
  effects: {
    type: 'boost_all' | 'boost_category' | 'unlock_invest' | 'reputation' | 'special';
    value: number;
    target?: string;
  }[];
  probability: number;
}

export const OPPORTUNITY_POOL: Opportunity[] = [
  // ==================== 第一次工业革命机遇 ====================
  {
    id: 'opp_colonial_trade',
    era: 'first',
    name: '殖民地贸易扩张',
    icon: 'colonial-trade',
    description: '东印度公司的商船满载香料与丝绸返航，殖民地贸易网络迅速扩张，商业投资迎来黄金时代。',
    flavorText: `1783年《巴黎条约》的墨迹尚未干透，大英帝国的商船已经重新铺满了各大洋的航线。

东印度公司的贸易站点从孟买延伸到新加坡，从加尔各答扩展到香港。鸦片、茶叶、丝绸、瓷器、香料——这些来自远东的奢侈品正在改变欧洲上流社会的生活方式，而每一箱货物的转手，都在为贸易网络的编织者创造天文数字的利润。利物浦的码头在昼夜不停地装卸，伦敦的商业交易所里，殖民地公司的股票价格每天都在刷新纪录。

您家族的商业投资组合，如果与这条横贯全球的贸易动脉相连，将在这个时代获得前所未有的回报。不列颠治下的和平或许是对被殖民者的枷锁，但对于身处帝国中心的投资者来说，这无疑是财富积累的最佳时代。印度的棉花、加勒比的糖、中国的茶叶、非洲的象牙——整个世界都在向伦敦输送黄金。`,
    effects: [
      { type: 'boost_category', value: 0.35, target: 'commerce' },
      { type: 'reputation', value: 0.2 },
    ],
    probability: 5,
  },
  {
    id: 'opp_tech_breakthrough',
    era: 'first',
    name: '新技术突破',
    icon: 'tech-breakthrough',
    description: '瓦特蒸汽机的专利到期，技术壁垒被打破，多种新兴产业向投资者敞开大门。',
    flavorText: `1800年，詹姆斯·瓦特的蒸汽机专利终于到期了。

这一道被法律保护了二十五年的技术闸门轰然打开，整个英格兰的工匠和企业家如同溃堤的洪水般涌入了蒸汽动力的未知领域。理查德·特里维西克将蒸汽机装上了轨道，造就了第一辆蒸汽机车；约翰·菲奇的蒸汽船在特拉华河上划破了宁静；而那些将蒸汽机引入纺织厂的企业家们，发现一台机器可以替代三十个工人的双手。

对于您家族而言，专利到期意味着投资的门槛骤然降低。曾经只有极少数特权家族能够参与的蒸汽动力产业，如今向所有愿意冒险的投资者敞开了大门。纺织机械化、蒸汽运输、冶铁新工艺——每一项技术突破都是一个全新的投资蓝海。这是属于先行者的时代，而您是否能在这波技术浪潮中找准方向，将决定家族在未来半个世纪里的财富版图。`,
    effects: [
      { type: 'unlock_invest', value: 1, target: 'steam-power' },
      { type: 'unlock_invest', value: 1, target: 'mechanized-textile' },
      { type: 'boost_category', value: 0.25, target: 'industry' },
    ],
    probability: 4,
  },
  {
    id: 'opp_noble_patronage',
    era: 'first',
    name: '贵族赞助',
    icon: 'noble-patron',
    description: '王室与贵族阶层青睐工业投资，获得贵族青睐的家族声誉暴涨，社交资本转化为商业特权。',
    flavorText: `白金汉宫的灯火通明之夜，摄政王殿下正与一群衣着华贵的绅士淑女们举杯畅饮——而在这些宾客之中，那些新近发迹的工业家正在被小心翼翼地接纳进古老的贵族圈子。

这是一个缓慢却不可逆转的变革：血统的壁垒正在被财富的洪流侵蚀。当一位纺织大亨被赐予爵位，当一位铁路投资者的女儿嫁入公爵之家，当国王本人亲临一家新落成的工厂剪彩——工业革命的财富正在与封建时代的权力进行一场跨越阶级的联姻。对于获得贵族青睐的家族而言，这不仅意味着社交地位的提升，更意味着商业上的无尽特权：政府采购的优先权、殖民地特许经营的牌照、议会里有利于资本的土地法案。

您家族如果能在这一刻赢得贵族阶层的信任，获得的将不只是声誉的暴涨——更是通往帝国权力核心的钥匙。`,
    effects: [
      { type: 'reputation', value: 0.5 },
      { type: 'special', value: 0.2, target: 'government-contracts' },
    ],
    probability: 4,
  },

  // ==================== 第二次工业革命机遇 ====================
  {
    id: 'opp_electrification',
    era: 'second',
    name: '电气化浪潮',
    icon: 'electrification',
    description: '爱迪生的灯泡照亮了曼哈顿，特斯拉的交流电驱动了工业新纪元，电气投资迎来爆发式增长。',
    flavorText: `1882年9月4日，纽约珍珠街发电站的开关被合上，曼哈顿金融区数千盏电灯同时亮起——这是人类历史上第一座商业发电站，也是电气时代的破晓时分。

爱迪生与特斯拉的电流战争撕裂了1890年代的美国，但无论直流还是交流，胜利者终将属于"电"本身。通用电气和西屋电气的股票在交易所里创造了令人眩晕的涨幅，电气化从照明扩展到动力，从城市延伸到工厂，从通信延伸到交通。1895年，尼亚加拉大瀑布的水力发电站将电流输送到二十英里外的布法罗——交流电赢得了未来。

您家族的电气投资组合正站在这场变革的风口浪尖。每一台新安装的电动机，每一条新建的输电线路，每一座拔地而起的发电站，都在为早期投资者积累复利式的回报。这是第二次工业革命的核心引擎，而您的财富将随着电流的脉搏一同跳动。`,
    effects: [
      { type: 'boost_category', value: 0.4, target: 'electric' },
      { type: 'unlock_invest', value: 1, target: 'power-grid' },
      { type: 'boost_category', value: 0.2, target: 'industry' },
    ],
    probability: 5,
  },
  {
    id: 'opp_immigration',
    era: 'second',
    name: '移民潮',
    icon: 'immigration',
    description: '数千万欧洲移民涌入新大陆，城市人口爆炸式增长，房地产与劳动密集型产业迎来黄金机遇。',
    flavorText: `1892年1月1日，埃利斯岛移民站正式开放。在接下来的六十二年里，超过一千二百万名移民将在这里踏上美国的土地——他们来自爱尔兰的饥荒废墟、意大利的贫困山村、波兰的被占领土、俄罗斯的犹太区，带着一只行李箱和一个关于新大陆的梦想。

这股人类历史上最大规模的人口迁徙，正在重塑美洲大陆的城市面貌。纽约的人口在三十年内翻了一番，芝加哥从一座小镇成长为世界第六大城市，旧金山在淘金热的废墟上重建为太平洋沿岸的贸易枢纽。每一张新抵达的面孔，都意味着对住房的需求、对工作的渴望、对消费品的新欲望。房地产开发商在城市的边缘地带建造了一片又一片街区，工厂主们在罢工的威胁与劳动力的充裕之间寻找平衡，铁路公司在移民路线上铺设了连接东西海岸的铁轨。

您家族如果布局了房地产和劳动密集型产业，将在这场人类大迁徙中收获几何级数的增长。`,
    effects: [
      { type: 'boost_category', value: 0.3, target: 'real-estate' },
      { type: 'boost_category', value: 0.25, target: 'labor-intensive' },
      { type: 'special', value: 0.15, target: 'transport' },
    ],
    probability: 4,
  },
  {
    id: 'opp_war_orders',
    era: 'second',
    name: '战争订单',
    icon: 'war-orders',
    description: '帝国扩张与军备竞赛催生天量军工订单，军工产业正式向私人资本开放，军工厂成为印钞机。',
    flavorText: `1898年，美国战舰"缅因号"在哈瓦那港的爆炸声，开启了美西战争的序幕，也开启了军工复合体与私人资本联姻的黄金时代。

当帝国扩张的野心遭遇工业化的生产力，军备竞赛便不再只是国家战略，更是一场财富的盛宴。克虏伯在埃森的钢铁厂为德意志帝国铸造大炮，维克斯在英国的造船厂为皇家海军铺设龙骨，美国的 Bethlehem Steel 以创纪录的速度生产装甲钢板。1899年到1902年的布尔战争、1904年到1905年的日俄战争、1912年到1913年的巴尔干战争——每一次炮火的轰鸣，都伴随着军工企业股价的飙升。

军工投资正式向私人资本敞开了大门。政府的战争订单以成本加成的方式保障了利润，而军工厂的生产线一旦启动，便如同永不熄灭的熔炉。您家族如果能在这场军备竞赛中占得一席之地，将获得的不仅是财富的积累——更是与国家权力深度绑定的政治资本。`,
    effects: [
      { type: 'unlock_invest', value: 1, target: 'military-industry' },
      { type: 'boost_category', value: 0.45, target: 'military' },
      { type: 'special', value: 0.2, target: 'steel-metal' },
    ],
    probability: 5,
  },

  // ==================== 第三次工业革命机遇 ====================
  {
    id: 'opp_space_race',
    era: 'third',
    name: '太空竞赛',
    icon: 'space-race',
    description: '斯普特尼克的蜂鸣声惊醒了西方世界，美苏太空竞赛将航空航天投资推向史无前例的高度。',
    flavorText: `1957年10月4日，人类历史上第一颗人造卫星"斯普特尼克1号"从拜科努尔航天发射场升空，以每秒8公里的速度划破了地球的上空。它的无线电蜂鸣声在20兆赫和40兆赫之间交替，而对于美国而言，这无异于一场国家声望的核打击。

艾森豪威尔总统的额头在那一刻渗出了冷汗。仅仅四周之后，苏联将"莱卡"——一只流浪犬——送上了太空。1961年4月12日，尤里·加加林成为第一个进入太空的人类。肯尼迪总统在椰林俱乐部的演讲台上立下了誓言："十年之内，我们要将人类送上月球，并安全返回地球。" NASA 的预算在五年内从五亿美元暴涨至五十亿美元，航空航天产业以举国之力被推向了人类工程能力的极限。

您家族的航空航天投资组合正处在这场史诗级竞赛的暴风眼。从洛克希德的"黑鸟"侦察机到波音的"土星五号"火箭，从休斯敦的航天中心到佛罗里达的发射场——每一美元的政府投入，都在为产业链上的私人企业创造利润。太空竞赛不只是科学的胜利，更是资本与国家意志的盛大合谋。`,
    effects: [
      { type: 'boost_category', value: 0.5, target: 'aerospace' },
      { type: 'boost_category', value: 0.25, target: 'tech' },
      { type: 'unlock_invest', value: 1, target: 'satellite-comm' },
    ],
    probability: 5,
  },
  {
    id: 'opp_consumerism',
    era: 'third',
    name: '消费主义兴起',
    icon: 'consumerism',
    description: '电视进入千家万户，广告塑造了新的消费欲望，电视传媒与大众消费品产业迎来爆发。',
    flavorText: `1948年，只有不到百分之一的英国家庭拥有电视机。到了1960年，这个数字超过了四分之三。而美国家庭的电视普及率，在同一时期从不足百分之一飙升至接近百分之九十。

这是一场比任何政治革命都更深刻的社会变革。电视机的荧光屏将客厅变成了商业布道的教堂，广告商们第一次拥有了直接进入数百万家庭卧室的权力。"麦迪逊大道"——这条纽约的街道成为了消费主义时代的梵蒂冈，广告人用弗洛伊德的心理学、民意调查的数据和好莱坞的制作技巧，编织出一个个关于"幸福生活"的模板：一辆新车、一台冰箱、一套 suburban 的住宅、一支能让牙齿更白的牙膏。

您家族的电视传媒与消费品投资组合，正处在这场欲望工程的核心。每一次黄金时段的广告投放，每一个品牌赞助的综艺节目，每一条植入电视剧的产品信息，都在将观看者转化为消费者，将消费者转化为利润的源泉。电视传媒不只是娱乐产业——它是消费主义时代最强大的印钞机。`,
    effects: [
      { type: 'boost_category', value: 0.35, target: 'media' },
      { type: 'boost_category', value: 0.3, target: 'consumer-goods' },
      { type: 'special', value: 0.15, target: 'advertising' },
    ],
    probability: 5,
  },
  {
    id: 'opp_cold_war_tech',
    era: 'third',
    name: '冷战科技投入',
    icon: 'coldwar-tech',
    description: '铁幕两侧的军备竞赛催生半导体与计算机产业，五角大楼的预算为科技投资注入核动力。',
    flavorText: `1950年2月9日，威斯康星州的年轻参议员约瑟夫·麦卡锡在西弗吉尼亚惠林市的一场演讲中，挥舞着一张据称载有205名"已知的共产党分子"名单的纸片——"铁幕"从此不仅是一道地缘政治的边界，更是一场席卷全球的意识形态战争的宣言。

在这场战争的阴影之下，科技投资获得了前所未有的国家推动力。1957年，仙童半导体公司在硅谷的帕洛阿尔托成立，它的八位联合创始人——史称"叛逆八人"——在之后的半个世纪里将创造出英特尔、AMD 和数十家改变世界的科技公司。IBM 的"360系列"大型计算机成为了美国国防部和 NASA 的标准配置，而 DARPA 在1969年资助的 ARPANET 项目，将在二十年后演变为连接全人类的互联网。

您家族的半导体与计算机投资组合正处在这场冷战科技竞赛的直接受益者之列。五角大楼的国防预算、NASA 的航天拨款、情报机构的密码学研究——这些以国家安全之名投入的资金，正在以技术突破的方式转化为商业利润。冷战的恐惧，是科技投资者最大的红利。`,
    effects: [
      { type: 'boost_category', value: 0.4, target: 'semiconductor' },
      { type: 'boost_category', value: 0.35, target: 'computer' },
      { type: 'unlock_invest', value: 1, target: 'integrated-circuit' },
    ],
    probability: 5,
  },

  // ==================== 第四次工业革命机遇 ====================
  {
    id: 'opp_smartphone',
    era: 'fourth',
    name: '智能手机革命',
    icon: 'smartphone',
    description: 'iPhone重新定义了移动互联网，App生态催生了万亿级市场，移动互联网投资迎来爆发式增长。',
    flavorText: `2007年1月9日，旧金山莫斯康展览中心的舞台上，史蒂夫·乔布斯从牛仔裤口袋里掏出了一台设备——"今天，苹果要重新发明手机。"

这句看似狂妄的宣言，在之后的时间里被证明还是过于谦虚了。iPhone 不只是重新发明了手机，它重新发明了人类与信息、与商业、与彼此之间的关系。2008年 App Store 的上线开启了一个全新的应用生态，愤怒的小鸟、Instagram、Uber、微信支付——这些将我们的生活彻底重塑的应用，在几年之内创造了一个超过万亿美元的市场。

您家族的移动互联网投资组合正站在这场革命的震中。从移动端的广告投放到移动支付的基础设施，从社交电商的流量入口到短视频的内容分发——每一台智能手机都是一个通往消费者钱包的入口。苹果公司和谷歌公司的市值在十年内增长了十倍，而那些在2007年就看准了移动互联网方向的风险投资者，如今已经成为了硅谷新的财富神话。`,
    effects: [
      { type: 'boost_category', value: 0.45, target: 'mobile-internet' },
      { type: 'boost_category', value: 0.3, target: 'app-ecosystem' },
      { type: 'special', value: 0.2, target: 'social-media' },
    ],
    probability: 6,
  },
  {
    id: 'opp_carbon_neutral',
    era: 'fourth',
    name: '碳中和政策',
    icon: 'carbon-neutral',
    description: '全球气候协议推动新能源革命，光伏、风电、储能、电动汽车产业获得政策强力驱动。',
    flavorText: `2015年12月12日，巴黎北郊的勒布尔热展览中心，195个国家的代表在经过两周的通宵谈判后，一致通过了《巴黎协定》——人类历史上第一个具有法律约束力的全球性气候协议。

协定承诺：将全球平均气温升幅控制在工业化前水平的2摄氏度以内，并努力限制在1.5摄氏度之内。这一目标意味着全球能源体系必须在接下来的三十年内完成从化石燃料向可再生能源的根本性转型。2019年，欧盟发布了"绿色协议"，承诺2050年实现碳中和；2020年，中国宣布2060年碳中和目标；2021年，美国重返《巴黎协定》。

您家族的新能源投资组合正处在这场世纪级能源转型的最前线。光伏发电的成本在十年内下降了百分之九十，海上风电的装机量以每年百分之二十的速度增长，电动汽车的销量在2023年突破了一千万辆。政府的补贴、碳交易市场的建立、传统能源企业的被迫转型——每一个政策杠杆都在为新能源投资者创造利润。这是人类历史上最大的基础设施重建工程，而您正处于这场工程的发包方名单上。`,
    effects: [
      { type: 'boost_category', value: 0.4, target: 'renewable-energy' },
      { type: 'boost_category', value: 0.35, target: 'electric-vehicle' },
      { type: 'unlock_invest', value: 1, target: 'carbon-credits' },
    ],
    probability: 5,
  },
  {
    id: 'opp_pandemic_digital',
    era: 'fourth',
    name: '疫情数字化',
    icon: 'pandemic-digital',
    description: '全球封锁加速了十年的数字化转型，远程办公、云计算、电商、流媒体成为经济新支柱。',
    flavorText: `2020年3月的世界，仿佛在一夜之间被按下了"暂停键"——但数字经济的按钮，却被按下了"快进"。

当十四亿人的中国在一周之内将课堂转移到钉钉和腾讯会议，当华尔街的交易员们在自家的客厅里完成数万亿美元的交易，当 Amazon 的股价在三个月内上涨了百分之六十——世界终于意识到，数字化不再是"可选项"，而是"必选项"。远程办公软件的日活用户在2020年增长了百分之三百，云计算市场的规模突破了三千亿美元，电商渗透率在一年的时间里完成了原本需要五年的增长。

您家族的科技投资组合在这场"被迫的数字化"中获得了前所未有的加速。那些在疫情前就已经布局了 SaaS、云计算、无接触配送、在线医疗的家族，发现市场需求不是慢慢增长，而是在一夜之间爆炸。Zoom 的创始人袁征在2020年成为了全世界最忙碌的CEO之一——而他的个人财富，也随着公司市值的飙升突破了百亿美元。数字化不是未来，数字化是2020年锁死的家门被打开之后的唯一出路。`,
    effects: [
      { type: 'boost_all', value: 0.25, condition: '所有科技类投资获得数字化加速红利' },
      { type: 'boost_category', value: 0.4, target: 'cloud-computing' },
      { type: 'boost_category', value: 0.35, target: 'remote-work' },
      { type: 'unlock_invest', value: 1, target: 'telemedicine' },
    ],
    probability: 5,
  },
];

export function getOpportunitiesByEra(era: Opportunity['era']): Opportunity[] {
  return OPPORTUNITY_POOL.filter((o) => o.era === era);
}
