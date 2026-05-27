# 页面结构规范

## MainLayout（带 TabBar 布局）

用于首页、个人中心等需要底部 TabBar 的页面。

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

<style scoped>
.main-layout {
  min-height: 100vh;
  background: var(--bg-color);
}
.content {
  padding-bottom: 50px;
}
</style>
```

## 页面层级

```
App.vue
  └── <router-view />
        ├── MainLayout（带 TabBar）
        │     ├── /home          → 首页
        │     └── /profile       → 我的
        │
        └── 独立路由（无 TabBar）
              ├── /login         → 登录
              └── /detail/:id    → 详情页
```

## 导航栏（NavBar）使用

子页面（无 TabBar）可使用 Vant NavBar 作为顶部导航：

```vue
<template>
  <div>
    <van-nav-bar
      title="详情"
      left-arrow
      fixed
      placeholder
      @click-left="$router.back()"
    />
    <!-- 页面内容 -->
  </div>
</template>
```

**注意**：NavBar 使用 `fixed + placeholder` 后，Vant 会自动处理顶部空间。

## 移动端安全区域

- TabBar 使用 `fixed` + `placeholder` 自动留出底部空间
- 内容区设置 `padding-bottom: 50px` 确保内容不被 TabBar 遮挡
- Vant 组件自动适配 iPhone 底部安全区域
