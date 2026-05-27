<template>
  <div class="sports-goal-page">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="运动目标" fixed placeholder />

    <!-- 班级筛选 Tab -->
    <div class="class-tabs-wrapper">
      <div class="class-tabs" ref="tabsRef">
        <div
          v-for="cls in tabs"
          :key="cls.id"
          class="class-tab"
          :class="{ active: activeClassId === cls.id }"
          @click="switchClass(cls.id)"
        >
          {{ cls.name }}
        </div>
      </div>
    </div>

    <!-- 模块 A：班级目标列表 -->
    <div class="goal-list">
      <!-- 下拉刷新 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div
          v-for="goal in filteredGoals"
          :key="goal.id"
          class="goal-card"
          @click="goGoalDetail(goal.id)"
        >
          <!-- 左侧图标 + 名称 -->
          <div class="goal-card-left">
            <div class="sport-icon" :style="{ background: getSportColor(goal.sportProjectType) }">
              <van-icon :name="getSportIcon(goal.sportProjectType)" size="20" color="#fff" />
            </div>
            <div class="goal-info">
              <div class="goal-name">{{ goal.name }}</div>
              <div class="goal-tags">
                <span class="sport-tag" :style="{ color: getSportColor(goal.sportProjectType) }">
                  {{ goal.sportProjectLabel }}
                </span>
                <span class="cycle-tag" :style="{ color: getCycleColor(goal.cycleType) }">
                  {{ getCycleLabel(goal.cycleType) }}
                </span>
              </div>
              <div class="goal-value">{{ goal.goalValueSummary }}</div>
            </div>
          </div>

          <!-- 右侧达标率 + 箭头 -->
          <div class="goal-card-right">
            <div class="rate-circle" :style="{ borderColor: getRateColor(goal.completionRate) }">
              <span class="rate-number">{{ goal.completionRate }}%</span>
            </div>
            <div class="rate-people">{{ goal.达标人数 }}/{{ goal.coveredCount }}人达标</div>
            <van-icon name="arrow" size="14" color="#ccc" />
          </div>
        </div>

        <!-- 空状态 -->
        <van-empty
          v-if="!refreshing && filteredGoals.length === 0"
          description="暂无生效中的运动目标"
        />
      </van-pull-refresh>
    </div>

    <!-- 历史目标入口 -->
    <div v-if="!refreshing && filteredGoals.length > 0" class="history-entry" @click="goHistory">
      <van-icon name="clock-o" size="14" color="#999" />
      <span class="history-text">历史目标</span>
      <van-icon name="arrow" size="14" color="#ccc" />
    </div>

    <!-- 空班级状态 -->
    <van-empty
      v-if="classList.length === 0"
      description="暂无任教班级"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { classList, goalList, sportProjectConfig, cycleTypeConfig } from '@/mock/sportsGoal.js'

const router = useRouter()
const refreshing = ref(false)

// 班级 Tab
const tabs = computed(() => [
  { id: 0, name: '全部班级' },
  ...classList.map(c => ({ id: c.id, name: c.name })),
])
const activeClassId = ref(0)

const switchClass = (id) => {
  activeClassId.value = id
}

// 筛选后的目标列表
const filteredGoals = computed(() => {
  let list = [...goalList]
  // 按达标率升序（最低排前面），达标率相同时按周期类型排序
  const urgency = { daily: 0, monthly: 1, semester: 2, custom: 3 }
  list.sort((a, b) => {
    if (a.completionRate !== b.completionRate) return a.completionRate - b.completionRate
    return urgency[a.cycleType] - urgency[b.cycleType]
  })
  return list
})

const onRefresh = () => {
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
}

// 导航
const goGoalDetail = (id) => {
  router.push(`/sports-goal/goal/${id}`)
}

const goHistory = () => {
  router.push('/sports-goal/history')
}

// 样式工具
const getSportIcon = (type) => sportProjectConfig[type]?.icon || 'label-o'
const getSportColor = (type) => sportProjectConfig[type]?.color || '#999'
const getCycleLabel = (type) => cycleTypeConfig[type]?.label || ''
const getCycleColor = (type) => cycleTypeConfig[type]?.color || '#999'
const getRateColor = (rate) => {
  if (rate >= 80) return '#36d399'
  if (rate >= 50) return '#ff976a'
  return '#ee0a24'
}
</script>

<style scoped>
.sports-goal-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-top: 46px;
}

/* 班级 Tab */
.class-tabs-wrapper {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 46px;
  z-index: 9;
}

.class-tabs {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px 12px;
  gap: 8px;
  -webkit-overflow-scrolling: touch;
}

.class-tabs::-webkit-scrollbar {
  display: none;
}

.class-tab {
  flex-shrink: 0;
  padding: 6px 14px;
  font-size: 13px;
  color: #666;
  background: #f5f7fa;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.class-tab.active {
  color: #fff;
  background: var(--primary-color, #0069EC);
}

/* 目标列表 */
.goal-list {
  padding: 12px;
}

.goal-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: opacity 0.2s;
}

.goal-card:active {
  opacity: 0.85;
}

.goal-card-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
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

.goal-info {
  flex: 1;
  min-width: 0;
}

.goal-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.goal-card-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  margin-left: 12px;
}

.rate-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid #1989fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rate-number {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.rate-people {
  font-size: 11px;
  color: #999;
}

/* 历史目标入口 */
.history-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px;
  background: #fff;
  margin: 0 12px 12px;
  border-radius: 12px;
  cursor: pointer;
}

.history-text {
  font-size: 14px;
  color: #999;
}
</style>
