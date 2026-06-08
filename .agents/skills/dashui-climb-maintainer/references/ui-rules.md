# UI Rules

## Overall Style

- Mobile-first WeChat mini program UI.
- Keep the experience practical, warm, and clear for first-time climbing users.
- Use quiet white cards over a light climbing-photo background.
- Avoid marketing-style hero redesigns, heavy gradients, decorative blobs, emoji-heavy UI, or unrelated illustration changes.

## Colors

- Primary green: `#22C55E` for the special hero word "攀岩", section marks, progress fill, and key emphasis.
- Existing primary button green: `#2DBE60`.
- Main text: `#111827` or existing dark text.
- Muted text: `#7F8590`, `#8A8F98`, or existing muted colors.
- Disabled buttons: gray background with muted text.

## Backgrounds

- 首页 uses `/assets/images/plan-climb.jpg` as the page background from the top.
- 预约、指南、我的 also use the same image with stronger masking, so the image is only faintly visible.
- Keep cards readable. If changing a background, adjust only opacity/mask enough to preserve legibility.
- Do not rotate or replace climbing images unless explicitly requested.

## Cards and Spacing

- Main cards should stay white or near-white with subtle shadow.
- Use consistent vertical spacing between major home modules, currently `32rpx`.
- Do not nest visual cards inside other cards unless the current page already does this for a specific repeated item.
- Guide list items should keep white blocks; do not make the whole guide list transparent.

## Section Titles

- 首页 module titles such as "近期活动" and "最新公告" live inside their white cards.
- Title row uses:
  - left green rounded vertical mark: width `8rpx`, height about `30rpx`, radius `999rpx`, color `#22C55E`
  - gap to title: `12rpx`
  - title size `32rpx`, weight `700`, color `#111827`
  - right action text unchanged, such as "查看全部 >" or "查看更多 >"
- Latest announcement title area keeps a divider below it.

## Activity UI Wording

- Home recent activity compact display:
  - title: "攀岩新手教学" or actual activity title
  - time on its own line
  - location on its own line
  - signup text format: `1 / 5 人报名`
- Activity list quota wording:
  - Use "已预约" with `registeredCount / capacity`.
- Activity detail quota wording:
  - Use "已预约名额".
- Booking states:
  - Open and bookable: green active button.
  - Waiting for booking open time: show text such as `待开放（6月8日 12点）`; button is gray and disabled.
  - Full or closed: disabled or detail-only state according to current page behavior.

## Assets

- Local image/audio resources should stay below warning thresholds.
- Current compressed main images are about:
  - `plan-climb.jpg`: about 80K
  - `guide-climb.jpg`: about 75K
- If replacing images, preserve orientation visually and verify file sizes.
