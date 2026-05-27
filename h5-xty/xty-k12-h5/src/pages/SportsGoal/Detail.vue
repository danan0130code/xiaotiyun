<template>
  <div class="goal-detail-page">
    <van-nav-bar :left-arrow="true" title="目标详情" @click-left="onBack" />

    <div class="loading" v-if="loading">加载中...</div>
    <div class="not-found" v-else-if="!goal">
      <van-empty description="目标不存在" />
    </div>
    <template v-else>
      <!-- 顶部信息区 -->
      <div class="detail-header">
        <div class="detail-name-row">
          <span class="detail-name">{{ goal.name }}</span>
          <van-tag :color="statusMap[goal.status]?.color || '#999'" size="medium">
            {{ statusMap[goal.status]?.label }}
          </van-tag>
          <van-icon name="question-o" class="rule-help" @click="showRuleHelp = true" />
        </div>
        <div class="detail-tags">
          <van-tag :color="goalTypeMap[goal.goalType]?.color" plain size="small">
            {{ goalTypeMap[goal.goalType]?.label }}
          </van-tag>
          <van-tag :color="cycleTypeMap[goal.cycleType]?.color" plain size="small">
            {{ cycleTypeMap[goal.cycleType]?.label }}
          </van-tag>
          <van-tag :color="includeTypeMap[goal.includeType]?.color" plain size="small">
            {{ includeTypeMap[goal.includeType]?.label }}
          </van-tag>
        </div>
      </div>

      <!-- 进度展示 -->
      <div class="progress-section">
        <div class="progress-numbers">
          <span class="progress-completed">{{ progressDisplay.completed }}</span>
          <span class="progress-divider">/</span>
          <span class="progress-target">{{ progressDisplay.target }} {{ progressDisplay.unit }}</span>
        </div>
        <div class="progress-dim">{{ cycleDimLabel }}</div>
        <div class="progress-pct">{{ goal.progress }}%</div>
        <div class="progress-status" :style="{ color: goal.progress >= 100 ? '#07c160' : '#4facfe' }">
          {{ goal.progress >= 100 ? '已达标' : '进行中' }}
        </div>
        <div class="overall-box">
          <div class="overall-line">整体进度：{{ goal.overallProgressText || defaultOverallProgress }}</div>
          <div class="overall-line">
            整体状态：
            <span :class="['overall-status', isOverallGood ? 'good' : 'bad']">
              {{ goal.overallStatus || defaultOverallStatus }}
            </span>
          </div>
        </div>
      </div>

      <!-- 剩余量提示 -->
      <div class="remaining-section" v-if="goal.progress < 100">
        <div class="remaining-item" v-if="goal.subConditions">
          <div class="sub-condition" v-for="(sub, i) in goal.subConditions" :key="i">
            <span :style="{ color: sub.done ? '#07c160' : '#ee0a24' }">
              {{ sub.done ? '✅' : '❌' }}
            </span>
            <span>{{ sub.name }} {{ sub.target }}</span>
            <span v-if="!sub.done" class="sub-gap">{{ sub.remaining }}</span>
          </div>
        </div>
        <div class="remaining-item" v-else-if="goal.includeType === 'sunrun' && goal.sunrunConfig">
          <div v-if="goal.sunrunConfig.weekMinCount">
            周次数还需完成
          </div>
          <div v-if="goal.sunrunConfig.monthMinCount">
            月次数还需完成
          </div>
          <div>{{ goal.remainingText }}</div>
        </div>
        <div class="remaining-item" v-else>
          {{ cycleRemainingText }}
        </div>
      </div>

      <!-- Tab 切换 -->
      <van-tabs v-model:active="activeTab" sticky :offset-top="0">
        <!-- Tab 1: 计入规则与记录 -->
        <van-tab name="rules" title="计入规则与记录">
          <!-- 周期达标概览 -->
          <div class="period-achievement-section">
            <div class="section-title">周期达标概览</div>

            <div v-if="goal.cycleType === 'daily'" class="daily-overview">
              <div class="overview-summary">
                达标 <span>{{ dailyAchievement.reached }}</span> / {{ dailyAchievement.total }} 天
              </div>
              <div class="mini-day-grid">
                <div
                  v-for="cell in dailyAchievement.cells"
                  :key="cell.day"
                  class="mini-day"
                  :class="cell.status"
                >
                  <span>{{ cell.day }}</span>
                  <em>{{ cell.label }}</em>
                </div>
              </div>
            </div>

            <div v-else-if="goal.cycleType === 'monthly'" class="monthly-overview">
              <div class="month-overview-card" :class="{ reached: goal.progress >= 100 }">
                <div>
                  <div class="month-title">{{ currentMonth }}</div>
                  <div class="month-desc">本月累计：{{ goal.completedValue }} / {{ goal.targetValue }} {{ progressDisplay.unit }}</div>
                </div>
                <van-tag :color="goal.progress >= 100 ? '#07c160' : '#4facfe'" plain size="small">
                  {{ goal.progress >= 100 ? '已达标' : '进行中' }}
                </van-tag>
              </div>
              <div class="month-note">本月累计按当前日历月份统计，未到月末前不做“已失达标”最终判断。</div>
            </div>

            <div v-else-if="goal.includeType === 'multi'" class="sub-overview">
              <div
                class="sub-overview-item"
                v-for="(sub, i) in goal.subConditions || []"
                :key="i"
                :class="{ reached: sub.done }"
              >
                <div class="sub-overview-top">
                  <span>{{ sub.name }}</span>
                  <van-tag :color="sub.done ? '#07c160' : '#ee0a24'" plain size="small">
                    {{ sub.done ? '已达标' : '未达标' }}
                  </van-tag>
                </div>
                <div class="sub-overview-desc">目标：{{ sub.target }} / 完成：{{ sub.completed || '--' }}</div>
              </div>
            </div>

            <div v-else-if="goal.includeType === 'sunrun' && goal.sunrunConfig" class="sunrun-overview">
              <div class="sunrun-mileage">
                <span>累计里程</span>
                <strong>{{ goal.completedValue }} <small>公里</small></strong>
              </div>
              <div class="sunrun-tags" v-if="sunrunWeeklyTags.length">
                <div class="tag-title">每周达标</div>
                <span
                  v-for="tag in sunrunWeeklyTags"
                  :key="tag.label"
                  class="period-tag"
                  :class="{ reached: tag.reached }"
                >
                  {{ tag.label }} {{ tag.reached ? '达标' : '未达标' }}
                </span>
              </div>
              <div class="sunrun-tags" v-if="sunrunMonthlyTags.length">
                <div class="tag-title">月度达标</div>
                <span
                  v-for="tag in sunrunMonthlyTags"
                  :key="tag.label"
                  class="period-tag"
                  :class="{ reached: tag.reached }"
                >
                  {{ tag.label }} {{ tag.reached ? '达标' : '未达标' }}
                </span>
              </div>
            </div>

            <div v-else class="total-overview">
              <div class="progress-row">
                <span>累计进度</span>
                <strong>{{ progressDisplay.completed }} / {{ progressDisplay.target }} {{ progressDisplay.unit }}</strong>
              </div>
              <van-progress
                :percentage="Math.min(goal.progress, 100)"
                :color="goal.progress >= 100 ? '#07c160' : '#4facfe'"
                :pivot-text="goal.progress + '%'"
              />
            </div>
          </div>

          <!-- 计入规则说明 -->
          <div class="rules-section">
            <div class="rules-title">计入规则说明</div>
            <div class="rule-row">
              <span class="rule-label">计入运动项目</span>
              <span class="rule-value">{{ goal.includeRules.includeProjects.join('、') }}</span>
            </div>
            <div class="rule-row">
              <span class="rule-label">计入业务类型</span>
              <span class="rule-value">{{ goal.includeRules.businessTypes.join('、') }}</span>
            </div>
            <div class="rule-row">
              <span class="rule-label">成绩状态要求</span>
              <span class="rule-value">{{ goal.includeRules.scoreStatus.join('、') }}</span>
            </div>
            <div class="rule-row" v-if="goal.includeRules.projectTags?.length > 0">
              <span class="rule-label">项目标签过滤</span>
              <span class="rule-value">{{ goal.includeRules.projectTags.join('、') }}</span>
            </div>
            <div class="rule-row" v-if="goal.includeType === 'sunrun' && goal.sunrunConfig">
              <span class="rule-label">阳光跑有效标准</span>
              <span class="rule-value">{{ goal.sunrunConfig.paceRequirement }}</span>
            </div>
          </div>

          <!-- 计入记录列表 -->
          <div class="records-section">
            <div class="records-title">已计入运动记录</div>
            <div class="record-item" v-for="record in goal.records" :key="record.id">
              <div class="record-main">
                <div class="record-time">{{ record.time }}</div>
                <div class="record-sport">{{ record.sportName }}</div>
                <div class="record-score">{{ record.score }}</div>
                <van-tag :color="record.scoreStatus === '正常' ? '#07c160' : '#ff976e'" plain size="small">
                  {{ record.scoreStatus }}
                </van-tag>
              </div>
              <div class="record-duration" v-if="record.sportDuration">
                <span>运动时长：{{ record.sportDuration }}</span>
              </div>
              <div class="record-meta">
                <span>计入：{{ record.includeTime }}</span>
                <van-tag
                  :color="record.includeStatus === 'all' ? '#07c160' : '#ff976e'"
                  plain
                  size="mini"
                >
                  {{ record.includeStatus === 'all' ? '全部计入' : '部分计入' }}
                </van-tag>
              </div>
              <div class="record-include-amount" v-if="record.includeAmount">
                {{ record.includeAmount }}
              </div>
              <div class="record-actions">
                <van-button size="small" plain type="primary" @click="showDetailToast">详情</van-button>
              </div>
            </div>
          </div>
        </van-tab>

        <!-- Tab 2: 历史达成 -->
        <van-tab name="history" title="历史达成">
          <div class="history-calendar">
            <!-- 月份切换 -->
            <div class="calendar-nav">
              <van-icon name="arrow-left" @click="prevMonth" />
              <span class="calendar-month">{{ currentMonth }}</span>
              <van-icon name="arrow" @click="nextMonth" />
            </div>

            <!-- 日历头部 -->
            <div class="calendar-week-header">
              <div class="calendar-day-header" v-for="d in weekDays" :key="d">{{ d }}</div>
            </div>

            <!-- 日历网格 -->
            <div class="calendar-grid">
              <div
                class="calendar-cell"
                v-for="(cell, idx) in calendarGrid"
                :key="idx"
                @click="cell.day && cell.status !== 'none' && onDayClick(cell)"
              >
                <div
                  class="calendar-day"
                  :class="{
                    today: cell.isToday,
                    achieved: isDailyGoal && cell.status === 'achieved',
                    failed: isDailyGoal && cell.status === 'failed',
                    'has-data': !isDailyGoal && cell.status !== 'none' && cell.day,
                    empty: cell.status === 'none' && cell.day,
                    disabled: !cell.day,
                  }"
                >
                  <span v-if="cell.day">{{ cell.day }}</span>
                  <span v-if="isDailyGoal && cell.status === 'achieved'" class="calendar-dot green"></span>
                  <span v-if="isDailyGoal && cell.status === 'failed'" class="calendar-dot red"></span>
                  <span v-if="!isDailyGoal && cell.status !== 'none' && cell.day" class="calendar-dot blue"></span>
                </div>
              </div>
            </div>

            <!-- 图例 -->
            <div class="calendar-legend">
              <template v-if="isDailyGoal">
                <span><span class="legend-dot green"></span> 已达标</span>
                <span><span class="legend-dot red"></span> 未达标</span>
                <span><span class="legend-dot gray"></span> 无数据</span>
              </template>
              <template v-else>
                <span><span class="legend-dot blue"></span> 有数据</span>
                <span><span class="legend-dot gray"></span> 无数据</span>
              </template>
            </div>

            <!-- 月度总计（仅每月目标） -->
            <div class="monthly-total" v-if="goal.cycleType === 'monthly'">
              本月累计：{{ goal.completedValue }} {{ goal.includeType === 'all' ? '分钟' : goal.includeType === 'sunrun' ? '公里' : '' }}
            </div>
          </div>

        </van-tab>
      </van-tabs>
    </template>

    <!-- 日期详情弹窗 -->
    <van-popup v-model:show="showDayDetail" position="bottom" round>
      <div class="day-detail-popup">
        <div class="popup-title">{{ selectedDay?.date }}</div>
        <div class="popup-content" v-if="selectedDay">
          <template v-if="isDailyGoal">
            <div class="popup-status" :style="{ color: selectedDay.status === 'achieved' ? '#07c160' : '#ee0a24' }">
              {{ selectedDay.status === 'achieved' ? '✅ 已达标' : '❌ 未达标' }}
            </div>
          </template>
          <template v-else>
            <div class="popup-summary">{{ selectedDay.summary }}</div>
          </template>
          <van-button block type="default" @click="showDayDetail = false" style="margin-top: 16px">关闭</van-button>
        </div>
      </div>
    </van-popup>

    <van-popup v-model:show="showRuleHelp" position="bottom" round>
      <div class="rule-help-popup">
        <div class="popup-title">计算规则说明</div>
        <div class="help-block" v-for="(item, idx) in ruleHelpText" :key="idx">{{ item }}</div>
        <van-button block type="primary" @click="showRuleHelp = false">知道了</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { showToast } from 'vant'
import {
  goalList,
  historyGoalList,
  goalTypeMap,
  cycleTypeMap,
  includeTypeMap,
  statusMap,
  calendarData,
} from '@/mock/sportsGoal.js'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const goal = ref(null)
const activeTab = ref('rules')
// 日历相关
const currentMonth = ref('2026年5月')
const currentYear = ref(2026)
const currentMonthNum = ref(5)
const showDayDetail = ref(false)
const showRuleHelp = ref(false)
const selectedDay = ref(null)

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 是否为每日目标
const isDailyGoal = computed(() => goal.value?.cycleType === 'daily')

// 周期维度标签
const cycleDimLabel = computed(() => {
  if (!goal.value) return ''
  if (goal.value.includeType === 'multi') return '条件完成'
  const map = { daily: '今日目标', monthly: '本月目标', semester: '本学期目标', custom: '总目标' }
  return map[goal.value.cycleType] || ''
})

const progressDisplay = computed(() => {
  const g = goal.value
  if (!g) return { completed: 0, target: 0, unit: '' }
  if (g.includeType === 'multi') {
    const total = g.subConditions?.length || g.targetValue || 0
    const completed = g.subConditions?.filter(s => s.done).length ?? g.completedValue ?? 0
    return { completed, target: total, unit: '项' }
  }
  if (g.includeType === 'all') {
    return { completed: Math.min(g.completedValue, g.targetValue), target: g.targetValue, unit: '分钟' }
  }
  if (g.includeType === 'sunrun') {
    const target = g.sunrunConfig?.semesterMileage || g.targetValue
    return { completed: Math.min(g.completedValue, target), target, unit: '公里' }
  }
  return { completed: Math.min(g.completedValue, g.targetValue), target: g.targetValue, unit: '' }
})

const defaultOverallProgress = computed(() => {
  if (!goal.value) return ''
  if (goal.value.cycleType === 'daily') return `已达标 ${dailyAchievement.value.reached}/${dailyAchievement.value.total} 天`
  if (goal.value.cycleType === 'monthly') return `本月累计 ${goal.value.completedValue}/${goal.value.targetValue} ${progressDisplay.value.unit}`
  return `累计达成 ${goal.value.progress}%`
})

const defaultOverallStatus = computed(() => {
  if (!goal.value) return ''
  if (goal.value.cycleType === 'daily') {
    return dailyAchievement.value.hasFailed ? '已失达标' : '保持达标'
  }
  if (goal.value.cycleType === 'monthly') {
    return goal.value.progress >= 100 ? '已达标' : '进行中'
  }
  if (goal.value.includeType === 'sunrun') {
    return hasFailedSunrunPeriod.value ? '已失达标' : (goal.value.progress >= 100 ? '已达标' : '未达标')
  }
  return goal.value.progress >= 100 ? '已达标' : '未达标'
})

const isOverallGood = computed(() => ['保持达标', '已达标', '进行中'].includes(goal.value?.overallStatus || defaultOverallStatus.value))

const dailyAchievement = computed(() => {
  const data = getCalendarData().filter(c => c.status !== 'none' && c.status !== 'nil')
  const cells = data.map(c => ({
    day: c.day,
    status: c.status === 'achieved' ? 'reached' : 'failed',
    label: c.status === 'achieved' ? '达标' : '未达标',
  }))
  return {
    cells,
    reached: cells.filter(c => c.status === 'reached').length,
    total: cells.length,
    hasFailed: cells.some(c => c.status === 'failed'),
  }
})

const sunrunWeeklyTags = computed(() => {
  if (!goal.value?.sunrunConfig?.weekMinCount) return []
  const reached = Math.min(5, Math.max(0, goal.value.weekCompleted || 0))
  return Array.from({ length: 5 }, (_, i) => ({
    label: `W${i + 1}`,
    reached: i < reached,
  }))
})

const sunrunMonthlyTags = computed(() => {
  if (!goal.value?.sunrunConfig?.monthMinCount) return []
  const monthReached = (goal.value.monthCompleted || 0) >= goal.value.sunrunConfig.monthMinCount
  return [{ label: `${currentMonthNum.value}月`, reached: monthReached }]
})

const hasFailedSunrunPeriod = computed(() => {
  if (!goal.value || goal.value.includeType !== 'sunrun') return false
  return sunrunWeeklyTags.value.some(t => !t.reached) || sunrunMonthlyTags.value.some(t => !t.reached)
})

const ruleHelpText = computed(() => {
  if (!goal.value) return []
  if (goal.value.includeType === 'sunrun') {
    return [
      '阳光跑必须配置里程目标，里程达标后才可能整体达标。',
      '如果开启周最低次数，目标生效时段内覆盖到的每个自然周都要达标；自然周为周一至周日，不足一个自然周也按一个周期。',
      '如果开启月最低次数，目标生效时段内覆盖到的每个自然月都要达标；不足一个自然月也按一个周期。',
      '学期/自定义阳光跑目标如果开启周/月次数，已到达自然周/月未达标时整体状态为已失达标。',
    ]
  }
  if (goal.value.cycleType === 'daily') {
    return [
      '每日目标的整体达标规则：目标生效期间每天都达标才算整体达标。',
      '当前统计只判断已经到达的日期，未来日期暂不参与。',
      '顶部完成值展示今日进度，整体进度展示已达标天数/已到达天数。',
    ]
  }
  if (goal.value.cycleType === 'monthly') {
    return [
      '每月目标的整体达标规则：目标生效期间每个月都达标才算整体达标。',
      '当前统计只判断已经到达的月份，未来月份暂不参与。',
      '顶部完成值展示本月进度，整体进度展示已达标月份/已到达月份。',
    ]
  }
  return [
    '学期/自定义普通总目标按累计完成值判断，达到目标值即已达标，未达到即未达标。',
    '普通总目标不展示已失达标，也不展示已达标天数/月数。',
    '如果是多个单项目标，需要所有子条件都达标。',
    '历史计入记录按产生时的规则版本固定；目标值修改后会重新计算当前达标结果。',
  ]
})

// 剩余量周期文案
const cycleRemainingText = computed(() => {
  if (!goal.value) return ''
  const prefix = { daily: '今天还需运动 ', monthly: '本月还需运动 ', semester: '本学期还需运动 ', custom: '本周期还需运动 ' }
  const remaining = goal.value.remainingText.replace('还差', '')
  return (prefix[goal.value.cycleType] || '还需 ') + remaining
})

// 获取日历数据
const getCalendarData = () => {
  const key = `${currentYear.value}${String(currentMonthNum.value).padStart(2, '0')}`
  return calendarData[key] || []
}

// 计算日历网格
const calendarGrid = computed(() => {
  const data = getCalendarData()
  const firstDay = new Date(currentYear.value, currentMonthNum.value - 1, 1)
  const startWeekday = firstDay.getDay()
  const daysInMonth = new Date(currentYear.value, currentMonthNum.value, 0).getDate()

  const grid = []
  for (let i = 0; i < startWeekday; i++) {
    grid.push({ day: null, status: 'none' })
  }
  const today = dayjs()
  for (let d = 1; d <= daysInMonth; d++) {
    const cellData = data.find(c => c.day === d)
    const rawStatus = cellData ? cellData.status : 'none'
    grid.push({
      day: d,
      status: rawStatus === 'nil' ? 'none' : rawStatus,
      isToday: currentYear.value === today.year() && currentMonthNum.value === (today.month() + 1) && d === today.date(),
    })
  }
  return grid
})

const prevMonth = () => {
  if (currentMonthNum.value === 1) {
    currentMonthNum.value = 12
    currentYear.value--
  } else {
    currentMonthNum.value--
  }
  currentMonth.value = `${currentYear.value}年${currentMonthNum.value}月`
}

const nextMonth = () => {
  if (currentMonthNum.value === 12) {
    currentMonthNum.value = 1
    currentYear.value++
  } else {
    currentMonthNum.value++
  }
  currentMonth.value = `${currentYear.value}年${currentMonthNum.value}月`
}

const onDayClick = (cell) => {
  if (!cell.day || cell.status === 'none') return
  selectedDay.value = {
    date: `${currentMonth.value}${cell.day}日`,
    status: cell.status,
    summary: getDaySummary(cell),
  }
  showDayDetail.value = true
}

const getDaySummary = (cell) => {
  if (isDailyGoal.value) {
    return cell.status === 'achieved' ? '今日运动120分钟，达标 ✅' : '今日运动45分钟，未达标 ❌'
  }
  const g = goal.value
  if (!g) return ''
  const includeType = g.includeType
  if (includeType === 'all') {
    return `当天完成运动${cell.status === 'achieved' ? '120' : '45'}分钟`
  }
  if (includeType === 'sunrun') {
    return `当天跑步${cell.status === 'achieved' ? '3.1' : '1.2'}公里`
  }
  if (includeType === 'multi') {
    return `跳绳 150个 ✅\n跑步 0.5公里 ❌\n仰卧起坐 60个 ✅`
  }
  return `当天完成${cell.status === 'achieved' ? '150个' : '80个'}`
}

const onBack = () => {
  router.back()
}

function showDetailToast() {
  showToast('跳转运动记录详情页')
}

// 初始化 - 支持从生效目标和历史目标中查找
const id = Number(route.params.id)
goal.value = goalList.find(g => g.id === id) || historyGoalList.find(g => g.id === id) || null
loading.value = false
</script>

<style scoped>
.goal-detail-page {
  min-height: 100vh;
  background: #f8f8fb;
  padding-bottom: 60px;
}

.loading, .not-found {
  padding: 40px;
  text-align: center;
  color: #999;
}

/* 顶部信息 */
.detail-header {
  padding: 16px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.detail-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.detail-name {
  font-size: 18px;
  font-weight: 600;
}

.detail-tags {
  display: flex;
  gap: 6px;
}

.detail-tags .van-tag {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  color: #fff !important;
}

.rule-help {
  margin-left: auto;
  font-size: 20px;
  color: #fff;
}

/* 进度展示 */
.progress-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  background: #fff;
  margin: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.progress-numbers {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.progress-completed {
  color: #4facfe;
}

.progress-divider {
  color: #ccc;
  margin: 0 4px;
}

.progress-target {
  color: #999;
}

.progress-dim {
  font-size: 13px;
  color: #999;
  margin-top: 2px;
}

.progress-pct {
  font-size: 16px;
  color: #4facfe;
  margin-top: 4px;
}

.progress-status {
  font-size: 14px;
  margin-top: 4px;
  font-weight: 500;
}

.overall-box {
  width: 100%;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f2f3f5;
  font-size: 13px;
  color: #666;
  line-height: 1.8;
}

.overall-line {
  text-align: center;
}

.overall-status.good {
  color: #07c160;
  font-weight: 600;
}

.overall-status.bad {
  color: #ee0a24;
  font-weight: 600;
}

.rule-help-popup {
  padding: 20px 16px 24px;
}

.help-block {
  font-size: 14px;
  color: #333;
  line-height: 1.7;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

/* 剩余量 */
.remaining-section {
  background: #fffbe8;
  margin: 0 16px 12px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  color: #ed6a0c;
}

.sub-condition {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  font-size: 14px;
}

.sub-gap {
  font-size: 12px;
  color: #ee0a24;
  margin-left: auto;
}

/* 周期达标概览 */
.period-achievement-section {
  background: #fff;
  margin: 12px 16px;
  padding: 16px;
  border-radius: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.overview-summary {
  margin-bottom: 10px;
  font-size: 13px;
  color: #666;
}

.overview-summary span {
  color: #07c160;
  font-weight: 600;
}

.mini-day-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.mini-day {
  min-height: 42px;
  border-radius: 8px;
  background: #fff1f0;
  color: #ee0a24;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.mini-day.reached {
  background: #e6f9f2;
  color: #07c160;
}

.mini-day em {
  font-style: normal;
  font-size: 11px;
  margin-top: 2px;
}

.month-overview-card,
.sub-overview-item,
.progress-row,
.sunrun-mileage {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  background: #f7f8fa;
  border-radius: 8px;
}

.month-title,
.sub-overview-top span,
.tag-title,
.progress-row span,
.sunrun-mileage span {
  font-size: 13px;
  color: #666;
}

.month-desc,
.sub-overview-desc {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.month-note {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}

.sub-overview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub-overview-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sunrun-mileage strong,
.progress-row strong {
  color: #1989fa;
  font-size: 18px;
}

.sunrun-mileage small {
  font-size: 12px;
  color: #999;
}

.sunrun-tags {
  margin-top: 12px;
}

.period-tag {
  display: inline-block;
  margin: 6px 6px 0 0;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  color: #ee0a24;
  background: #fff1f0;
}

.period-tag.reached {
  color: #07c160;
  background: #e6f9f2;
}

.total-overview .van-progress {
  margin-top: 12px;
}

/* 计入规则 */
.rules-section {
  background: #fff;
  margin: 12px 16px;
  padding: 16px;
  border-radius: 12px;
}

.rules-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.rule-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 13px;
}

.rule-row:last-child {
  border-bottom: none;
}

.rule-label {
  width: 100px;
  color: #999;
  flex-shrink: 0;
}

.rule-value {
  flex: 1;
  color: #333;
}

/* 记录列表 */
.records-section {
  background: #fff;
  margin: 0 16px 12px;
  padding: 16px;
  border-radius: 12px;
}

.records-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.record-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.record-item:last-child {
  border-bottom: none;
}

.record-main {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  flex-wrap: wrap;
}

.record-time {
  color: #999;
}

.record-sport {
  color: #4facfe;
  font-weight: 500;
}

.record-score {
  color: #333;
}

.record-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  font-size: 11px;
  color: #999;
}

.record-duration {
  font-size: 12px;
  color: #666;
  margin-top: 6px;
}

.record-include-amount {
  font-size: 12px;
  color: #ff976e;
  margin-top: 4px;
}

.record-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

/* 日历 */
.history-calendar {
  background: #fff;
  margin: 12px 16px;
  padding: 16px;
  border-radius: 12px;
}

.calendar-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 600;
}

.calendar-nav .van-icon {
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
}

.calendar-week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 8px;
}

.calendar-day-header {
  font-size: 12px;
  color: #999;
  padding: 4px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-cell {
  text-align: center;
}

.calendar-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 2px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
}

.calendar-day.today {
  background: #e8f4fd;
  font-weight: 700;
  color: #4facfe;
}

.calendar-day.achieved {
  color: #07c160;
  font-weight: 500;
}

.calendar-day.failed {
  color: #ee0a24;
  font-weight: 500;
}

.calendar-day.disabled {
  visibility: hidden;
}

.calendar-day.empty {
  color: #ccc;
}

.calendar-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  margin-top: 2px;
}

.calendar-dot.green { background: #07c160; }
.calendar-dot.red { background: #ee0a24; }
.calendar-dot.blue { background: #4facfe; }
.calendar-dot.gray { background: #e0e0e0; }

.calendar-day.has-data {
  color: #4facfe;
  font-weight: 500;
}

.calendar-legend {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  font-size: 12px;
  color: #999;
}

.legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}

.legend-dot.green { background: #07c160; }
.legend-dot.red { background: #ee0a24; }
.legend-dot.blue { background: #4facfe; }
.legend-dot.gray { background: #e0e0e0; }

/* 月度总计 */
.monthly-total {
  margin-top: 12px;
  padding: 10px 12px;
  background: #e8f4fd;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #4facfe;
  text-align: center;
}

/* 弹窗 */
.day-detail-popup {
  padding: 24px 16px;
}

.popup-title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
}

.popup-content {
  text-align: center;
}

.popup-status {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.popup-summary {
  font-size: 14px;
  color: #666;
  white-space: pre-line;
  text-align: left;
  line-height: 1.8;
}
</style>
