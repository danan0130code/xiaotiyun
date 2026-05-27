import dayjs from 'dayjs'

const GRADES = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三']
const SPORTS_PROJECTS = ['跳绳', '跑步', '仰卧起坐', '引体向上', '立定跳远', '篮球', '足球', '乒乓球', '羽毛球', '游泳']
const BUSINESS_TYPES = ['自由训练', '随堂测试', '串班训练', '体质测试', '校园活动', '阳光跑']
const SNAPSHOT_TIME = '2026-05-18 24:00'
const DEFAULT_EXECUTE_WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const WEEKDAY_INDEX_MAP = { 周日: 0, 周一: 1, 周二: 2, 周三: 3, 周四: 4, 周五: 5, 周六: 6 }
const weekdayText = (days = DEFAULT_EXECUTE_WEEKDAYS) => days.length === 7 ? '周一至周日' : days.join('、')

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomFloat = (min, max, d = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(d))
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

const SURNAMES = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴']
const GIVEN_NAMES = ['伟', '强', '杰', '勇', '浩', '磊', '芳', '娜', '敏', '静']
const genName = () => randomItem(SURNAMES) + randomItem(GIVEN_NAMES)
const genStudentNo = (i) => `XJ${String(i + 1).padStart(8, '0')}`

// 预定义的目标 Tab 数据，ensure ID 稳定 + 覆盖全场景 + achieveRate 与看板数据一致
const PREDEFINED_GOALS = {
  school: {
    active: [
      { id: 'school-active-daily-all', label: '每日运动目标', groupType: 'school', sportMode: 'all', cycleType: 'daily', status: 'active', achieveRate: 72, cycleLabel: '每日', sportModeLabel: '全部项目', scopeText: '全校', targetSummary: '周一、周三、周五每日运动 60 分钟', timeRange: '2026-05-01 至 2026-07-01', executeWeekdays: ['周一', '周三', '周五'], executeWeekdaysText: '周一、周三、周五', countingRules: '全部项目 / 自由训练、随堂测试、串班训练、体质测试、校园活动、阳光跑 / 正常', totalStudents: 300, achieved: 216, notAchieved: 84, snapshotTime: SNAPSHOT_TIME },
      { id: 'school-active-monthly-single', label: '每月跳绳目标', groupType: 'school', sportMode: 'single', cycleType: 'monthly', status: 'active', achieveRate: 65, cycleLabel: '每月', sportModeLabel: '单个项目', scopeText: '三年级、四年级、五年级', targetSummary: '跳绳 500 个/月', timeRange: '2026 年 5 月 至 2026 年 7 月', countingRules: '跳绳 / 自由训练、随堂测试、体质测试 / 正常', singleProject: '跳绳', singleTarget: '500 个', totalStudents: 200, achieved: 130, notAchieved: 70 },
      { id: 'school-active-semester-multi', label: '学期综合目标', groupType: 'school', sportMode: 'multi', cycleType: 'semester', status: 'active', achieveRate: 58, cycleLabel: '学期', sportModeLabel: '多个单项', scopeText: '三年级、四年级、五年级', targetSummary: '5 项运动达标', timeRange: '2025-2026 学年第二学期', countingRules: '5 个项目 / 自由训练、随堂测试、体质测试 / 正常、异常', subProjects: [
        { name: '跳绳', targetValue: '500', unit: '个' },
        { name: '跑步', targetValue: '300', unit: '分钟' },
        { name: '仰卧起坐', targetValue: '200', unit: '次' },
        { name: '阳光跑', targetValue: '40', unit: '公里' },
        { name: '立定跳远', targetValue: '500', unit: '厘米' },
      ], totalStudents: 180, achieved: 104, notAchieved: 76 },
      { id: 'school-active-custom-sunrun', label: '阳光跑学期目标', groupType: 'school', sportMode: 'sunrun', cycleType: 'custom', status: 'active', achieveRate: 45, cycleLabel: '自定义周期', sportModeLabel: '阳光跑', scopeText: '初一~初三', targetSummary: '周 3 次 + 月 10 次 + 上限 2km', timeRange: '2026-05-01 至 2026-07-01', countingRules: '阳光跑 / 阳光跑 / 正常', sunrunConfig: { weeklyMin: 3, monthlyMin: 10, dailyLimit: '2.0km' }, totalStudents: 150, achieved: 68, notAchieved: 82 },
    ],
    ended: [
      { id: 'school-ended-daily', label: '3 月运动目标（已停止）', groupType: 'school', sportMode: 'all', cycleType: 'daily', status: 'stopped', achieveRate: 80, cycleLabel: '每日', sportModeLabel: '全部项目', scopeText: '全校', targetSummary: '每日运动 45 分钟', timeRange: '2026-03-01 至 2026-03-31', executeWeekdays: DEFAULT_EXECUTE_WEEKDAYS, executeWeekdaysText: '周一至周日', countingRules: '全部项目 / 自由训练、随堂测试、串班训练、体质测试、校园活动 / 正常', totalStudents: 280, achieved: 224, notAchieved: 56, snapshotTime: SNAPSHOT_TIME },
      { id: 'school-ended-monthly', label: '4 月跑步目标（已过期）', groupType: 'school', sportMode: 'single', cycleType: 'monthly', status: 'expired', achieveRate: 70, cycleLabel: '每月', sportModeLabel: '单个项目', scopeText: '一年级~六年级', targetSummary: '跑步 300 分钟/月', timeRange: '2026 年 4 月 至 2026 年 4 月', countingRules: '跑步 / 随堂测试、体质测试 / 正常', singleProject: '跑步', singleTarget: '300 分钟', totalStudents: 250, achieved: 175, notAchieved: 75 },
    ],
  },
  class: {
    active: [
      { id: 'class-active-daily-single', label: '班级每日跳绳', groupType: 'class', sportMode: 'single', cycleType: 'daily', status: 'active', achieveRate: 85, cycleLabel: '每日', sportModeLabel: '单个项目', scopeText: '三年级（1）班', targetSummary: '周一、周三、周五跳绳 200 个/日', timeRange: '2026-05-01 至 2026-07-01', executeWeekdays: ['周一', '周三', '周五'], executeWeekdaysText: '周一、周三、周五', countingRules: '跳绳 / 自由训练、校园活动 / 正常', singleProject: '跳绳', singleTarget: '200 个', totalStudents: 45, achieved: 38, notAchieved: 7, snapshotTime: SNAPSHOT_TIME },
      { id: 'class-active-monthly-sunrun', label: '班级阳光跑月目标', groupType: 'class', sportMode: 'sunrun', cycleType: 'monthly', status: 'active', achieveRate: 55, cycleLabel: '每月', sportModeLabel: '阳光跑', scopeText: '初三（1）班', targetSummary: '周 2 次 + 月 8 次', timeRange: '2026 年 5 月 至 2026 年 7 月', countingRules: '阳光跑 / 阳光跑 / 正常', sunrunConfig: { weeklyMin: 2, monthlyMin: 8 }, totalStudents: 40, achieved: 22, notAchieved: 18 },
      { id: 'class-active-semester-all', label: '班级学期运动', groupType: 'class', sportMode: 'all', cycleType: 'semester', status: 'active', achieveRate: 60, cycleLabel: '学期', sportModeLabel: '全部项目', scopeText: '初二（2）班', targetSummary: '学期运动 60 分钟/日', timeRange: '2025-2026 学年第二学期', countingRules: '全部项目 / 自由训练、随堂测试、串班训练、体质测试、校园活动、阳光跑 / 正常', totalStudents: 42, achieved: 25, notAchieved: 17 },
    ],
    ended: [
      { id: 'class-ended-daily', label: '班级 3 月跳绳（已过期）', groupType: 'class', sportMode: 'single', cycleType: 'daily', status: 'expired', achieveRate: 90, cycleLabel: '每日', sportModeLabel: '单个项目', scopeText: '三年级（1）班', targetSummary: '跳绳 150 个/日', timeRange: '2026-03-01 至 2026-03-31', executeWeekdays: DEFAULT_EXECUTE_WEEKDAYS, executeWeekdaysText: '周一至周日', countingRules: '跳绳 / 自由训练 / 正常', singleProject: '跳绳', singleTarget: '150 个', totalStudents: 45, achieved: 41, notAchieved: 4, snapshotTime: SNAPSHOT_TIME },
    ],
  },
  teacher: {
    active: [
      { id: 'teacher-active-daily-all', label: '每日运动目标', sportMode: 'all', cycleType: 'daily', status: 'active', achieveRate: 68, cycleLabel: '每日', sportModeLabel: '全部项目', scopeText: '全校', targetSummary: '周一至周五每日运动 30 分钟', timeRange: '2026-05-01 至 2026-07-01', executeWeekdays: ['周一', '周二', '周三', '周四', '周五'], executeWeekdaysText: '周一、周二、周三、周四、周五', countingRules: '全部项目 / 自由训练、校园活动 / 正常', totalTeachers: 50, achieved: 34, notAchieved: 16, snapshotTime: SNAPSHOT_TIME },
      { id: 'teacher-active-monthly-single', label: '每月跑步目标', sportMode: 'single', cycleType: 'monthly', status: 'active', achieveRate: 52, cycleLabel: '每月', sportModeLabel: '单个项目', scopeText: '全校', targetSummary: '跑步 120 分钟/月', timeRange: '2026 年 5 月 至 2026 年 7 月', countingRules: '跑步 / 自由训练 / 正常', singleProject: '跑步', singleTarget: '120 分钟', totalTeachers: 45, achieved: 23, notAchieved: 22 },
    ],
    ended: [
      { id: 'teacher-ended-daily', label: '3 月运动目标（已停止）', sportMode: 'all', cycleType: 'daily', status: 'stopped', achieveRate: 75, cycleLabel: '每日', sportModeLabel: '全部项目', scopeText: '全校', targetSummary: '每日运动 45 分钟', timeRange: '2026-03-01 至 2026-03-31', executeWeekdays: DEFAULT_EXECUTE_WEEKDAYS, executeWeekdaysText: '周一至周日', countingRules: '全部项目 / 自由训练、阳光跑 / 正常', totalTeachers: 40, achieved: 30, notAchieved: 10, snapshotTime: SNAPSHOT_TIME },
    ],
  },
}

// === 学生目标统计 - 全局概览（仅目标数） ===
function generateStudentOverview(statusPhase) {
  const goals = PREDEFINED_GOALS
  const allGoals = statusPhase === 'active'
    ? [...goals.school.active, ...goals.class.active]
    : [...goals.school.ended, ...goals.class.ended]
  const schoolGoals = allGoals.filter(g => g.groupType === 'school')
  const classGoals = allGoals.filter(g => g.groupType === 'class')
  return {
    wholeSchoolGoalCount: schoolGoals.length,
    classGoalCount: classGoals.length,
  }
}

// === 教师目标统计 - 全局概览（仅目标个数） ===
function generateTeacherOverview(statusPhase) {
  const goals = PREDEFINED_GOALS.teacher
  const allGoals = statusPhase === 'active' ? goals.active : goals.ended
  return {
    teacherGoalCount: allGoals.length,
  }
}

// === 学生目标列表（按分组） ===
function generateStudentGoalTabs(groupType, statusPhase) {
  if (groupType === 'all') {
    const schoolList = statusPhase === 'active' ? PREDEFINED_GOALS.school.active : PREDEFINED_GOALS.school.ended
    const classList = statusPhase === 'active' ? PREDEFINED_GOALS.class.active : PREDEFINED_GOALS.class.ended
    return [...schoolList, ...classList]
  }
  const goals = statusPhase === 'active'
    ? PREDEFINED_GOALS[groupType]?.active ?? []
    : PREDEFINED_GOALS[groupType]?.ended ?? []
  return [...goals]
}

// === 教师目标列表 ===
function generateTeacherGoalTabs(statusPhase) {
  const goals = statusPhase === 'active' ? PREDEFINED_GOALS.teacher.active : PREDEFINED_GOALS.teacher.ended
  return [...goals]
}

// === Module A: 达成概览看板（使用预定义数据保持一致） ===
function generateAchievementBoard(goal) {
  if (!goal) return null
  const { totalStudents, totalTeachers, achieved, notAchieved, achieveRate, periodProgress } = goal
  return {
    totalStudents: totalStudents || totalTeachers,
    achieved,
    notAchieved,
    rate: achieveRate,
    snapshotTime: goal.snapshotTime || SNAPSHOT_TIME,
    periodProgress: periodProgress || defaultPeriodProgress(goal.cycleType),
  }
}

function defaultPeriodProgress(cycleType) {
  if (cycleType === 'daily') return '8/27天'
  if (cycleType === 'monthly') return '1/3月'
  if (cycleType === 'semester') return '105/181天'
  return '15/62天'
}

function getProgressTotal(cycleType) {
  if (cycleType === 'daily') return 8
  if (cycleType === 'monthly') return 3
  return 1
}

function buildProgressMeta(cycleType, currentRate, progressTotal = getProgressTotal(cycleType), sportMode = null) {
  const currentReached = currentRate >= 100
  if (cycleType === 'daily' && sportMode !== 'multi') {
    const total = progressTotal
    const done = currentReached ? total : random(Math.max(0, total - 4), total - 1)
    return {
      achieved: done === total,
      progressText: `已达标 ${done}/${total} 天`,
      overallStatus: done === total ? '保持达标' : '已失达标',
    }
  }
  if (cycleType === 'monthly' && sportMode !== 'multi') {
    const total = progressTotal
    const done = currentReached ? total : random(0, Math.max(0, total - 1))
    return {
      achieved: done === total,
      progressText: `已达标 ${done}/${total} 月`,
      overallStatus: done === total ? '保持达标' : '已失达标',
    }
  }
  if (sportMode === 'sunrun') {
    return {
      achieved: currentReached,
      progressText: currentReached ? '里程、周/月频次均已达标' : '存在周/月频次未达标',
      overallStatus: currentReached ? '已达标' : '已失达标',
    }
  }
  return {
    achieved: currentReached,
    progressText: `累计达成 ${Math.min(currentRate, 100)}%`,
    overallStatus: currentReached ? '已达标' : '未达标',
  }
}

// === 达标趋势数据（带时间范围） ===
function generateTrendData(cycleType, timeRange, executeWeekdays = DEFAULT_EXECUTE_WEEKDAYS) {
  if (cycleType === 'daily') {
    const now = new Date(2026, 4, 15)
    const allowed = executeWeekdays.map(d => WEEKDAY_INDEX_MAP[d])
    const result = []
    for (let offset = 13; offset >= 0 && result.length < 7; offset -= 1) {
      const d = new Date(now)
      d.setDate(d.getDate() - offset)
      if (!allowed.includes(d.getDay())) continue
      const month = d.getMonth() + 1
      const day = d.getDate()
      result.push({
        label: `${month}/${day}`,
        value: random(30, 95),
      })
    }
    return result
  }
  if (cycleType === 'monthly') {
    return Array.from({ length: 3 }, (_, i) => ({
      label: `${3 + i}月`,
      value: random(40, 88),
    }))
  }
  return []
}

// === Module B: 年级排名（统一字段：排名/年级班级/覆盖学生数/达标人数/达标率） ===
function generateGradeRanking(cycleType) {
  return GRADES.map((grade, idx) => {
    const total = random(100, 200)
    const achieved = Math.floor(total * (random(35, 98) / 100))
    const rate = Math.min(Math.round((achieved / total) * 100), 100)
    return { id: idx + 1, name: grade, totalStudents: total, achieved, rate }
  }).sort((a, b) => (b.rate || 0) - (a.rate || 0) || (b.achieved || 0) - (a.achieved || 0))
}

// === Module B: 班级排名 ===
function generateClassRanking() {
  const count = random(6, 10)
  return Array.from({ length: count }, (_, i) => {
    const total = random(30, 55)
    const achieved = Math.floor(total * (random(30, 100) / 100))
    const rate = Math.min(Math.round((achieved / total) * 100), 100)
    return { id: i + 1, name: `${randomItem(GRADES)}(${i + 1})班`, totalStudents: total, achieved, rate }
  }).sort((a, b) => (b.rate || 0) - (a.rate || 0) || (b.achieved || 0) - (a.achieved || 0))
}

// === Module C: 学生达成列表 ===
function generateStudentAchievementList(count = 100, cycleType, sportMode = null) {
  const progressTotal = getProgressTotal(cycleType)
  return Array.from({ length: count }, (_, i) => {
    const grade = randomItem(GRADES)
    const classIdx = random(1, 6)
    const targetValue = random(60, 120)
    const currentCompleteValue = random(0, Math.floor(targetValue * 1.2))
    const currentRate = Math.min(Math.round((currentCompleteValue / targetValue) * 100), 100)
    const meta = buildProgressMeta(cycleType, currentRate, progressTotal, sportMode)
    const achieveRate = currentRate
    return {
      id: i + 1,
      name: genName(),
      studentNo: genStudentNo(i),
      gender: randomItem(['男', '女']),
      grade,
      className: `${grade}${classIdx}班`,
      achieveRate,
      currentRate,
      ...meta,
    }
  })
}

// 多项目目标的达成列表
function generateMultiProjectStudentList(count = 30) {
  const projects = [
    { name: '跳绳', unit: '个', targetRange: [100, 800] },
    { name: '跑步', unit: '分钟', targetRange: [50, 200] },
    { name: '仰卧起坐', unit: '次', targetRange: [50, 400] },
    { name: '阳光跑', unit: '公里', targetRange: [5, 60] },
    { name: '立定跳远', unit: '厘米', targetRange: [200, 800] },
  ]
  return Array.from({ length: count }, (_, i) => {
    const grade = randomItem(GRADES)
    const classIdx = random(1, 6)
    const subResults = projects.map(p => {
      const [minT, maxT] = p.targetRange
      const target = random(minT, maxT)
      const complete = random(0, Math.floor(target * 1.3))
      // 达成率上限 100%
      const rate = Math.min(Math.round((complete / target) * 100), 100)
      return {
        project: p.name,
        targetValue: `${target}${p.unit}`,
        completeValue: `${complete}${p.unit}`,
        achieveRate: rate,
        achieved: rate >= 100,
      }
    })
    // 总体达标：所有子条件都达标
    const currentRate = Math.min(...subResults.map(r => r.achieveRate))
    const meta = buildProgressMeta('semester', currentRate, getProgressTotal('semester'), 'multi')
    return {
      id: i + 1,
      name: genName(),
      studentNo: genStudentNo(i),
      gender: randomItem(['男', '女']),
      grade,
      className: `${grade}${classIdx}班`,
      subResults,
      currentRate,
      ...meta,
    }
  })
}

// === Module CT: 教师达成列表 ===
function generateTeacherAchievementList(count = 50, cycleType = 'daily', sportMode = null) {
  const progressTotal = getProgressTotal(cycleType)
  return Array.from({ length: count }, (_, i) => {
    const targetValue = random(30, 120)
    const completeValue = random(0, 130)
    const currentRate = Math.min(Math.round((completeValue / targetValue) * 100), 100)
    const meta = buildProgressMeta(cycleType, currentRate, progressTotal, sportMode)
    const achieveRate = currentRate
    return {
      id: i + 1,
      name: genName(),
      achieveRate,
      currentRate,
      ...meta,
    }
  })
}

// === 生成计入记录明细（含运动项目、运动时间、业务类型） ===
function formatDuration(totalMinutes) {
  if (totalMinutes < 60) return `${totalMinutes} 分钟`
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  if (mins === 0) return `${hours} 小时`
  return `${hours} 小时 ${mins} 分钟`
}

function generateRecords(count, goalSportMode, singleProjectName, scoreStatuses, isDurationGoal) {
  const statuses = scoreStatuses || ['正常']
  const records = Array.from({ length: count }, (_, i) => {
    // 运动项目
    let project
    if (goalSportMode === 'single') {
      project = singleProjectName || '跳绳'
    } else if (goalSportMode === 'sunrun') {
      project = '阳光跑'
    } else if (goalSportMode === 'multi') {
      project = randomItem(['跳绳', '跑步', '仰卧起坐', '阳光跑', '立定跳远'])
    } else {
      project = randomItem(SPORTS_PROJECTS)
    }

    const scoreStatus = randomItem(['正常', '正常', '正常', '异常'])
    const isSunrun = project === '阳光跑' || goalSportMode === 'sunrun'
    const isPartial = isSunrun && Math.random() > 0.6

    const actualScore = isSunrun ? randomFloat(1.5, 4.0, 1) : random(50, 500)
    const includeScore = isPartial ? randomFloat(1.0, 2.0, 1) : actualScore

    // 运动开始时间（年月日 时分）
    const sportDay = random(1, 15)
    const sportHour = random(7, 20)
    const sportMin = random(0, 59)
    const sportTime = `2026-05-${String(sportDay).padStart(2, '0')} ${String(sportHour).padStart(2, '0')}:${String(sportMin).padStart(2, '0')}`

    // 业务类型
    const businessType = isSunrun ? '阳光跑' : randomItem(BUSINESS_TYPES.filter(t => t !== '阳光跑'))

    // 单位：根据项目确定
    let unit
    if (project === '阳光跑') unit = '公里'
    else if (project === '跑步') unit = '分钟'
    else if (['跳绳', '仰卧起坐', '引体向上'].includes(project)) unit = '个'
    else if (project === '立定跳远') unit = '厘米'
    else unit = '个'

    // 运动时长：阳光跑区分有效时长/总时长，其他项目统一运动时长
    let sportDurationMinutes
    if (isSunrun) {
      const effectiveMin = random(15, 40)
      const totalMin = effectiveMin + random(5, 20)
      if (statuses.includes('异常')) {
        sportDurationMinutes = totalMin
      } else {
        sportDurationMinutes = effectiveMin
      }
    } else {
      sportDurationMinutes = random(10, 90)
    }
    const sportDuration = formatDuration(sportDurationMinutes)

    // 计入成绩：当目标统计单位是时长时，计入成绩 = 时长
    let includeScoreStr
    if (isDurationGoal) {
      if (isPartial) {
        const partialMinutes = Math.round(sportDurationMinutes * random(20, 80) / 100)
        includeScoreStr = formatDuration(partialMinutes)
      } else {
        includeScoreStr = sportDuration
      }
    } else {
      includeScoreStr = `${includeScore}${unit}`
    }

    return {
      id: i + 1,
      sportProject: project,
      sportTime,
      businessType,
      score: `${actualScore}${unit}`,
      scoreStatus,
      scoreStatusColor: scoreStatus === '正常' ? 'success' : 'warning',
      sportDuration,
      includeTime: `2026-05-${String(random(1, 15)).padStart(2, '0')} ${String(random(7, 20)).padStart(2, '0')}:${String(random(0, 59)).padStart(2, '0')}`,
      includeStatus: isPartial ? '部分计入' : '全部计入',
      includeStatusColor: isPartial ? 'warning' : 'success',
      includeScore: includeScoreStr,
    }
  }).sort((a, b) => b.includeTime.localeCompare(a.includeTime))
  return records
}

// === 周期达标概览 Mock 生成器 ===

// 解析 timeRange 字符串 → { start: dayjs, end: dayjs }
// 支持格式: "YYYY-MM-DD 至 YYYY-MM-DD" / "YYYY 年 M 月 至 YYYY 年 M 月"
function parseTimeRange(timeRange) {
  if (!timeRange) return { start: dayjs('2026-05-01'), end: dayjs('2026-05-31') }

  // "2026-05-01 至 2026-07-01"
  const dateMatch = timeRange.match(/(\d{4}-\d{2}-\d{2})\s*至\s*(\d{4}-\d{2}-\d{2})/)
  if (dateMatch) {
    return { start: dayjs(dateMatch[1]), end: dayjs(dateMatch[2]) }
  }

  // "2026 年 5 月 至 2026 年 7 月"
  const monthRange = timeRange.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*至\s*(\d{4})\s*年\s*(\d{1,2})\s*月/)
  if (monthRange) {
    const start = dayjs(`${monthRange[1]}-${monthRange[2].padStart(2, '0')}-01`)
    const end = dayjs(`${monthRange[3]}-${monthRange[4].padStart(2, '0')}-01`).endOf('month')
    return { start, end }
  }

  // fallback
  return { start: dayjs('2026-05-01'), end: dayjs('2026-05-31') }
}

function generateDailyAchievement(timeRange, executeWeekdays = DEFAULT_EXECUTE_WEEKDAYS) {
  const { start, end } = parseTimeRange(timeRange)
  const allowed = executeWeekdays.map(d => WEEKDAY_INDEX_MAP[d])
  const result = []
  let current = start
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    result.push({
      date: current.format('YYYY-MM-DD'),
      isExecutionDay: allowed.includes(current.day()),
      achieved: Math.random() > 0.3,
    })
    current = current.add(1, 'day')
  }
  // 如果天数太多，取前 30 天 + 最后 5 天采样
  if (result.length > 35) {
    const head = result.slice(0, 30)
    const tail = result.slice(-5)
    return [...head, ...tail]
  }
  return result
}

function generateMonthlyAchievement(timeRange) {
  const { start, end } = parseTimeRange(timeRange)
  const result = []
  let current = start.startOf('month')
  while (current.isBefore(end) || current.isSame(end, 'month')) {
    const month = current.format('YYYY-MM')
    const achieved = Math.random() > 0.4
    const target = 500
    const completeVal = achieved ? random(target, 650) : random(100, target - 1)
    result.push({
      month,
      achieved,
      summary: `完成 ${completeVal}/${target} 个`,
    })
    current = current.add(1, 'month')
  }
  return result
}

function generateSunrunAchievement(timeRange) {
  const { start, end } = parseTimeRange(timeRange)
  // 按周生成
  const weeks = []
  let weekStart = start.startOf('week')
  let weekIdx = 1
  while (weekStart.isBefore(end)) {
    weeks.push({ week: `W${weekIdx}`, achieved: Math.random() > 0.4 })
    weekStart = weekStart.add(1, 'week')
    weekIdx++
    if (weekIdx > 20) break
  }
  // 按月生成
  const months = []
  let monthStart = start.startOf('month')
  while (monthStart.isBefore(end) || monthStart.isSame(end, 'month')) {
    months.push({ month: monthStart.format('YYYY-MM'), achieved: Math.random() > 0.5 })
    monthStart = monthStart.add(1, 'month')
  }
  return {
    weeks,
    months,
    totalMileage: randomFloat(20, 50, 1),
  }
}

function generateAllOrSingleAchievement(sportMode) {
  if (sportMode === 'all') {
    const current = random(500, 900)
    const target = 900
    return {
      currentValue: `${current} 分钟`,
      targetValue: `${target} 分钟/月`,
      progress: Math.round((current / target) * 100),
    }
  }
  // single
  const current = random(300, 550)
  const target = 500
  return {
    currentValue: `${current} 个`,
    targetValue: `${target} 个`,
    progress: Math.round((current / target) * 100),
  }
}

function getDetailStatus(cycleType, sportMode, cycleOverview) {
  if (cycleType === 'daily' && Array.isArray(cycleOverview)) {
    const achieved = cycleOverview.length > 0 && cycleOverview.every(item => item.achieved)
    return {
      achieved,
      overallStatus: achieved ? '保持达标' : '已失达标',
    }
  }

  if (cycleType === 'monthly' && Array.isArray(cycleOverview)) {
    const achieved = cycleOverview.length > 0 && cycleOverview.every(item => item.achieved)
    return {
      achieved,
      overallStatus: achieved ? '保持达标' : '已失达标',
    }
  }

  if (sportMode === 'sunrun' && cycleOverview) {
    const mileageReached = (cycleOverview.totalMileage || 0) >= 30
    const weeklyReached = !cycleOverview.weeks?.length || cycleOverview.weeks.every(item => item.achieved)
    const monthlyReached = !cycleOverview.months?.length || cycleOverview.months.every(item => item.achieved)
    const achieved = mileageReached && weeklyReached && monthlyReached
    return {
      achieved,
      overallStatus: achieved ? '已达标' : (!weeklyReached || !monthlyReached) ? '已失达标' : '未达标',
    }
  }

  const progress = cycleOverview?.progress || 0
  return {
    achieved: progress >= 100,
    overallStatus: progress >= 100 ? '已达标' : '未达标',
  }
}

// === Module D: 学生达成详情 ===
function parseScoreStatuses(countingRules) {
  if (!countingRules) return ['正常']
  const parts = countingRules.split(' / ')
  return (parts[parts.length - 1] || '').split('、').filter(Boolean)
}

function generateStudentDetailData(studentName, goalCycleType, goalSportMode, timeRange, countingRules, executeWeekdays = DEFAULT_EXECUTE_WEEKDAYS) {
  const scoreStatuses = parseScoreStatuses(countingRules)
  const isDurationGoal = goalSportMode === 'all'
  const records = generateRecords(random(8, 15), goalSportMode, null, scoreStatuses, isDurationGoal)

  let targetValueText = '60 分钟'
  if (goalSportMode === 'single') targetValueText = '跳绳 500 个'
  else if (goalSportMode === 'sunrun') targetValueText = '周 3 次 + 月 10 次'
  else if (goalSportMode === 'multi') targetValueText = '5 项运动达标'

  let cycleOverview = null
  if (goalCycleType === 'daily') {
    cycleOverview = generateDailyAchievement(timeRange, executeWeekdays)
  } else if (goalCycleType === 'monthly') {
    cycleOverview = generateMonthlyAchievement(timeRange)
  } else if (goalSportMode === 'sunrun') {
    cycleOverview = generateSunrunAchievement(timeRange)
  } else if (goalSportMode === 'all' || goalSportMode === 'single') {
    cycleOverview = generateAllOrSingleAchievement(goalSportMode)
  }

  return {
    name: studentName,
    gender: randomItem(['男', '女']),
    studentNo: genStudentNo(random(1, 100)),
    className: `${randomItem(GRADES)}${random(1, 6)}班`,
    goalName: '每日运动目标',
    targetValue: targetValueText,
    ...getDetailStatus(goalCycleType, goalSportMode, cycleOverview),
    cycleType: goalCycleType,
    sportMode: goalSportMode,
    cycleOverview,
    records,
  }
}

// === 学生达成详情 - 多项目子条件达标状态 ===
function generateMultiProjectDetailData(studentName, goalCycleType, goalSportMode, timeRange, countingRules) {
  const projects = [
    { project: '跳绳', targetValue: '500 个', completeValue: '480 个', achieveRate: 96, achieved: false },
    { project: '跑步', targetValue: '300 分钟', completeValue: '320 分钟', achieveRate: 100, achieved: true },
    { project: '仰卧起坐', targetValue: '200 次', completeValue: '210 次', achieveRate: 100, achieved: true },
    { project: '阳光跑', targetValue: '40 公里', completeValue: '35 公里', achieveRate: 88, achieved: false },
    { project: '立定跳远', targetValue: '500 厘米', completeValue: '520 厘米', achieveRate: 100, achieved: true },
  ]

  const scoreStatuses = parseScoreStatuses(countingRules)
  const records = generateRecords(10, 'multi', null, scoreStatuses, false)
  const achieved = projects.every(item => item.achieved)

  // multi 模式通过 subResults 展示概览，不需要额外 cycleOverview
  return {
    name: studentName,
    gender: randomItem(['男', '女']),
    studentNo: genStudentNo(random(1, 100)),
    className: `${randomItem(GRADES)}${random(1, 6)}班`,
    goalName: '多项目综合运动目标',
    targetValue: '5 项运动达标',
    achieved,
    overallStatus: achieved ? '已达标' : '未达标',
    cycleType: goalCycleType,
    sportMode: goalSportMode,
    subResults: projects,
    records,
  }
}

// === Module DT: 教师达成详情 ===
function generateTeacherDetailData(teacherName, goalCycleType, goalSportMode, timeRange, countingRules, executeWeekdays = DEFAULT_EXECUTE_WEEKDAYS) {
  const scoreStatuses = parseScoreStatuses(countingRules)
  const isDurationGoal = goalSportMode === 'all'
  const records = generateRecords(random(6, 12), goalSportMode, null, scoreStatuses, isDurationGoal)

  let targetValueText = '120 分钟'
  if (goalSportMode === 'single') targetValueText = '跑步 120 分钟'
  else if (goalSportMode === 'all') targetValueText = '每日 30 分钟'

  let cycleOverview = null
  if (goalCycleType === 'daily') {
    cycleOverview = generateDailyAchievement(timeRange, executeWeekdays)
  } else if (goalCycleType === 'monthly') {
    cycleOverview = generateMonthlyAchievement(timeRange)
  } else if (goalSportMode === 'sunrun') {
    cycleOverview = generateSunrunAchievement(timeRange)
  } else if (goalSportMode === 'all' || goalSportMode === 'single') {
    cycleOverview = generateAllOrSingleAchievement(goalSportMode)
  }

  return {
    name: teacherName,
    goalName: '教师运动目标',
    targetValue: targetValueText,
    ...getDetailStatus(goalCycleType, goalSportMode, cycleOverview),
    cycleType: goalCycleType,
    sportMode: goalSportMode,
    cycleOverview,
    records,
  }
}

export {
  generateStudentOverview,
  generateTeacherOverview,
  generateStudentGoalTabs,
  generateTeacherGoalTabs,
  generateAchievementBoard,
  generateTrendData,
  generateGradeRanking,
  generateClassRanking,
  generateStudentAchievementList,
  generateMultiProjectStudentList,
  generateTeacherAchievementList,
  generateStudentDetailData,
  generateMultiProjectDetailData,
  generateTeacherDetailData,
  PREDEFINED_GOALS,
  GRADES,
}
