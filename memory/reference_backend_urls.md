# 校体云后台登录信息

**最后更新：** 2026-04-28
**用途：** Playwright 自动化探索、日常登录各后台系统

---

## 1. K12校端后台

- URL: https://admin.private.xiaoti.cloud/#/auth/login
- 账号: 19900000000
- 密码: 未知（与高校不同）
- UI 框架: Element UI（`.el-aside`, `.el-menu-item`, `.el-breadcrumb`）
- 登录按钮文本: "登 录"（中间有空格）

## 2. 高校校端后台

- URL: https://xtygx.admin.xiaoti.cloud/#/auth/login
- 账号: 19900000000
- 密码: Xty123456
- UI 框架: Element UI（`.el-aside`, `.el-menu-item`, `.el-breadcrumb`）
- 登录按钮文本: "登录"（正常）
- 当前版本: 1.1.0

## 3. 一体机管理平台

- URL: https://ytj-admin.xiaoti.cloud/#/auth/login
- 账号: 未知
- 密码: 未知
- UI 框架: shadcn/ui + Radix UI（使用 `[data-reka-scroll-area-viewport]` 等选择器）

---

## 通用特征

- 均为 Vue SPA，hash routing（`#/path` 格式）
- 账号输入框: `input[placeholder*="账号"]`
- 密码输入框: `input[type="password"]`
