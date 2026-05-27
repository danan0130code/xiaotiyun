<template>
  <div class="profile-page">
    <!-- 顶部状态栏 -->
    <div class="top-bar">
      <div class="page-title">我的</div>
      <van-button icon="setting-o" size="small" plain class="setting-btn" />
    </div>

    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-avatar">
        <img src="https://img.yzcdn.cn/vant/avatar.gif" alt="avatar" />
      </div>
      <div class="user-info">
        <div class="user-name">{{ userInfo.name }}</div>
        <div class="user-school">{{ userInfo.school }} {{ userInfo.className }}</div>
      </div>
    </div>

    <!-- 菜单列表 -->
    <div class="menu-section">
      <div class="menu-item" v-for="item in menuItems" :key="item.label" @click="onMenuClick(item)">
        <div class="menu-icon">{{ item.icon }}</div>
        <div class="menu-label">{{ item.label }}</div>
        <div class="menu-right-text" v-if="item.rightText">{{ item.rightText }}</div>
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
  name: '李思思',
  school: '杭州市滨河区第二中学',
  className: '三年级 1 班',
  phone: '183******80',
  cacheSize: '2.3MB',
})

const menuItems = ref([
  { icon: '🔄', label: '切换用户', action: 'switchUser' },
  { icon: '🖼️', label: '我的头像', action: 'avatar' },
  { icon: '📱', label: '联系方式', action: 'showPhone', rightText: '183******80' },
  { icon: '🔑', label: '修改密码', action: 'changePassword' },
  { icon: '🔓', label: '解绑账号', action: 'unbindAccount' },
])

const onMenuClick = (item) => {
  switch (item.action) {
    case 'switchUser':
      showDialog({
        title: '切换用户',
        message: '当前已登录：李思思（三年级 1 班）\n\n确定要切换到其他账号吗？',
        confirmButtonText: '确定切换',
      }).then(() => {
        showToast('已切换到登录页面')
      })
      break
    case 'avatar':
      showToast('查看/修改头像')
      break
    case 'showPhone':
      showDialog({
        title: '联系方式',
        message: `手机号：18312345678\n邮箱：lisi@example.com`,
        confirmButtonText: '复制号码',
      }).then(() => {
        showToast('已复制到剪贴板')
      })
      break
    case 'changePassword':
      showDialog({
        title: '修改密码',
        message: '请联系学校管理员重置密码',
        confirmButtonText: '知道了',
      })
      break
    case 'unbindAccount':
      showDialog({
        title: '解绑账号',
        message: '⚠️ 警告：解绑后将无法访问当前班级的数据\n\n确定要继续吗？',
        confirmButtonText: '确定解绑',
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

/* 顶部状态栏 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.setting-btn {
  min-width: 32px;
  height: 32px;
  background: #f5f5f5;
  border: none;
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
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  background: #ffcdd2;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  height: 52px;
  padding: 0 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
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
  font-size: 18px;
}

.menu-label {
  flex: 1;
  font-size: 15px;
  color: #333;
}

.menu-right-text {
  font-size: 13px;
  color: #999;
  margin-right: 8px;
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
