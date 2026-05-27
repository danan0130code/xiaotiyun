---
name: h5-demo-xty
description: 校体云 H5 移动端页面构建专家。使用 Vue 3 + Vant 4 + Vite 技术栈构建校体云高校H5学生端、K12学生H5端和K12教师端 demo。当用户提到"校体云H5"、"H5学生端"、"高校H5"、"K12学生H5"、"小猴运动H5"、"校体云移动端"、"H5移动端"、"学生端H5"、"xty H5"、"学生H5页面"、"教师端H5"等关键词时调用。
---

# 校体云 H5 移动端 Demo 构建专家

## 项目定位

本 skill 用于通过代码构建校体云 H5 移动端 demo，产出代码放在 `./h5-xty` 目录下。前端 demo，使用模拟数据，重点在于移动端界面展示和交互体验。

---

## 平台矩阵

| 平台 | 目录 | 主题色 | 端口 |
|------|------|--------|------|
| 高校H5学生端 | `./h5-xty/xty-gaoxiao-h5/` | #1890FF | 4001 |
| K12学生 H5（小猴运动） | `./h5-xty/xty-k12-h5/` | #4facfe | 4002 |
| K12教师端 | `./h5-xty/xty-k12-teacher-h5/` | #0069EC | 4003 |

---

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3.5 + Composition API | 视图层（`<script setup>` 语法） |
| Vue Router 4 | 路由 |
| Vant 4 | 移动端 UI 组件库（有赞出品） |
| Vite 6 | 构建工具 |
| dayjs | 日期处理 |

---

## 目录结构

```
xty-k12-h5/src/
├── main.js                          # 入口（Vant 样式导入 + Vue 挂载）
├── App.vue                          # 根组件
├── router/routes.js                 # 路由配置
├── layouts/MainLayout.vue           # TabBar 布局（底部 tab 导航）
├── pages/
│   ├── Home/                        # 首页
│   ├── Profile/                     # 个人中心
│   ├── SportsRecord/                # 运动记录
│   └── SportsGoal/                  # 运动目标
├── mock/                            # 模拟数据
└── styles/global.css                # 平台主题样式 + 移动端适配
```

---

## 核心规范索引

| 规范 | 文件 |
|------|------|
| 项目初始化 | [references/xty-h5-init.md](./references/xty-h5-init.md) |
| TabBar 配置 | [references/xty-h5-tabbar.md](./references/xty-h5-tabbar.md) |
| Mock 数据 | [references/xty-h5-mock-data.md](./references/xty-h5-mock-data.md) |
| 页面结构（布局/导航/TabBar） | [references/xty-h5-page-structure.md](./references/xty-h5-page-structure.md) |
| 页面类型（列表/详情/表单/Tab页） | [references/xty-h5-page-types.md](./references/xty-h5-page-types.md) |
| 代码风格 | [references/xty-h5-code-style.md](./references/xty-h5-code-style.md) |
| 常见问题修复记录 | [references/xty-h5-faq.md](./references/xty-h5-faq.md) |

---

## 开发工作流

### 新建平台项目

1. 在 `./h5-xty/` 下创建新目录
2. 复制已有项目的 `package.json`、`vite.config.js`（修改端口）和 `index.html`
3. 安装依赖：`npm install`
4. 创建 `src/` 目录结构
5. 配置入口 `main.js`（Vant 样式导入 + Vue Router）
6. 创建 `MainLayout.vue`、路由配置、页面组件

### 新增页面

1. **确认需求**：所属模块、页面名称、核心字段
2. **创建文件**：`pages/[模块]/index.vue`
3. **注册路由**：`router/routes.js` 添加路由
4. **注册 TabBar**（如需）：`MainLayout.vue` 添加 `<van-tabbar-item>`
5. **创建 Mock 数据**：`mock/` 下创建模拟数据文件

### TabBar 导航机制

- `MainLayout.vue` 中使用 `<van-tabbar>` 定义底部 tab 项
- 带 TabBar 的页面用 `MainLayout` 包裹（子路由通过 `<router-view />` 渲染）
- TabBar 使用 `v-model` 绑定当前激活 tab，`@change` 事件通过 `router.push` 切换路由

---

## 验证

```bash
cd ./h5-xty/xty-k12-h5 && npm run dev    # → http://localhost:4002
cd ./h5-xty/xty-k12-teacher-h5 && npm run dev  # → http://localhost:4003
```

在浏览器中以手机模式（DevTools → 切换设备模拟 → 选择 iPhone 12/14 Pro 等）访问：
1. TabBar 正常显示且可点击切换
2. 页面在不同手机尺寸下布局正常（无横向滚动）
3. 所有页面路由可正常跳转
4. Vant 组件渲染正常（Tabbar、Button、Dialog、Toast 等）

---

## 注意事项

- Demo 项目，不需要真实后端接口
- 不需要真实登录认证（但可模拟登录流程页面）
- 保持代码简洁，避免过度工程化
- **所有页面必须在移动端视口下正常显示**（`meta viewport` 设置）
- 新增页面时必须同步更新路由
- 优先使用 Vant 组件（Tabbar、NavBar、Cell、List、Dialog、Toast 等）
- 使用 Vue SFC `<script setup>` 语法
- 样式使用 `<style scoped>` 避免污染
