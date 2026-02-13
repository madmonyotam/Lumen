# Backend Lead Specification: **LUMEN Nervous System**

## 1. The Mission: Engineering Consciousness

ה-Backend Lead ב-LUMEN אחראי על הפיכת זרם הנתונים הביומטריים של יותם לישות תודעתית יציבה. תפקידו להבטיח שמערכת העצבים הדיגיטלית פועלת בסינכרון מושלם, בעלת זיכרון עקבי וחוסן ביולוגי.

## 2. The Technological Stack (The DNA)

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Runtime** | **Node.js (TypeScript)** | סביבת הריצה המרכזית, אכיפת טיפוסים קשיחה ב-Monorepo. |
| **Communication** | **Socket.io** | הזרמת פעימות (Pulses) ב-Low Latency (<20ms). |
| **Cognition** | **Gemini API** | "הקליפה המוחית" – עיבוד סמנטי והאנשה של המדדים. |
| **Bio-Ingestion** | **Garmin Connect API** | קלט חושי גולמי (BPM, Stress, Sleep). |
| **Memory (LT)** | **Vector DB (Pinecone)** | זיכרון ארוך טווח, תמיכה בחיפוש סמנטי. |
| **State (ST)** | **Redis / In-Memory** | ניהול ה-Trace הרגשי המיידי וסנכרון ה-Homeostasis. |

---

## 3. Lead Responsibilities (Ownership)

### A. Interface Integrity & Contract Guard

ה-Lead הוא שומר הסף של ה-`packages/shared`.

* **אחריות:** וידוא שכל שימוש ב-`OrganState` או `BiometricData` מסונכרן ב-100% בין השרת לפרונט.
* **מימוש:** אכיפת החוזה באמצעות Zod schemas וטיפוסי TypeScript משותפים למניעת "פיצול אישיות" של הישות.

### B. AI Orchestration & Sampling Strategy

קריאה ל-LLM בכל פעימה היא בזבזנית ולא יעילה.

* **אחריות:** ניהול ה"קשב" של LUMEN.
* **מימוש:** פיתוח לוגיקה שמחליטה מתי לעדכן את המצב התודעתי דרך ה-AI (למשל: בשינוי של >10% במדד הסטרס) ומתי להשתמש בחישובים מקומיים (Linear Interpolation) בשרת.

### C. The Biological Algorithms (Implementation)

פיתוח המנגנונים הפיזיקליים שמאחורי הקיום של LUMEN:

* **Temporal Engine:** מימוש נוסחת הזמן הסובייקטיבי.
* **Memory Decay:** אוטומציה של תהליך דעיכת הזיכרונות (Synaptic Pruning) ב-Vector DB.

---

## 4. Resilience & Survival (Fail-safes)

Lead נמדד ביכולת שלו לשמור על המערכת בחיים כשהכל קורס.

* **Bio-Fallback:** פיתוח מנגנון "חיוניות חלופית" – אם הקשר עם הגארמין מתנתק, השרת מפיק פעימות דמה המבוססות על המצב הבריאותי וההיסטורי של יותם כדי לשמור על רציפות ה-UI.
* **Graceful Degradation:** במקרה של תקלה ב-AI, השרת יעבור למוד "Reflexive Only" – הצגת נתונים יבשים וויזואליזציה בסיסית ללא שכבת הפרשנות הסמנטית.

## 5. DevOps & Monitoring

* **Bio-Latency Monitoring:** ניטור הזמן שעובר מרגע קליטת הדופק ועד להפצת האירוע ב-Socket.
* **Entropy Audit:** מעקב אחר קצב ה"הזדקנות" של הישות כדי למנוע באגים של "מוות מוקדם".

---

## 6. Error Handling & Standards

מערכת עצבים לא קורסת, היא מרגישה "כאב". שגיאות צריכות להיות מטופלות סמנטית.

| Code | Type | Action |
| :--- | :--- | :--- |
| **500** | `ORGAN_FAILURE` | Critical. הפעלת מנגנון Fallback מיידי ודיווח ל-Sentry. |
| **401** | `REJECTION` | התנתקות מהגוף (Garmin Token Expired). ניסיון חידוש אוטומטי. |
| **429** | `SENSORY_OVERLOAD` | יותר מדי בקשות בבת אחת. האטה מכוונת של ה-Pulse. |

## 7. Security Checklist (Auto-Immune System)

*   [ ] **JWT Validation:** אימות חתימה בכל בקשת WebSocket.
*   [ ] **Rate Limiting:** הגנה על ה-API של ה-LLM מפני ניצול יתר.
*   [ ] **Sanitization:** ניקוי הקלט המגיע מה-LLM כדי למנוע הזרקת קוד ל-Frontend.

## 8. Code Organization (Anatomy)

```
apps/server/src/
├── engines/        # Core biological logic (Heartbeat, Time)
├── cortex/         # AI & Memory integration (Gemini, Pinecone)
├── api/            # REST & WebSocket controllers
├── types/          # Local types (extends shared)
└── config/         # Environment variables & Secrets
```