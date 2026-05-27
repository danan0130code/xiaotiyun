# 小猴运动 K12 H5 项目指南

## 技术栈
- React 19 + React Router 7
- Vant 4（移动端 UI 组件库）
- Vite 8
- dayjs

## 端口
开发端口：4002

## TabBar 结构（4 个 Tab）

| Tab | 路由 | 页面 | 状态 |
|-----|------|------|------|
| 首页 | /home | 运动改善方案 | 占位 |
| 运动记录 | /sports-record | AI 运动 + 体能训练记录 | 有列表 |
| 运动目标 | /sports-goal | 个人运动目标进度 | 有卡片列表 |
| 我的 | /profile | 个人中心 | 有入口 |

## 新增页面流程
1. 创建页面文件：`src/pages/[模块]/index.jsx`
2. 注册路由：`src/App.jsx` 添加 Route
3. 如需底部 TabBar，更新 `src/router/index.jsx` 的 `tabBarList`
4. 创建 Mock 数据：`src/mock/` 下创建

## 主题色
橙色 `#FF6B00`，定义在 `src/styles/global.css` 的 `--primary-color`
