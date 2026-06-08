---
name: dashui-climb-maintainer
description: Use when working on the Dashui Climb / 大水 climb WeChat mini program, including UI changes, feature additions, booking logic, admin workflows, release checks, resource compression, rollback planning, or maintenance of the 杭州攀岩新人体验预约 project.
---

# Dashui Climb Maintainer

## Core Rule

This skill protects the existing mini program while allowing focused iteration. Before editing, read the relevant current files and keep changes scoped to the user's requested outcome. Do not redesign, refactor, rename, or move existing UI/logic unless the user explicitly asks for that.

## Project Snapshot

This is a native WeChat mini program for "杭州攀岩新人体验预约" with CloudBase cloud functions.

- User tabs: 首页, 预约, 指南, 我的.
- Key user flows: view activities, wait for booking-open time, submit booking, view/cancel bookings, read announcements and beginner guide content.
- Admin flows: manage activities, bookings, announcements, guide content, settings, and 100-person plan progress.
- Main color: green `#22C55E` / `#2DBE60`.
- Main visual asset: `/assets/images/plan-climb.jpg`.

Read these references only when relevant:

- Project structure and data model: `references/project-map.md`
- UI rules and visual constraints: `references/ui-rules.md`
- Change workflow and scope control: `references/change-workflow.md`
- Release and rollback checks: `references/release-checklist.md`

## Required Workflow

1. Inspect the current implementation before changing anything.
2. Identify the exact pages, cloud functions, and data fields affected.
3. Preserve existing behavior outside the requested scope.
4. Keep UI changes consistent with the current quiet, card-based mobile style.
5. Verify the change with the narrowest useful checks.
6. After a successful change, create a Git commit with a short Chinese message.

## Guardrails

- If the user asks for a new feature, add only what is needed for that feature.
- If a request might affect old UI or old business logic, state the affected areas before editing.
- Do not change homepage, tabBar, background images, booking states, or admin flows as a side effect.
- Do not replace existing data wording unless requested. Current booking quota wording is "已预约" / "已预约名额".
- Do not add large local assets. Keep image/audio resources under the mini program size warning threshold; prefer compression or CDN for large files.
- Do not commit `node_modules`, local private configs, temporary screenshots, or cache directories.

## Rollback Rule

This project should stay under Git version control. If a change is wrong, prefer reverting the relevant commit or restoring from the last stable commit. Do not manually delete broad sets of files unless the user explicitly asks.
