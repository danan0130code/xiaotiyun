<template>
  <div class="home-page">
    <!-- 顶部状态栏区域 -->
    <div class="top-bar">
      <div class="logo">
        <span class="logo-icon">🐵</span>
        <span class="logo-text">小猴运动</span>
      </div>
    </div>

    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-avatar">
        <div class="avatar-placeholder">测</div>
      </div>
      <div class="user-info">
        <div class="user-name">{{ userInfo.name }}</div>
        <div class="user-school">{{ userInfo.school }} {{ userInfo.className }}</div>
      </div>
    </div>

    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-text">
        <div class="welcome-title">嗨～</div>
        <div class="welcome-subtitle">欢迎来到小猴运动</div>
        <div class="welcome-desc">
          查看你的专属改善方案，开始今天的挑战吧！<br>
          每一滴汗水，都会被认真对待<br>
          每一次坚持，都会让你离目标更近一点
        </div>
      </div>
      <div class="welcome-mascot">
        <img src="/images/mascot.png" alt="mascot" class="mascot-img" />
      </div>
    </div>

    <!-- 运动改善方案卡片 -->
    <div class="scheme-card">
      <div class="scheme-header">
        <div class="scheme-title">
          <span class="scheme-icon">📅</span>
          <span>运动改善方案</span>
        </div>
        <div class="scheme-more" @click="viewSchemeDetail">查看详情 ›</div>
      </div>

      <!-- 日期选择器 -->
      <div class="date-picker">
        <div class="date-item" v-for="(date, index) in weekDates" :key="index" :class="{ active: date.isToday, completed: date.isCompleted }">
          <div class="date-weekday">{{ date.weekday }}</div>
          <div class="date-day">{{ date.day }}</div>
          <div class="date-dot" :class="{ active: date.isToday }"></div>
        </div>
      </div>

      <!-- 训练进度 -->
      <div class="training-progress">
        <div class="progress-info">
          <div class="progress-title">我的训练进度</div>
          <div class="progress-stats">
            <div class="progress-actions">7 个动作</div>
            <div class="progress-circle">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle class="progress-bg" cx="20" cy="20" r="16" />
                <circle class="progress-bar" cx="20" cy="20" r="16" :style="circleStyle" />
              </svg>
              <span class="progress-text">{{ progress.completed }}/{{ progress.totalActions }}</span>
            </div>
          </div>
        </div>
        <div class="progress-days">第{{ progress.currentDay }}/34 天</div>
      </div>
    </div>

    <!-- 体测报告卡片 -->
    <div class="report-card" @click="viewReport">
      <div class="report-content">
        <div class="report-title">你的体测报告已生成</div>
        <van-button type="primary" size="small" class="view-report-btn">点击查看 ›</van-button>
      </div>
      <div class="report-mascot">
        <img src="/images/mascot.png" alt="mascot" class="mascot-img-small" />
      </div>
    </div>

    <!-- 我的运动记录 -->
    <div class="record-section" @click="goToSportsRecord">
      <van-button block class="record-btn">我的运动记录</van-button>
    </div>

    <div class="footer-text">杭州校体云信息科技有限公司提供技术支持</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import dayjs from 'dayjs'

const router = useRouter()

const userInfo = ref({
  name: '测试学生',
  school: '杭州市滨河区第二中学',
  className: '三年级 1 班',
})

// 生成一周日期
const weekDates = computed(() => {
  const dates = []
  const today = dayjs()
  const weekDays = ['一', '二', '三', '四', '五', '六', '日']

  // 获取本周一
  const monday = today.day() === 0 ? today.subtract(6, 'day') : today.day(today.day() - 1)

  for (let i = 0; i < 7; i++) {
    const date = monday.add(i, 'day')
    dates.push({
      weekday: weekDays[i],
      day: date.date(),
      isToday: date.isSame(today, 'day'),
      isCompleted: i < 3, // 模拟已完成
    })
  }

  return dates
})

// 训练进度
const progress = ref({
  currentDay: 29,
  total: 34,
  completed: 3,
  totalActions: 7,
})

// 进度环样式
const circleStyle = computed(() => {
  const circumference = 2 * Math.PI * 16
  const offset = circumference - (progress.value.completed / progress.value.totalActions) * circumference
  return {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: offset,
  }
})

const viewSchemeDetail = () => {
  showToast('查看运动改善方案详情')
}

const viewReport = () => {
  showDialog({
    title: '体测报告',
    message: '体测报告功能开发中...',
  })
}

const goToSportsRecord = () => {
  router.push('/sports-record')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 60px;
}

/* 顶部状态栏 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #e8f4fc 0%, #f0f8ff 100%);
}

.logo {
  display: flex;
  align-items: center;
  gap: 6px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 用户信息卡片 */
.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%);
  margin: 12px 16px;
  border-radius: 12px;
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #ffcdd2 0%, #f8bbd9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-placeholder {
  font-size: 24px;
  color: #fff;
  font-weight: 600;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.user-school {
  font-size: 13px;
  color: #666;
}

/* 欢迎区域 */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  margin: 0 16px 12px;
  border-radius: 12px;
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.welcome-subtitle {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.welcome-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.8;
}

.welcome-mascot {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  margin-left: 12px;
}

.mascot-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 运动改善方案卡片 */
.scheme-card {
  background: #fff;
  border-radius: 12px;
  margin: 0 16px 12px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.scheme-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.scheme-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.scheme-icon {
  font-size: 18px;
}

.scheme-more {
  font-size: 13px;
  color: #4caf50;
  cursor: pointer;
}

/* 日期选择器 */
.date-picker {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 12px;
}

.date-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.date-item.completed .date-dot {
  background: #4caf50;
}

.date-weekday {
  font-size: 12px;
  color: #999;
}

.date-day {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.date-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e0e0e0;
}

.date-dot.active {
  background: #4caf50;
}

.date-item.active {
  background: #e8f5e9;
}

.date-item.active .date-day {
  color: #4caf50;
}

/* 训练进度 */
.training-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-info {
  flex: 1;
}

.progress-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.progress-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-actions {
  font-size: 13px;
  color: #666;
}

.progress-circle {
  position: relative;
  width: 40px;
  height: 40px;
}

.progress-bg {
  fill: none;
  stroke: #e0e0e0;
  stroke-width: 3;
}

.progress-bar {
  fill: none;
  stroke: #4caf50;
  stroke-width: 3;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: 600;
  color: #4caf50;
}

.progress-days {
  font-size: 13px;
  color: #666;
}

/* 体测报告卡片 */
.report-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #fff9c4 0%, #c8e6c9 100%);
  border-radius: 12px;
  margin: 0 16px 12px;
  padding: 16px;
  cursor: pointer;
}

.report-content {
  flex: 1;
}

.report-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.view-report-btn {
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 20px;
  font-size: 12px;
  padding: 0 12px;
}

.report-mascot {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  margin-left: 12px;
}

.mascot-img-small {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 我的运动记录 */
.record-section {
  padding: 0 16px 12px;
}

.record-btn {
  height: 44px;
  background: #fff;
  color: #0069ec;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 底部文字 */
.footer-text {
  text-align: center;
  padding: 16px;
  font-size: 12px;
  color: #ccc;
}
</style>
