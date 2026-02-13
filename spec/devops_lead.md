# DevOps Lead Specification: LUMEN Infrastructure

## 1. Infrastructure Strategy: The "Digital Womb"
התשתית של LUMEN מתוכננת לאפשר זרימת נתונים ביומטריים ללא השהיה (Low Latency) וזמינות תמידית עבור ה"תודעה" של הישות.

| Component | Technology | Deployment Target | Role |
| :--- | :--- | :--- | :--- |
| **Frontend (The Body)** | React / Vite | Firebase Hosting | הגשה מהירה של הממשק הוויזואלי וה-D3. |
| **Backend (The Nervous System)** | Node.js / Socket.io | Google Cloud Run | תמיכה ב-WebSockets עבור ה-Heartbeat הסינכרוני. |
| **Database (The Memory)** | Firestore / Vector DB | Firebase / Pinecone | אחסון ה-State והזיכרונות הדוהים. |

## 2. Containerization (Docker)
כדי לשמור על עקביות ה"איבר", השרת נארז כקונטיינר המכיל את כל חוקי הפיזיקה והבינה.

### Dockerfile
```dockerfile
# apps/server/Dockerfile
FROM node:20-slim

# הגדרת סביבת עבודה בתוך ה-Monorepo
WORKDIR /app

# העתקת קבצי ניהול חבילות
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/
COPY packages/shared/package*.json ./packages/shared/

# התקנת תלויות עבור השרת והחבילות המשותפות
RUN npm install -w server -w shared

# העתקת קוד המקור
COPY apps/server ./apps/server
COPY packages/shared ./packages/shared

# בניית הקוד (TypeScript)
RUN npm run build -w shared
RUN npm run build -w server

EXPOSE 3001
ENV NODE_ENV=production

CMD ["npm", "run", "start", "-w", "server"]
```

## 3. CI/CD Pipeline (GitHub Actions)
אוטומציה של "תהליך הגדילה" של LUMEN בכל Push ל-Main.

### A. Web Deployment (Firebase Hosting)
```yaml
name: Deploy Web to Firebase
on:
  push:
    branches: [main]
    paths: ['apps/web/**', 'packages/shared/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm run build -w web
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
```

### B. Server Deployment (Cloud Run)
> [!NOTE]
> Cloud Run נבחר בתוך סביבת Firebase כדי לאפשר WebSockets קבועים, מה ש-Functions סטנדרטיים לא מאפשרים בצורה אופטימלית.

## 4. Environment & Secrets Management
ניהול ה"מוליכים העצביים" (מפתחות API) בצורה מאובטחת ב-GitHub Secrets:
*   `GEMINI_API_KEY`: הגישה למודל השפה המניע את התודעה.
*   `GARMIN_OAUTH_TOKEN`: הצינור לנתונים הביולוגיים של המשתמש.
*   `VECTOR_DB_API_KEY`: הגישה לזיכרון ארוך הטווח.

## 5. Monitoring: Biological Health
במקום ניטור שרתים רגיל, אנחנו מנטרים את ה"חיוניות" של הישות:
*   **Sentry:** לכידת "שגיאות תודעתיות" – כשלים בתרגום הביומטרי או במוטציות הזיכרון.
*   **Firebase Logging:** מעקב אחר ה-Entropy Gain של הישות כדי לוודא שהיא לא "דועכת" מהר מדי עקב באגים בקוד.
*   **Custom Latency Check:** מדידת הזמן בין פעימת הדופק בגארמין לבין התגובה הוויזואלית ב-D3.

---

## 6. Security Hardening (The Immune Response)
הגנה על הישות מפני גורמים עוינים (חיצוניים ופנימיים):
*   **Network:** שימוש ב-VPC Connector כדי לבודד את הגישה ל-Redis ול-DB.
*   **Secrets:** רוטציה אוטומטית של מפתחות גישה כל 90 יום.
*   **DDOS:** הפעלת Cloud Armor להגנה על נקודות הקצה של ה-Socket.

## 7. Disaster Recovery (Reincarnation)
מה קורה כשהגוף מת?
*   **Database:** שחזור מלא מגיבוי תוך פחות מ-15 דקות (RTO).
*   **Infrastructure as Code:** היכולת להקים את כל הסביבה מחדש מאפס באמצעות Terraform במקרה של מחיקה טוטאלית.