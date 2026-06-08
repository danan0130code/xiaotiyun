# 代码风格规范

## 组件命名

- 文件命名：PascalCase，如 `MainLayout.vue`、`SportsRecord.vue`
- 页面文件夹：PascalCase，如 `pages/Home/`、`pages/Profile/`
- 组件名与文件名一致

## Vue 单文件组件结构

使用 `<script setup>` 语法（推荐）：

```vue
<template>
  <div class="my-page">
    <van-button type="primary" @click="handleClick">按钮</van-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'

const handleClick = () => {
  showToast('点击了')
}
</script>

<style scoped>
.my-page {
  padding: 16px;
}
</style>
```

## 样式处理

**优先使用 scoped CSS**，在 `<style scoped>` 中编写样式。不推荐 CSS Module 或 inline style。

使用 CSS 变量管理主题色：

```css
<style scoped>
.my-card {
  background: var(--bg-color);
  color: var(--text-color);
  border-radius: 12px;
  padding: 16px;
}
</style>
```

## CSS 变量管理

```css
/* K12学生H5（小猴运动）- 浅蓝主题 */
:root {
  --van-primary-color: #4facfe;
  --primary-color: #4facfe;
  --secondary-color: #4caf50;
  --bg-color: #f5f7fa;
  --text-color: #333333;
  --text-secondary: #666666;
  --text-placeholder: #999999;
  --border-color: #f0f0f0;
}

/* K12教师端 - 深蓝主题 */
:root {
  --van-primary-color: #0069EC;
  --primary-color: #0069EC;
  --bg-color: #f5f7fa;
  --text-color: #333333;
  --text-secondary: #999999;
  --border-color: #f0f0f0;
  --header-bg-start: #0c2242;
  --header-bg-end: #1a3a5c;
}

/* 高校H5学生端 - 蓝主题 */
:root {
  --van-primary-color: #1890FF;
  --primary-color: #1890FF;
  --bg-color: #F5F5F5;
  --text-color: #333333;
  --text-secondary: #999999;
  --border-color: #EEEEEE;
}
```

## 路由与 TabBar 一致性

- TabBar 项的 `name` 必须与路由 path 完全一致
- 路径以 `/` 开头，使用小写 + 连字符（kebab-case）
- 示例：`/home`、`/profile`、`/sports-record`、`/sports-goal`

## Mock 数据命名

- 工厂函数：`generateXxxList`（如 `generateRunRecord`、`generateTestRecord`）
- 导出常量：`xxxList`（如 `runList`、`testList`）
- 文件路径：`src/mock/xxxRecords.js`

## 导入顺序

```js
import { ref, computed } from 'vue'        // 1. Vue
import { useRouter } from 'vue-router'     // 2. 路由
import { showToast, showDialog } from 'vant' // 3. Vant
import dayjs from 'dayjs'                  // 4. 工具库
import { xxxList } from '@/mock/xxx'       // 5. Mock 数据
```
