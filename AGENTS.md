# AGENTS.md

本文件为 Codex 工作目录指南。

## 语言约束

本项目默认使用简体中文，新增/更新的 skill、规则、记忆等文件应该使用简体中文（可允许部分必须要英文字母的表述，如 API、URL、ID 等）。

## 项目概述

这是一个产品经理的 Codex 工作空间，用于：
- 需求分析（requirements-analysis）
- 撰写 PRD（prd-writer）
- 构建 PC 端供应链管理后台 Demo（pc-demo）
- 构建校体云 PC 管理后台 Demo（pc-demo-xty）
- 构建校体云 H5 移动端 Demo（h5-demo-xty）

**工作流程**：需求分析 → PRD 撰写 → PC/H5 端 Demo 开发

## 目录结构

```
pm_agent/
├── AGENTS.md              # 本文件
├── prd/                   # PRD 文档目录
├── pc/                    # PC 端供应链管理后台 Demo
│   ├── AGENTS.md          # PC 项目指南
│   └── src/               # 项目源码
├── pc-xty/                # 校体云 PC 管理后台 Demo
│   ├── xty-k12/           # K12 校端后台
│   ├── xty-gaoxiao/       # 高校后台（待创建）
│   └── xty-yitiji/        # 一体机管理（待创建）
├── h5-xty/                # 校体云 H5 移动端 Demo
│   ├── xty-gaoxiao-h5/    # 高校H5学生端
│   └── xty-k12-h5/        # K12学生H5（小猴运动）
└── .Codex/
    └── skills/            # Codex 技能目录
        ├── prd-writer/           # PRD 撰写技能
        ├── requirements-analysis/ # 需求分析技能
        ├── pc-demo/              # PC 端 Demo 构建技能
        ├── pc-demo-xty/          # 校体云 PC 后台 Demo
        └── h5-demo-xty/          # 校体云 H5 移动端 Demo
```

## 技能说明

### requirements-analysis（需求分析）
当用户提到"需求分析"、"分析需求"、"撰写需求分析"、"需求调研"时使用。在 PRD 撰写前进行需求调研、分析和确认。

### prd-writer（PRD 撰写）
当用户提到"写PRD"、"撰写需求"、"产品需求"、"需求背景"、"功能设计"、"撰写产品需求文档"时使用。根据标准模板输出，包含需求背景、目标、流程图、功能清单、系统改造等章节。

### pc-demo（PC 端 Demo）
当用户提到"PC后台"、"供应链后台"、"后台页面"、"新增页面"、"添加菜单"、"PC端开发"、"后台列表"、"后台详情"、"管理后台"、"新建页面"、"开发页面"、"页面模板"等关键词时使用。即使用户只是简单提到要做一个后台页面或管理界面，也应该触发此 skill。

### pc-demo-xty（校体云 PC 后台 Demo）
当用户提到"校体云后台"、"K12后台"、"高校后台"、"一体机后台"、"智慧体育后台"、"校端后台"、"xty后台"、"中小学平台"等关键词时使用。产出代码在 `./pc-xty/` 目录下。

### h5-demo-xty（校体云 H5 移动端 Demo）
当用户提到"校体云H5"、"H5学生端"、"高校H5"、"K12学生H5"、"小猴运动H5"、"校体云移动端"、"H5移动端"、"学生端H5"、"xty H5"、"学生H5页面"等关键词时使用。产出代码在 `./h5-xty/` 目录下。

## 参考文档

做需求分析、写 system-status.md 或了解校体云系统现状时，查阅 memory/ 目录下的相关文件：

| 文件 | 用途 |
|------|------|
| `memory/reference_backend_urls.md` | 三个后台的登录 URL、账号密码、UI 框架 |
| `memory/project_xiaoticloud_products.md` | 13 个终端分属 4 个域，K12 vs 高校差异 |
| `memory/feedback_system_status_format.md` | system-status.md 格式规范（表格表达完整菜单树） |

