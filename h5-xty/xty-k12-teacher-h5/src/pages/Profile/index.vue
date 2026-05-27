<template>
  <div class="profile-page">
    <!-- 头部背景区（深蓝渐变） -->
    <div class="header-bg">
      <div class="header-top">
        <div class="logo">
          <span class="logo-icon">🌈</span>
          <span class="logo-text">小猴运动</span>
        </div>
      </div>

      <div class="profile-center">
        <div class="avatar">
          <img src="/images/mascot.png" alt="avatar" class="avatar-img" />
        </div>
        <div class="profile-info">
          <div class="teacher-name">{{ userInfo.name }}</div>
          <div class="teacher-school">{{ userInfo.school }}</div>
          <div class="teacher-id">教师号：{{ userInfo.teacherId }}</div>
        </div>
      </div>
    </div>

    <!-- 菜单列表 -->
    <div class="menu-section">
      <div class="menu-item" v-for="item in menuItems" :key="item.label" @click="onMenuClick(item)">
        <div class="menu-icon" :style="{ color: item.iconColor }">{{ item.icon }}</div>
        <div class="menu-label">{{ item.label }}</div>
        <van-icon name="arrow" class="menu-arrow" />
      </div>
    </div>

    <div class="footer-text">杭州校体云信息科技有限公司提供技术支持</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast, showDialog } from 'vant'

const userInfo = ref({
  name: '大南老师',
  school: '校体云测试学校',
  teacherId: '148239817421',
})

const menuItems = ref([
  { icon: '👤', label: '个人资料', action: 'profile', iconColor: '#0069EC' },
  { icon: '🧹', label: '清除缓存', action: 'clearCache', iconColor: '#0069EC' },
  { icon: '📱', label: '绑定手机号', action: 'bindPhone', iconColor: '#FF9800' },
  { icon: '🔑', label: '修改密码', action: 'changePassword', iconColor: '#43e97b' },
  { icon: '🚪', label: '注销账号', action: 'deleteAccount', iconColor: '#ff4d4f' },
])

const onMenuClick = (item) => {
  switch (item.action) {
    case 'profile':
      showToast('个人资料')
      break
    case 'clearCache':
      showDialog({ message: '缓存清除成功' }).then(() => {
        showToast('已清除缓存')
      })
      break
    case 'bindPhone':
      showDialog({
        title: '绑定手机号',
        message: '当前未绑定手机号\n\n请输入手机号进行绑定',
        confirmButtonText: '去绑定',
      })
      break
    case 'changePassword':
      showDialog({
        title: '修改密码',
        message: '请联系学校管理员重置密码',
        confirmButtonText: '知道了',
      })
      break
    case 'deleteAccount':
      showDialog({
        title: '注销账号',
        message: '⚠️ 警告：注销后所有数据将被删除且无法恢复\n\n确定要继续吗？',
        confirmButtonText: '确定注销',
        confirmButtonColor: '#ff4d4f',
      })
      break
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 60px;
}

/* 头部背景 */
.header-bg {
  background: linear-gradient(180deg, #1a3a5c 0%, #3d5a7a 100%);
  padding: 16px 16px 0;
  padding-top: 20px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

/* 头像区域 */
.profile-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 32px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  text-align: center;
  color: #fff;
}

.teacher-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.teacher-school {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.teacher-id {
  font-size: 12px;
  opacity: 0.7;
}

/* 菜单列表 */
.menu-section {
  background: #fff;
  border-radius: 12px;
  margin: 12px 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.menu-item:active {
  background: #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.menu-label {
  flex: 1;
  font-size: 15px;
  color: #333;
}

.menu-arrow {
  font-size: 14px;
  color: #ccc;
}

/* 底部文字 */
.footer-text {
  text-align: center;
  padding: 24px 16px 16px;
  font-size: 12px;
  color: #ccc;
}
</style>
