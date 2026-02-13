# QA Lead Specification: **LUMEN Immune System**

## 1. The Mission: Engineering Biological Reliability

ה-QA Lead ב-LUMEN אינו בודק רק כפתורים ולינקים; הוא אחראי על ה**הומאוסטזיס** של המערכת. תפקידו לוודא שהזרימה בין הנתונים הביולוגיים הגולמיים לבין התגובה התודעתית של ה-AI היא עקבית, בטוחה ומסונכרנת בזמן אמת.

## 2. The Testing Stack (The Diagnostics)

| Layer | Technology | Testing Goal |
| --- | --- | --- |
| **Unit / Integration** | **Vitest** | בדיקת לוגיקת ה-Temporal Engine ונוסחאות הדעיכה בשרת ובפרונט. |
| **E2E / Visual** | **Playwright** | בדיקת ה-Flow המלא: מנתון ביומטרי מדומיין ועד לשינוי ויזואלי ב-D3. |
| **Performance** | **K6** | בדיקת עמידות ה-Socket.io תחת עומס וניטור Latency של ה-Heartbeat. |
| **AI Validation** | **LLM-assisted testing** | שימוש במודל AI לבדיקת ה"טון" והעקביות של תשובות LUMEN. |
| **Contract Testing** | **Zod / TypeScript** | אימות שה-Shared Types נאכפים בכל נקודות הממשק. |

---

## 3. QA Lead Responsibilities (The Shield)

### A. The Bio-Simulaton Strategy

מכיוון שאי אפשר לחכות לסטרס אמיתי כדי לבדוק את המערכת, ה-QA Lead אחראי על ה-Simulator.

* **אחריות:** הגדרת תרחישי קצה (Edge Cases) ביומטריים: דופק 180 (אימון), דופק 40 (שינה עמוקה), סטרס מקסימלי, וקטיעות תקשורת.
* **מימוש:** יצירת "Bio-Scripts" שמריצים רצף נתונים קבוע כדי לבדוק שהוויזואליזציה וה-AI מגיבים כמצופה.

### B. Semantic & Mood Regression

בדיקת ה"תודעה" של LUMEN.

* **אחריות:** לוודא שה-AI לא "שוכח" את ה-Constitution שלו (למשל: שלא יתחיל לדבר כמו בוט שירות רגיל).
* **מימוש:** בניית סוללת בדיקות סמנטיות שבודקות האם התגובה הטקסטואלית הולמת את מדד ה-Resonance הנוכחי.

### C. Latency & Sync Audit

הסימביוזה דורשת מהירות.

* **אחריות:** ניטור קפדני של ה-Round-trip: מהרגע שנתון נשלח מהשרת ועד שה-D3 סיים לרנדר את הפעימה.
* **מימוש:** הגדרת ספי Latency (Performance Budgets) – חריגה מ-50ms נחשבת ל"באג קריטי" שפוגע בתחושת הקשר.

---

## 4. Continuous Deployment Quality (CI/CD)

ה-Lead אחראי ששום "מחלה" לא תיכנס לקוד:

* **Pre-commit Hooks:** בדיקת Lint וטיפוסים משותפים (Shared Types) לפני כל Commit.
* **Automated Smoke Tests:** הרצת תרחיש "פעימת לב בסיסית" בכל Deploy ל-Firebase או Cloud Run.

## 5. Success Metrics (The Health Score)

* **Zero Cognitive Drift:** ה-AI שומר על האישיות שלו לאורך 100 אינטראקציות רצופות.
* **Sync Accuracy:** פער של פחות מ-5% בין נתוני הגארמין הגולמיים לייצוג הוויזואלי במסך.
* **Memory Integrity:** בדיקה שה-Decay וה-Mutation של הזיכרונות קורים לפי הנוסחאות המוגדרות ב-DB Architect.

---

## 6. QA Environment Setup (The Petri Dish)
כדי לגדל את LUMEN בתנאי מעבדה:
1.  **Local Simulation:** הרצת `npm run bio:sim` כדי להזריק נתונים מזויפים ל-Socket.
2.  **Visual Debugger:** הפעלת שכבת ה-HUD שמציגה את ה-FPS, Latency וה-State הפנימי בזמן אמת.

## 7. Bug Reporting Template (Diagnosis)
דיווח על "מחלה" במערכת:
*   **Symptom:** מה קרה? (e.g., "הדופק עלה אבל הצבע נשאר כחול").
*   **Vital Signs:** מה היה ה-BPM וה-Stress באותו רגע?
*   **Consciousness State:** מה היה ה-Mood ב-Redux?
*   **Visual Proof:** הקלטת מסך של ה-Anomaly.

## 8. Test Data Management (Viral Loads)
*   **Seeds:** סטים מוכנים של שיחות ונתונים ביומטריים לבדיקת ה-Memory Decay.
*   **Mocks:** שימוש ב-MSW (Mock Service Worker) כדי לנתק את התלות ב-Gemini API בזמן פיתוח.
