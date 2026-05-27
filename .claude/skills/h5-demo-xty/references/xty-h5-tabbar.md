# TabBar 配置规范

## K12学生H5（小猴运动）TabBar

底部 TabBar 共 2 个 tab：首页、我的。

```vue
<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="main-layout">
    <div class="content">
      <router-view />
    </div>
    <van-tabbar v-model="activeTab" fixed placeholder @change="onTabChange">
      <van-tabbar-item icon="home-o" name="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="contact" name="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeTab = ref(route.path)

watch(() => route.path, (newPath) => {
  activeTab.value = newPath
})

const onTabChange = (path) => {
  router.push(path)
}
</script>
```

## K12教师端 TabBar

底部 TabBar 共 2 个 tab（与学生端一致）：首页、我的。

```vue
<van-tabbar v-model="activeTab" fixed placeholder @change="onTabChange">
  <van-tabbar-item icon="home-o" name="/home">首页</van-tabbar-item>
  <van-tabbar-item icon="contact" name="/profile">我的</van-tabbar-item>
</van-tabbar>
```

教师端主题色为深蓝 `#0069EC`，全局 CSS 中设置 `--van-tabbar-active-color: #0069EC`。

## 高校H5 TabBar 设计

底部 TabBar 共 4 个 tab（可根据业务调整）：首页、校园跑、申诉、我的。

```vue
<van-tabbar v-model="activeTab" fixed placeholder @change="onTabChange">
  <van-tabbar-item icon="home-o" name="/home">首页</van-tabbar-item>
  <van-tabbar-item icon="records-o" name="/run">校园跑</van-tabbar-item>
  <van-tabbar-item icon="bell-o" name="/appeal">申诉</van-tabbar-item>
  <van-tabbar-item icon="contact" name="/profile">我的</van-tabbar-item>
</van-tabbar>
```

## TabBar 与路由关系

```
带 TabBar 页面（用 MainLayout 包裹为子路由）:
  /home          → 首页
  /profile       → 我的
  /sports-record → 运动记录（K12学生端）
  /sports-goal   → 运动目标（K12学生端）
  /run           → 校园跑（高校）
  /appeal        → 申诉（高校）

不带 TabBar 页面（独立路由）:
  /login         → 登录页
  /detail/:id    → 详情页
```

## 路由配置模式

```js
// src/router/routes.js
const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/Home/index.vue') },
    ],
  },
  {
    path: '/profile',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/Profile/index.vue') },
    ],
  },
]

export default routes
```

**注意**：TabBar 的路由用 MainLayout 作为父组件，页面作为子路由通过 `<router-view />` 渲染。每个 TabBar 路由独立一个 Route 配置。
