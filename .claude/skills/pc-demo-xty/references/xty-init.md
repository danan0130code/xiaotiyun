# 项目初始化指南

## 项目定位

本项目用于通过代码构建校体云 PC 端管理后台 demo，产出代码放在 `./pc-xty` 目录下。前端 demo，使用模拟数据，重点在于界面展示和交互体验。

---

## 技术栈

| 技术 | 用途 | 说明 |
|------|------|------|
| React 18/19 + Hooks | 视图层 | 函数组件 + Hooks，不使用 class 组件 |
| React Router 6/7 | 路由 | 嵌套路由 |
| Ant Design 5/6 | UI 组件库 | 企业后台标配 |
| Vite | 构建工具 | 开发服务器 + 构建 |
| dayjs | 日期处理 | antd 默认日期库 |

---

## 平台矩阵

| 平台 | 目录 | 主题色（顶部导航背景） | 服务器端口 |
|------|------|----------------------|-----------|
| 中小学 K12 | `./pc-xty/xty-k12/` | #DEEFFF | 3001 |
| 高校 | `./pc-xty/xty-gaoxiao/` | #060912 | 3002 |
| 一体机管理 | `./pc-xty/xty-yitiji/` | #060912 | 3003 |

---

## 初始化新项目

如果对应平台目录下还没有项目，按以下步骤初始化：

### 1. 创建项目

```bash
cd ./pc-xty/xty-k12
npm create vite@latest . -- --template react
```

### 2. 安装依赖

```bash
npm install antd @ant-design/icons react-router-dom dayjs
```

### 3. 启动开发服务器

```bash
npm run dev
```

---

## 目录结构

```
xty-k12/
├── src/
│   ├── main.jsx               # 入口文件
│   ├── App.jsx                # 根组件，路由配置
│   ├── router/
│   │   └── index.jsx          # 菜单配置（menuConfig + getTopKeyByPath）
│   ├── layouts/
│   │   └── MainLayout.jsx     # 主布局：顶部菜单 + 左侧菜单 + 内容区
│   ├── components/
│   │   ├── TopHeader/         # 顶部一级菜单组件
│   │   │   └── index.jsx
│   │   ├── SideMenu/          # 左侧二级菜单组件
│   │   │   └── index.jsx
│   │   └── Placeholder.jsx    # 占位页面组件
│   ├── pages/
│   │   ├── Dashboard/         # 驾驶舱
│   │   ├── Basic/             # 基础管理
│   │   │   ├── School/
│   │   │   ├── Student/
│   │   │   └── ...
│   │   ├── Teaching/          # 教学管理
│   │   ├── Physical/          # 体质测试
│   │   ├── SunRun/            # 阳光跑管理
│   │   └── Sports/            # 学生运动数据
│   ├── mock/                  # 模拟数据
│   └── styles/
│       └── global.css         # 平台主题样式
├── index.html
├── vite.config.js
├── package.json
└── CLAUDE.md
```

---

## 布局结构

校体云使用 **顶部一级菜单 + 左侧二级菜单** 布局（不同于供应链的纯左侧菜单）：

```
┌──────────────────────────────────────────────┐
│  Logo  基础管理  教学管理  体质测试 ... 驾驶舱  │ ← TopHeader
├────────┬─────────────────────────────────────┤
│ 学校管理 │                                     │
│ 学生管理 │          内容区                      │
│ ...     │          (Outlet)                    │
├────────┴─────────────────────────────────────┤
```

- TopHeader：顶部一级菜单，固定高度 56px
- SideMenu：左侧二级菜单，根据顶部选中动态切换
- Content：内容区，flex 布局，内部滚动
