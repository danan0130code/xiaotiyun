<template>
  <div class="student-detail-page">
    <van-nav-bar title="学生达成详情" left-arrow fixed placeholder @click-left="$router.back()" />

    <div v-if="detail" class="detail-content">
      <!-- 差距摘要 -->
      <div class="gap-banner" :class="{ reached: detail.isReached }">
        <van-icon :name="detail.isReached ? 'checked' : 'info-o'" size="18" />
        <span class="gap-text">{{ detail.isReached ? '已达标 ✓' : detail.gapSummary }}</span>
      </div>

      <!-- 学生基本信息 -->
      <div class="student-card">
        <div class="student-header">
          <div class="student-avatar">{{ detail.student.name.charAt(0) }}</div>
          <div class="student-info">
            <div class="student-name">{{ detail.student.name }}</div>
            <div class="student-meta">{{ detail.student.className }} · {{ detail.student.gender }} · {{ detail.student.studentNo }}</div>
          </div>
          <div class="student-status" :class="{ reached: detail.isReached, unreached: !detail.isReached }">
            <span>{{ detail.isReached ? '已达标' : '未达标' }}</span>
          </div>
        </div>
      </div>

      <!-- 周期达标概览 -->
      <div v-if="detail.periodAchievement" class="period-achievement-card">
        <div class="section-title">周期达标概览</div>

        <!-- 每日目标 → 迷你日历 -->
        <div v-if="detail.periodAchievement.cycleType === 'daily' && detail.periodAchievement.calendar" class="pa-calendar">
          <div class="cal-summary">
            达标 <span class="cal-count">{{ detail.periodAchievement.calendar.reachedDays }}</span> / {{ detail.periodAchievement.calendar.totalDays }} 天
          </div>
          <div class="cal-grid">
            <div
              v-for="(d, idx) in detail.periodAchievement.calendar.dates"
              :key="idx"
              class="cal-cell"
              :class="d.status"
            >
              <span class="cal-date">{{ d.date.split('/')[1] }}</span>
              <span class="cal-tag">{{ d.status === 'reached' ? '达标' : '未达标' }}</span>
            </div>
          </div>
        </div>

        <!-- 每月目标 → 月份卡片列表 -->
        <div v-if="detail.periodAchievement.cycleType === 'monthly' && detail.periodAchievement.months" class="pa-months">
          <div
            v-for="(m, idx) in detail.periodAchievement.months"
            :key="idx"
            class="month-card"
            :class="{ reached: m.reached, unreached: !m.reached }"
          >
            <span class="month-name">{{ m.month }}</span>
            <span class="month-summary">{{ m.summary }}</span>
            <van-tag :color="m.reached ? '#36d399' : '#ee0a24'" size="small" text-color="#fff">
              {{ m.reached ? '已达标' : '未达标' }}
            </van-tag>
          </div>
        </div>

        <!-- 学期/自定义 - 多个项目 / 单个项目 → 进度条 -->
        <div v-if="detail.periodAchievement.sportMode === 'all' && detail.periodAchievement.progressAll" class="pa-progress">
          <div class="progress-info">
            <span class="progress-target">目标：{{ detail.periodAchievement.progressAll.goalValue }}</span>
            <span class="progress-current">当前：{{ detail.periodAchievement.progressAll.currentValue }}</span>
          </div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-bg">
              <div
                class="progress-bar-fill"
                :class="{ reached: detail.periodAchievement.progressAll.progress >= 100 }"
                :style="{ width: Math.min(detail.periodAchievement.progressAll.progress, 100) + '%' }"
              />
            </div>
            <span class="progress-num">{{ detail.periodAchievement.progressAll.progress }}%</span>
          </div>
        </div>

        <div v-if="detail.periodAchievement.sportMode === 'single' && detail.periodAchievement.progressSingle" class="pa-progress">
          <div class="progress-info">
            <span class="progress-target">目标：{{ detail.periodAchievement.progressSingle.goalValue }}</span>
            <span class="progress-current">当前：{{ detail.periodAchievement.progressSingle.currentValue }}</span>
          </div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-bg">
              <div
                class="progress-bar-fill"
                :class="{ reached: detail.periodAchievement.progressSingle.progress >= 100 }"
                :style="{ width: Math.min(detail.periodAchievement.progressSingle.progress, 100) + '%' }"
              />
            </div>
            <span class="progress-num">{{ detail.periodAchievement.progressSingle.progress }}%</span>
          </div>
        </div>

        <!-- 学期/自定义 - 阳光跑 → 累计里程 + 周达标 + 月达标 -->
        <div v-if="detail.periodAchievement.sportMode === 'sunrun' && detail.periodAchievement.sunrun" class="pa-sunrun">
          <div class="sunrun-mileage">
            <span class="mileage-label">累计里程</span>
            <span class="mileage-value">{{ detail.periodAchievement.sunrun.totalMileage }} <small>公里</small></span>
          </div>
          <div class="sunrun-section">
            <div class="sunrun-subtitle">每周达标</div>
            <div class="sunrun-tags">
              <span
                v-for="(w, idx) in detail.periodAchievement.sunrun.weeklyStatus"
                :key="idx"
                class="sunrun-tag"
                :class="{ reached: w.reached, unreached: !w.reached }"
              >
                {{ w.week }} {{ w.reached ? '达标' : '未达标' }}
              </span>
            </div>
          </div>
          <div class="sunrun-section">
            <div class="sunrun-subtitle">月度达标</div>
            <div class="sunrun-tags">
              <span
                v-for="(m, idx) in detail.periodAchievement.sunrun.monthlyStatus"
                :key="idx"
                class="sunrun-tag"
                :class="{ reached: m.reached, unreached: !m.reached }"
              >
                {{ m.month }} {{ m.reached ? '达标' : '未达标' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 子条件达标状态（多项运动目标） -->
      <div v-if="detail.subConditions" class="sub-conditions-card">
        <div class="section-title">子条件达标状态</div>
        <div class="sub-list">
          <div
            v-for="(sc, idx) in detail.subConditions.items"
            :key="idx"
            class="sub-item"
            :class="{ reached: sc.reached, unreached: !sc.reached }"
          >
            <div class="sub-header">
              <span class="sub-name">{{ sc.name }}</span>
              <span class="sub-status">{{ sc.reached ? '✅ 已达标' : '❌ 未达标' }}</span>
            </div>
            <div class="sub-value">目标：{{ sc.goal }} / 完成：{{ sc.value }}</div>
            <div class="sub-progress">
              <div class="sub-progress-bar">
                <div
                  class="sub-progress-fill"
                  :class="{ reached: sc.reached, unreached: !sc.reached }"
                  :style="{ width: sc.reached ? '100%' : '50%' }"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="sub-summary" :class="{ reached: detail.subConditions.allReached, unreached: !detail.subConditions.allReached }">
          {{ detail.subConditions.allReached ? '全部子条件都已达标' : '存在未达标的子条件' }}
        </div>
      </div>

      <!-- 该学生的计入记录列表 -->
      <div class="records-section">
        <div class="section-title">计入运动记录</div>
        <div v-if="detail.records.length > 0">
          <div
            v-for="rec in detail.records"
            :key="rec.id"
            class="record-card"
          >
            <div class="record-top">
              <span class="record-project">{{ rec.sportProject }}</span>
              <van-tag
                :color="rec.countStatus === '全部计入' ? '#36d399' : '#ff976a'"
                size="small"
                text-color="#fff"
              >
                {{ rec.countStatus }}
              </van-tag>
            </div>
            <div class="record-mid">
              <span class="record-score">{{ rec.score }}</span>
              <span v-if="rec.sportProject !== '阳光跑'" class="record-status" :class="rec.scoreStatus === '正常' ? 'normal' : 'abnormal'">
                {{ rec.scoreStatus }}
              </span>
            </div>
            <div class="record-meta-row">
              <span class="record-label">运动时间</span>
              <span class="record-meta-value">{{ rec.sportTime }}</span>
            </div>
            <div class="record-meta-row">
              <span class="record-label">运动时长</span>
              <span class="record-meta-value">{{ rec.sportDuration }}</span>
            </div>
            <div class="record-bottom">
              <span class="record-time">计入时间：{{ rec.countTime }}</span>
            </div>
            <div v-if="rec.countStatus === '部分计入'" class="record-counted">
              <span class="counted-label">计入成绩：</span>
              <span class="counted-value">{{ rec.countedScore }}</span>
            </div>
            <div class="record-actions">
              <van-button size="small" plain type="primary" @click="showDetailToast">详情</van-button>
            </div>
          </div>
        </div>
        <van-empty v-else description="该学生暂无已计入的运动记录" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { getNewStudentDetail, cycleTypeConfig } from '@/mock/sportsGoal.js'

const route = useRoute()
const goalId = computed(() => Number(route.params.goalId))
const studentId = computed(() => Number(route.params.studentId))

const detail = computed(() => getNewStudentDetail(goalId.value, studentId.value))
const getCycleLabel = (type) => cycleTypeConfig[type]?.label || ''

function showDetailToast() {
  showToast('跳转运动记录详情页')
}
</script>

<style scoped>
.student-detail-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-top: 46px;
}

.detail-content {
  padding-bottom: 24px;
}

/* 差距摘要 */
.gap-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff7e6;
  border-bottom: 1px solid #ffe0b2;
  font-size: 14px;
  color: #ff976a;
  font-weight: 500;
}

.gap-banner.reached {
  background: #e6f9f2;
  border-bottom-color: #b3ecd5;
  color: #36d399;
}

.gap-text {
  flex: 1;
}

/* 学生卡片 */
.student-card {
  background: #fff;
  margin: 12px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.student-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary-color, #0069EC);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  flex-shrink: 0;
}

.student-info {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.student-meta {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.student-status {
  font-size: 13px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 12px;
  flex-shrink: 0;
}

.student-status.reached {
  color: #36d399;
  background: #e6f9f2;
}

.student-status.unreached {
  color: #ee0a24;
  background: #fff0f0;
}

/* 子条件达标状态 */
.sub-conditions-card {
  background: #fff;
  margin: 12px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.sub-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sub-item {
  padding: 12px;
  border-radius: 8px;
  background: #f9f9fb;
}

.sub-item.reached {
  background: #e6f9f2;
}

.sub-item.unreached {
  background: #fff7e6;
}

.sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.sub-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.sub-status {
  font-size: 12px;
  font-weight: 500;
}

.sub-value {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.sub-progress-bar {
  height: 6px;
  background: #e5e5e5;
  border-radius: 3px;
  overflow: hidden;
}

.sub-progress-fill {
  height: 100%;
  border-radius: 3px;
}

.sub-progress-fill.reached {
  background: #36d399;
}

.sub-progress-fill.unreached {
  background: #ff976a;
}

.sub-summary {
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

.sub-summary.reached {
  background: #e6f9f2;
  color: #36d399;
}

.sub-summary.unreached {
  background: #fff7e6;
  color: #ff976a;
}

/* 周期达标概览 */
.period-achievement-card {
  background: #fff;
  margin: 12px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 迷你日历 */
.cal-summary {
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 500;
}

.cal-count {
  color: var(--primary-color, #0069EC);
  font-weight: 700;
}

.cal-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cal-cell {
  width: calc((100% - 36px) / 7);
  aspect-ratio: 1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  gap: 2px;
}

.cal-cell.reached {
  background: #e6f9f2;
  color: #36d399;
}

.cal-cell.unreached {
  background: #fff0f0;
  color: #ee0a24;
}

.cal-date {
  font-weight: 600;
  font-size: 11px;
}

.cal-tag {
  font-size: 9px;
}

/* 月份卡片 */
.pa-months {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.month-card {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  gap: 10px;
}

.month-card.reached {
  background: #e6f9f2;
}

.month-card.unreached {
  background: #fff7e6;
}

.month-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  width: 40px;
}

.month-summary {
  flex: 1;
  font-size: 12px;
  color: #666;
}

/* 进度条 */
.pa-progress {
  padding: 4px 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;
}

.progress-target {
  color: #666;
}

.progress-current {
  color: var(--primary-color, #0069EC);
  font-weight: 600;
}

.progress-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar-bg {
  flex: 1;
  height: 10px;
  background: #e5e5e5;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 5px;
  background: #ff976a;
  transition: width 0.3s;
}

.progress-bar-fill.reached {
  background: #36d399;
}

.progress-num {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  width: 36px;
  text-align: right;
}

/* 阳光跑 */
.pa-sunrun {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sunrun-mileage {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.mileage-label {
  font-size: 13px;
  color: #666;
}

.mileage-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color, #0069EC);
}

.mileage-value small {
  font-size: 12px;
  font-weight: 400;
  color: #999;
}

.sunrun-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sunrun-subtitle {
  font-size: 12px;
  color: #999;
}

.sunrun-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.sunrun-tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
}

.sunrun-tag.reached {
  background: #e6f9f2;
  color: #36d399;
}

.sunrun-tag.unreached {
  background: #fff0f0;
  color: #ee0a24;
}

/* 记录列表 */
.records-section {
  margin: 12px;
}

.record-card {
  background: #fff;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.record-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.record-project {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.record-mid {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.record-score {
  font-size: 15px;
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

.record-meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
  font-size: 11px;
}

.record-label {
  color: #aaa;
  width: 48px;
  flex-shrink: 0;
}

.record-meta-value {
  color: #666;
}

.record-bottom {
  display: flex;
  justify-content: space-between;
}

.record-time {
  font-size: 11px;
  color: #bbb;
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

.record-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}
</style>
