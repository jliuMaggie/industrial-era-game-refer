import type { Achievement } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_invest', name: '初次投资', description: '完成第一笔投资', condition: 'invest_1', unlocked: false },
  { id: 'first_crit', name: '首爆', description: '第一次触发暴击', condition: 'crit_1', unlocked: false },
  { id: 'combo_5', name: '连击高手', description: '达成5连击', condition: 'combo_5', unlocked: false },
  { id: 'combo_10', name: '连击大师', description: '达成10连击', condition: 'combo_10', unlocked: false },
  { id: 'millionaire', name: '百万富翁', description: '资产达到100万', condition: 'asset_1m', unlocked: false },
  { id: 'billionaire', name: '亿万富翁', description: '资产达到10亿', condition: 'asset_1b', unlocked: false },
  { id: 'trillionaire', name: '万亿帝国', description: '资产达到1万亿', condition: 'asset_1t', unlocked: false },
  { id: 'era_2', name: '电气时代', description: '进入第二次工业革命', condition: 'era_2', unlocked: false },
  { id: 'era_3', name: '数字革命', description: '进入第三次工业革命', condition: 'era_3', unlocked: false },
  { id: 'era_4', name: '智能时代', description: '进入第四次工业革命', condition: 'era_4', unlocked: false },
  { id: 'rank_1', name: '首富', description: '排名升至第1位', condition: 'rank_1', unlocked: false },
  { id: 'all_in', name: '孤注一掷', description: '完成一次全仓投资', condition: 'all_in_1', unlocked: false },
  { id: 'upgrade_max', name: '登峰造极', description: '将一个投资升至满级', condition: 'upgrade_max_1', unlocked: false },
  { id: 'marry_legendary', name: '天作之合', description: '与传说品质对象联姻', condition: 'marry_legendary_1', unlocked: false },
  { id: 'survive_crisis', name: '危机幸存者', description: '在危机中存活', condition: 'survive_crisis_1', unlocked: false },
];
