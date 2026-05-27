/**
 * 运动目标模块 Mock 数据
 * 对应 PRD：运动目标设置-教师小程序-运动目标
 */

// ========== 辅助函数（必须在数据定义之前） ==========

const studentNames = [
  '张伟', '李娜', '王芳', '刘洋', '陈明', '赵丽', '周杰', '吴敏', '郑浩', '孙悦',
  '马超', '朱婷', '胡歌', '林晨', '何雨', '罗翔', '高飞', '梁博', '宋佳', '谢霆',
  '唐嫣', '韩庚', '冯绍', '许嵩', '邓超', '萧蔷', '曹格', '袁弘', '蒋欣', '裴斗',
  '陈西', '杨过', '黄蓉', '欧阳', '司马', '诸葛', '令狐', '任盈盈', '岳灵', '田伯',
]

let _studentIdCounter = 1

function generateStudents(classIds, count) {
  const result = []
  const classNames = classIds.map(id => {
    const cls = classList.find(c => c.id === id)
    return cls ? cls.name : '未知班级'
  })
  for (let i = 0; i < count; i++) {
    const clsName = classNames[i % classNames.length]
    result.push({
      id: _studentIdCounter++,
      name: studentNames[i % studentNames.length] + (i >= studentNames.length ? `${Math.ceil(i / studentNames.length)}` : ''),
      className: clsName,
      studentNo: `STU2026${String(i + 1).padStart(4, '0')}`,
      gender: i % 3 === 0 ? '女' : '男',
      grade: clsName.replace(/\d+班$/, ''),
    })
  }
  return result
}

function findStudentById(id) {
  const matchedInGoal = goalList
    .flatMap(goal => goal.studentsAll || [])
    .find(s => s.id === Number(id))
  return matchedInGoal || allStudentsPool.find(s => s.id === Number(id)) || {
    id,
    name: studentNames[(id - 1) % studentNames.length],
    className: '七年级1班',
    studentNo: `STU2026${String(id).padStart(4, '0')}`,
    gender: id % 2 === 0 ? '女' : '男',
    grade: '七年级',
  }
}

function getStudentReachedInGoal(goal, studentId) {
  if (!goal) return false
  const sortedStudents = goal.studentsAll || []
  const studentIndex = sortedStudents.findIndex(s => s.id === Number(studentId))
  if (studentIndex < 0) return false
  return studentIndex < Math.min(goal.达标人数 || 0, sortedStudents.length)
}

function generateCountRecords(sportLabel, actual, goal) {
  const records = []
  const count = Math.min(15, Math.ceil(actual / Math.max(1, Math.round(goal / 10))))
  const projects = sportLabel === '全部项目' ? ['跳绳', '阳光跑', '自由训练', '体能训练'] : [sportLabel]
  for (let i = 0; i < count; i++) {
    const project = projects[i % projects.length]
    const value = project === '阳光跑'
      ? (1.5 + Math.random() * 3).toFixed(1) + 'km'
      : project === '跳绳'
        ? Math.round(80 + Math.random() * 120) + '个'
        : Math.round(10 + Math.random() * 40) + '分钟'
    const day = new Date(2026, 4, 15 - i)
    records.push({
      studentName: '当前学生',
      gender: '',
      studentNo: '',
      grade: '',
      className: '',
      project,
      score: value,
      status: Math.random() > 0.15 ? '正常' : '异常',
      countTime: `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')} ${String(Math.round(8 + Math.random() * 8)).padStart(2, '0')}:${String(Math.round(Math.random() * 60)).padStart(2, '0')}`,
      countStatus: Math.random() > 0.2 ? '全部计入' : '部分计入',
    })
  }
  return records
}

// 教师任教班级列表
export const classList = [
  { id: 1, name: '七年级1班', grade: '七年级' },
  { id: 2, name: '七年级2班', grade: '七年级' },
  { id: 3, name: '八年级1班', grade: '八年级' },
  { id: 4, name: '八年级3班', grade: '八年级' },
  { id: 5, name: '九年级2班', grade: '九年级' },
]

// 计入运动项目图标/颜色映射
export const sportProjectConfig = {
  all: { icon: 'apps-o', label: '全部项目', color: '#1989fa' },
  sunrun: { icon: 'running-o', label: '阳光跑', color: '#ff976a' },
  single: { icon: 'jump-o', label: '跳绳', color: '#36d399' },
  multi: { icon: 'apps-o', label: '多个单项', color: '#7c3aed' },
}

// 周期类型配置
export const cycleTypeConfig = {
  daily: { label: '每日', color: '#1989fa' },
  monthly: { label: '每月', color: '#ff976a' },
  semester: { label: '学期', color: '#36d399' },
  custom: { label: '自定义', color: '#7c3aed' },
}

// 预生成所有学生数据池（模块加载时一次性生成）
const allStudentsPool = [
  ...generateStudents([1, 2], 50),
  ...generateStudents([3, 4, 5], 50),
]

// 班级目标列表（生效中）
export const goalList = [
  {
    id: 1,
    name: '每日运动打卡',
    typeLabel: '班级目标',
    sportProjectType: 'all',
    sportProjectLabel: '全部项目',
    cycleType: 'daily',
    goalValueSummary: '60分钟',
    completionRate: 68,
    达标人数: 85,
    coveredCount: 125,
    periodProgress: '已统计 15/123 天',
    students: [1, 2, 3],
    studentsAll: generateStudents([1, 2], 125),
  },
  {
    id: 2,
    name: '每月跳绳挑战',
    typeLabel: '全校目标',
    sportProjectType: 'single',
    sportProjectLabel: '跳绳',
    cycleType: 'monthly',
    goalValueSummary: '1000个',
    completionRate: 45,
    达标人数: 56,
    coveredCount: 125,
    periodProgress: '已统计 3/5 月',
    students: [4, 5],
    studentsAll: generateStudents([1, 2, 3], 125),
  },
  {
    id: 3,
    name: '阳光跑春季计划',
    typeLabel: '全校目标',
    sportProjectType: 'sunrun',
    sportProjectLabel: '阳光跑',
    cycleType: 'semester',
    goalValueSummary: '里程80km + 周2次 + 月8次',
    completionRate: 32,
    达标人数: 40,
    coveredCount: 125,
    periodProgress: '已统计 11/22 周',
    students: [6],
    studentsAll: generateStudents([1, 2, 3, 4, 5], 125),
  },
  {
    id: 4,
    name: '体能综合目标',
    typeLabel: '班级目标',
    sportProjectType: 'multi',
    sportProjectLabel: '多个单项',
    cycleType: 'monthly',
    goalValueSummary: '3个条件',
    completionRate: 82,
    达标人数: 102,
    coveredCount: 125,
    periodProgress: '已统计 3/5 月',
    students: [7, 8],
    studentsAll: generateStudents([1, 3, 5], 125),
  },
]

// 历史目标
export const historyGoalList = [
  {
    id: 101,
    name: '秋季运动计划',
    sportProjectType: 'all',
    sportProjectLabel: '全部项目',
    cycleType: 'custom',
    goalValueSummary: '90分钟',
    completionRate: 71,
    达标人数: 89,
    coveredCount: 125,
    status: '已过期',
    period: '2025-09-01 至 2025-12-01',
  },
  {
    id: 102,
    name: '冬季阳光跑计划',
    sportProjectType: 'sunrun',
    sportProjectLabel: '阳光跑',
    cycleType: 'semester',
    goalValueSummary: '月8次',
    completionRate: 55,
    达标人数: 68,
    coveredCount: 125,
    status: '已停止',
    period: '2025-12-01 至 2026-02-01',
  },
]

// 目标详情规则
export const goalRules = {
  1: {
    id: 1,
    name: '每日运动打卡',
    cycleType: 'daily',
    sportProjectType: 'all',
    sportProjectLabel: '全部项目',
    goalValue: '60分钟',
    period: '2026-03-01 至 2026-07-01',
    scope: '七年级1班、七年级2班',
    gender: '不限',
    countRules: {
      sportProjects: '全部项目',
      businessTypes: '自由训练、随堂测试、体质测试',
      statusTypes: '正常、异常',
      projectTags: '无',
    },
    changeRecords: [
      {
        time: '2026-04-15 10:30',
        changer: '李思思（主管老师）',
        type: '编辑',
        summary: '目标值：30→60分钟',
        oldVal: '30分钟',
        newVal: '60分钟',
      },
      {
        time: '2026-03-01 08:00',
        changer: '李思思（主管老师）',
        type: '编辑',
        summary: '创建目标',
        oldVal: null,
        newVal: '每日运动打卡，60分钟',
      },
    ],
  },
  2: {
    id: 2,
    name: '每月跳绳挑战',
    cycleType: 'monthly',
    sportProjectType: 'single',
    sportProjectLabel: '跳绳',
    goalValue: '1000个',
    period: '2026-03-01 至 2026-07-01',
    scope: '七年级1班',
    gender: '不限',
    countRules: {
      sportProjects: '跳绳',
      businessTypes: '自由训练、随堂测试',
      statusTypes: '正常',
      projectTags: '无绳空跳',
    },
    changeRecords: [],
  },
  3: {
    id: 3,
    name: '阳光跑春季计划',
    cycleType: 'semester',
    sportProjectType: 'sunrun',
    sportProjectLabel: '阳光跑',
    goalValue: '周2次',
    period: '2026年春季学期',
    scope: '七年级、八年级',
    gender: '不限',
    countRules: {
      sportProjects: '阳光跑',
      businessTypes: '阳光跑',
      statusTypes: '正常、异常',
    },
    sunrunConfig: {
      weeklyMin: 2,
      monthlyMin: 8,
      dailyMaxKm: 3.0,
      semesterKm: 80,
    },
    changeRecords: [
      {
        time: '2026-05-10 14:20',
        changer: '李思思（主管老师）',
        type: '编辑',
        summary: '新增周最低次数开关：关闭→开启（2次）',
        oldVal: '关闭',
        newVal: '开启（2次）',
      },
    ],
  },
}

// ========== 计入运动记录 Mock（新模块 B） ==========

// 预生成大池子计入记录
const _allRecordsPool = (() => {
  const records = []
  const sports = [
    { name: '跳绳', unit: '个', getScore: () => Math.round(80 + Math.random() * 120), businessTypes: ['自由训练', '随堂测试'], getDuration: () => Math.round(5 + Math.random() * 15) + '分钟' },
    { name: '阳光跑', unit: 'km', getScore: () => (1.5 + Math.random() * 3).toFixed(1), businessTypes: ['阳光跑'], getDuration: () => Math.round(8 + Math.random() * 20) + '分钟' },
    { name: '自由训练', unit: '分钟', getScore: () => Math.round(10 + Math.random() * 40), businessTypes: ['自由训练'], getDuration: () => Math.round(10 + Math.random() * 30) + '分钟' },
    { name: '体能训练', unit: '分钟', getScore: () => Math.round(5 + Math.random() * 30), businessTypes: ['体能训练'], getDuration: () => Math.round(5 + Math.random() * 25) + '分钟' },
    { name: '50米跑', unit: '秒', getScore: () => (7 + Math.random() * 5).toFixed(1), businessTypes: ['随堂测试', '体质测试'], getDuration: () => Math.round(1 + Math.random() * 3) + '分钟' },
    { name: '立定跳远', unit: '厘米', getScore: () => Math.round(120 + Math.random() * 80), businessTypes: ['随堂测试', '自由训练'], getDuration: () => Math.round(2 + Math.random() * 5) + '分钟' },
    { name: '仰卧起坐', unit: '个', getScore: () => Math.round(20 + Math.random() * 30), businessTypes: ['自由训练', '随堂测试'], getDuration: () => Math.round(3 + Math.random() * 10) + '分钟' },
  ]
  for (let i = 0; i < 300; i++) {
    const student = allStudentsPool[i % allStudentsPool.length]
    const sport = sports[i % sports.length]
    const score = sport.getScore()
    const isPartial = sport.name === '阳光跑' && Math.random() > 0.7
    const countedScore = isPartial ? (Math.max(0.5, score - Math.random() * 1.5)).toFixed(1) : score
    const day = new Date(2026, 4, 15 - Math.floor(i / 20))
    const hour = Math.round(8 + Math.random() * 10)
    const minute = Math.round(Math.random() * 60)
    const sportTime = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    const countTime = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')} ${String(Math.round(8 + Math.random() * 8)).padStart(2, '0')}:${String(Math.round(Math.random() * 60)).padStart(2, '0')}`
    // 阳光跑运动时长：正常→有效时长，正常+异常→总时长（取决于成绩状态配置）
    const isSunrun = sport.name === '阳光跑'
    const totalDuration = Math.round(8 + Math.random() * 20)
    const effectiveDuration = Math.round(totalDuration * (0.6 + Math.random() * 0.3))
    const sportDuration = isSunrun
      ? (Math.random() > 0.5 ? `${totalDuration}分钟（总时长）` : `${effectiveDuration}分钟（有效时长）`)
      : sport.getDuration()
    const isDurationSport = ['自由训练', '体能训练'].includes(sport.name)
    const countedScoreText = isDurationSport
      ? sportDuration
      : isPartial ? `${countedScore}${sport.unit}` : `${score}${sport.unit}`

    records.push({
      id: i + 1,
      studentName: student.name,
      gender: student.gender,
      studentNo: student.studentNo,
      grade: student.grade,
      className: student.className,
      sportProject: sport.name,
      score: String(score) + sport.unit,
      scoreStatus: Math.random() > 0.15 ? '正常' : '异常',
      sportTime,                                              // NEW: 运动开始时间
      businessType: sport.businessTypes[Math.floor(Math.random() * sport.businessTypes.length)], // NEW: 业务类型
      sportDuration,                                           // NEW: 运动时长
      countTime,
      countStatus: isPartial ? '部分计入' : '全部计入',
      countedScore: countedScoreText,
    })
  }
  records.sort((a, b) => b.countTime.localeCompare(a.countTime))
  return records
})()

// 目标基本信息摘要
export function getGoalSummary(goalId) {
  const goal = goalList.find(g => g.id === Number(goalId))
  if (!goal) return null
  const rule = goalRules[Number(goalId)]
  return {
    id: goal.id,
    name: goal.name,
    typeLabel: goal.typeLabel || '班级目标',
    cycleType: goal.cycleType,
    sportProjectType: goal.sportProjectType,
    sportProjectLabel: goal.sportProjectLabel,
    goalValueSummary: goal.goalValueSummary,
    completionRate: goal.completionRate,
    达标人数: goal.达标人数,
    coveredCount: goal.coveredCount,
    unreachedCount: Math.max(0, goal.coveredCount - goal.达标人数),
    periodProgress: goal.periodProgress || '',
    period: rule?.period || '',
  }
}

export function getCoveredStudents(goalId, filters = {}) {
  const goal = goalList.find(g => g.id === Number(goalId))
  if (!goal) return []
  const currentCycleText = goal.cycleType === 'daily' ? '天' : goal.cycleType === 'monthly' ? '月' : ''
  const achievedCount = Math.min(goal.达标人数 || 0, (goal.studentsAll || []).length)
  const totalUnits = goal.cycleType === 'monthly' ? 3 : goal.cycleType === 'daily' ? 15 : 0
  const list = (goal.studentsAll || []).map((student, idx) => {
    const reached = idx < achievedCount
    const currentRate = reached ? 100 : Math.max(8, Math.min(96, 35 + ((idx * 13) % 61)))
    const reachedUnits = reached ? totalUnits : Math.min(Math.max(0, totalUnits - 1), (idx * 3) % Math.max(totalUnits, 1))
    let overallStatus
    let progressText
    if (goal.cycleType === 'daily') {
      overallStatus = reached ? '保持达标' : '已失达标'
      progressText = `已达标 ${Math.min(reachedUnits, totalUnits)}/${totalUnits} ${currentCycleText}`
    } else if (goal.cycleType === 'monthly') {
      overallStatus = reached ? '已达标' : '进行中'
      progressText = `本月累计 ${currentRate}%`
    } else if (goal.sportProjectType === 'sunrun') {
      overallStatus = reached ? '已达标' : '已失达标'
      progressText = reached ? '里程、周/月频次均已达标' : '存在周/月频次未达标'
    } else {
      overallStatus = reached ? '已达标' : '未达标'
      progressText = `累计达成 ${currentRate}%`
    }
    return {
      ...student,
      currentRate,
      progressText,
      overallStatus,
      reached,
    }
  })
  let result = list
  if (filters.studentName) {
    const kw = filters.studentName.toLowerCase()
    result = result.filter(s => s.name.toLowerCase().includes(kw) || s.studentNo.includes(kw))
  }
  if (filters.grade) result = result.filter(s => s.grade === filters.grade)
  if (filters.className) result = result.filter(s => s.className === filters.className)
  if (filters.status === 'reached') result = result.filter(s => s.reached)
  if (filters.status === 'unreached') result = result.filter(s => !s.reached)
  result.sort((a, b) => {
    if (a.reached !== b.reached) return a.reached ? 1 : -1
    return a.currentRate - b.currentRate
  })
  return result
}

// 根据目标类型获取应计入的运动项目名称列表
function getSportNamesForGoal(goalId) {
  const goal = goalList.find(g => g.id === Number(goalId))
  if (!goal) return null
  switch (goal.sportProjectType) {
    case 'all': return null // 全部项目，不限制
    case 'sunrun': return ['阳光跑']
    case 'single': return [goal.sportProjectLabel] // 如 '跳绳'
    case 'multi': return ['跳绳', '立定跳远', '仰卧起坐']
    default: return null
  }
}

// 计入运动记录列表（带筛选）
export function getGoalDetailRecords(goalId, filters = {}) {
  let records = [..._allRecordsPool]
  const goal = goalList.find(g => g.id === Number(goalId))

  // 按目标运动项目类型过滤
  const sportNames = getSportNamesForGoal(goalId)
  if (sportNames) {
    records = records.filter(r => sportNames.includes(r.sportProject))
  }

  if (goal?.sportProjectType === 'all') {
    records = records.map(r => ({
      ...r,
      countedScore: r.sportDuration,
    }))
  }

  if (filters.studentName) {
    const kw = filters.studentName.toLowerCase()
    records = records.filter(r =>
      r.studentName.toLowerCase().includes(kw) || r.studentNo.includes(kw)
    )
  }
  if (filters.grade) {
    records = records.filter(r => r.grade === filters.grade)
  }
  if (filters.className) {
    records = records.filter(r => r.className === filters.className)
  }
  if (filters.startDate) {
    records = records.filter(r => r.countTime >= filters.startDate)
  }
  if (filters.endDate) {
    records = records.filter(r => r.countTime <= filters.endDate + ' 23:59')
  }

  // 统计概览
  const totalCount = records.length
  const fullCount = records.filter(r => r.countStatus === '全部计入').length
  const partialCount = totalCount - fullCount

  return {
    stats: { totalCount, fullCount, partialCount },
    records,
    totalPages: Math.ceil(records.length / 20),
  }
}

// 获取适用年级列表（Mock）
export function getAvailableGrades(goalId) {
  return ['七年级', '八年级', '九年级']
}

// 获取适用班级列表（Mock，按年级过滤）
export function getAvailableClasses(goalId, grade) {
  return classList.filter(c => c.grade === grade)
}

// ========== 学生达成详情 Mock（新模块 C） ==========

// 学生在该目标下的计入记录（按目标运动项目类型过滤）
export function getStudentGoalRecords(goalId, studentId) {
  const goal = goalList.find(g => g.id === Number(goalId))
  const student = findStudentById(studentId)
  let records = _allRecordsPool.filter(r => r.studentNo === student.studentNo)
  const sportNames = getSportNamesForGoal(goalId)
  if (sportNames) {
    records = records.filter(r => sportNames.includes(r.sportProject))
  }
  if (goal?.sportProjectType === 'all') {
    records = records.map(r => ({
      ...r,
      countedScore: r.sportDuration,
    }))
  }
  return records.slice(0, 20)
}

// 周期达标概览数据生成
function generatePeriodAchievement(goal, rule, shouldReach = false) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  if (goal.cycleType === 'daily') {
    // 每日目标 → 日历视图
    const dates = []
    const startDay = new Date(year, month - 1, 1)
    const endDay = new Date(year, month, 0)
    let reachedDays = 0
    let totalDays = 0
    for (let d = new Date(startDay); d <= endDay && d <= now; d.setDate(d.getDate() + 1)) {
      totalDays++
      const isLast = d.toDateString() === now.toDateString()
      const status = shouldReach || (!isLast && Math.random() > 0.2) ? 'reached' : 'unreached'
      if (status === 'reached') reachedDays++
      dates.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        status,
      })
    }
    return { cycleType: 'daily', calendar: { totalDays, reachedDays, dates } }
  }

  if (goal.cycleType === 'monthly') {
    // 每月目标 → 月份卡片
    const months = []
    for (let m = 3; m <= month; m++) {
      const reached = shouldReach || m < month ? true : false
      months.push({ month: `${m}月`, summary: reached ? `已完成 ${goal.goalValueSummary}` : `完成 ${Math.round(Number(goal.goalValueSummary.match(/\d+/)?.[0] || 100) * (0.3 + Math.random() * 0.4))}${goal.goalValueSummary.replace(/^\d+/, '')} / ${goal.goalValueSummary}`, reached })
    }
    return { cycleType: 'monthly', months }
  }

  // 学期/自定义目标 → 按计入方式
  const goalNum = Number(goal.goalValueSummary.match(/\d+/)?.[0] || 0)
  if (goal.sportProjectType === 'all') {
    const current = shouldReach ? Math.round(goalNum * (1 + Math.random() * 0.2)) : Math.round(goalNum * (0.5 + Math.random() * 0.4))
    return { cycleType: goal.cycleType, sportMode: 'all', progressAll: { goalValue: `${goalNum} 分钟/月`, currentValue: `${current} 分钟`, progress: Math.round(current / goalNum * 100) } }
  }
  if (goal.sportProjectType === 'single') {
    const current = shouldReach ? Math.round(goalNum * (1 + Math.random() * 0.2)) : Math.round(goalNum * (0.3 + Math.random() * 0.5))
    return { cycleType: goal.cycleType, sportMode: 'single', progressSingle: { goalValue: goal.goalValueSummary, currentValue: `${current}${goal.goalValueSummary.replace(/^\d+/, '')}`, progress: Math.round(current / goalNum * 100) } }
  }
  if (goal.sportProjectType === 'sunrun') {
    const sunrunCfg = rule?.sunrunConfig || { weeklyMin: 2, monthlyMin: 8 }
    const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
    const weekMonths = ['3月', '4月', '5月']
    return {
      cycleType: goal.cycleType,
      sportMode: 'sunrun',
      sunrun: {
        totalMileage: shouldReach ? (80 + Math.random() * 10).toFixed(1) : (20 + Math.random() * 45).toFixed(1),
        weeklyStatus: weeks.slice(0, 6 + Math.floor(Math.random() * 3)).map((w, idx) => ({ week: w, reached: shouldReach || idx < 5 })),
        monthlyStatus: weekMonths.map((m, idx) => ({ month: m, reached: shouldReach || idx < 2 })),
      },
    }
  }
  return null
}

// 学生达成详情完整数据
export function getNewStudentDetail(goalId, studentId) {
  const goal = goalList.find(g => g.id === Number(goalId))
  const rule = goalRules[Number(goalId)]
  const student = findStudentById(studentId)
  if (!goal || !student) return null

  const records = getStudentGoalRecords(goalId, studentId)
  const goalNum = Number(goal.goalValueSummary.match(/\d+/)?.[0] || 0)
  const isReached = getStudentReachedInGoal(goal, studentId)
  const actual = isReached
    ? Math.round(goalNum * (1 + Math.random() * 0.2))
    : Math.round(goalNum * (0.4 + Math.random() * 0.5))
  const gap = Math.max(0, goalNum - actual)

  // 多项运动目标生成子条件达标状态
  let subConditions = null
  if (goal.sportProjectType === 'multi') {
    const subs = [
      { name: '跳绳', goal: '100个', value: isReached ? '120个' : '80个', reached: isReached || Math.random() > 0.3 },
      { name: '立定跳远', goal: '150厘米', value: isReached ? '170厘米' : '130厘米', reached: isReached || Math.random() > 0.4 },
      { name: '仰卧起坐', goal: '40个', value: isReached ? '48个' : '28个', reached: isReached || Math.random() > 0.5 },
    ]
    const allReached = subs.every(s => s.reached)
    subConditions = { items: subs, allReached }
  }

  // 周期达标概览
  const periodAchievement = generatePeriodAchievement(goal, rule, isReached)

  return {
    student,
    goalSummary: {
      name: goal.name,
      typeLabel: goal.typeLabel || '班级目标',
      cycleType: goal.cycleType,
      sportProjectLabel: goal.sportProjectLabel,
      sportProjectType: goal.sportProjectType,
      goalValue: goal.goalValueSummary,
      period: rule?.period || '',
      countRules: rule?.countRules || {},
    },
    periodAchievement,
    subConditions,
    isReached,
    gapSummary: `还差 ${gap} ${goal.goalValueSummary.replace(/^\d+/, '')}`,
    records,
  }
}

// 单条记录详情
export function getRecordById(recordId) {
  return _allRecordsPool.find(r => r.id === Number(recordId)) || null
}

// 学生达成列表 Mock（保留，供后续使用）
export function getStudentList(goalId, classId, statusFilter) {
  const goal = goalList.find(g => g.id === Number(goalId))
  if (!goal) return []

  const allStudents = goal.studentsAll || []
  let list = allStudents.map(s => {
    const isReached = goal.students.includes(s.id)
    const completeValue = isReached
      ? Math.round(goal.goalValueSummary.match(/\d+/)?.[0] * (0.85 + Math.random() * 0.3))
      : Math.round(goal.goalValueSummary.match(/\d+/)?.[0] * (0.1 + Math.random() * 0.6))
    const rate = isReached ? 100 : Math.round(completeValue / Number(goal.goalValueSummary.match(/\d+/)?.[0] || 1) * 100)
    return {
      id: s.id,
      name: s.name,
      className: s.className,
      completeValue: completeValue + (goal.goalValueSummary.replace(/\d+/g, '') || ''),
      achievementRate: rate,
      reached: isReached,
    }
  })

  if (statusFilter === 'reached') list = list.filter(s => s.reached)
  else if (statusFilter === 'unreached') list = list.filter(s => !s.reached)

  // 排序：未达标在前，按达成率升序
  list.sort((a, b) => {
    if (a.reached !== b.reached) return a.reached ? 1 : -1
    return a.achievementRate - b.achievementRate
  })

  return list
}

// 学生达成详情 Mock
export function getStudentDetail(goalId, studentId) {
  const goal = goalRules[goalId]
  const student = findStudentById(studentId)
  if (!goal || !student) return null

  const goalNum = Number(goal.goalValue.match(/\d+/)?.[0] || 0)
  const actual = Math.round(goalNum * (0.4 + Math.random() * 0.7))
  const gap = Math.max(0, goalNum - actual)

  const countRecords = generateCountRecords(goal.sportProjectLabel, actual, goalNum)

  return {
    student,
    goalRule: {
      name: goal.name,
      cycleType: goal.cycleType,
      sportProject: goal.sportProjectLabel,
      goalValue: goal.goalValue,
      period: goal.period,
      scope: goal.scope,
      countRules: goal.countRules,
    },
    gapSummary: {
      all: `还差 ${gap} 分钟达到目标`,
      single: `${goal.sportProjectLabel} 还差 ${gap} 个`,
      multi: `条件1：还差 ${Math.round(gap * 0.4)} 个；条件2：还差 ${Math.round(gap * 0.3)} 个`,
      sunrun: `还差 ${(gap / 10).toFixed(1)} 公里 / ${Math.round(gap * 0.2)} 次`,
    },
    countRecords,
    changeRecords: goal.changeRecords,
  }
}
