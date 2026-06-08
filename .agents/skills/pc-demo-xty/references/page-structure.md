# 页面结构规范

## 整体布局

校体云后台采用 **顶部一级菜单 + 左侧二级菜单 + 右侧内容区** 的三栏布局：

```
┌──────────────────────────────────────────────┐
│  TopHeader（56px，固定，#DEEFFF 背景）          │
├──────────┬───────────────────────────────────┤
│ SideMenu │ Content                           │
│ (200px)  │ (flex, 滚动)                       │
│          │                                    │
│          │                                    │
│          │                                    │
└──────────┴───────────────────────────────────┘
```

---

## TopHeader 顶部菜单

### 结构

- 固定高度 56px
- 左侧：Logo + 平台名称（点击跳转驾驶舱）
- 右侧：水平排列的一级菜单项

### 交互规则

- 点击一级菜单 → 切换左侧菜单 + 跳转到该模块第一个子页面
- 驾驶舱无子菜单，点击直接跳转 `/dashboard`
- 选中状态高亮（蓝色系）

### 实现要点

- 使用 antd `Menu` 组件，`mode="horizontal"`
- 选中状态通过 `activeKey` prop 由 MainLayout 管理

---

## SideMenu 左侧菜单

### 结构

- 固定宽度 200px
- 顶部：当前一级菜单名称标题栏（48px）
- 主体：二级菜单列表

### 交互规则

- 根据 `topKey` prop 动态显示对应二级菜单
- 点击跳转到对应路由
- 当前路由高亮

### 实现要点

- 使用 antd `Menu` 组件，`mode="inline"`
- 无子菜单的顶部菜单（如驾驶舱）不显示左侧菜单

---

## 内容区

### 布局规范

- 背景色 `#f5f5f5`
- padding 24px
- 内部滚动（`overflow: auto`）

### 滚动实现

- 整体 `height: 100vh; overflow: hidden`
- 列表页 Table 使用 `scroll={{ x, y: 'calc(100vh - 300px)' }}` 固定表头

---

## MainLayout 组合

```jsx
// layouts/MainLayout.jsx
export default function MainLayout() {
  const location = useLocation()
  const [activeTopKey, setActiveTopKey] = useState('dashboard')

  useEffect(() => {
    const topKey = getTopKeyByPath(location.pathname)
    if (topKey) setActiveTopKey(topKey)
  }, [location.pathname])

  return (
    <Layout style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
      <TopHeader activeKey={activeTopKey} onChange={setActiveTopKey} />
      <Layout style={{ flex: 1, overflow: 'hidden' }}>
        <SideMenu topKey={activeTopKey} />
        <Content style={{ flex: 1, padding: 24, background: '#f5f5f5', overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
```

### 关键点

1. `activeTopKey` 状态驱动顶部/左侧联动
2. URL 变化时通过 `getTopKeyByPath` 自动同步
3. TopHeader 的 `onChange` 回调更新状态
