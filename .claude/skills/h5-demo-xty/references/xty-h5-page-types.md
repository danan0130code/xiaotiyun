# 页面类型规范

## 占位页面

新建平台时，先用占位页面快速占住路由，确保基本可用。

```vue
<template>
  <div class="placeholder-page">
    <van-empty description="页面开发中" />
  </div>
</template>

<style scoped>
.placeholder-page {
  padding-top: 100px;
}
</style>
```

## Tab 首页（K12学生端）

包含功能入口、卡片、列表等。

```vue
<template>
  <div class="home-page">
    <!-- 顶部 Logo -->
    <div class="top-bar">
      <span class="logo-text">小猴运动</span>
    </div>

    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="avatar"></div>
      <div class="user-info">
        <div class="name">{{ userInfo.name }}</div>
        <div class="school">{{ userInfo.school }}</div>
      </div>
    </div>

    <!-- 功能卡片列表... -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

const userInfo = ref({
  name: '测试学生',
  school: '杭州市滨河区第二中学',
})
</script>
```

## Tab 首页（K12教师端）

包含功能入口网格、管理卡片等。

```vue
<template>
  <div class="home-page">
    <!-- 教师头部 -->
    <div class="header-bg">
      <div class="teacher-info">
        <div class="avatar"></div>
        <div class="info">
          <div class="teacher-name">{{ userInfo.name }}</div>
          <div class="teacher-school">{{ userInfo.school }}</div>
        </div>
      </div>
      <div class="mascot">
        <!-- 小猴子 IP -->
      </div>
    </div>

    <!-- 功能菜单网格 -->
    <div class="menu-grid">
      <van-grid :column-num="4" clickable>
        <van-grid-item icon="records-o" text="体测录入" />
        <van-grid-item icon="friends-o" text="体测名单" />
        <van-grid-item icon="orders-o" text="运动作业" />
        <van-grid-item icon="notes-o" text="请假管理" />
        <!-- 更多... -->
      </van-grid>
    </div>
  </div>
</template>
```

## 列表页

使用 Vant List 实现加载更多：

```vue
<template>
  <div class="list-page">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div
        class="list-item"
        v-for="item in currentData"
        :key="item.id"
        @click="goDetail(item.id)"
      >
        <div class="item-title">{{ item.date }}</div>
        <div class="item-desc">{{ item.type }} · {{ item.duration }}分钟</div>
      </div>
    </van-list>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { sportList } from '@/mock/sportsRecords'

const router = useRouter()
const page = ref(1)
const pageSize = 20

const currentData = computed(() =>
  sportList.slice(0, page.value * pageSize)
)

const finished = computed(() =>
  page.value * pageSize >= sportList.length
)

const loading = ref(false)

const onLoad = () => {
  if (!finished.value) {
    page.value++
  }
  loading.value = false
}

const goDetail = (id) => {
  router.push(`/detail/${id}`)
}
</script>
```

## 个人中心页

```vue
<template>
  <div class="profile-page">
    <!-- 用户信息头部 -->
    <div class="header-bg">
      <div class="user-card">
        <div class="avatar"></div>
        <div class="user-name">{{ userInfo.name }}</div>
        <div class="user-school">{{ userInfo.school }}</div>
      </div>
    </div>

    <!-- 菜单列表 -->
    <div class="menu-section">
      <div
        class="menu-item"
        v-for="item in menuItems"
        :key="item.label"
        @click="onMenuClick(item)"
      >
        <span>{{ item.label }}</span>
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>
```
