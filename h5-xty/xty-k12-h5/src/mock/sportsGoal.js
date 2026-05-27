/**
 * 运动目标 Mock 数据
 */

// 目标类型映射
export const goalTypeMap = {
  'global': { label: '全校目标', color: '#1989fa' },
  'class': { label: '班级目标', color: '#ff976e' },
}

// 周期类型映射
export const cycleTypeMap = {
  'daily': { label: '每日', color: '#07c160' },
  'monthly': { label: '每月', color: '#1989fa' },
  'semester': { label: '学期', color: '#7232dd' },
  'custom': { label: '自定义', color: '#ff976e' },
}

// 计入方式映射
export const includeTypeMap = {
  'all': { label: '全部项目', icon: '⏰', color: '#1989fa' },
  'sunrun': { label: '阳光跑', icon: '🏃', color: '#ff6b00' },
  'single': { label: '单个项目', icon: '👟', color: '#07c160' },
  'multi': { label: '多个单项', icon: '📋', color: '#7232dd' },
}

// 状态映射
export const statusMap = {
  'pending': { label: '未生效', color: '#909399' },
  'active': { label: '生效中', color: '#07c160' },
  'stopped': { label: '已停止', color: '#909399' },
  'expired': { label: '已过期', color: '#c8c8c8' },
}

// 周期文案映射
export const cycleTextMap = {
  'daily': '今天',
  'monthly': '本月',
  'semester': '本学期',
  'custom': (end) => `${end} 截止`,
}

// 生效中的目标列表 Mock 数据
export const goalList = [
  {
    id: 1,
    name: '每日运动2小时',
    goalType: 'global',
    cycleType: 'daily',
    includeType: 'all',
    targetValue: 120,
    completedValue: 85,
    progress: 71,
    status: 'active',
    targetDetail: '目标120分钟',
    completedDetail: '已完成85分钟',
    remainingText: '还差35分钟',
    cycleText: '今天',
    scopeText: '全校',
    scopeGender: '不限',
    effectivePeriod: '2026-05-01 至 2026-07-01',
    includeRules: {
      includeProjects: ['自由训练', '随堂测试', '体质测试'],
      businessTypes: ['自由训练', '随堂测试', '体质测试'],
      scoreStatus: ['正常', '异常'],
      projectTags: [],
    },
    records: [
      { id: 1, time: '今天 16:30', sportName: '跳绳', score: '150个', sportDuration: '18分钟', scoreStatus: '正常', includeTime: '2026-05-15 16:30', includeStatus: 'all', includeAmount: '计入18分钟' },
      { id: 2, time: '今天 15:20', sportName: '篮球', score: '45分钟', sportDuration: '45分钟', scoreStatus: '正常', includeTime: '2026-05-15 15:20', includeStatus: 'all', includeAmount: '计入45分钟' },
      { id: 3, time: '今天 12:00', sportName: '仰卧起坐', score: '60个', sportDuration: '22分钟', scoreStatus: '正常', includeTime: '2026-05-15 12:00', includeStatus: 'all', includeAmount: '计入22分钟' },
    ],
    overallProgressText: '已达标 13/14 天',
    overallStatus: '已失达标',
  },
  {
    id: 2,
    name: '阳光跑学期挑战',
    goalType: 'global',
    cycleType: 'semester',
    includeType: 'sunrun',
    targetValue: 30,
    completedValue: 12.5,
    progress: 42,
    status: 'active',
    targetDetail: '学期30公里',
    completedDetail: '已跑12.5公里',
    remainingText: '还差17.5公里',
    cycleText: '本学期',
    scopeText: '1-6年级',
    scopeGender: '不限',
    effectivePeriod: '2026-03-01 至 2026-07-15',
    dailyCompleted: 0.8,
    weekCompleted: 2,
    monthCompleted: 5,
    sunrunConfig: {
      semesterMileage: 30,
      weekMinCount: 2,
      monthMinCount: 8,
      dailyMaxInclude: 5.0,
      paceRequirement: '配速 3\'30"~7\'00" / 单次最低 0.5 公里',
    },
    includeRules: {
      includeProjects: ['阳光跑'],
      businessTypes: ['阳光跑'],
      scoreStatus: ['正常', '异常'],
      projectTags: [],
    },
    records: [
      { id: 1, time: '05-14 17:30', sportName: '阳光跑', score: '2.3公里', sportDuration: '18分钟（有效时长）', scoreStatus: '正常', includeTime: '2026-05-14 17:30', includeStatus: 'all', includeAmount: '计入2.3公里' },
      { id: 2, time: '05-12 16:00', sportName: '阳光跑', score: '1.8公里', sportDuration: '14分钟（有效时长）', scoreStatus: '正常', includeTime: '2026-05-12 16:00', includeStatus: 'all', includeAmount: '计入1.8公里' },
      { id: 3, time: '05-10 07:20', sportName: '阳光跑', score: '3.1公里', sportDuration: '24分钟（有效时长）', scoreStatus: '正常', includeTime: '2026-05-10 07:20', includeStatus: 'partially', includeAmount: '计入3.1公里' },
    ],
    overallProgressText: '里程达成 12.5/30 公里，周达标 5/7 周，月达标 1/3 月',
    overallStatus: '已失达标',
  },
  {
    id: 3,
    name: '每日体能小达人',
    goalType: 'class',
    cycleType: 'daily',
    includeType: 'multi',
    targetValue: 3,
    completedValue: 2,
    progress: 67,
    status: 'active',
    targetDetail: '共3个条件',
    completedDetail: '2/3条件满足',
    remainingText: '还差1个条件',
    cycleText: '今天',
    scopeText: '三年级1班',
    scopeGender: '不限',
    effectivePeriod: '2026-05-01 至 2026-07-01',
    subConditions: [
      { name: '跳绳', target: '100个', completed: '150个', done: true },
      { name: '跑步', target: '1公里', completed: '0.5公里', done: false, remaining: '还差0.5公里' },
      { name: '仰卧起坐', target: '50个', completed: '60个', done: true },
    ],
    includeRules: {
      includeProjects: ['跳绳', '跑步', '仰卧起坐'],
      businessTypes: ['自由训练', '随堂测试'],
      scoreStatus: ['正常'],
      projectTags: [],
    },
    records: [
      { id: 1, time: '今天 16:30', sportName: '跳绳', score: '150个', sportDuration: '15分钟', scoreStatus: '正常', includeTime: '2026-05-15 16:30', includeStatus: 'all' },
      { id: 2, time: '今天 15:20', sportName: '跑步', score: '0.5公里', sportDuration: '6分钟', scoreStatus: '正常', includeTime: '2026-05-15 15:20', includeStatus: 'partially', includeAmount: '已完成0.5/1公里' },
    ],
    overallProgressText: '已达标 13/14 天',
    overallStatus: '已失达标',
  },
  {
    id: 4,
    name: '5月运动达标计划',
    goalType: 'global',
    cycleType: 'monthly',
    includeType: 'all',
    targetValue: 800,
    completedValue: 320,
    progress: 40,
    status: 'active',
    targetDetail: '目标800分钟',
    completedDetail: '已完成320分钟',
    remainingText: '还差480分钟',
    cycleText: '本月',
    scopeText: '全校',
    scopeGender: '不限',
    effectivePeriod: '2026-05-01 至 2026-05-31',
    includeRules: {
      includeProjects: ['自由训练', '随堂测试', '体质测试'],
      businessTypes: ['自由训练', '随堂测试'],
      scoreStatus: ['正常'],
      projectTags: [],
    },
    records: [
      { id: 1, time: '05-14 10:30', sportName: '跳绳', score: '80个', sportDuration: '12分钟', scoreStatus: '正常', includeTime: '2026-05-14 10:30', includeStatus: 'all', includeAmount: '计入12分钟' },
      { id: 2, time: '05-12 15:00', sportName: '篮球', score: '60分钟', sportDuration: '60分钟', scoreStatus: '正常', includeTime: '2026-05-12 15:00', includeStatus: 'all', includeAmount: '计入60分钟' },
      { id: 3, time: '05-10 08:20', sportName: '仰卧起坐', score: '50个', sportDuration: '10分钟', scoreStatus: '正常', includeTime: '2026-05-10 08:20', includeStatus: 'all', includeAmount: '计入10分钟' },
    ],
    overallProgressText: '本月累计 320/800 分钟',
    overallStatus: '进行中',
  },
]

// 历史目标列表
export const historyGoalList = [
  {
    id: 10,
    name: '3月运动打卡',
    goalType: 'global',
    cycleType: 'monthly',
    includeType: 'all',
    targetValue: 600,
    completedValue: 680,
    progress: 100,
    status: 'expired',
    targetDetail: '目标600分钟',
    completedDetail: '已完成680分钟',
    remainingText: '',
    cycleText: '2026年3月',
    scopeText: '全校',
    scopeGender: '不限',
    effectivePeriod: '2026-03-01 至 2026-03-31',
    achievedDays: 22,
    totalDays: 23,
    overallProgressText: '已达标 1/1 月',
    overallStatus: '保持达标',
    includeRules: {
      includeProjects: ['自由训练', '随堂测试', '体质测试'],
      businessTypes: ['自由训练', '随堂测试'],
      scoreStatus: ['正常'],
      projectTags: [],
    },
    records: [
      { id: 1, time: '03-31 17:00', sportName: '跳绳', score: '120个', sportDuration: '18分钟', scoreStatus: '正常', includeTime: '2026-03-31 17:00', includeStatus: 'all', includeAmount: '计入18分钟' },
      { id: 2, time: '03-30 16:00', sportName: '篮球', score: '50分钟', sportDuration: '50分钟', scoreStatus: '正常', includeTime: '2026-03-30 16:00', includeStatus: 'all', includeAmount: '计入50分钟' },
      { id: 3, time: '03-28 15:30', sportName: '仰卧起坐', score: '60个', sportDuration: '20分钟', scoreStatus: '正常', includeTime: '2026-03-28 15:30', includeStatus: 'all', includeAmount: '计入20分钟' },
    ],
  },
  {
    id: 11,
    name: '2月阳光跑挑战',
    goalType: 'global',
    cycleType: 'monthly',
    includeType: 'sunrun',
    targetValue: 20,
    completedValue: 8.5,
    progress: 43,
    status: 'expired',
    targetDetail: '目标20公里',
    completedDetail: '已跑8.5公里',
    remainingText: '还差11.5公里',
    cycleText: '2026年2月',
    scopeText: '全校',
    scopeGender: '不限',
    effectivePeriod: '2026-02-01 至 2026-02-28',
    achievedDays: 6,
    totalDays: 18,
    overallProgressText: '里程达成 8.5/20 公里，周达标 1/4 周，月达标 0/1 月',
    overallStatus: '已失达标',
    dailyCompleted: 0,
    weekCompleted: 1,
    monthCompleted: 3,
    sunrunConfig: {
      semesterMileage: 20,
      weekMinCount: 3,
      monthMinCount: 12,
      dailyMaxInclude: 3.0,
      paceRequirement: '配速 3\'30"~7\'00" / 单次最低 0.5 公里',
    },
    includeRules: {
      includeProjects: ['阳光跑'],
      businessTypes: ['阳光跑'],
      scoreStatus: ['正常'],
      projectTags: [],
    },
    records: [
      { id: 1, time: '02-28 17:30', sportName: '阳光跑', score: '2.1公里', sportDuration: '17分钟（有效时长）', scoreStatus: '正常', includeTime: '2026-02-28 17:30', includeStatus: 'all', includeAmount: '计入2.1公里' },
      { id: 2, time: '02-25 16:00', sportName: '阳光跑', score: '3.0公里', sportDuration: '23分钟（有效时长）', scoreStatus: '正常', includeTime: '2026-02-25 16:00', includeStatus: 'partially', includeAmount: '计入3.0公里' },
    ],
  },
]

// 日历 Mock 数据 - 按目标周期类型分别存储
// key 格式：yearMonth（如 202605 表示 2026年5月）
export const calendarData = {
  // 每日目标日历（5月 - 当前月，有详细每日数据）
  202605: [
    { day: 1, status: 'none' }, { day: 2, status: 'none' }, { day: 3, status: 'none' },
    { day: 4, status: 'achieved' }, { day: 5, status: 'achieved' }, { day: 6, status: 'failed' },
    { day: 7, status: 'achieved' }, { day: 8, status: 'none' }, { day: 9, status: 'failed' },
    { day: 10, status: 'achieved' }, { day: 11, status: 'achieved' }, { day: 12, status: 'achieved' },
    { day: 13, status: 'failed' }, { day: 14, status: 'achieved' }, { day: 15, status: 'achieved' },
    { day: 16, status: 'none' }, { day: 17, status: 'none' }, { day: 18, status: 'none' },
    { day: 19, status: 'none' }, { day: 20, status: 'none' }, { day: 21, status: 'none' },
    { day: 22, status: 'none' }, { day: 23, status: 'none' }, { day: 24, status: 'none' },
    { day: 25, status: 'none' }, { day: 26, status: 'none' }, { day: 27, status: 'none' },
    { day: 28, status: 'none' }, { day: 29, status: 'none' }, { day: 30, status: 'none' },
    { day: 31, status: 'none' },
  ],
  // 4月（所有目标类型 - 完整月）
  202604: [
    { day: 1, status: 'achieved' }, { day: 2, status: 'achieved' }, { day: 3, status: 'failed' },
    { day: 4, status: 'achieved' }, { day: 5, status: 'achieved' }, { day: 6, status: 'none' },
    { day: 7, status: 'none' }, { day: 8, status: 'failed' }, { day: 9, status: 'achieved' },
    { day: 10, status: 'achieved' }, { day: 11, status: 'failed' }, { day: 12, status: 'achieved' },
    { day: 13, status: 'achieved' }, { day: 14, status: 'failed' }, { day: 15, status: 'achieved' },
    { day: 16, status: 'achieved' }, { day: 17, status: 'none' }, { day: 18, status: 'achieved' },
    { day: 19, status: 'failed' }, { day: 20, status: 'achieved' }, { day: 21, status: 'achieved' },
    { day: 22, status: 'achieved' }, { day: 23, status: 'none' }, { day: 24, status: 'achieved' },
    { day: 25, status: 'failed' }, { day: 26, status: 'achieved' }, { day: 27, status: 'achieved' },
    { day: 28, status: 'achieved' }, { day: 29, status: 'none' }, { day: 30, status: 'achieved' },
  ],
  // 3月（每月目标周期 - 完整月）
  202603: [
    { day: 1, status: 'achieved' }, { day: 2, status: 'achieved' }, { day: 3, status: 'failed' },
    { day: 4, status: 'achieved' }, { day: 5, status: 'achieved' }, { day: 6, status: 'none' },
    { day: 7, status: 'achieved' }, { day: 8, status: 'failed' }, { day: 9, status: 'achieved' },
    { day: 10, status: 'achieved' }, { day: 11, status: 'achieved' }, { day: 12, status: 'achieved' },
    { day: 13, status: 'failed' }, { day: 14, status: 'achieved' }, { day: 15, status: 'achieved' },
    { day: 16, status: 'achieved' }, { day: 17, status: 'none' }, { day: 18, status: 'nil' },
    { day: 19, status: 'achieved' }, { day: 20, status: 'achieved' }, { day: 21, status: 'achieved' },
    { day: 22, status: 'achieved' }, { day: 23, status: 'nil' }, { day: 24, status: 'achieved' },
    { day: 25, status: 'nil' }, { day: 26, status: 'achieved' }, { day: 27, status: 'achieved' },
    { day: 28, status: 'achieved' }, { day: 29, status: 'nil' }, { day: 30, status: 'achieved' },
    { day: 31, status: 'achieved' },
  ],
  // 2月（每月目标周期 - 28天）
  202602: [
    { day: 1, status: 'nil' }, { day: 2, status: 'nil' }, { day: 3, status: 'achieved' },
    { day: 4, status: 'failed' }, { day: 5, status: 'achieved' }, { day: 6, status: 'nil' },
    { day: 7, status: 'achieved' }, { day: 8, status: 'nil' }, { day: 9, status: 'achieved' },
    { day: 10, status: 'failed' }, { day: 11, status: 'nil' }, { day: 12, status: 'achieved' },
    { day: 13, status: 'nil' }, { day: 14, status: 'nil' }, { day: 15, status: 'achieved' },
    { day: 16, status: 'achieved' }, { day: 17, status: 'nil' }, { day: 18, status: 'achieved' },
    { day: 19, status: 'failed' }, { day: 20, status: 'nil' }, { day: 21, status: 'nil' },
    { day: 22, status: 'achieved' }, { day: 23, status: 'nil' }, { day: 24, status: 'nil' },
    { day: 25, status: 'achieved' }, { day: 26, status: 'nil' }, { day: 27, status: 'nil' },
    { day: 28, status: 'achieved' },
  ],
  // 1月（学期周期内 - 31天）
  202601: [
    { day: 1, status: 'nil' }, { day: 2, status: 'nil' }, { day: 3, status: 'nil' },
    { day: 4, status: 'achieved' }, { day: 5, status: 'achieved' }, { day: 6, status: 'nil' },
    { day: 7, status: 'achieved' }, { day: 8, status: 'nil' }, { day: 9, status: 'achieved' },
    { day: 10, status: 'nil' }, { day: 11, status: 'achieved' }, { day: 12, status: 'achieved' },
    { day: 13, status: 'nil' }, { day: 14, status: 'achieved' }, { day: 15, status: 'nil' },
    { day: 16, status: 'achieved' }, { day: 17, status: 'nil' }, { day: 18, status: 'achieved' },
    { day: 19, status: 'nil' }, { day: 20, status: 'achieved' }, { day: 21, status: 'nil' },
    { day: 22, status: 'achieved' }, { day: 23, status: 'nil' }, { day: 24, status: 'nil' },
    { day: 25, status: 'achieved' }, { day: 26, status: 'nil' }, { day: 27, status: 'achieved' },
    { day: 28, status: 'nil' }, { day: 29, status: 'nil' }, { day: 30, status: 'achieved' },
    { day: 31, status: 'nil' },
  ],
}

// 计算综合优先级得分（用于排序）
export function calcPriorityScore(goal) {
  const achievementRate = goal.status === 'active' && goal.progress >= 100 ? 1 : goal.progress / 100
  const urgencyMap = { daily: 0.9, monthly: 0.5, semester: 0.3, custom: 0.6 }
  const urgency = urgencyMap[goal.cycleType] || 0.5
  return (1 - achievementRate) * 0.6 + urgency * 0.4
}

// 按 PRD 排序规则排序目标列表
export function sortGoals(goals) {
  return goals
    .filter(g => g.status === 'active')
    .sort((a, b) => {
      const scoreA = calcPriorityScore(a)
      const scoreB = calcPriorityScore(b)
      const aDone = a.progress >= 100 ? 1 : 0
      const bDone = b.progress >= 100 ? 1 : 0
      if (aDone !== bDone) return aDone - bDone
      if (Math.abs(scoreA - scoreB) < 0.001) return b.id - a.id
      return scoreB - scoreA
    })
}
