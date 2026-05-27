<template>
  <div class="history-goals-page">
    <van-nav-bar :left-arrow="true" title="历史目标" @click-left="onBack" />

    <div class="history-list">
      <div
        class="history-card"
        v-for="goal in historyGoals"
        :key="goal.id"
        @click="goToDetail(goal.id)"
      >
        <div class="card-header">
          <span class="card-name">{{ goal.name }}</span>
          <van-tag :color="statusMap[goal.status]?.color || '#999'" plain size="small">
            {{ goal.effectivePeriod }}
          </van-tag>
        </div>
        <div class="card-body">
          <div class="card-info-row">
            <span class="info-label">周期</span>
            <span class="info-value">{{ cycleTypeMap[goal.cycleType]?.label }}</span>
          </div>
          <div class="card-info-row">
            <span class="info-label">计入项目</span>
            <span class="info-value">{{ includeTypeMap[goal.includeType]?.label }}</span>
          </div>
          <div class="card-info-row">
            <span class="info-label">适用范围</span>
            <span class="info-value">{{ goal.scopeText }}</span>
          </div>
          <div class="card-info-row">
            <span class="info-label">完成值</span>
            <span class="info-value">{{ goal.completedDetail }}</span>
          </div>
          <div class="card-info-row">
            <span class="info-label">整体进度</span>
            <span class="info-value">{{ goal.overallProgressText || historyProgressText(goal) }}</span>
          </div>
        </div>
        <div class="card-progress">
          <van-progress
            :percentage="goal.progress"
            :color="goal.progress >= 100 ? '#07c160' : '#4facfe'"
            :pivot-text="goal.progress >= 100 ? '已达标' : '未达标'"
            stroke-width="6"
          />
        </div>
      </div>
    </div>

    <div class="empty-state" v-if="historyGoals.length === 0">
      <van-empty description="暂无历史目标" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { historyGoalList, cycleTypeMap, includeTypeMap, statusMap } from '@/mock/sportsGoal.js'

const router = useRouter()
const historyGoals = ref(historyGoalList)

const historyProgressText = (goal) => {
  if (goal.cycleType === 'daily') return `已达标 ${goal.achievedDays || 0} / ${goal.totalDays || 0} 天`
  if (goal.cycleType === 'monthly') return goal.progress >= 100 ? '已达标 1/1 月' : '已达标 0/1 月'
  return `累计达成 ${Math.min(goal.progress || 0, 100)}%`
}

const onBack = () => {
  router.back()
}

const goToDetail = (id) => {
  router.push(`/sports-goal/${id}`)
}
</script>

<style scoped>
.history-goals-page {
  min-height: 100vh;
  background: #f8f8fb;
  padding-bottom: 60px;
}

.history-list {
  padding: 12px 16px;
}

.history-card {
  background: #f5f5f5;
  border-radius: 12px;
  margin-bottom: 12px;
  padding: 14px;
  opacity: 0.85;
  cursor: pointer;
}

.history-card:active {
  opacity: 1;
  background: #ebebeb;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-name {
  font-size: 15px;
  font-weight: 600;
  color: #666;
}

.card-body {
  background: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 10px;
}

.card-info-row {
  display: flex;
  padding: 4px 0;
  font-size: 13px;
}

.info-label {
  width: 70px;
  color: #999;
}

.info-value {
  flex: 1;
  color: #666;
}

.card-progress {
  margin-top: 4px;
}

.empty-state {
  padding: 40px 0;
}
</style>
