// إعدادات الاتصال السحابي (Supabase) لنظام HIC المحاسبي
// هذا الملف يجعل أي جهاز يفتح accounting.html يتصل تلقائيًا بنفس قاعدة البيانات السحابية
// بدون الحاجة لإدخال الرابط والمفتاح يدويًا في كل جهاز.
window.KING_SUPABASE_CONFIG = {
  url: "https://pvlfdydtsatujslelpqk.supabase.co",
  anonKey: "sb_publishable_U28ts7oq25pKYwRU5ORecw_gGDRuT6-",
  companyId: "main",
  table: "king_accounting_state"
};
