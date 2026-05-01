/** AI家族数据定义
 * 游戏中作为竞争对手和投资参照的五大传奇家族
 */

export interface AIFamily {
  id: string;
  name: string;
  icon: string;
  style: string;
  riskPreference: 'conservative' | 'moderate' | 'aggressive';
  specialAbility: string;
  specialBonus: { type: string; value: number };
  initialAsset: number;
  color: string;
}

export const AIFAMILIES: AIFamily[] = [
  {
    id: 'rothschild',
    name: '罗斯柴尔德家族',
    icon: '👑',
    style:
      '以金融投资为核心策略，擅长在债券、银行和货币市场中运作。家族奉行「信息即财富」的信条，拥有遍布欧洲的情报网络。',
    riskPreference: 'aggressive',
    specialAbility:
      '金融危机时投资收益率翻倍。当市场陷入恐慌、其他人纷纷抛售时，罗斯柴尔德家族却能逆势而行，以极低价格收购优质资产，等待市场回暖后获得超额回报。这是他们在滑铁卢战役后一夜成名的秘诀。',
    specialBonus: { type: 'crisis_investment_return', value: 0.5 },
    initialAsset: 5000000,
    color: '#8B4513',
  },
  {
    id: 'rockefeller',
    name: '洛克菲勒家族',
    icon: '🛢️',
    style:
      '以工业投资为核心策略，专注于石油、化工和能源领域的垂直整合。信奉「控制全产业链」的理念，从开采到精炼再到运输，每个环节都要掌握在自己手中。',
    riskPreference: 'conservative',
    specialAbility:
      '石油相关投资收益率提升30%。得益于家族在石油行业的百年积累，他们能精准判断油价走势和油田价值，在钻井技术和炼油工艺上拥有旁人无法企及的优势。',
    specialBonus: { type: 'oil_investment_return', value: 0.3 },
    initialAsset: 4500000,
    color: '#1E90FF',
  },
  {
    id: 'morgan',
    name: '摩根家族',
    icon: '🏛️',
    style:
      '以多元化投资为核心策略，在金融、工业、铁路和公用事业领域全面布局。家族擅长资本运作和并购重组，多次在美国经济危机中扮演「救火队长」的角色。',
    riskPreference: 'moderate',
    specialAbility:
      '经济危机抗性+20%，资产减值幅度降低。摩根家族深谙风险分散之道，其投资组合涵盖多个行业，即使某一领域遭遇重创，其他资产也能提供缓冲。J.P.摩根甚至曾以个人之力挽救整个美国银行体系。',
    specialBonus: { type: 'crisis_resistance', value: 0.2 },
    initialAsset: 4800000,
    color: '#4B0082',
  },
  {
    id: 'vanderbilt',
    name: '范德比尔特家族',
    icon: '🚂',
    style:
      '以交通运输为核心策略，从蒸汽船起家，后全面转向铁路投资。老范德比尔特以「船长」闻名，被称为「铁路之王」，他的家族信条是：谁控制了运输，谁就控制了商业的命脉。',
    riskPreference: 'aggressive',
    specialAbility:
      '铁路相关投资收益率提升40%。凭借在运输行业的深厚根基和经营智慧，范德比尔特家族能以最快速度铺轨、最高效率运营，并通过枢纽站的布局控制区域商业流动，获取超额利润。',
    specialBonus: { type: 'railroad_investment_return', value: 0.4 },
    initialAsset: 4200000,
    color: '#B22222',
  },
  {
    id: 'carnegie',
    name: '卡内基家族',
    icon: '⚙️',
    style:
      '以钢铁和制造业为核心策略，追求极致的工业效率和生产规模。安德鲁·卡内基从工厂学徒成长为钢铁大王，信奉「成本每降低一分钱，利润就增加一分钱」的铁律。',
    riskPreference: 'conservative',
    specialAbility:
      '工业相关投资效率提升30%。卡内基家族在工厂管理、生产流程优化和技术革新方面拥有无与伦比的经验。他们能以更低的成本、更高的产能运营工厂，使每吨钢铁的利润远超竞争对手。',
    specialBonus: { type: 'industrial_efficiency', value: 0.3 },
    initialAsset: 4000000,
    color: '#696969',
  },
];

/** 获取所有AI家族 */
export function getAllAIFamilies(): AIFamily[] {
  return [...AIFAMILIES];
}

/** 根据ID获取AI家族 */
export function getAIFamilyById(id: string): AIFamily | undefined {
  return AIFAMILIES.find((f) => f.id === id);
}

/** 根据风险偏好获取AI家族 */
export function getAIFamiliesByRisk(
  risk: 'conservative' | 'moderate' | 'aggressive'
): AIFamily[] {
  return AIFAMILIES.filter((f) => f.riskPreference === risk);
}

/** 获取初始资产排名 */
export function getAIFamiliesByInitialAsset(): AIFamily[] {
  return [...AIFAMILIES].sort((a, b) => b.initialAsset - a.initialAsset);
}

/** 风险偏好文本映射 */
export function getRiskLabel(risk: AIFamily['riskPreference']): string {
  const map: Record<string, string> = {
    conservative: '稳健型',
    moderate: '中等风险',
    aggressive: '激进型',
  };
  return map[risk] ?? risk;
}
