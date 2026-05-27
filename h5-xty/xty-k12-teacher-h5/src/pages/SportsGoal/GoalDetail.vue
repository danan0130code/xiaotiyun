<template>
  <div class="goal-detail-page">
    <van-nav-bar title="目标详情" left-arrow fixed placeholder @click-left="$router.back()" />

    <div v-if="summary" class="detail-content">
      <!-- 目标基本信息摘要卡片 -->
      <div class="summary-card">
        <div class="summary-header">
          <div class="summary-name">{{ summary.name }}</div>
          <div class="summary-tags">
            <van-tag :color="getSportColor(summary.sportProjectType)" size="small" text-color="#fff">
              {{ summary.sportProjectLabel }}
            </van-tag>
            <van-tag type="primary" size="small">{{ summary.typeLabel }}</van-tag>
            <van-tag :color="getCycleColor(summary.cycleType)" size="small" text-color="#fff">
              {{ getCycleLabel(summary.cycleType) }}
            </van-tag>
          </div>
        </div>
        <div class="summary-value">{{ summary.goalValueSummary }}</div>
        <van-icon name="question-o" class="summary-help" @click="showCalcPopup = true" />
        <div class="summary-rate-row">
          <div class="rate-circle-lg" :style="{ borderColor: getRateColor(summary.completionRate) }">
            <span class="rate-lg">{{ summary.completionRate }}%</span>
          </div>
          <span class="rate-label">整体达标率</span>
          <div class="summary-counts">
            <span>整体已达标 {{ summary.达标人数 }} 人</span>
            <span>整体未达标 {{ summary.unreachedCount }} 人</span>
          </div>
          <div class="summary-period">{{ summary.periodProgress }}</div>
        </div>
      </div>

      <!-- 统计概览条 -->
      <div class="stats-bar">
        <div class="stats-item">
          <span class="stats-num">{{ stats.totalCount }}</span>
          <span class="stats-label">总记录数</span>
        </div>
        <div class="stats-divider" />
        <div class="stats-item">
          <span class="stats-num green">{{ stats.fullCount }}</span>
          <span class="stats-label">已计入数</span>
        </div>
        <div class="stats-divider" />
        <div class="stats-item">
          <span class="stats-num orange">{{ stats.partialCount }}</span>
          <span class="stats-label">部分计入数</span>
        </div>
      </div>

      <!-- 目标规则摘要（折叠） -->
      <div class="rule-card">
        <div class="card-title-row">
          <div class="card-title-left" @click="ruleExpanded = !ruleExpanded">
            <span class="card-title">目标规则摘要</span>
            <van-icon :name="ruleExpanded ? 'arrow-up' : 'arrow-down'" size="14" color="#999" />
          </div>
          <span class="view-rule-btn" @click="showRulePopup = true">查看规则</span>
        </div>
        <div v-show="ruleExpanded" class="rule-body">
          <div class="rule-group">
            <div class="rule-label">目标名称</div>
            <div class="rule-value">{{ ruleDetail?.name || summary.name }}</div>
          </div>
          <div class="rule-group">
            <div class="rule-label">目标类型 / 周期</div>
            <div class="rule-value">{{ summary.typeLabel }} · {{ getCycleLabel(summary.cycleType) }}</div>
          </div>
          <div class="rule-group">
            <div class="rule-label">目标值</div>
            <div class="rule-value">{{ summary.goalValueSummary }}</div>
          </div>
          <div class="rule-group">
            <div class="rule-label">生效周期</div>
            <div class="rule-value">{{ ruleDetail?.period || summary.period || '-' }}</div>
          </div>
          <div class="rule-group">
            <div class="rule-label">计入运动项目</div>
            <div class="rule-value">{{ summary.sportProjectLabel }}</div>
          </div>
          <div v-if="ruleDetail?.countRules" class="rule-group">
            <div class="rule-label">计入规则</div>
            <div class="rule-value rule-rules">
              <span>{{ ruleDetail.countRules.sportProjects || '-' }}</span>
              <span class="rule-sep">·</span>
              <span>{{ ruleDetail.countRules.businessTypes || '-' }}</span>
              <span class="rule-sep">·</span>
              <span>{{ ruleDetail.countRules.statusTypes || '-' }}</span>
              <span v-if="ruleDetail.countRules.projectTags && ruleDetail.countRules.projectTags !== '无'" class="rule-sep">·</span>
              <span v-if="ruleDetail.countRules.projectTags && ruleDetail.countRules.projectTags !== '无'">{{ ruleDetail.countRules.projectTags }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 查看规则弹窗 -->
      <van-popup v-model:show="showRulePopup" position="right" :style="{ width: '85%', height: '100%' }" closeable close-icon="cross">
        <div class="rule-popup">
          <div class="rule-popup-title">运动目标规则详情</div>

          <div class="rule-section">
            <div class="rule-section-title">基础信息</div>
            <div class="rule-cell">
              <span class="rule-cell-label">目标名称</span>
              <span class="rule-cell-value">{{ ruleDetail?.name || summary.name }}</span>
            </div>
            <div class="rule-cell">
              <span class="rule-cell-label">目标类型</span>
              <span class="rule-cell-value">{{ summary.typeLabel }}</span>
            </div>
            <div class="rule-cell">
              <span class="rule-cell-label">目标周期</span>
              <span class="rule-cell-value">{{ getCycleLabel(summary.cycleType) }}</span>
            </div>
          </div>

          <div class="rule-section">
            <div class="rule-section-title">周期信息</div>
            <div class="rule-cell">
              <span class="rule-cell-label">生效周期</span>
              <span class="rule-cell-value">{{ ruleDetail?.period || summary.period || '-' }}</span>
            </div>
            <div class="rule-cell">
              <span class="rule-cell-label">目标值</span>
              <span class="rule-cell-value">{{ summary.goalValueSummary }}</span>
            </div>
          </div>

          <div class="rule-section">
            <div class="rule-section-title">计入运动项目</div>
            <div class="rule-cell">
              <span class="rule-cell-label">计入项目</span>
              <span class="rule-cell-value">{{ summary.sportProjectLabel }}</span>
            </div>
            <div class="rule-cell">
              <span class="rule-cell-label">目标值详情</span>
              <span class="rule-cell-value">{{ summary.goalValueSummary }}</span>
            </div>
          </div>

          <div class="rule-section">
            <div class="rule-section-title">适用范围</div>
            <div class="rule-cell">
              <span class="rule-cell-label">适用对象</span>
              <span class="rule-cell-value">{{ ruleDetail?.scope || summary.typeLabel === '全校目标' ? '全校' : ruleDetail?.scope || '-' }}</span>
            </div>
            <div class="rule-cell">
              <span class="rule-cell-label">性别设定</span>
              <span class="rule-cell-value">{{ ruleDetail?.gender || '不限' }}</span>
            </div>
          </div>

          <div v-if="ruleDetail?.countRules" class="rule-section">
            <div class="rule-section-title">计入规则</div>
            <div class="rule-cell">
              <span class="rule-cell-label">运动项目</span>
              <span class="rule-cell-value">{{ ruleDetail.countRules.sportProjects || '-' }}</span>
            </div>
            <div class="rule-cell">
              <span class="rule-cell-label">业务类型</span>
              <span class="rule-cell-value">{{ ruleDetail.countRules.businessTypes || '-' }}</span>
            </div>
            <div class="rule-cell">
              <span class="rule-cell-label">成绩状态</span>
              <span class="rule-cell-value">{{ ruleDetail.countRules.statusTypes || '-' }}</span>
            </div>
            <div class="rule-cell">
              <span class="rule-cell-label">项目标签</span>
              <span class="rule-cell-value">{{ ruleDetail.countRules.projectTags || '无' }}</span>
            </div>
          </div>

          <div v-if="ruleDetail?.changeRecords?.length" class="rule-section">
            <div class="rule-section-title">变更记录</div>
            <div v-for="(cr, idx) in ruleDetail.changeRecords" :key="idx" class="change-item">
              <div class="change-time">{{ cr.time }}</div>
              <div class="change-desc">{{ cr.summary }}</div>
              <div class="change-changer">{{ cr.changer }}</div>
            </div>
          </div>
        </div>
      </van-popup>

      <van-tabs v-model:active="activeTab" sticky>
        <van-tab title="覆盖学生" name="students">
          <div class="filter-area">
            <van-search
              v-model="filters.studentName"
              placeholder="搜索学生姓名/学籍号"
              shape="round"
              @search="doSearch"
              @clear="doSearch"
            />
            <div class="filter-row">
              <van-dropdown-menu active-color="var(--primary-color, #0069EC)">
                <van-dropdown-item v-model="filters.status" :options="statusOptions" title="整体状态" />
                <van-dropdown-item v-model="filters.grade" :options="gradeOptions" title="年级" @change="onGradeChange" />
                <van-dropdown-item v-model="filters.className" :options="classOptions" title="班级" />
              </van-dropdown-menu>
            </div>
          </div>

          <div class="student-list">
            <div
              v-for="stu in pageStudents"
              :key="stu.id"
              class="student-card-row"
              @click="goStudentByItem(stu)"
            >
              <div class="student-row-main">
                <div>
                  <div class="student-row-name">{{ stu.name }}</div>
                  <div class="student-row-meta">{{ stu.className }} · {{ stu.studentNo }}</div>
                </div>
                <van-tag :color="getStatusColor(stu.overallStatus)" size="small" text-color="#fff">
                  {{ stu.overallStatus }}
                </van-tag>
              </div>
              <div class="student-row-progress">
                <span>当前周期 {{ stu.currentRate }}%</span>
                <span>{{ stu.progressText }}</span>
              </div>
            </div>
            <van-empty v-if="pageStudents.length === 0" description="暂无符合条件的学生" />
          </div>
        </van-tab>

        <van-tab title="计入记录" name="records">
          <!-- 筛选区 -->
          <div class="filter-area">
            <van-search
              v-model="filters.studentName"
              placeholder="搜索学生姓名/学籍号"
              shape="round"
              @search="doSearch"
              @clear="doSearch"
            />
            <div class="filter-row">
              <van-dropdown-menu active-color="var(--primary-color, #0069EC)">
                <van-dropdown-item v-model="filters.grade" :options="gradeOptions" title="年级" @change="onGradeChange" />
                <van-dropdown-item v-model="filters.className" :options="classOptions" title="班级" />
              </van-dropdown-menu>
            </div>
            <div class="filter-row date-row">
              <van-field
                v-model="filters.startDate"
                label="计入时间"
                placeholder="开始日期"
                readonly
                is-link
                @click="showStartPicker = true"
              />
              <span class="date-sep">至</span>
              <van-field
                v-model="filters.endDate"
                placeholder="结束日期"
                readonly
                is-link
                @click="showEndPicker = true"
              />
            </div>
            <van-popup v-model:show="showStartPicker" position="bottom">
              <van-date-picker
                title="选择开始日期"
                :min-date="new Date(2025, 0, 1)"
                :max-date="new Date(2026, 11, 31)"
                @confirm="onStartDateConfirm"
                @cancel="showStartPicker = false"
              />
            </van-popup>
            <van-popup v-model:show="showEndPicker" position="bottom">
              <van-date-picker
                title="选择结束日期"
                :min-date="new Date(2025, 0, 1)"
                :max-date="new Date(2026, 11, 31)"
                @confirm="onEndDateConfirm"
                @cancel="showEndPicker = false"
              />
            </van-popup>
          </div>

      <!-- 单条记录详情弹窗 -->
      <van-popup v-model:show="showRecordPopup" position="bottom" round :style="{ maxHeight: '70%' }" closeable>
        <div class="record-detail-popup" v-if="recordDetail">
          <div class="popup-title">运动记录详情</div>
          <div class="popup-body">
            <div class="detail-row">
              <span class="detail-label">学生姓名</span>
              <span class="detail-value">{{ recordDetail.studentName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">性别</span>
              <span class="detail-value">{{ recordDetail.gender }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">学籍号</span>
              <span class="detail-value">{{ recordDetail.studentNo }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">年级</span>
              <span class="detail-value">{{ recordDetail.grade }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">班级</span>
              <span class="detail-value">{{ recordDetail.className }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">运动项目</span>
              <span class="detail-value">{{ recordDetail.sportProject }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">运动时间</span>
              <span class="detail-value">{{ recordDetail.sportTime }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">业务类型</span>
              <span class="detail-value">{{ recordDetail.businessType }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">成绩</span>
              <span class="detail-value">{{ recordDetail.score }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">成绩状态</span>
              <span class="detail-value">
                <van-tag :color="recordDetail.scoreStatus === '正常' ? '#36d399' : '#ee0a24'" size="small" text-color="#fff">
                  {{ recordDetail.scoreStatus }}
                </van-tag>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">运动时长</span>
              <span class="detail-value">{{ recordDetail.sportDuration }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">计入时间</span>
              <span class="detail-value">{{ recordDetail.countTime }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">计入状态</span>
              <span class="detail-value">
                <van-tag :color="recordDetail.countStatus === '全部计入' ? '#36d399' : '#ff976a'" size="small" text-color="#fff">
                  {{ recordDetail.countStatus }}
                </van-tag>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">计入成绩</span>
              <span class="detail-value counted">{{ recordDetail.countedScore }}</span>
            </div>
          </div>
        </div>
      </van-popup>

          <!-- 记录列表 -->
          <div class="record-list">
        <div
          v-for="rec in pageRecords"
          :key="rec.id"
          class="record-card"
          @click="goStudentDetail(rec)"
        >
          <div class="record-top">
            <div class="record-student">
              <span class="student-name">{{ rec.studentName }}</span>
              <span class="student-gender">{{ rec.gender }}</span>
              <span class="student-no">{{ rec.studentNo }}</span>
            </div>
            <van-tag
              :color="rec.countStatus === '全部计入' ? '#36d399' : '#ff976a'"
              size="small"
              text-color="#fff"
            >
              {{ rec.countStatus }}
            </van-tag>
          </div>
          <div class="record-mid">
            <span class="record-project">{{ rec.sportProject }}</span>
            <span class="record-score">{{ rec.score }}</span>
            <span v-if="rec.sportProject !== '阳光跑'" class="record-status" :class="rec.scoreStatus === '正常' ? 'normal' : 'abnormal'">
              {{ rec.scoreStatus }}
            </span>
          </div>
          <div class="record-duration" v-if="rec.sportDuration">
            <span class="duration-label">运动时长：</span>
            <span class="duration-value">{{ rec.sportDuration }}</span>
          </div>
          <div class="record-bottom">
            <span class="record-meta">{{ rec.className }} · {{ rec.grade }}</span>
            <span class="record-time">{{ rec.countTime }}</span>
          </div>
          <div v-if="rec.countStatus === '部分计入'" class="record-counted">
            <span class="counted-label">计入成绩：</span>
            <span class="counted-value">{{ rec.countedScore }}</span>
          </div>
          <div class="record-actions">
            <van-button size="small" plain type="primary" @click.stop="showRecordDetail(rec)">详情</van-button>
          </div>
        </div>

        <!-- 空状态 -->
        <van-empty v-if="pageRecords.length === 0" description="暂无符合条件的运动记录" />

        <!-- 加载更多 -->
        <div v-if="pageRecords.length > 0 && page < totalPages" class="load-more" @click="loadMore">
          <span>加载更多</span>
          <van-icon name="arrow-down" size="14" />
        </div>
          </div>
        </van-tab>
      </van-tabs>

      <van-popup v-model:show="showCalcPopup" position="bottom" round>
        <div class="calc-popup">
          <div class="popup-title">计算规则说明</div>
          <div class="calc-line" v-for="(line, idx) in calcRuleLines" :key="idx">{{ line }}</div>
          <van-button block type="primary" @click="showCalcPopup = false">知道了</van-button>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getGoalSummary,
  getGoalDetailRecords,
  getCoveredStudents,
  getAvailableGrades,
  getAvailableClasses,
  sportProjectConfig,
  cycleTypeConfig,
  goalRules,
} from '@/mock/sportsGoal.js'

const route = useRoute()
const router = useRouter()

const goalId = computed(() => Number(route.params.id))

// 目标摘要
const summary = computed(() => getGoalSummary(goalId.value))

// 规则详情
const ruleDetail = computed(() => goalRules[goalId.value] || null)

// 规则摘要折叠 & 弹窗
const ruleExpanded = ref(false)
const showRulePopup = ref(false)
const showCalcPopup = ref(false)
const activeTab = ref('students')

// 筛选
const filters = reactive({
  studentName: '',
  status: '',
  grade: '',
  className: '',
  startDate: '',
  endDate: formatDate(new Date(2026, 4, 1)),
})

const statusOptions = [
  { text: '全部', value: '' },
  { text: '保持/已达标', value: 'reached' },
  { text: '已失/未达标', value: 'unreached' },
]

const gradeOptions = computed(() => {
  const grades = getAvailableGrades(goalId.value)
  return [{ text: '全部', value: '' }, ...grades.map(g => ({ text: g, value: g }))]
})

const classOptions = computed(() => {
  if (!filters.grade) return [{ text: '全部', value: '' }]
  const classes = getAvailableClasses(goalId.value, filters.grade)
  return [{ text: '全部', value: '' }, ...classes.map(c => ({ text: c.name, value: c.name }))]
})

function onGradeChange() {
  filters.className = ''
}

// 日期选择
const showStartPicker = ref(false)
const showEndPicker = ref(false)

function onStartDateConfirm({ selectedValues }) {
  filters.startDate = selectedValues.join('-')
  showStartPicker.value = false
}
function onEndDateConfirm({ selectedValues }) {
  filters.endDate = selectedValues.join('-')
  showEndPicker.value = false
}

// 记录数据
const stats = reactive({ totalCount: 0, fullCount: 0, partialCount: 0 })
const totalPages = ref(0)
const page = ref(1)
const pageRecords = ref([])
const pageStudents = ref([])

function fetchStudents() {
  pageStudents.value = getCoveredStudents(goalId.value, {
    studentName: filters.studentName,
    status: filters.status,
    grade: filters.grade,
    className: filters.className,
  }).slice(0, 80)
}

function fetchRecords(resetPage = true) {
  if (resetPage) page.value = 1
  const result = getGoalDetailRecords(goalId.value, {
    studentName: filters.studentName,
    grade: filters.grade,
    className: filters.className,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  })
  stats.totalCount = result.stats.totalCount
  stats.fullCount = result.stats.fullCount
  stats.partialCount = result.stats.partialCount
  totalPages.value = result.totalPages
  if (resetPage) {
    pageRecords.value = result.records.slice(0, 20)
  }
}

function doSearch() {
  fetchStudents()
  fetchRecords(true)
}

function loadMore() {
  page.value++
  const result = getGoalDetailRecords(goalId.value, {
    studentName: filters.studentName,
    grade: filters.grade,
    className: filters.className,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  })
  pageRecords.value = result.records.slice(0, page.value * 20)
}

// 监听筛选变化
watch(
  () => [filters.status, filters.grade, filters.className, filters.startDate, filters.endDate],
  () => {
    fetchStudents()
    fetchRecords(true)
  }
)

onMounted(() => {
  fetchStudents()
  fetchRecords()
})

// 学生详情
function goStudentDetail(record) {
  const studentId = Number(record.studentNo.replace('STU2026', ''))
  router.push(`/sports-goal/student/${goalId.value}/${studentId}`)
}

function goStudentByItem(student) {
  router.push(`/sports-goal/student/${goalId.value}/${student.id}`)
}

// 单条记录详情弹窗
const showRecordPopup = ref(false)
const recordDetail = ref(null)

function showRecordDetail(rec) {
  recordDetail.value = rec
  showRecordPopup.value = true
}

// 工具函数
function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const getSportColor = (type) => sportProjectConfig[type]?.color || '#999'
const getCycleLabel = (type) => cycleTypeConfig[type]?.label || ''
const getCycleColor = (type) => cycleTypeConfig[type]?.color || '#999'
const getRateColor = (rate) => {
  if (rate >= 80) return '#36d399'
  if (rate >= 50) return '#ff976a'
  return '#ee0a24'
}

const getStatusColor = (status) => {
  if (status === '保持达标' || status === '已达标') return '#36d399'
  if (status === '已失达标') return '#ff976a'
  return '#ee0a24'
}

const calcRuleLines = computed(() => {
  if (!summary.value) return []
  if (summary.value.sportProjectType === 'sunrun') {
    return [
      '整体达标率=整体达标学生数/覆盖学生数。',
      '阳光跑必须达到里程目标；开启周最低次数时，每个自然周都要达标；开启月最低次数时，每个自然月都要达标。',
      '自然周为周一至周日，不足一个自然周或自然月也按一个周期判断。',
      '学期/自定义阳光跑目标如果开启周/月次数，已到达自然周/月未达标时整体状态为已失达标。',
    ]
  }
  if (summary.value.cycleType === 'daily') {
    return [
      '整体达标率=当前已到达日期都达标的学生数/覆盖学生数。',
      '未来日期不参与当前判断；目标结束后按全周期每天都达标判断。',
      '覆盖学生列表展示今日达成率和整体状态。',
    ]
  }
  if (summary.value.cycleType === 'monthly') {
    return [
      '整体达标率=当前已到达月份都达标的学生数/覆盖学生数。',
      '未来月份不参与当前判断；目标结束后按全周期每个月都达标判断。',
      '覆盖学生列表展示本月达成率和整体状态。',
    ]
  }
  return [
    '整体达标率=整体达标学生数/覆盖学生数。',
    '学期/自定义普通总目标按累计完成值判断，整体状态只展示已达标或未达标。',
    '普通总目标不展示已失达标，也不展示已达标天数/月数。',
    '单个项目或多个单项选择成绩单位时，完成值大于等于目标值即达标；选择运动次数时，累计次数大于等于目标次数即达标。',
    '目标值修改后会重新计算达标结果，历史计入记录仍按产生时规则版本固定。',
  ]
})
</script>

<style scoped>
.goal-detail-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-top: 46px;
}

.detail-content {
  padding-bottom: 24px;
}

/* 目标摘要卡片 */
.summary-card {
  background: #fff;
  margin: 12px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
}

.summary-header {
  margin-bottom: 10px;
}

.summary-name {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.summary-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.summary-value {
  font-size: 13px;
  color: #666;
  padding: 8px 0;
}

.summary-help {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 20px;
  color: var(--primary-color, #0069EC);
}

.summary-rate-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  gap: 6px;
}

.rate-circle-lg {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 4px solid #1989fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rate-lg {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.rate-label {
  font-size: 11px;
  color: #999;
}

.summary-counts {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.summary-period {
  font-size: 12px;
  color: #999;
}

.student-list {
  margin: 0 12px 12px;
}

.student-card-row {
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.student-row-main {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
}

.student-row-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.student-row-meta {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.student-row-progress {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

.calc-popup {
  padding: 20px 16px 24px;
}

.calc-line {
  font-size: 14px;
  color: #333;
  line-height: 1.7;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

/* 统计概览条 */
.stats-bar {
  display: flex;
  align-items: center;
  background: #fff;
  margin: 0 12px 12px;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stats-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stats-num {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.stats-num.green {
  color: #36d399;
}

.stats-num.orange {
  color: #ff976a;
}

.stats-label {
  font-size: 11px;
  color: #999;
}

.stats-divider {
  width: 1px;
  height: 28px;
  background: #e5e5e5;
}

/* 目标规则摘要卡片 */
.rule-card {
  background: #fff;
  margin: 0 12px 12px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title-left {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.view-rule-btn {
  font-size: 13px;
  color: var(--primary-color, #0069EC);
  cursor: pointer;
}

.rule-body {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.rule-group {
  display: flex;
  padding: 6px 0;
}

.rule-label {
  width: 100px;
  font-size: 13px;
  color: #999;
  flex-shrink: 0;
}

.rule-value {
  font-size: 13px;
  color: #333;
  flex: 1;
}

.rule-rules {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.rule-sep {
  color: #ccc;
}

/* 查看规则弹窗 */
.rule-popup {
  padding: 20px 16px 32px;
  height: 100%;
  overflow-y: auto;
}

.rule-popup-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.rule-section {
  margin-bottom: 20px;
}

.rule-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f0f0f0;
}

.rule-cell {
  display: flex;
  padding: 8px 0;
}

.rule-cell-label {
  width: 80px;
  font-size: 13px;
  color: #999;
  flex-shrink: 0;
}

.rule-cell-value {
  font-size: 13px;
  color: #333;
  flex: 1;
}

.change-item {
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.change-time {
  font-size: 12px;
  color: #bbb;
}

.change-desc {
  font-size: 13px;
  color: #333;
  margin: 4px 0;
}

.change-changer {
  font-size: 12px;
  color: #999;
}

/* 筛选区 */
.filter-area {
  background: #fff;
  margin: 0 12px 12px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filter-area .van-search {
  padding: 8px 8px 0;
}

.filter-row {
  padding: 0;
}

.filter-row .van-dropdown-menu {
  height: 44px;
}

.date-row {
  display: flex;
  align-items: center;
  padding: 0 16px 8px;
}

.date-row .van-field {
  flex: 1;
  padding: 6px 0;
  font-size: 13px;
}

.date-sep {
  color: #ccc;
  margin: 0 8px;
  flex-shrink: 0;
}

/* 记录列表 */
.record-list {
  margin: 0 12px;
}

.record-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  position: relative;
  cursor: pointer;
  transition: opacity 0.2s;
}

.record-card:active {
  opacity: 0.85;
}

.record-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.record-student {
  display: flex;
  align-items: center;
  gap: 6px;
}

.student-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.student-gender {
  font-size: 11px;
  color: #999;
}

.student-no {
  font-size: 11px;
  color: #bbb;
}

.record-mid {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.record-project {
  font-size: 13px;
  color: #555;
  font-weight: 500;
}

.record-score {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.record-status {
  font-size: 11px;
}

.record-status.normal {
  color: #36d399;
}

.record-status.abnormal {
  color: #ee0a24;
}

.record-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.record-meta {
  font-size: 11px;
  color: #aaa;
}

.record-time {
  font-size: 11px;
  color: #bbb;
}

.record-duration {
  margin-top: 4px;
  font-size: 11px;
  color: #888;
}

.duration-label {
  color: #aaa;
}

.duration-value {
  color: #666;
}

.record-counted {
  margin-top: 8px;
  padding: 6px 10px;
  background: #fff7e6;
  border-radius: 6px;
  font-size: 12px;
}

.counted-label {
  color: #999;
}

.counted-value {
  color: #ff976a;
  font-weight: 600;
}

.record-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.record-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

/* 单条记录详情弹窗 */
.record-detail-popup {
  padding: 20px 16px 32px;
}

.popup-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
}

.popup-body {
  max-height: 50vh;
  overflow-y: auto;
}

.detail-row {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.detail-label {
  width: 80px;
  font-size: 13px;
  color: #999;
  flex-shrink: 0;
}

.detail-value {
  font-size: 13px;
  color: #333;
  flex: 1;
  text-align: right;
}

.detail-value.counted {
  color: #ff976a;
  font-weight: 600;
}

/* 加载更多 */
.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 14px;
  font-size: 13px;
  color: var(--primary-color, #0069EC);
  cursor: pointer;
}

.load-more:active {
  opacity: 0.7;
}
</style>
