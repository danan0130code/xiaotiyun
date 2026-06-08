# Change Workflow

## Before Editing

- Check Git status first.
- Read the relevant page files and shared utilities before deciding the implementation.
- Identify whether the change affects:
  - UI only
  - user booking flow
  - admin flow
  - cloud function behavior
  - database fields or permissions
  - static assets

## Scope Control

- If the user asks for a small visual change, edit only the matching WXML/WXSS and leave JS/business logic alone.
- If the user asks for a new feature, add the minimum new state, UI, and logic needed for that feature.
- If old behavior must change, make the changed behavior explicit in the response.
- Do not normalize unrelated names, colors, spacing, routes, or data fields during another task.

## Implementation Preferences

- Reuse existing WeChat mini program patterns and utility functions.
- Put shared booking-state logic in `miniprogram/utils/activity.js`.
- Keep demo data in `miniprogram/utils/demo.js` aligned with production fields when adding user-visible fields.
- Keep admin create/edit pages aligned with user-facing fields.
- Prefer clear Chinese UI text over technical labels.

## Verification

- Run syntax or smoke checks that are available without changing unrelated files.
- For UI changes, inspect the affected page structure and style for text overflow, spacing, disabled states, and background/card readability.
- For booking logic, verify both demo mode and cloud function paths when applicable.
- For resource changes, check actual byte sizes and ensure no asset exceeds the intended threshold.

## Git Practice

- Commit after a complete verified change.
- Use short Chinese commit messages, for example:
  - `初始化长期维护规范`
  - `调整首页活动卡片样式`
  - `修复待开放预约状态`
- Do not commit `node_modules`, local private config, screenshots, caches, or temporary files.
