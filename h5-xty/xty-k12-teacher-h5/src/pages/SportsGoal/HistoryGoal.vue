<template>
  <div class="history-goal-page">
    <van-nav-bar title="历史目标" left-arrow fixed placeholder @click-left="$router.back()" />

    <div class="history-list">
      <div
        v-for="goal in historyGoalList"
        :key="goal.id"
        class="goal-card"
      >
        <!-- 状态标签 -->
        <div class="status-bar">
          <van-tag :type="goal.status === '已过期' ? 'default' : 'danger'" size="medium">
            {{ goal.status }}
          </van-tag>
          <span class="period-text">{{ goal.period }}</span>
        </div>

        <!-- 目标信息 -->
        <div class="goal-info">
          <div class="sport-icon" :style="{ background: getSportColor(goal.sportProjectType) }">
            <van-icon :name="getSportIcon(goal.sportProjectType)" size="20" color="#fff" />
          </div>
          <div class="goal-details">
            <div class="goal-name">{{ goal.name }}</div>
            <div class="goal-tags">
              <span class="sport-tag" :style="{ color: getSportColor(goal.sportProjectType) }">
                {{ goal.sportProjectLabel }}
              </span>
              <span class="cycle-tag">{{ getCycleLabel(goal.cycleType) }}</span>
            </div>
            <div class="goal-value">{{ goal.goalValueSummary }}</div>
          </div>
        </div>

        <!-- 达成数据 -->
        <div class="goal-stats">
          <div class="stat-item">
            <span class="stat-rate" :style="{ color: getRateColor(goal.completionRate) }">
              {{ goal.completionRate }}%
            </span>
            <span class="stat-label">达标率</span>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-value">{{ goal.达标人数 }}/{{ goal.coveredCount }}</span>
            <span class="stat-label">达标人数</span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <van-empty v-if="historyGoalList.length === 0" description="暂无历史目标" />
    </div>
  </div>
</template>

<script setup>
import { historyGoalList, sportProjectConfig, cycleTypeConfig } from '@/mock/sportsGoal.js'

const getSportIcon = (type) => sportProjectConfig[type]?.icon || 'label-o'
const getSportColor = (type) => sportProjectConfig[type]?.color || '#999'
const getCycleLabel = (type) => cycleTypeConfig[type]?.label || ''
const getRateColor = (rate) => {
  if (rate >= 80) return '#36d399'
  if (rate >= 50) return '#ff976a'
  return '#ee0a24'
}
</script>

<style scoped>
.history-goal-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-top: 46px;
}

.history-list {
  padding: 12px;
}

.goal-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.period-text {
  font-size: 11px;
  color: #999;
}

.goal-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.sport-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.goal-details {
  flex: 1;
  min-width: 0;
}

.goal-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.goal-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
}

.sport-tag {
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(25, 141, 250, 0.08);
  border-radius: 4px;
}

.cycle-tag {
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(153, 153, 153, 0.08);
  border-radius: 4px;
  color: #999;
}

.goal-value {
  font-size: 12px;
  color: #999;
}

.goal-stats {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f8fb;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.stat-rate {
  font-size: 20px;
  font-weight: 700;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 11px;
  color: #999;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: #e5e5e5;
}
</style>
