# 项目初始化指南

## Vite 项目创建

```bash
# 方式一：在已有目录下初始化
mkdir -p ./h5-xty/xty-k12-teacher-h5 && cd ./h5-xty/xty-k12-teacher-h5

# 方式二：复制已有项目模板（推荐，更快）
cp -r xty-k12-h5 xty-k12-teacher-h5
cd xty-k12-teacher-h5
# 修改 vite.config.js 端口、index.html 标题等
```

## 安装依赖

```bash
npm install
npm install vue vue-router vant dayjs
npm install -D @vitejs/plugin-vue vite
```

## Vite 配置

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 4002, // K12学生: 4002, K12教师: 4003, 高校: 4001
    host: true,
  },
})
```

## viewport 配置

**这是移动端适配的基础，必须在 `index.html` 中配置：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>小猴运动</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

## 入口文件

```js
// src/main.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Vant from 'vant'
import 'vant/lib/index.css'
import App from './App.vue'
import routes from './router/routes.js'
import './styles/global.css'

const router = createRouter({ history: createWebHistory(), routes })
const app = createApp(App)
app.use(router)
app.use(Vant)
app.mount('#app')
```

## 全局 CSS

```css
/* src/styles/global.css */
:root {
  /* K12学生H5 主题色（浅蓝） */
  --van-primary-color: #4facfe;
  --van-tabbar-active-color: #4facfe;
  --primary-color: #4facfe;
  --bg-color: #f5f7fa;
  --text-color: #333333;
  --text-secondary: #666666;
  --border-color: #f0f0f0;

  /* K12教师端 主题色（深蓝） */
  /* --van-primary-color: #0069EC; */
  /* --primary-color: #0069EC; */
  /* 教师端头部背景: #0c2242 → #1a3a5c */
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body, #app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  color: var(--text-color);
  background-color: var(--bg-color);
  -webkit-font-smoothing: antialiased;
}
```

## 目录结构

```
xty-k12-h5/src/
├── main.js
├── App.vue
├── router/
│   └── routes.js
├── layouts/
│   └── MainLayout.vue
├── pages/
│   ├── Home/
│   ├── Profile/
│   ├── SportsRecord/
│   └── SportsGoal/
├── mock/
└── styles/
    └── global.css
```
