# ابدأ هنا - Study Buddy

المشروع جاهز كامل! بس قبل ما تشغله، لازم تنزل البرامج التالية.

## 1. البرامج المطلوبة

### Git
- الرابط: https://git-scm.com/download/win
- خلال التثبيت: اختار "Git from command line and also from 3rd-party software"
- للتحقق: `git --version`

### Python 3.11
- الرابط: https://www.python.org/downloads/
- مهم جداً: علم على "Add Python to PATH" خلال التثبيت
- للتحقق: `python --version`

### Node.js LTS (20.x)
- الرابط: https://nodejs.org
- شغل المثبت بكل القيم الافتراضية
- للتحقق: `node -v` و `npm -v`

### PostgreSQL 16
- الرابط: https://www.postgresql.org/download/windows/
- خلال التثبيت:
  - حط كلمة سر لـ postgres (احفظها!)
  - Port: 5432 (الافتراضي)
  - خلي pgAdmin 4 محدد
- للتحقق: `psql --version`

### VS Code
- الرابط: https://code.visualstudio.com
- إضافات لازم تنزلها بعد التثبيت:
  - Python (Microsoft)
  - ES7+ React/Redux snippets
  - Prettier
  - GitLens (اختياري)

### OpenAI API Key
- الرابط: https://platform.openai.com
- سجل دخول، روح API Keys، اعمل key جديد
- انسخ الـ key (يبلش بـ `sk-`)

## 2. تحقق من كل شي

بعد ما تنزل كل شي، افتح Command Prompt (cmd) وشغل:

```bash
git --version
python --version
pip --version
node -v
npm -v
psql --version
```

## 3. إعداد قاعدة البيانات (PostgreSQL)

افتح "SQL Shell (psql)" من قائمة Start.
اضغط Enter لكل الإعدادات الافتراضية، وحط كلمة سر postgres.

بعدين شغل:

```sql
CREATE USER studybuddy_user WITH PASSWORD 'strong_password';
CREATE DATABASE studybuddy_db OWNER studybuddy_user;
GRANT ALL PRIVILEGES ON DATABASE studybuddy_db TO studybuddy_user;
\q
```

## 4. تعديل ملف backend/.env

افتح `backend/.env` وعدل:
- `DB_PASSWORD=` حط كلمة السر اللي حطيتها فوق (strong_password أو غيرها)
- `OPENAI_API_KEY=` حط الـ API key من OpenAI
- `DJANGO_SECRET_KEY=` ولّد string عشوائي طويل (50+ حرف)

## 5. تشغيل المشروع

### Terminal 1 - Backend:
```bash
cd C:\Users\Administrator\Desktop\study-buddy\backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Terminal 2 - Frontend:
```bash
cd C:\Users\Administrator\Desktop\study-buddy\frontend
npm install
npm run dev
```

## 6. افتح المتصفح

- Frontend: http://localhost:5173
- Backend API: http://127.0.0.1:8000/api/health/
- Admin: http://127.0.0.1:8000/admin

## 7. اختبر

- سجل مستخدم جديد
- سجل دخول
- اعمل ملاحظة
- جرب AI Tools (Summarize, Quiz)
- ابعت Bug Report
