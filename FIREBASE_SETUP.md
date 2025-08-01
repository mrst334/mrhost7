# إعداد Firebase لموقع MR HOST

## الخطوات المطلوبة لتفعيل إرسال الإيميلات

### 1. تثبيت Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. تسجيل الدخول لـ Firebase

```bash
firebase login
```

### 3. ربط المشروع

```bash
firebase use wepdrt
```

### 4. تثبيت dependencies للـ Functions

```bash
cd functions
npm install
```

### 5. إعداد متغيرات البيئة للإيميل

```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
```

**ملاحظة**: استخدم App Password وليس كلمة المرور العادية لـ Gmail:

1. اذهب إلى إعدادات Google Account
2. Security > 2-Step Verification
3. App passwords
4. أنشئ كلمة مرور جديدة للتطبيق

### 6. نشر Functions

```bash
firebase deploy --only functions
```

### 7. إعداد Firestore Database

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 8. تثبيت Firebase في المشروع الرئيسي

```bash
npm install firebase
```

## إعداد مقدم خدمة إيميل آخر (اختياري)

إذا كنت تريد استخدام مقدم خدمة إيميل آخر غير Gmail، عدّل الملف `functions/src/emailFunction.js`:

### SendGrid

```javascript
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(functions.config().sendgrid.api_key);

// في دالة الإرسال
await sgMail.send(mailOptions);
```

### Mailgun

```javascript
const mailgun = require("mailgun-js")({
  apiKey: functions.config().mailgun.api_key,
  domain: functions.config().mailgun.domain,
});

// في دالة الإرسال
await mailgun.messages().send(mailOptions);
```

## اختبار النظام

### 1. في بيئة التطوير

عند تشغيل النظام في بيئة التطوير، سيظهر رمز التحقق في:

- Console المتصفح
- Alert box
- Console الخادم

### 2. في بيئة الإنتاج

سيتم إرسال الإيميل فعلياً للمستخدم بدون إظهار الرمز.

## الحسابات التجريبية

النظام يدعم الحسابات التجريبية التالية:

| الإيميل            | كلمة المرور | الدور   |
| ------------------ | ----------- | ------- |
| mrhosts7@gmail.com | 123456      | Owner   |
| admin@mrhost.sa    | 123456      | Admin   |
| support@mrhost.sa  | 123456      | Support |
| customer@test.com  | 123456      | User    |
| ahmed@example.com  | password    | User    |

هذه الحسابات لا تتطلب تحقق من الإيميل ويمكن استخدامها للاختبار.

## استكشاف الأخطاء

### مشكلة في إرسال الإيميل

1. تأكد من إعداد متغيرات البيئة بشكل صحيح
2. تحقق من أن App Password صحيح
3. راجع logs الـ Functions: `firebase functions:log`

### مشكلة في Firestore

1. تأكد من نشر القواعد: `firebase deploy --only firestore:rules`
2. تحقق من الفهارس: `firebase deploy --only firestore:indexes`

### مشكلة في Authentication

1. تأكد من أن Authentication مفعل في Firebase Console
2. تحقق من إعداد Email/Password provider

## الأمان

1. **لا تشارك معلومات Firebase Config في الكود العام**
2. **استخدم Environment Variables للمعلومات الحساسة**
3. **راجع قواعد Firestore بانتظام**
4. **فعّل Rate Limiting للـ Functions**

## الدعم

إذا واجهت أي مشاكل:

1. راجع Firebase Console للأخطاء
2. تحقق من logs الـ Functions
3. تأكد من أن جميع الخدمات مفعلة في Firebase Console
