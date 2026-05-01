## 修复计划 — 《家族穿越：工业革命纪元》

### 问题1：按钮无响应 — 修复方案
**文件**：`src/pages/MainGame.tsx` (~556-580行)
**问题**：底部快捷按钮只有onMouseEnter/Leave，没有onClick
**修复**：为5个按钮添加onClick handler：
- 联姻 → `navigate('/marriage')`
- 培养 → `navigate('/heir')`
- 排名 → `navigate('/ranking')`
- 成就 → `navigate('/achievements')`
- 设置 → 打开设置弹窗

同时修复第2-4行重复的 `useNavigate` 导入和第23/26行重复的 `navigate` 声明。

### 问题2：时代跨越过早 — 修复方案
**文件**：`src/engine/EventSystem.ts` (56-70行)
**问题**：资产阈值太低（Era1=100,000），导致2次投资就可能达标
**修复**：
- 大幅提高资产阈值：Era1=500,000,000（5亿）, Era2=50,000,000,000（500亿）, Era3=500,000,000,000（5000亿）, Era4=1,000,000,000,000（1万亿=胜利）
- 或者：移除资产阈值，只依赖 `turn >= maxTurnsPerEra`
- 采用方案：保留资产阈值但大幅提高，主要依赖回合数

**文件**：`src/pages/MainGame.tsx` (140-149行)
**问题**：`checkEraTransition` 在 `turn` 变化时触发，但即使提前达标也会触发
**修复**：确保必须完成10次投资（turn >= maxTurnsPerEra）才能跨越

### 问题3：投资升级方式修改
**文件**：`src/engine/GameState.tsx` (75-94行)
**当前逻辑**：新投资level=1，已有投资只增加experience
**需求**：每次购买投资，该投资自动升级一级
**修复**：在INVEST case中，如果投资已存在，level+1（最多7级）

**文件**：`src/components/InvestmentCard.tsx`
**需求**：卡面显示当前等级（如"Lv.3"）
**修复**：在卡片上添加等级显示

### 问题4：扩展危机/机遇
**文件**：`src/data/crises.ts`, `src/data/opportunities.ts`
**当前**：每时代3种危机+3种机遇
**需求**：每时代10种危机+10种机遇
**修复**：添加更多事件数据

**文件**：`src/pages/MainGame.tsx` (159-178行)
**当前**：每回合50%概率触发事件
**需求**：每个投资回合必定触发1个危机或1个机遇
**修复**：每次投资后随机选择一个危机或机遇触发（50/50概率）

### 问题5：联姻美女图片
**已完成**：生成了4张图片
- `/public/marriage-common.jpg` — 普通品质
- `/public/marriage-rare.jpg` — 稀有品质
- `/public/marriage-epic.jpg` — 史诗品质
- `/public/marriage-legendary.jpg` — 传说品质

**文件**：`src/pages/MarriageScreen.tsx`
**修复**：在候选人卡片上显示对应品质的美女图片

### 问题6：新闻播报系统
**新文件**：`src/components/NewsToast.tsx`
**功能**：成就解锁时、排名上升时显示新闻卡片播报
**集成**：在GameState的reducer中触发，或在MainGame中监听状态变化
