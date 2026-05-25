# SAUDIHIC - النسخة النهائية

هذه الحزمة تحتوي على آخر نسخة كاملة من الموقع بعد تفعيل:

- Cloudflare Pages
- Admin Panel
- حفظ مباشر عبر KV
- API: /api/content
- حماية دخول الأدمن
- ربط صفحات الموقع بقراءة المحتوى من /api/content

## إعدادات Cloudflare المطلوبة

Bindings:
- HIC_CONTENT = KV namespace باسم HIC_CONTENT

Variables and Secrets:
- HIC_ADMIN_PASSWORD = Aa@6821111

## روابط التشغيل

الموقع:
https://saudihic.com

الأدمن:
https://saudihic.com/admin.html

## ملاحظات

لا تستخدم Worker القديم.
النشر الصحيح يكون عبر Cloudflare Pages المتصل بـ GitHub.
