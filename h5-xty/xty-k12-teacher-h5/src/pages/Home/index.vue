<template>
  <div class="home-page">
    <!-- 头部背景区（浅蓝渐变） -->
    <div class="header-bg">
      <div class="header-top">
        <div class="logo">
          <span class="logo-icon">🐵</span>
          <span class="logo-text">小猴运动</span>
          <span class="logo-tag">教师端</span>
        </div>
        <van-icon name="setting" class="header-icon" />
      </div>

      <div class="greeting">
        <div class="greeting-text">
          <div class="greeting-title">☀️ 早上好</div>
          <div class="teacher-name">{{ userInfo.name }}</div>
          <div class="teacher-school">{{ userInfo.school }}</div>
        </div>
        <div class="header-mascot">
          <img src="/images/mascot.png" alt="mascot" class="mascot-img" />
        </div>
      </div>
    </div>

    <!-- 干预方案 + 体测数据 -->
    <div class="cards-row">
      <div class="card intervention-card" @click="onCardClick('干预方案')">
        <div class="card-header">
          <span class="card-title">干预方案</span>
          <van-tag type="primary" size="mini">新</van-tag>
        </div>
        <div class="card-desc">查看学生运动干预计划</div>
        <div class="card-illustration intervention-illus">
          <span class="illus-icon">📋</span>
        </div>
      </div>

      <div class="card test-card" @click="onCardClick('体测数据')">
        <div class="card-header">
          <span class="card-title">体测数据</span>
        </div>
        <div class="card-desc">学生体质健康测试数据</div>
        <div class="card-illustration test-illus">
          <span class="illus-icon">📊</span>
        </div>
      </div>
    </div>

    <!-- 日常锻炼 -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">日常锻炼</span>
      </div>
      <div class="menu-grid">
        <div class="menu-item" @click="onMenuClick('排行榜')">
          <div class="menu-icon green">
            <span class="menu-emoji">🏆</span>
          </div>
          <div class="menu-label">排行榜</div>
        </div>
        <div class="menu-item" @click="onMenuClick('运动数据')">
          <div class="menu-icon orange">
            <span class="menu-emoji">📈</span>
          </div>
          <div class="menu-label">运动数据</div>
        </div>
        <div class="menu-item" @click="onMenuClick('运动明细')">
          <div class="menu-icon blue">
            <span class="menu-emoji">📝</span>
          </div>
          <div class="menu-label">运动明细</div>
        </div>
        <div class="menu-item" @click="onMenuClick('阳光跑')">
          <div class="menu-icon pink">
            <span class="menu-emoji">🏃</span>
          </div>
          <div class="menu-label">阳光跑</div>
        </div>
        <div class="menu-item" @click="onMenuClick('校园活动')">
          <div class="menu-icon purple">
            <span class="menu-emoji">🎉</span>
          </div>
          <div class="menu-label">校园活动</div>
        </div>
      </div>
    </div>

    <!-- 教学教务 -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">教学教务</span>
      </div>
      <div class="menu-grid two-columns">
        <div class="menu-item" @click="onMenuClick('班级管理')">
          <div class="menu-icon purple">
            <span class="menu-emoji">👥</span>
          </div>
          <div class="menu-label">班级管理</div>
        </div>
        <div class="menu-item" @click="onMenuClick('学生档案')">
          <div class="menu-icon orange">
            <span class="menu-emoji">📁</span>
          </div>
          <div class="menu-label">学生档案</div>
        </div>
        <div class="menu-item" @click="goSportsGoal">
          <div class="menu-icon blue">
            <span class="menu-emoji">🎯</span>
          </div>
          <div class="menu-label">运动目标管理</div>
        </div>
      </div>
    </div>

    <div class="footer-text">杭州校体云信息科技有限公司提供技术支持</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const userInfo = ref({
  name: '李思思老师',
  school: '杭州市滨河区第二中学',
})

const onCardClick = (name) => {
  showToast(name)
}

const onMenuClick = (name) => {
  showToast(name)
}

const goSportsGoal = () => {
  router.push('/sports-goal')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 60px;
}

/* 头部背景 - 浅蓝渐变 */
.header-bg {
  background: linear-gradient(180deg, #4facfe 0%, #a8edea 100%);
  padding: 16px 16px 0;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 6px;
}

.logo-icon {
  font-size: 22px;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.logo-tag {
  font-size: 11px;
  color: #666;
  background: rgba(255, 255, 255, 0.6);
  padding: 2px 6px;
  border-radius: 4px;
}

.header-icon {
  font-size: 22px;
  color: #333;
}

/* 问候区域 */
.greeting {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 20px;
}

.greeting-text {
  flex: 1;
}

.greeting-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  opacity: 0.9;
}

.teacher-name {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.teacher-school {
  font-size: 13px;
  color: #666;
  opacity: 0.9;
}

.header-mascot {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  margin-left: 12px;
}

.mascot-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 卡片行 */
.cards-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px 16px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.card:active {
  opacity: 0.8;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.card-desc {
  font-size: 11px;
  color: #999;
  margin-bottom: 12px;
}

.card-illustration {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 12px;
  bottom: 12px;
}

.illus-icon {
  font-size: 32px;
}

.intervention-illus {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.test-illus {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* 区块 */
.section {
  background: #fff;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

/* 菜单网格 */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px 12px;
}

.menu-grid.two-columns {
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.menu-item:active {
  opacity: 0.7;
}

.menu-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-emoji {
  font-size: 26px;
}

.menu-icon.green {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.menu-icon.orange {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.menu-icon.blue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.menu-icon.pink {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.menu-icon.purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.menu-label {
  font-size: 12px;
  color: #333;
}

/* 底部文字 */
.footer-text {
  text-align: center;
  padding: 24px 0 16px;
  font-size: 12px;
  color: #ccc;
}
</style>
