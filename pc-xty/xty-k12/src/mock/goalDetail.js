import { generateStudentGoalList, generateTeacherGoalList } from './goalList'

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

const SURNAMES = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴']
const GIVEN_NAMES = ['伟', '强', '杰', '勇', '浩', '磊', '芳', '娜', '敏', '静', '丽', '婷']
const genName = () => randomItem(SURNAMES) + randomItem(GIVEN_NAMES)

const GRADES = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三']
const SPORTS_PROJECTS = ['跳绳', '跑步', '仰卧起坐', '引体向上', '立定跳远', '篮球', '足球', '乒乓球', '羽毛球', '游泳']
const SNAPSHOT_TIME = '2026-05-18 24:00'
const BUSINESS_TYPES = ['自由训练', '随堂测试', '串班训练', '体质测试', '校园活动']

// 根据 ID 查找目标完整配置
function generateGoalDetail(goalId) {
  const allStudent = generateStudentGoalList(30)
  const allTeacher = generateTeacherGoalList(15)
  const goal = allStudent.find(g => g.id === goalId) || allTeacher.find(g => g.id === goalId)
  if (!goal) return null

  // 补全所有展示字段
  return {
    ...goal,
    // 目标值详情
    goalValueDetail: goalValueDetailText(goal),
    // 阳光跑专配
    sunrunDetail: goal.sportMode === 'sunrun' ? goal.sunrunConfig : null,
    // 适用范围详情
    scopeDetail: scopeDetailText(goal),
    coverageSnapshotCount: goal.completionTotal || goal.totalStudents || goal.totalTeachers || random(80, 300),
    snapshotTime: goal.snapshotTime || SNAPSHOT_TIME,
    // 计入规则详情
    countingDetail: {
      sportProjects: goal.countingRules?.sportProjects || [],
      businessTypes: goal.countingRules?.businessTypes || [],
      scoreStatuses: goal.countingRules?.scoreStatuses || [],
      projectTags: goal.countingRules?.projectTags || [],
    },
    // 状态信息
    statusChangeTime: goal.status === 'active' ? '2026-05-14 09:00' : goal.status === 'pending' ? null : `2026-05-${String(random(10, 14)).padStart(2, '0')} 09:00`,
    lastEditor: goal.creator + '(本人)',
    lastEditTime: `2026-05-${String(random(10, 13)).padStart(2, '0')} ${String(random(9, 17)).padStart(2, '0')}:${String(random(0, 59)).padStart(2, '0')}`,
  }
}

function goalValueDetailText(goal) {
  switch (goal.sportMode) {
    case 'all':
      return `运动时长：${goal.duration || 60} 分钟`
    case 'sunrun':
      return '参见阳光跑专配'
    case 'single':
      return `${goal.sportProject || ''} ${goal.targetValue || 0} ${goal.targetUnit || '个'}`
    case 'multi':
      return (goal.subConditions || []).map(s => `${s.sportProject} ${s.targetValue} ${s.unit}`).join('；')
    default:
      return ''
  }
}

function scopeDetailText(goal) {
  if (goal.goalTargetType === 'class') {
    // 班级目标直接展示班级名称
    return goal.scopeText || '--'
  }
  if (goal.scopeLevel === 'all') return '全校'
  if (goal.scopeLevel === 'grades') return `指定年级：${(goal.scopeGrades || []).join('、')}`
  if (goal.scopeLevel === 'classes') return `指定班级：${(goal.scopeClasses || []).join('、')}`
  return ''
}

// 变更记录
function generateChangeHistory(goalId) {
  const count = random(2, 5)
  const types = ['edit', 'edit', 'edit', 'stop']
  const persons = ['张管理（管理员）', '李体育（教师）', '王教学（教师）']
  const changes = [
    { type: 'edit', summary: '目标值：60→90分钟', before: '运动时长：60分钟', after: '运动时长：90分钟' },
    { type: 'edit', summary: '目标名称修改：每日运动→每日运动目标', before: '每日运动', after: '每日运动目标' },
    { type: 'edit', summary: '新增计入项目：跑步', before: '已选项目：跳绳、仰卧起坐', after: '已选项目：跳绳、仰卧起坐、跑步' },
    { type: 'edit', summary: '新增业务类型：串班训练', before: '业务类型：自由训练、随堂测试', after: '业务类型：自由训练、随堂测试、串班训练' },
    { type: 'edit', summary: '执行星期修改：周一至周日→周一、周三、周五', before: '执行星期：周一至周日', after: '执行星期：周一、周三、周五' },
    { type: 'edit', summary: '成绩状态变更触发重算', before: '成绩状态：异常；未计入目标', after: '成绩状态：正常；重新计入并重算达成结果' },
    { type: 'stop', summary: '停止目标', before: '状态：生效中', after: '状态：已停止' },
  ]

  return Array.from({ length: count }, (_, i) => {
    const change = randomItem(changes)
    const scoreStatus = randomItem(['正常', '正常', '正常', '异常'])
    return {
      id: i + 1,
      time: `2026-05-${String(10 + i).padStart(2, '0')} ${String(9 + i).padStart(2, '0')}:${String(random(0, 59)).padStart(2, '0')}`,
      person: randomItem(persons),
      changeType: change.type,
      changeTypeLabel: change.type === 'edit' ? '编辑' : '停止',
      summary: change.summary,
      beforeContent: change.before,
      afterContent: change.after,
    }
  }).sort((a, b) => b.time.localeCompare(a.time))
}

// 运动项目 → 单位映射（成绩格式与运动项目匹配）
const SPORT_UNIT_MAP = {
  '跳绳': { unit: '个', min: 50, max: 500 },
  '跑步': { unit: '分钟', min: 10, max: 60 },
  '仰卧起坐': { unit: '个', min: 10, max: 100 },
  '引体向上': { unit: '个', min: 1, max: 30 },
  '立定跳远': { unit: '厘米', min: 100, max: 250 },
  '篮球': { unit: '个', min: 1, max: 20 },
  '足球': { unit: '个', min: 1, max: 15 },
  '乒乓球': { unit: '个', min: 5, max: 50 },
  '羽毛球': { unit: '个', min: 5, max: 40 },
  '游泳': { unit: '米', min: 100, max: 2000 },
  '50米跑': { unit: '秒', min: 6, max: 15 },
  '800米跑': { unit: '秒', min: 180, max: 360 },
  '1000米跑': { unit: '秒', min: 240, max: 420 },
  '实心球': { unit: '米', min: 3, max: 12 },
  '排球': { unit: '个', min: 5, max: 50 },
}

function formatScore(sportProject) {
  const cfg = SPORT_UNIT_MAP[sportProject] || { unit: '个', min: 50, max: 500 }
  const value = cfg.unit === '公里' ? (random(cfg.min * 100, cfg.max * 100) / 100).toFixed(2) : random(cfg.min, cfg.max)
  return `${value}${cfg.unit}`
}

function formatDuration(totalMinutes) {
  if (totalMinutes < 60) return `${totalMinutes} 分钟`
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  if (mins === 0) return `${hours} 小时`
  return `${hours} 小时 ${mins} 分钟`
}

// 计入运动记录
function generateSportRecords(goalId, { keyword, grade, className, dateRange, page = 1, pageSize = 20 } = {}) {
  const total = random(50, 200)
  // 获取目标配置的运动项目范围
  const allStudent = generateStudentGoalList(30)
  const allTeacher = generateTeacherGoalList(15)
  const goal = allStudent.find(g => g.id === goalId) || allTeacher.find(g => g.id === goalId)
  let allowedSports = SPORTS_PROJECTS
  let isSunrunGoal = false
  let scoreStatuses = ['正常']
  let isDurationGoal = false
  if (goal) {
    const rules = goal.countingRules?.sportProjects
    if (rules === 'all') {
      allowedSports = SPORTS_PROJECTS
    } else if (Array.isArray(rules) && rules.length > 0) {
      allowedSports = rules
    }
    isSunrunGoal = goal.sportMode === 'sunrun'
    scoreStatuses = goal.countingRules?.scoreStatuses || ['正常']
    isDurationGoal = goal.sportMode === 'all'
  }

  const records = Array.from({ length: total }, (_, i) => {
    const g = randomItem(GRADES)
    const cls = `${g}${random(1, 6)}班`
    const isFullInclude = Math.random() > 0.2
    const gender = randomItem(['男', '女'])
    const sport = randomItem(allowedSports)
    const isSunrunSport = isSunrunGoal || sport === '阳光跑'
    const scoreStatus = randomItem(scoreStatuses)

    // 生成原始成绩值 + 格式化展示
    let rawScore, scoreStr, unit
    if (isSunrunGoal) {
      rawScore = random(50, 500) / 100
      unit = '公里'
      scoreStr = `${rawScore.toFixed(2)}${unit}`
    } else {
      const cfg = SPORT_UNIT_MAP[sport] || { unit: '个', min: 50, max: 500 }
      unit = cfg.unit
      rawScore = cfg.unit === '公里' ? (random(cfg.min * 100, cfg.max * 100) / 100) : random(cfg.min, cfg.max)
      scoreStr = `${rawScore}${unit}`
    }

    // 运动时长：阳光跑区分有效时长/总时长，其他项目统一运动时长
    let sportDurationMinutes
    if (isSunrunSport) {
      const effectiveMin = random(15, 40)
      const totalMin = effectiveMin + random(5, 20)
      // 仅统计「正常」→ 取有效时长；统计「正常+异常」→ 取总时长
      if (scoreStatuses.includes('异常')) {
        sportDurationMinutes = totalMin
      } else {
        sportDurationMinutes = effectiveMin
      }
    } else {
      sportDurationMinutes = random(10, 90)
    }
    const sportDuration = formatDuration(sportDurationMinutes)

    // 计入成绩：全部计入 = 实际成绩，部分计入 = 实际成绩的 20%~80%
    // 当目标统计单位是时长时，计入成绩 = 时长
    let countingScoreStr, includeTip
    if (isDurationGoal) {
      if (isFullInclude) {
        countingScoreStr = sportDuration
        includeTip = ''
      } else {
        const partialMinutes = Math.round(sportDurationMinutes * random(20, 80) / 100)
        countingScoreStr = formatDuration(partialMinutes)
        includeTip = `受每日最多计入限制影响，本次计入${countingScoreStr}`
      }
    } else {
      if (isFullInclude) {
        countingScoreStr = scoreStr
        includeTip = ''
      } else {
        const fraction = random(20, 80) / 100
        const partialValue = rawScore * fraction
        const formattedPartial = unit === '公里' ? partialValue.toFixed(2) : String(unit === '秒' ? partialValue.toFixed(1) : Math.round(partialValue))
        countingScoreStr = `${formattedPartial}${unit}`
        includeTip = `受每日最多计入限制影响，本次计入${countingScoreStr}`
      }
    }

    return {
      id: i + 1,
      studentName: genName(),
      gender,
      studentNo: `STU${String(i + 1).padStart(6, '0')}`,
      grade: g,
      className: cls,
      sportProject: sport,
      score: scoreStr,
      scoreStatus,
      scoreStatusColor: scoreStatus === '正常' ? 'success' : 'warning',
      sportDuration,
      includeTime: `2026-05-${String(random(1, 15)).padStart(2, '0')} ${String(random(7, 20)).padStart(2, '0')}:${String(random(0, 59)).padStart(2, '0')}`,
      includeStatus: isFullInclude ? '全部计入' : '部分计入',
      includeStatusColor: isFullInclude ? 'success' : 'warning',
      includeTip,
      countingScore: countingScoreStr,
      businessType: isSunrunSport ? '阳光跑' : randomItem(BUSINESS_TYPES),
    }
  }).filter(r => {
    if (keyword && !r.studentName.includes(keyword) && !r.studentNo.includes(keyword)) return false
    if (grade && r.grade !== grade) return false
    if (className && r.className !== className) return false
    return true
  }).sort((a, b) => b.includeTime.localeCompare(a.includeTime))

  return {
    total: records.length,
    includedCount: records.filter(r => r.includeStatus === '全部计入').length,
    partialCount: records.filter(r => r.includeStatus === '部分计入').length,
    records: records.slice((page - 1) * pageSize, page * pageSize),
  }
}

// 达成概览
function generateAchievementOverview(goalId) {
  const totalStudents = random(100, 500)
  const achieved = Math.floor(totalStudents * (random(40, 90) / 100))
  const notAchieved = totalStudents - achieved
  const rate = totalStudents > 0 ? Math.round((achieved / totalStudents) * 100) : null

  return {
    rate,
    totalStudents,
    achieved,
    notAchieved,
    snapshotTime: SNAPSHOT_TIME,
  }
}

export {
  generateGoalDetail,
  generateChangeHistory,
  generateSportRecords,
  generateAchievementOverview,
}
