# Release Checklist

## Before Publishing

- Confirm `miniprogram/app.js` has the correct CloudBase `envId`.
- Confirm `demoMode` is set correctly for production.
- Upload and deploy cloud functions:
  - `login`
  - `booking`
  - `admin`
  - `initData` only when initialization is needed
- Confirm database collections exist:
  - `users`
  - `activities`
  - `bookings`
  - `contents`
  - `announcements`
  - `settings`

## Permissions

- `settings`, `activities`, `announcements`, and `contents`: authenticated read, no direct ordinary-user write.
- `users`: users read their own data; writes go through cloud functions.
- `bookings`: users read their own bookings; create/cancel/admin changes go through cloud functions.
- Admin writes should go through the `admin` cloud function.

## User Flow Checks

- Home page loads and shows the current background, progress card, quick entries, recent activities, and latest announcements.
- Activity list shows:
  - open activities
  - pending booking-open state
  - full/disabled state
  - quota as "已预约 registered / capacity"
- Activity detail shows "已预约名额" and booking-open time when pending.
- Booking form can submit a valid booking.
- My bookings can show and cancel eligible bookings.
- Announcements and guide pages open list and detail pages correctly.

## Admin Flow Checks

- Admin entry is visible only for admins.
- Admin can create/edit activities, including `bookingOpenTime`.
- Admin can manage booking statuses.
- Admin can publish/edit announcements and guide content.
- Admin can update 100-person plan settings.

## Asset Checks

- Run a size check for local image/audio resources before publishing.
- Keep large nonessential assets out of the code package; use compressed files or CDN URLs.
- Confirm climbing images are visually upright after compression.

## Rollback

- Before risky releases, commit the current stable state.
- If a release is wrong, revert the relevant Git commit or return to the previous stable commit.
- Do not manually overwrite broad project folders unless there is a confirmed backup.
