# Project Map

## Runtime

- Native WeChat mini program under `miniprogram/`.
- WeChat CloudBase cloud functions under `cloudfunctions/`.
- Demo mode exists in `miniprogram/utils/demo.js`; production mode uses cloud functions.
- Global app config is in `miniprogram/app.js`.
- Page routing and tabBar are in `miniprogram/app.json`.

## User Pages

- 首页: `pages/home/home`
  - Shows hero copy, 100-person plan progress, quick entries, recent activities, latest announcements.
  - Uses `/assets/images/plan-climb.jpg` as full-page background.
- 预约: `pages/activities/activities`
  - Lists visible activities, booking state, booking quota, and action button.
- 活动详情: `pages/activity-detail/activity-detail`
  - Shows time, location, meeting point, booking-open time, quota, rules, and booking CTA.
- 预约表单: `pages/booking-form/booking-form`
  - Collects booking contact and beginner-related fields.
- 我的预约: `pages/my-bookings/my-bookings`
  - Shows user booking status and supports canceling eligible bookings.
- 公告: `pages/announcements/announcements` and `pages/announcement-detail/announcement-detail`
- 指南: `pages/contents/contents` and `pages/content-detail/content-detail`
- 我的: `pages/profile/profile`

## Admin Pages

- Admin entry: `pages/admin/index/index`
- Activities: `pages/admin/activities/activities`, `pages/admin/activity-edit/activity-edit`
- Bookings: `pages/admin/bookings/bookings`, `pages/admin/booking-detail/booking-detail`
- Announcements: `pages/admin/announcements/announcements`, `pages/admin/announcement-edit/announcement-edit`
- Guide content: `pages/admin/contents/contents`, `pages/admin/content-edit/content-edit`
- Settings: `pages/admin/settings/settings`

## Cloud Functions

- `login`: gets openid, admin status, and global settings.
- `booking`: user booking operations such as create, cancel, and my bookings.
- `admin`: admin CRUD and booking status operations.
- `initData`: initializes example data.

## Data Collections

- `users`
- `activities`
- `bookings`
- `contents`
- `announcements`
- `settings`

Important activity fields include `status`, `isVisible`, `bookingOpenTime`, `startTime`, `location`, `meetingPoint`, `capacity`, and `registeredCount`.

Booking state is centralized in `miniprogram/utils/activity.js`. Reuse it instead of duplicating status rules.
