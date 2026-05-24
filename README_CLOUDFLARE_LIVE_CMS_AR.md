# HIC Live CMS على Cloudflare Pages

## ماذا تفعل هذه النسخة؟

هذه النسخة تجعل الأدمن يحفظ مباشرة على Cloudflare KV.

يعني:
1. تفتح `yourdomain.com/admin.html`
2. تدخل كلمة المرور
3. تعدل النص أو الصورة
4. تضغط `حفظ مباشر`
5. تحدث الموقع وتشوف التعديل

بدون تحميل ورفع `site-content.json` يدوياً.

---

## المطلوب في Cloudflare

### 1) إنشاء KV Namespace

من Cloudflare Dashboard:

Workers & Pages → KV → Create namespace

الاسم المقترح:
`HIC_CONTENT`

### 2) ربط KV بالمشروع

داخل مشروع Cloudflare Pages:

Settings → Functions → KV namespace bindings

أضف Binding:

Variable name:
`HIC_CONTENT`

KV namespace:
`HIC_CONTENT`

### 3) إضافة كلمة مرور الأدمن

داخل مشروع Cloudflare Pages:

Settings → Environment variables

أضف:

Variable name:
`HIC_ADMIN_PASSWORD`

Value:
`Aa@6821111`

### 4) أعد نشر المشروع

بعد إضافة KV والبيئة، أعد Deploy.

---

## رابط الأدمن

افتح:

`https://yourdomain.com/admin.html`

---

## ملاحظة مهمة

إذا لم تضف KV binding باسم `HIC_CONTENT`، الحفظ المباشر لن يعمل.

إذا لم تضف `HIC_ADMIN_PASSWORD`، سيستخدم النظام كلمة المرور الافتراضية:
`Aa@6821111`
