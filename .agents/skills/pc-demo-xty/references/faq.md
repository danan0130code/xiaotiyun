# 常见问题修复记录

---

## 顶部/左侧菜单联动不同步

**症状**：点击顶部菜单，左侧菜单未切换，或 URL 变化后菜单状态未更新。

**原因**：`activeTopKey` 状态与 URL 不同步。

**修复**：
```jsx
// MainLayout.jsx 中监听 URL 变化
useEffect(() => {
  const topKey = getTopKeyByPath(location.pathname)
  if (topKey) setActiveTopKey(topKey)
}, [location.pathname])
```

---

## 路由 path 与菜单 key 不一致

**症状**：菜单点击后页面不跳转，或跳转后左侧菜单未高亮。

**原因**：App.jsx 中 Route path 与 router/index.jsx 菜单 key 不匹配。

**修复**：确保两者完全一致，包括前导斜杠：
```jsx
// router/index.jsx
{ key: '/basic/student', label: '学生管理' }

// App.jsx
<Route path="/basic/student" element={<BasicStudent />} />
```

---

## 占位页面导入路径错误

**症状**：`Failed to resolve import "../../components/Placeholder"`

**原因**：页面目录层级不同，相对路径数量不对。
- `pages/Dashboard/` → 一层深，用 `../../components/Placeholder`
- `pages/Basic/Student/` → 两层深，用 `../../../components/Placeholder`

**修复**：检查页面所在目录层级，使用正确的相对路径。

---

## 端口冲突

**症状**：`Port 3001 is in use, trying another one...`

**原因**：多个项目使用相同端口，或其他进程占用。

**修复**：
```bash
lsof -ti:3001 | xargs kill -9 2>/dev/null
```
或修改 vite.config.js 中的 `server.port`。

---

## 驾驶舱无左侧菜单

**症状**：进入驾驶舱后左侧空白。

**原因**：驾驶舱在 menuConfig 中没有 children，只有 path。这是**预期行为**，属于正确设计。
