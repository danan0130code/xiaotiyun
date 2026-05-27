# 校体云-中小学平台 Demo

## 项目概述

校体云 K12 校端后台 Demo，基于 React + Ant Design + Vite。顶部一级菜单 + 左侧二级菜单布局，所有数据使用 Mock 模拟。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19 | 视图层 |
| React Router | 7 | 路由管理 |
| Ant Design | 6 | UI 组件库 |
| Vite | 8 | 构建工具 |

## 启动

```bash
cd pc-xty/xty-k12
npm install
npm run dev
```

## 目录结构

```
src/
├── main.jsx              # 入口
├── App.jsx               # 路由配置
├── router/index.jsx      # 菜单配置（menuConfig + getTopKeyByPath）
├── layouts/MainLayout.jsx # 布局：顶部+左侧+内容
├── components/
│   ├── TopHeader/        # 顶部一级菜单（#DEEFFF）
│   ├── SideMenu/         # 左侧二级菜单（动态联动）
│   └── Placeholder.jsx   # 占位页面
├── pages/
│   ├── Dashboard/        # 驾驶舱
│   ├── Basic/            # 基础管理
│   ├── Teaching/         # 教学管理
│   ├── Physical/         # 体质测试
│   ├── SunRun/           # 阳光跑管理
│   ├── Goal/              # 运动目标
│   └── Sports/           # 学生运动数据
├── styles/global.css     # K12 主题样式
└── mock/                 # 模拟数据
```

## UI 风格

- 顶部导航背景：`#DEEFFF`
- 按钮/链接主色：`#1677ff`
- 内容区背景：`#f5f5f5`
- 左侧菜单选中：蓝色系

## 菜单结构

```
校体云-中小学平台
├── 基础管理（9 子菜单）
├── 教学管理（6 子菜单）
├── 体质测试（3 子菜单）
├── 阳光跑管理（3 子菜单）
├── 运动目标（2 子菜单）
├── 学生运动数据（4 子菜单）
└── 驾驶舱
```

## 导航联动机制

1. 顶部菜单点击 → 切换左侧菜单 + 跳转第一个子页面
2. 驾驶舱无子菜单，直接跳转
3. URL 变化时自动同步顶部/左侧菜单选中状态

## 注意事项

- Demo 项目，Mock 数据，无需后端
- 不需要登录认证、权限控制
- 新增页面需同步更新 menuConfig（router/index.jsx）和 App.jsx Route
