# Study Buddy - Quick Usage Guide

## شغّل المشروع بضغطة واحدة

### في أي وقت بدك تشغّل الموقع:
1. روح على مجلد `study-buddy`
2. **اعمل دبل كليك على `START.bat`**
3. رح تنفتح نافذتين سودا (Backend + Frontend) والمتصفح بفتح تلقائياً!

### إيقاف المشروع:
**اعمل دبل كليك على `STOP.bat`**

### فتح الموقع فقط (بدون تشغيل):
**اعمل دبل كليك على `Open Study Buddy.url`** - بفتح المتصفح على المشروع.

---

## نقل المشروع لجهاز جديد

### 1. متطلبات الجهاز الجديد:
- ✅ Python 3.11 أو أحدث: https://www.python.org/downloads/
- ✅ Node.js 20 LTS: https://nodejs.org
- ✅ PostgreSQL 16: https://www.postgresql.org/download/windows/
- ✅ Git (اختياري): https://git-scm.com/download/win

### 2. نسخ المشروع:
- انسخ مجلد `study-buddy` كاملاً للجهاز الجديد (Desktop مثلاً)

### 3. إعداد قاعدة البيانات:
افتح **SQL Shell (psql)** وشغّل:
```sql
CREATE USER studybuddy_user WITH PASSWORD 'postgres123';
CREATE DATABASE studybuddy_db OWNER studybuddy_user;
GRANT ALL PRIVILEGES ON DATABASE studybuddy_db TO studybuddy_user;
\q
```

### 4. شغّل ملف الإعداد:
**اعمل دبل كليك على `SETUP.bat`**

هذا الملف رح:
- يعمل Python virtual environment
- يثبّت كل المكتبات (Django, React, إلخ)
- يعمل migrations لقاعدة البيانات
- يثبّت dependencies تبع Frontend

### 5. شغّل المشروع:
**اعمل دبل كليك على `START.bat`**

---

## الروابط

| الصفحة | الرابط |
|---|---|
| الموقع الرئيسي | http://localhost:5173 |
| Notes | http://localhost:5173/notes |
| AI Tools | http://localhost:5173/ai |
| AI Chat | http://localhost:5173/chat |
| Support | http://localhost:5173/support |
| Backend API | http://127.0.0.1:8000/api/health/ |
| Django Admin | http://127.0.0.1:8000/admin |

---

## بياناتك:

- **Username (Admin):** hashem
- **Password:** admin1234
- **User Account:** hashem3 / StudyBuddy2026

---

## ملاحظات مهمة:

1. **ملف `.env`:** لو نقلت المشروع لجهاز جديد، تأكد من ملف `backend/.env` - فيه:
   - كلمة سر قاعدة البيانات (DB_PASSWORD)
   - مفتاح Groq API (OPENAI_API_KEY)

2. **مفتاح Groq:** لو محتاج مفتاح جديد، روح على:
   - https://console.groq.com/keys

3. **إذا الموقع ما اشتغل:**
   - تأكد إنو PostgreSQL شغّال
   - تأكد إنو ملفات النوافذ السوداء (Backend + Frontend) شغّالين بعد START.bat
