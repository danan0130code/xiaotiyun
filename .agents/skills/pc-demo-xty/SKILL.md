---
name: pc-demo-xty
description: 校体云后台 Demo 构建专家。使用 React + Ant Design + Vite 技术栈构建校体云K12/高校/一体机 管理后台 demo。当用户提到"校体云后台"、"K12后台"、"高校后台"、"一体机后台"、"智慧体育后台"、"校端后台"、"xty后台"、"校体云"、"中小学平台"等关键词时调用。
---

# 校体云后台 Demo 构建专家

## 项目定位

本 skill 用于通过代码构建校体云 PC 端管理后台 demo，产出代码放在 `./pc-xty` 目录下。前端 demo，使用模拟数据，重点在于界面展示和交互体验。

---

## 平台矩阵

| 平台 | 目录 | 主题色（顶部导航背景） | 按钮主色 |
|------|------|----------------------|---------|
| 中小学 K12 | `./pc-xty/xty-k12/` | #DEEFFF | #1677ff |
| 高校 | `./pc-xty/xty-gaoxiao/` | #060912 | #1677ff |
| 一体机管理 | `./pc-xty/xty-yitiji/` | #060912 | #1677ff |

---

## 技术栈

| 技术 | 用途 |
|------|------|
| React 18/19 + Hooks | 视图层 |
| React Router 6/7 | 路由 |
| Ant Design 5/6 | UI 组件库 |
| Vite | 构建工具 |
| dayjs | 日期处理 |

---

## 目录结构

```
xty-k12/src/
├── main.jsx                   # 入口
├── App.jsx                    # 路由配置
├── router/index.jsx           # 菜单配置（menuConfig + getTopKeyByPath）
├── layouts/MainLayout.jsx     # 顶部+左侧+内容布局
├── components/
│   ├── TopHeader/             # 顶部一级菜单
│   ├── SideMenu/             # 左侧二级菜单
│   └── Placeholder.jsx        # 占位页面组件
├── pages/
│   ├── Dashboard/             # 驾驶舱
│   ├── Basic/                 # 基础管理（9 页）
│   ├── Teaching/              # 教学管理（6 页）
│   ├── Physical/              # 体质测试（3 页）
│   ├── SunRun/                # 阳光跑管理（3 页）
│   ├── Goal/                  # 运动目标（2 页）
│   └── Sports/                # 学生运动数据（4 页）
├── mock/                      # 模拟数据
└── styles/global.css          # 平台主题样式
```

---

## 核心规范索引

| 规范 | 文件 |
|------|------|
| 项目初始化 | [references/xty-init.md](./references/xty-init.md) |
| 菜单配置 | [references/menu-config.md](./references/menu-config.md) |
| Mock 数据 | [references/mock-data.md](./references/mock-data.md) |
| 页面结构（布局/菜单/导航） | [references/page-structure.md](./references/page-structure.md) |
| 页面类型（列表/看板/详情） | [references/page-types.md](./references/page-types.md) |
| 代码风格 | [references/code-style.md](./references/code-style.md) |
| 常见问题修复记录 | [references/faq.md](./references/faq.md) |

---

## 开发工作流

### 新增页面

1. **确认需求**：所属模块、页面名称、核心字段
2. **创建文件**：`pages/[模块]/[页面]/index.jsx`
3. **注册路由**：`App.jsx` 添加 Route，path 与菜单 key 一致
4. **注册菜单**：`router/index.jsx` 的 `menuConfig` 添加二级菜单项
5. **创建 Mock 数据**：`mock/` 下创建模拟数据文件（列表页需要）

### 菜单联动机制

- `menuConfig` 定义顶部一级和左侧二级菜单
- `getTopKeyByPath(pathname)` 根据 URL 推导所属顶部菜单
- 点击顶部菜单 → 切换左侧菜单 + 跳转第一个子页面
- 驾驶舱无子菜单，直接跳转

---

## 验证

```bash
cd ./pc-xty/xty-k12 && npm install && npm run dev
```

检查：
1. 顶部菜单背景色 #DEEFFF
2. 点击顶部菜单，左侧二级菜单联动切换
3. 所有页面路由可正常跳转
4. 默认进入驾驶舱

---

## 注意事项

- Demo 项目，不需要真实后端接口
- 不需要登录认证、权限控制
- 保持代码简洁，避免过度工程化
- 新增页面时必须同步更新菜单和路由
- 二级菜单 key 必须与 Route path 完全一致（含前导斜杠）
