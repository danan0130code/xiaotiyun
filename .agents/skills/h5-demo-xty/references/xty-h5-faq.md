# 常见问题修复记录

## TabBar 不显示或不切换

**原因**：`MainLayout.vue` 中 `v-model` 绑定的 `activeTab` 与路由不同步。

**修复**：
```js
// 在 MainLayout.vue 中添加 watch 同步
watch(() => route.path, (newPath) => {
  activeTab.value = newPath
})
```

## Vant 样式不生效

**原因**：未在入口文件导入 `vant/lib/index.css`。

**修复**：确保 `main.js` 中有 `import 'vant/lib/index.css'`。

## 页面横向滚动

**原因**：某元素宽度超过屏幕。

**修复**：检查是否有固定宽度超过 100vw 的元素，使用 `overflow-x: hidden` 或调整布局。

## 底部 TabBar 遮挡内容

**原因**：内容区底部未留 padding。

**修复**：在 MainLayout 的 `.content` 设置 `padding-bottom: 50px`，或给页面组件设置 `padding-bottom: 60px`。

## Vite 热更新不生效

**原因**：文件改动未被 Vite 检测到。

**修复**：重启 dev server：`pkill -9 -f vite && npm run dev`

## 路由 404

**原因**：Vue Router 使用 `createWebHistory` 模式，直接访问子路由会 404。

**修复**：确保所有路由都有对应的 Route 配置，开发环境会自动处理。

## 页面在手机上字体过小

**原因**：viewport meta 未正确设置。

**修复**：确保 `index.html` 中有正确的 viewport meta：
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

## Vue 组件未注册

**原因**：使用了 Vant 组件但未按需导入。

**修复**：在 `main.js` 中全局注册 Vant：`app.use(Vant)`，或在组件中单独导入。
