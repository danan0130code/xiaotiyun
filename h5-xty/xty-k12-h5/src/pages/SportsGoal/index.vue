<template>
  <div class="sports-goal-page">
    <!-- 顶部返回 -->
    <div class="page-header">
      <div class="page-title">运动目标</div>
    </div>

    <!-- 目标达成概览条 -->
    <div class="overview-bar">
      <div class="overview-left">
        <div class="ring-progress">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle class="ring-bg" cx="30" cy="30" r="25" />
            <circle
              class="ring-bar"
              cx="30" cy="30" r="25"
              :style="ringStyle"
            />
          </svg>
          <span class="ring-text">{{ overviewPercent }}%</span>
        </div>
      </div>
      <div class="overview-right">
        <div class="overview-count">
          共 <strong>{{ activeGoals.length }}</strong> 个目标，已完成 <strong>{{ achievedCount }}</strong> 个
        </div>
        <div v-if="achievedCount === activeGoals.length && activeGoals.length > 0" class="all-done-hint">
          太棒了！全部目标已完成 🎉
        </div>
        <div v-else-if="completedCount === 0 && activeGoals.length > 0" class="keep-going-hint">
          继续加油！
        </div>
      </div>
    </div>

    <!-- 目标卡片列表 -->
    <div class="goal-list" v-if="sortedGoals.length > 0">
      <div
        class="goal-card"
        v-for="goal in sortedGoals"
        :key="goal.id"
        @click="goToDetail(goal.id)"
        :class="{ achieved: goal.progress >= 100 }"
      >
        <!-- 计入项目图标 -->
        <div class="goal-icon">
          {{ includeTypeMap[goal.includeType]?.icon }}
        </div>
        <!-- 主体 -->
        <div class="goal-body">
          <div class="goal-header">
            <span class="goal-name">{{ goal.name }}</span>
            <van-tag :color="goalTypeMap[goal.goalType]?.color || '#1989fa'" plain size="small">
              {{ goalTypeMap[goal.goalType]?.label }}
            </van-tag>
            <van-tag :color="cycleTypeMap[goal.cycleType]?.color || '#999'" plain size="small" type="primary">
              {{ cycleTypeMap[goal.cycleType]?.label }}
            </van-tag>
          </div>
          <div class="goal-target">
            {{ goal.targetDetail }}
          </div>
          <div class="goal-completed">
            {{ goal.completedDetail }}
          </div>
          <!-- 多项目标子条件 -->
          <div class="sub-conditions" v-if="goal.subConditions">
            <div class="sub-item" v-for="(sub, i) in goal.subConditions" :key="i">
              <span :style="{ color: sub.done ? '#07c160' : '#ee0a24' }">
                {{ sub.done ? '✅' : '❌' }}
              </span>
              <span>{{ sub.name }} {{ sub.target }}</span>
              <span v-if="!sub.done" class="sub-remaining">{{ sub.remaining }}</span>
            </div>
          </div>
          <!-- 阳光跑特殊展示 -->
          <div class="sunrun-details" v-if="goal.includeType === 'sunrun' && goal.sunrunConfig">
            <div class="sunrun-item" v-if="goal.dailyCompleted !== undefined">
              今日里程：{{ goal.dailyCompleted }} 公里
            </div>
            <div class="sunrun-item">
              学期里程：{{ goal.completedValue }}/{{ goal.sunrunConfig.semesterMileage }} 公里
              <span class="remaining-inline">{{ goal.remainingText }}</span>
            </div>
            <div class="sunrun-item" v-if="goal.sunrunConfig.weekMinCount">
              周达标情况：{{ goal.weekCompleted || 0 }}/{{ goal.sunrunConfig.weekMinCount }} 次
              <span v-if="goal.weekCompleted >= goal.sunrunConfig.weekMinCount" style="color: #07c160">✅</span>
              <span v-else class="remaining-inline">还差 {{ goal.sunrunConfig.weekMinCount - (goal.weekCompleted || 0) }} 次</span>
            </div>
            <div class="sunrun-item" v-if="goal.sunrunConfig.monthMinCount">
              月达标情况：{{ goal.monthCompleted || 0 }}/{{ goal.sunrunConfig.monthMinCount }} 次
              <span v-if="goal.monthCompleted >= goal.sunrunConfig.monthMinCount" style="color: #07c160">✅</span>
              <span v-else class="remaining-inline">还差 {{ goal.sunrunConfig.monthMinCount - (goal.monthCompleted || 0) }} 次</span>
            </div>
            <div class="sunrun-item" v-if="goal.sunrunConfig.dailyMaxInclude">
              💡 每日最多计入：{{ goal.sunrunConfig.dailyMaxInclude }} 公里
            </div>
          </div>
          <!-- 进度条 -->
          <van-progress
            :percentage="Math.min(goal.progress, 100)"
            :color="goal.progress >= 100 ? '#07c160' : '#4facfe'"
            :pivot-text="goal.progress >= 100 ? '已达标' : ''"
            stroke-width="6"
          />
        </div>
        <!-- 状态+剩余 -->
        <div class="goal-footer">
          <div class="goal-status">
            <van-tag :color="goal.progress >= 100 ? '#07c160' : '#4facfe'" size="medium" plain>
              {{ goal.progress >= 100 ? '已达标' : '进行中' }}
            </van-tag>
          </div>
          <div class="goal-remaining" v-if="goal.progress < 100">
            {{ goal.remainingText }}
          </div>
          <div class="goal-period">{{ goal.cycleText }}</div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-state" v-else>
      <van-empty description="暂无运动目标，等待老师为你设置" />
    </div>

    <!-- 历史目标入口 -->
    <div class="history-entry" @click="goToHistoryGoals">
      <span>📜 历史目标</span>
      <van-icon name="arrow" />
    </div>

    <!-- 历史达成入口（详情页内，主页不需要） -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  goalList,
  sortGoals,
  goalTypeMap,
  cycleTypeMap,
  includeTypeMap,
} from '@/mock/sportsGoal.js'

const router = useRouter()

// 使用 Mock 数据
const activeGoals = ref(goalList)

// 已完成数
const achievedCount = computed(() => activeGoals.value.filter(g => g.progress >= 100).length)
const completedCount = computed(() => achievedCount.value)

// 概览占比
const overviewPercent = computed(() => {
  if (activeGoals.value.length === 0) return '--'
  return Math.round((achievedCount.value / activeGoals.value.length) * 100)
})

// 环形进度条样式
const ringStyle = computed(() => {
  if (typeof overviewPercent.value !== 'number') return {}
  const circumference = 2 * Math.PI * 25
  const offset = circumference - (overviewPercent.value / 100) * circumference
  return {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: offset,
  }
})

// 排序后的目标列表
const sortedGoals = computed(() => sortGoals(goalList))

const goToDetail = (id) => {
  router.push(`/sports-goal/${id}`)
}

const goToHistoryGoals = () => {
  router.push('/sports-goal/history')
}
</script>

<style scoped>
.sports-goal-page {
  min-height: 100vh;
  padding-bottom: 80px;
  background: #f8f8fb;
}

/* 顶部 */
.page-header {
  padding: 16px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
}

/* 概览条 */
.overview-bar {
  display: flex;
  align-items: center;
  padding: 16px;
  margin: 12px 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.overview-left {
  margin-right: 16px;
  flex-shrink: 0;
}

.ring-progress {
  position: relative;
  width: 60px;
  height: 60px;
}

.ring-bg {
  fill: none;
  stroke: #e0e0e0;
  stroke-width: 4;
}

.ring-bar {
  fill: none;
  stroke: #4facfe;
  stroke-width: 4;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.5s ease;
}

.ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  font-weight: 700;
  color: #4facfe;
}

.overview-right {
  flex: 1;
}

.overview-count {
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
}

.overview-count strong {
  font-size: 18px;
  color: #4facfe;
}

.all-done-hint {
  font-size: 13px;
  color: #07c160;
  margin-top: 4px;
  font-weight: 500;
}

.keep-going-hint {
  font-size: 12px;
  color: #ff976e;
  margin-top: 4px;
}

/* 目标卡片列表 */
.goal-list {
  padding: 0 16px;
}

.goal-card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  padding: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
}

.goal-card:active {
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.15);
}

.goal-card .goal-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.goal-card .goal-body {
  flex: 1;
}

.goal-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.goal-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.goal-target {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.goal-completed {
  font-size: 13px;
  color: #4facfe;
  margin-bottom: 6px;
}

/* 子条件 */
.sub-conditions {
  background: #f8f8fb;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 8px;
}

.sub-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #333;
  padding: 3px 0;
}

.sub-remaining {
  font-size: 11px;
  color: #ee0a24;
  margin-left: auto;
}

/* 阳光跑详情 */
.sunrun-details {
  background: #fff7ed;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 8px;
}

.sunrun-item {
  font-size: 13px;
  color: #333;
  padding: 3px 0;
}

.remaining-inline {
  font-size: 11px;
  color: #ff976e;
  margin-left: 4px;
}

/* 卡片底部 */
.goal-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 12px;
}

.goal-status {
  flex-shrink: 0;
}

.goal-remaining {
  flex: 1;
  color: #999;
}

.goal-card.achieved .goal-remaining {
  color: #07c160;
}

.goal-period {
  color: #999;
  font-size: 11px;
}

/* 空状态 */
.empty-state {
  padding: 40px 0;
}

/* 历史入口 */
.history-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 16px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 12px;
  font-size: 14px;
  color: #666;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
}

.history-entry:active {
  background: #f8f8fb;
}
</style>
