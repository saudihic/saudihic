# دليل رفع موقع هورايزن إنتيغريشن على GitHub

## المحتويات
- `index.html` — الرئيسية (إنجليزي)
- `ar/index.html` — الرئيسية (عربي)
- `profile/index.html` — البروفايل (إنجليزي)
- `ar/profile/index.html` — البروفايل (عربي)
- `building-systems/index.html` — الحلول الإنشائية المتكاملة
- `admin/index.html` — لوحة الإدارة (كلمة المرور: Aa@6821111)
- `functions/api/content.js` — واجهة الحفظ (Cloudflare KV)
- `assets/` — كل الصور والشعارات

## خطوات الرفع
1. ارفع كل محتويات مجلد `saudihic_site` إلى مستودع GitHub
2. Cloudflare Pages ينشر تلقائياً عند كل push
3. تأكد أن KV Namespace باسم `HIC_CONTENT` مربوط بالمشروع (للوحة الإدارة)

## لوحة الإدارة
- الرابط: `saudihic.com/admin/`
- تعدّل الصور والنصوص في كل الصفحات
- الحفظ يعمل محلياً (localStorage) وعلى السيرفر (KV)
