# 代码风格约定

## 组件命名

- PascalCase，如 `StudentList.jsx`
- 一个页面一个目录，目录下可包含子组件

## 文件组织

```
pages/
└── [模块名]/
    ├── index.jsx         # 页面入口
    └── components/       # 页面私有组件（按需）
```

## 样式方案

- 优先使用 antd 组件自带样式 + 内联 style
- 平台主题色通过 CSS 变量管理：
  - K12: `--primary-color: #1677ff`, `--top-nav-bg: #DEEFFF`
  - 高校/一体机: `--primary-color: #1677ff`, `--top-nav-bg: #060912`
- 避免全局样式污染

## 注释规范

- 只在复杂业务逻辑处添加注释
- 不做冗余注释

## Hooks 使用

| Hook | 用途 |
|------|------|
| `useState` | 组件内部状态 |
| `useEffect` | 副作用（如 URL 同步菜单状态） |
| `useMemo` | 分页/筛选计算 |

## antd 组件使用

- 直接使用，不做二次封装（除非有明确复用需求）
- K12 主题色：`#1677ff`，顶部背景：`#DEEFFF`

## 路由与菜单

- 二级菜单 key 必须与 Route path 完全一致（含前导斜杠）
- `getTopKeyByPath` 是联动核心，修改时需保证正确性
