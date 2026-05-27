# 小猴运动 H5 - Vue 3 项目

## 技术栈

- **Vue 3.5** - 渐进式 JavaScript 框架
- **Vue Router 4** - 官方路由管理器
- **Vant 4** - 轻量、可靠的移动端 Vue 组件库
- **Vite 6** - 下一代前端构建工具
- **dayjs** - 轻量级日期处理库

## 项目结构

```
h5-xty/xty-k12-h5/
├── index.html              # 入口 HTML
├── package.json            # 项目依赖
├── vite.config.js          # Vite 配置
├── src/
│   ├── main.js             # 应用入口
│   ├── App.vue             # 根组件
│   ├── router/
│   │   └── routes.js       # 路由配置
│   ├── layouts/
│   │   └── MainLayout.vue  # 主布局（带 TabBar）
│   ├── pages/
│   │   ├── Home/           # 首页
│   │   ├── Profile/        # 我的
│   │   ├── SportsRecord/   # 运动记录
│   │   └── SportsGoal/     # 运动目标
│   ├── components/         # 公共组件
│   ├── mock/               # Mock 数据
│   └── styles/             # 全局样式
```

## 路由结构

| 路由 | 页面 | 说明 |
|------|------|------|
| `/home` | 首页 | 运动改善方案、欢迎卡片、体测报告入口 |
| `/sports-record` | 运动记录 | AI 运动 + 体能训练记录 |
| `/sports-goal` | 运动目标 | 个人运动目标进度 |
| `/profile` | 我的 | 个人中心、设置 |

## TabBar 配置

4 个底部导航 Tab：
- 首页 (`/home`)
- 运动记录 (`/sports-record`)
- 运动目标 (`/sports-goal`)
- 我的 (`/profile`)

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 4002）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 新增页面流程

1. 在 `src/pages/` 下创建新页面目录和 `.vue` 文件
2. 在 `src/router/routes.js` 中添加路由
3. 如需 TabBar，在 `MainLayout.vue` 中添加 `<van-tabbar-item>`
4. 在 `src/mock/index.js` 中添加 Mock 数据（可选）

## 样式规范

- 主题色：`#0069EC`（定义在 `global.css`）
- 背景色：`#f8f8fb`
- 文字主色：`#333`
- 文字次要：`#999`

## 组件使用示例

```vue
<template>
  <div class="my-page">
    <van-button type="primary" @click="handleClick">按钮</van-button>
    <van-toast>提示消息</van-toast>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'

const handleClick = () => {
  showToast('点击了')
}
</script>
```

## 后续开发建议

1. **API 封装**：创建 `src/utils/request.js` 封装 HTTP 请求
2. **状态管理**：如需要，可引入 Pinia 进行全局状态管理
3. **组件复用**：将通用组件提取到 `src/components/`
4. **类型定义**：可引入 TypeScript 增强代码质量
