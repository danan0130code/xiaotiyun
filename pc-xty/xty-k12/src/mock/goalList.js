// 目标类型（学生）
const STUDENT_GOAL_TYPES = {
  WHOLE_SCHOOL: { value: 'whole_school', label: '全校目标', color: 'blue' },
  CLASS: { value: 'class', label: '班级目标', color: 'green' },
}

// 周期类型
const CYCLE_TYPES = {
  DAILY: { value: 'daily', label: '每日', color: 'cyan' },
  MONTHLY: { value: 'monthly', label: '每月', color: 'geekblue' },
  SEMESTER: { value: 'semester', label: '学期', color: 'purple' },
  CUSTOM: { value: 'custom', label: '自定义周期', color: 'orange' },
}

// 计入运动项目方式
const SPORT_MODES = {
  ALL: { value: 'all', label: '多个项目', color: 'blue' },
  SUNRUN: { value: 'sunrun', label: '阳光跑', color: 'purple' },
  SINGLE: { value: 'single', label: '单个项目', color: 'green' },
  MULTI: { value: 'multi', label: '多个单项', color: 'orange' },
}

// 目标状态
const GOAL_STATUS = {
  PENDING: { value: 'pending', label: '未生效', color: 'default' },
  ACTIVE: { value: 'active', label: '生效中', color: 'success' },
  STOPPED: { value: 'stopped', label: '已停止', color: 'warning' },
  EXPIRED: { value: 'expired', label: '已过期', color: 'default' },
}

const SPORTS_PROJECTS = [
  '跳绳', '跑步', '仰卧起坐', '引体向上', '立定跳远',
  '篮球', '足球', '乒乓球', '羽毛球', '游泳',
  '50米跑', '800米跑', '1000米跑', '实心球', '排球',
]

// 非运动项目（不计入目标统计）
const NON_SPORT_PROJECTS = ['身高体重', '肺活量', '握力', '坐位体前屈']

const BUSINESS_TYPES = ['自由训练', '随堂测试', '串班训练', '体质测试', '校园活动', '阳光跑']
const WEEKDAY_OPTIONS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const DEFAULT_EXECUTE_WEEKDAYS = [...WEEKDAY_OPTIONS]

function normalizeExecuteWeekdays(days) {
  return days && days.length > 0 ? days : DEFAULT_EXECUTE_WEEKDAYS
}

function executeWeekdaysText(days) {
  const normalized = normalizeExecuteWeekdays(days)
  return normalized.length === 7 ? '周一至周日' : normalized.join('、')
}

const GRADES = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三']

const SCHOOLS = ['实验小学', '第一中学', '第二中学', '阳光小学', '育才学校']

const CLASSES_POOL = [
  { value: '1-1', label: '一年级1班', grade: '一年级' },
  { value: '1-2', label: '一年级2班', grade: '一年级' },
  { value: '2-1', label: '二年级1班', grade: '二年级' },
  { value: '2-2', label: '二年级2班', grade: '二年级' },
  { value: '3-1', label: '三年级1班', grade: '三年级' },
  { value: '3-2', label: '三年级2班', grade: '三年级' },
  { value: '4-1', label: '四年级1班', grade: '四年级' },
  { value: '5-1', label: '五年级1班', grade: '五年级' },
  { value: '6-1', label: '六年级1班', grade: '六年级' },
  { value: '7-1', label: '初一1班', grade: '初一' },
  { value: '7-2', label: '初一2班', grade: '初一' },
  { value: '8-1', label: '初二1班', grade: '初二' },
  { value: '9-1', label: '初三1班', grade: '初三' },
  { value: '9-2', label: '初三2班', grade: '初三' },
]

const TEACHER_ROLES = ['学校管理员', '普通教师', '体育老师']

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomFloat = (min, max, decimals = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

// 模块级缓存：确保列表和详情数据一致
let _studentGoalCache = null
let _teacherGoalCache = null

// 根据 period 类型生成生效周期展示文本
function periodText(goal) {
  switch (goal.cycleType) {
    case 'daily':
      return `${goal.effectiveStart || '2026-05-01'} 至 ${goal.effectiveEnd || '2026-07-01'}（${executeWeekdaysText(goal.executeWeekdays)}）`
    case 'monthly':
      return `${goal.effectiveStart || '2026年5月'} 至 ${goal.effectiveEnd || '2026年7月'}`
    case 'semester':
      return goal.semester || '2025-2026学年第一学期'
    case 'custom':
      return `${goal.effectiveStart || '2026-05-01'} 至 ${goal.effectiveEnd || '2026-07-01'}`
    default:
      return ''
  }
}

// 目标值摘要
function goalValueSummary(goal) {
  switch (goal.sportMode) {
    case 'all':
      return `${goal.cycleType === 'daily' ? `执行${executeWeekdaysText(goal.executeWeekdays)}，` : ''}运动时长 ${goal.duration || 60} ${goal.durationUnit === 'hour' ? '小时' : '分钟'}`
    case 'sunrun': {
      const cfg = goal.sunrunConfig || {}
      const parts = []
      if (cfg.weeklyMinEnabled && cfg.weeklyMinTimes) parts.push(`周${cfg.weeklyMinTimes}次`)
      if (cfg.monthlyMinEnabled && cfg.monthlyMinTimes) parts.push(`月${cfg.monthlyMinTimes}次`)
      if (cfg.dailyLimitEnabled && cfg.dailyLimitKm) parts.push(`日上限${cfg.dailyLimitKm}km`)
      if (cfg.singleRunMinEnabled && cfg.singleRunMinKm) parts.push(`单次≥${cfg.singleRunMinKm}km`)
      if (cfg.semesterGoal) parts.push(`学期${cfg.semesterGoal}km`)
      return parts.length > 0 ? parts.join(' / ') : '频次+里程'
    }
    case 'single':
      return `${goal.sportProject || ''} ${goal.targetValue || 0}${goal.targetUnit || '个'}`
    case 'multi':
      return `${(goal.subConditions || []).length} 个子条件`
    default:
      return ''
  }
}

// 适用范围展示文本
function scopeDisplayText(goal) {
  const gender = goal.scopeGender || 'all'
  const genderMark = gender === 'male' ? ' ♂' : gender === 'female' ? ' ♀' : ''
  if (goal.goalTargetType === 'class') {
    const cls = CLASSES_POOL.find(c => c.value === goal.scopeClasses)
    return (cls?.label || goal.scopeClasses || '') + genderMark
  }
  if (goal.scopeLevel === 'all') return '全校' + genderMark
  if (goal.scopeLevel === 'grades') return `${goal.scopeGrades?.length || 0}个年级` + genderMark
  if (goal.scopeLevel === 'classes') return `${goal.scopeClasses?.length || 0}个班级` + genderMark
  return ''
}

// 教师适用范围展示文本（按角色维度）
function teacherScopeText(goal) {
  if (!goal.scopeRoles || goal.scopeRoles.length === 0) return '全校教师'
  return goal.scopeRoles.join('、')
}

// 计入规则摘要
function countingRuleSummary(goal) {
  const rules = goal.countingRules || {}
  const sports = rules.sportProjects === 'all' ? '全部运动' : `${(rules.sportProjects || []).length}个项目`
  const biz = `${(rules.businessTypes || []).length}种业务`
  const score = (rules.scoreStatuses || []).join('、') || '正常'
  const frequency = goal.cycleType === 'daily' ? `${executeWeekdaysText(goal.executeWeekdays)} / ` : ''
  return `${frequency}${sports} / ${biz} / ${score}`
}

// ===== 学生目标生成器 =====
function generateStudentGoalList(count = 30) {
  if (!_studentGoalCache) _studentGoalCache = generateStudentGoalListInternal(count)
  return _studentGoalCache
}

function generateStudentGoalListInternal(count = 30) {
  const types = Object.keys(STUDENT_GOAL_TYPES)
  const statuses = Object.keys(GOAL_STATUS)
  const creators = [
    { name: '张管理', role: '管理员' },
    { name: '李体育', role: '教师' },
    { name: '王教学', role: '教师' },
  ]

  const allGoals = Array.from({ length: count }, (_, i) => {
    const goalTargetType = randomItem(Object.values(STUDENT_GOAL_TYPES).map(t => t.value))
    const typeCfg = STUDENT_GOAL_TYPES[Object.keys(STUDENT_GOAL_TYPES).find(k => STUDENT_GOAL_TYPES[k].value === goalTargetType)]
    const cycleType = randomItem(Object.values(CYCLE_TYPES).map(t => t.value))
    const cycleCfg = CYCLE_TYPES[Object.keys(CYCLE_TYPES).find(k => CYCLE_TYPES[k].value === cycleType)]
    const sportMode = randomItem(Object.values(SPORT_MODES).map(t => t.value))
    const sportCfg = SPORT_MODES[Object.keys(SPORT_MODES).find(k => SPORT_MODES[k].value === sportMode)]
    const statusKey = randomItem(statuses)
    const statusCfg = GOAL_STATUS[statusKey]
    const creator = randomItem(creators)

    const goal = {
      id: `student-${i + 1}`,
      name: `${typeCfg.label}-${i + 1}`,
      goalTargetType,
      goalTargetLabel: typeCfg.label,
      goalTargetColor: typeCfg.color,
      cycleType,
      cycleTypeLabel: cycleCfg.label,
      cycleTypeColor: cycleCfg.color,
      sportMode,
      sportModeLabel: sportCfg.label,
      sportModeColor: sportCfg.color,
      status: statusKey.toLowerCase(),
      statusLabel: statusCfg.label,
      statusColor: statusCfg.color,
      creator: creator.name,
      creatorRole: creator.role,
      createdAt: `2026-${String(random(4, 5)).padStart(2, '0')}-${String(random(1, 30)).padStart(2, '0')} ${String(random(8, 18)).padStart(2, '0')}:${String(random(0, 59)).padStart(2, '0')}`,
      statusTime: `2026-${String(random(4, 5)).padStart(2, '0')}-${String(random(1, 30)).padStart(2, '0')} ${String(random(8, 18)).padStart(2, '0')}:${String(random(0, 59)).padStart(2, '0')}`,
    }

    // 生效周期
    if (cycleType === 'daily') {
      goal.effectiveStart = `2026-0${random(4, 5)}-${String(random(1, 28)).padStart(2, '0')}`
      goal.effectiveEnd = `2026-0${random(6, 7)}-${String(random(1, 28)).padStart(2, '0')}`
      goal.executeWeekdays = randomItem([
        DEFAULT_EXECUTE_WEEKDAYS,
        ['周一', '周三', '周五'],
        ['周一', '周二', '周三', '周四', '周五'],
      ])
      goal.executeWeekdaysText = executeWeekdaysText(goal.executeWeekdays)
    } else if (cycleType === 'monthly') {
      goal.effectiveStart = `2026年${random(3, 5)}月`
      goal.effectiveEnd = `2026年${random(6, 8)}月`
    } else if (cycleType === 'semester') {
      goal.semester = randomItem(['2025-2026学年第二学期', '2026-2027学年第一学期'])
    } else if (cycleType === 'custom') {
      goal.effectiveStart = `2026-0${random(3, 5)}-${String(random(1, 28)).padStart(2, '0')}`
      goal.effectiveEnd = `2026-0${random(6, 8)}-${String(random(1, 28)).padStart(2, '0')}`
    }

    // 目标值
    if (sportMode === 'all') {
      goal.duration = random(30, 120)
      goal.durationUnit = randomItem(['minute', 'hour'])
    } else if (sportMode === 'sunrun') {
      // 每日目标不支持设置日/周/月限制
      const isDaily = cycleType === 'daily'
      const wkEnable = !isDaily && random(0, 1) === 1
      const moEnable = !isDaily && wkEnable && random(0, 1) === 1
      const dlEnable = !isDaily && random(0, 1) === 1
      const wkTimes = wkEnable ? random(2, 4) : undefined
      const moTimes = moEnable ? (wkTimes || 2) + random(2, 5) : undefined
      goal.sunrunConfig = {
        weeklyMinEnabled: wkEnable,
        weeklyMinTimes: wkTimes,
        monthlyMinEnabled: moEnable,
        monthlyMinTimes: moTimes,
        dailyLimitEnabled: dlEnable,
        dailyLimitKm: dlEnable ? randomFloat(1, 5, 1) : undefined,
        singleRunMinEnabled: random(0, 1) === 1,
        singleRunMinKm: randomFloat(0.5, 2, 1),
        semesterGoal: random(0, 1) === 1 ? random(20, 100) : undefined,
        paceConfig: {
          minPace: '3\'30"',
          maxPace: '8\'00"',
          minDistance: '0.8km',
        },
      }
    } else if (sportMode === 'single') {
      goal.sportProject = randomItem(SPORTS_PROJECTS)
      goal.targetValue = random(100, 2000)
      goal.targetUnit = randomItem(['个', '次', '米', '分钟'])
    } else if (sportMode === 'multi') {
      const subCount = random(2, 4)
      goal.subConditions = Array.from({ length: subCount }, (_, si) => ({
        sportProject: SPORTS_PROJECTS[si],
        targetValue: random(50, 500),
        unit: randomItem(['个', '次', '分钟']),
      }))
    }

    // 适用范围
    goal.scopeGender = randomItem(['all', 'male', 'female'])
    if (goalTargetType === 'whole_school') {
      goal.scopeLevel = randomItem(['all', 'grades', 'classes'])
      if (goal.scopeLevel === 'grades') {
        const cnt = random(2, 5)
        goal.scopeGrades = GRADES.slice(0, cnt)
      }
      if (goal.scopeLevel === 'classes') {
        const cnt = random(2, 5)
        goal.scopeClasses = CLASSES_POOL.slice(0, cnt).map(c => c.value)
      }
    } else {
      // 班级目标：单选一个班级
      goal.scopeLevel = 'classes'
      goal.scopeClasses = randomItem(CLASSES_POOL).value
    }

    // 计入规则
    goal.countingRules = {
      sportProjects: sportMode === 'sunrun' ? ['阳光跑'] : sportMode === 'all' ? (random(0, 1) === 1 ? 'all' : SPORTS_PROJECTS.slice(0, random(3, SPORTS_PROJECTS.length))) : sportMode === 'single' ? [goal.sportProject] : (goal.subConditions || []).map(s => s.sportProject),
      businessTypes: sportMode === 'sunrun' ? ['阳光跑'] : BUSINESS_TYPES.slice(0, random(2, 5)),
      scoreStatuses: randomItem([['正常'], ['异常'], ['正常', '异常']]),
      projectTags: sportMode !== 'sunrun' && random(0, 1) === 1 ? randomItem([['无绳空跳'], ['疑似作弊'], []]) : [],
    }

    // 完成情况（所有周期类型，非未生效状态均应有完成率）
    if (goal.status !== 'pending') {
      goal.completionRate = random(30, 98)
      goal.completionTotal = random(100, 500)
      goal.completionAchieved = Math.floor(goal.completionTotal * goal.completionRate / 100)
    } else {
      goal.completionRate = null
      goal.completionTotal = 0
      goal.completionAchieved = 0
    }

    // 计算展示字段
    goal.periodText = periodText(goal)
    goal.goalValueSummary = goalValueSummary(goal)
    goal.scopeText = scopeDisplayText(goal)
    goal.ruleSummary = countingRuleSummary(goal)
    goal.lastEditor = creator.name
    goal.lastEditTime = `2026-05-${String(random(14, 15)).padStart(2, '0')} ${String(random(9, 17)).padStart(2, '0')}:${String(random(0, 59)).padStart(2, '0')}`

    return goal
  })

  // 补充3个固定的单个项目目标（跳绳、50米跑、立定跳远）
  const singleGoals = [
    { sportProject: '跳绳', targetValue: 2000, unit: '个', sportMode: 'single', sportModeColor: 'green', grade: '三年级', gradeScopeCount: 2, className: '三年级1班' },
    { sportProject: '50米跑', targetValue: 100, unit: '秒', sportMode: 'single', sportModeColor: 'green', grade: '四年级', gradeScopeCount: 2, className: '四年级1班' },
    { sportProject: '立定跳远', targetValue: 180, unit: '厘米', sportMode: 'single', sportModeColor: 'green', grade: '五年级', gradeScopeCount: 2, className: '五年级1班' },
  ]
  singleGoals.forEach((tmpl, idx) => {
    allGoals.push({
      id: `student-single-demo-${idx + 1}`,
      name: `${tmpl.sportProject}目标`,
      goalTargetType: idx === 0 ? 'class' : 'whole_school',
      goalTargetLabel: idx === 0 ? '班级目标' : '全校目标',
      goalTargetColor: idx === 0 ? 'green' : 'blue',
      cycleType: 'daily',
      cycleTypeLabel: '每日',
      cycleTypeColor: 'cyan',
      sportMode: 'single',
      sportModeLabel: '单个项目',
      sportModeColor: 'green',
      status: 'active',
      statusLabel: '生效中',
      statusColor: 'success',
      creator: '张管理',
      creatorRole: '管理员',
      createdAt: '2026-05-01 10:00',
      statusTime: '2026-05-01 10:00',
      effectiveStart: '2026-05-01',
      effectiveEnd: '2026-07-01',
      executeWeekdays: idx === 0 ? ['周一', '周三', '周五'] : DEFAULT_EXECUTE_WEEKDAYS,
      executeWeekdaysText: idx === 0 ? '周一、周三、周五' : '周一至周日',
      effectiveStartRaw: '2026-05-01',
      effectiveEndRaw: '2026-07-01',
      sportProject: tmpl.sportProject,
      targetValue: tmpl.targetValue,
      targetUnit: tmpl.unit,
      scopeGender: 'all',
      scopeLevel: idx === 0 ? 'classes' : 'grades',
      scopeGrades: idx === 0 ? undefined : [tmpl.grade],
      scopeClasses: idx === 0 ? CLASSES_POOL.find(c => c.grade === tmpl.grade)?.value || `${tmpl.grade}1班` : undefined,
      scopeText: idx === 0 ? tmpl.className : `${tmpl.gradeScopeCount}个年级`,
      countingRules: {
        sportProjects: [tmpl.sportProject],
        businessTypes: idx === 0 ? ['自由训练', '校园活动'] : ['自由训练', '随堂测试'],
        scoreStatuses: ['正常'],
        projectTags: tmpl.sportProject === '跳绳' ? ['跳绳:无绳空跳'] : [],
      },
      completionRate: idx === 0 ? 85 : 72,
      completionTotal: idx === 0 ? 45 : 120,
      completionAchieved: idx === 0 ? 38 : 86,
      periodText: '2026-05-01 至 2026-07-01',
      goalValueSummary: `${tmpl.sportProject} ${tmpl.targetValue}${tmpl.unit}`,
      ruleSummary: `${idx === 0 ? '周一、周三、周五' : '周一至周日'} / 1个项目 / 2种业务 / 正常`,
      lastEditor: '张管理',
      lastEditTime: '2026-05-01 14:30',
    })
  })

  // 补充一个固定的多项目目标（5个项目：跳绳算个数、跑步算时间、仰卧起坐算次数、阳光跑算里程、立定跳远算成绩）
  const multiGoal = {
    id: 'student-multi-demo',
    name: '多项目综合运动目标',
    goalTargetType: 'whole_school',
    goalTargetLabel: '全校目标',
    goalTargetColor: 'blue',
    cycleType: 'monthly',
    cycleTypeLabel: '每月',
    cycleTypeColor: 'geekblue',
    sportMode: 'multi',
    sportModeLabel: '多个单项',
    sportModeColor: 'orange',
    status: 'active',
    statusLabel: '生效中',
    statusColor: 'success',
    creator: '张管理',
    creatorRole: '管理员',
    createdAt: '2026-05-01 10:00',
    statusTime: '2026-05-01 10:00',
    effectiveStart: '2026年5月',
    effectiveEnd: '2026年7月',
    effectiveStartRaw: '2026-05-01',
    effectiveEndRaw: '2026-07-31',
    subConditions: [
      { sportProject: '跳绳', targetValue: 2000, unit: '个' },       // 算个数
      { sportProject: '跑步', targetValue: 300, unit: '分钟' },       // 算时间
      { sportProject: '仰卧起坐', targetValue: 200, unit: '次' },     // 算次数
      { sportProject: '阳光跑', targetValue: 40, unit: '公里' },      // 算里程
      { sportProject: '立定跳远', targetValue: 500, unit: '厘米' },   // 算成绩
    ],
    scopeLevel: 'grades',
    scopeGrades: ['三年级', '四年级', '五年级'],
    scopeGender: 'all',
    scopeText: '3个年级',
    countingRules: {
      sportProjects: ['跳绳', '跑步', '仰卧起坐', '阳光跑', '立定跳远'],
      businessTypes: ['自由训练', '随堂测试', '体质测试'],
      scoreStatuses: ['正常', '异常'],
      projectTags: [],
    },
    completionRate: 68,
    completionTotal: 450,
    completionAchieved: 306,
    periodText: '2026年5月 至 2026年7月',
    goalValueSummary: '5 个子条件',
    ruleSummary: '5个项目 / 3种业务 / 正常、异常',
    lastEditor: '张管理',
    lastEditTime: '2026-05-01 14:30',
  }

  return [...allGoals, multiGoal]
}

// ===== 教师目标生成器 =====
function generateTeacherGoalList(count = 15) {
  if (!_teacherGoalCache) _teacherGoalCache = generateTeacherGoalListInternal(count)
  return _teacherGoalCache
}

function generateTeacherGoalListInternal(count = 15) {
  const statuses = Object.keys(GOAL_STATUS)
  const creators = [
    { name: '张管理', role: '管理员' },
    { name: '李体育', role: '教师' },
  ]

  return Array.from({ length: count }, (_, i) => {
    const cycleType = randomItem(Object.values(CYCLE_TYPES).map(t => t.value))
    const cycleCfg = CYCLE_TYPES[Object.keys(CYCLE_TYPES).find(k => CYCLE_TYPES[k].value === cycleType)]
    const sportMode = randomItem(Object.values(SPORT_MODES).map(t => t.value))
    const sportCfg = SPORT_MODES[Object.keys(SPORT_MODES).find(k => SPORT_MODES[k].value === sportMode)]
    const statusKey = randomItem(statuses)
    const statusCfg = GOAL_STATUS[statusKey]
    const creator = randomItem(creators)

    const goal = {
      id: `teacher-${i + 1}`,
      name: `教师目标-${i + 1}`,
      goalTargetType: 'teacher',
      goalTargetLabel: '教师目标',
      goalTargetColor: 'red',
      cycleType,
      cycleTypeLabel: cycleCfg.label,
      cycleTypeColor: cycleCfg.color,
      sportMode,
      sportModeLabel: sportCfg.label,
      sportModeColor: sportCfg.color,
      status: statusKey.toLowerCase(),
      statusLabel: statusCfg.label,
      statusColor: statusCfg.color,
      creator: creator.name,
      creatorRole: creator.role,
      createdAt: `2026-${String(random(4, 5)).padStart(2, '0')}-${String(random(1, 30)).padStart(2, '0')} ${String(random(8, 18)).padStart(2, '0')}:${String(random(0, 59)).padStart(2, '0')}`,
      statusTime: `2026-${String(random(4, 5)).padStart(2, '0')}-${String(random(1, 30)).padStart(2, '0')} ${String(random(8, 18)).padStart(2, '0')}:${String(random(0, 59)).padStart(2, '0')}`,
    }

    // 生效周期
    if (cycleType === 'daily') {
      goal.effectiveStart = `2026-0${random(4, 5)}-${String(random(1, 28)).padStart(2, '0')}`
      goal.effectiveEnd = `2026-0${random(6, 7)}-${String(random(1, 28)).padStart(2, '0')}`
      goal.executeWeekdays = randomItem([
        DEFAULT_EXECUTE_WEEKDAYS,
        ['周一', '周三', '周五'],
        ['周一', '周二', '周三', '周四', '周五'],
      ])
      goal.executeWeekdaysText = executeWeekdaysText(goal.executeWeekdays)
    } else if (cycleType === 'monthly') {
      goal.effectiveStart = `2026年${random(3, 5)}月`
      goal.effectiveEnd = `2026年${random(6, 8)}月`
    } else if (cycleType === 'semester') {
      goal.semester = randomItem(['2025-2026学年第二学期', '2026-2027学年第一学期'])
    } else if (cycleType === 'custom') {
      goal.effectiveStart = `2026-0${random(3, 5)}-${String(random(1, 28)).padStart(2, '0')}`
      goal.effectiveEnd = `2026-0${random(6, 8)}-${String(random(1, 28)).padStart(2, '0')}`
    }

    // 目标值（与 student 相同逻辑）
    if (sportMode === 'all') {
      goal.duration = random(30, 120)
      goal.durationUnit = randomItem(['minute', 'hour'])
    } else if (sportMode === 'sunrun') {
      // 每日目标不支持设置日/周/月限制
      const isDaily = cycleType === 'daily'
      const wkEnable = !isDaily && random(0, 1) === 1
      const moEnable = !isDaily && wkEnable && random(0, 1) === 1
      const dlEnable = !isDaily && random(0, 1) === 1
      goal.sunrunConfig = {
        weeklyMinEnabled: wkEnable,
        weeklyMinTimes: wkEnable ? random(2, 4) : undefined,
        monthlyMinEnabled: moEnable,
        monthlyMinTimes: moEnable ? (wkEnable ? random(2, 4) : 2) + random(2, 5) : undefined,
        dailyLimitEnabled: dlEnable,
        dailyLimitKm: dlEnable ? randomFloat(1, 5, 1) : undefined,
        semesterGoal: random(0, 1) === 1 ? random(20, 100) : undefined,
        paceConfig: { minPace: "3'30\"", maxPace: "8'00\"", minDistance: '0.8km' },
      }
    } else if (sportMode === 'single') {
      goal.sportProject = randomItem(SPORTS_PROJECTS)
      goal.targetValue = random(100, 2000)
      goal.targetUnit = randomItem(['个', '次', '米', '分钟'])
    } else if (sportMode === 'multi') {
      const subCount = random(2, 3)
      goal.subConditions = Array.from({ length: subCount }, (_, si) => ({
        sportProject: SPORTS_PROJECTS[si + 2],
        targetValue: random(50, 500),
        unit: randomItem(['个', '次', '分钟']),
      }))
    }

    // 适用范围（教师维度 - 按角色）
    const roleCount = random(1, 3)
    goal.scopeRoles = TEACHER_ROLES.slice(0, roleCount)

    // 计入规则
    goal.countingRules = {
      sportProjects: sportMode === 'sunrun' ? ['阳光跑'] : sportMode === 'all' ? (random(0, 1) === 1 ? 'all' : SPORTS_PROJECTS.slice(0, random(3, SPORTS_PROJECTS.length))) : sportMode === 'single' ? [goal.sportProject] : (goal.subConditions || []).map(s => s.sportProject),
      businessTypes: sportMode === 'sunrun' ? ['阳光跑'] : BUSINESS_TYPES.slice(0, random(2, 5)),
      scoreStatuses: randomItem([['正常'], ['异常'], ['正常', '异常']]),
      projectTags: sportMode !== 'sunrun' && random(0, 1) === 1 ? randomItem([['无绳空跳'], []]) : [],
    }

    // 完成情况
    if (goal.status !== 'pending') {
      goal.completionRate = random(20, 95)
      goal.completionTotal = random(10, 80)
      goal.completionAchieved = Math.floor(goal.completionTotal * goal.completionRate / 100)
    } else {
      goal.completionRate = null
      goal.completionTotal = 0
      goal.completionAchieved = 0
    }

    goal.periodText = periodText(goal)
    goal.goalValueSummary = goalValueSummary(goal)
    goal.scopeText = teacherScopeText(goal)
    goal.ruleSummary = countingRuleSummary(goal)
    goal.lastEditor = creator.name
    goal.lastEditTime = `2026-05-${String(random(14, 15)).padStart(2, '0')} ${String(random(9, 17)).padStart(2, '0')}:${String(random(0, 59)).padStart(2, '0')}`

    return goal
  })
}

// 过滤函数
function applyFilters(list, filters) {
  return list.filter(item => {
    if (filters.goalType && filters.goalType.length > 0 && !filters.goalType.includes(item.goalTargetType)) return false
    if (filters.sportMode && filters.sportMode.length > 0 && !filters.sportMode.includes(item.sportMode)) return false
    if (filters.status && filters.status.length > 0 && !filters.status.includes(item.status)) return false
    if (filters.keyword && !item.name.includes(filters.keyword)) return false
    if (filters.dateRange && filters.dateRange.length === 2) {
      const start = item.effectiveStart || ''
      const end = item.effectiveEnd || ''
      const filterStart = filters.dateRange[0]
      const filterEnd = filters.dateRange[1]
      if (end && start && (end < filterStart || start > filterEnd)) return false
    }
    return true
  })
}

function applyTeacherFilters(list, filters) {
  return list.filter(item => {
    if (filters.cycleType && filters.cycleType.length > 0 && !filters.cycleType.includes(item.cycleType)) return false
    if (filters.sportMode && filters.sportMode.length > 0 && !filters.sportMode.includes(item.sportMode)) return false
    if (filters.status && filters.status.length > 0 && !filters.status.includes(item.status)) return false
    if (filters.keyword && !item.name.includes(filters.keyword)) return false
    if (filters.dateRange && filters.dateRange.length === 2) {
      const start = item.effectiveStart || ''
      const end = item.effectiveEnd || ''
      const filterStart = filters.dateRange[0]
      const filterEnd = filters.dateRange[1]
      if (end && start && (end < filterStart || start > filterEnd)) return false
    }
    return true
  })
}

// 根据 ID 查找目标（用于详情页）
function findGoalById(id) {
  const allStudent = generateStudentGoalList(30)
  const allTeacher = generateTeacherGoalList(15)
  const found = allStudent.find(g => g.id === id) || allTeacher.find(g => g.id === id)
  return found || null
}

export {
  STUDENT_GOAL_TYPES,
  CYCLE_TYPES,
  SPORT_MODES,
  GOAL_STATUS,
  SPORTS_PROJECTS,
  NON_SPORT_PROJECTS,
  BUSINESS_TYPES,
  WEEKDAY_OPTIONS,
  DEFAULT_EXECUTE_WEEKDAYS,
  executeWeekdaysText,
  GRADES,
  SCHOOLS,
  CLASSES_POOL,
  generateStudentGoalList,
  generateTeacherGoalList,
  applyFilters,
  applyTeacherFilters,
  findGoalById,
  goalValueSummary,
}
