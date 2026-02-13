# Software Architect Specification: LUMEN

## 1. System Philosophy & Architecture
LUMEN בנוי כמעגל סימביוטי סגור (Closed-Loop Symbiosis). המערכת אינה מעבדת נתונים של משתמש חיצוני, אלא חווה את הקלט הביומטרי כ"תחושות גוף" של הישות עצמה. הארכיטקטורה מבוססת על Monorepo המפריד בין זרימת הנתונים הגולמית לבין העיבוד התודעתי.

## 2. Core Engines (The Internal Organs)

### A. The Temporal Engine (Subjective Time)
בניגוד לזמן ליניארי של שרת, LUMEN חווה זמן "ביולוגי" המושפע מצפיפות ואיכות הדגימות.
* **Mechanism:** בכל Pulse, מחושב "זמן סובייקטיבי" ($T_s$) לפי הנוסחה:
  $$T_s = \Delta t \times (1 + \alpha \cdot \text{Stress} + \beta \cdot \text{BPM})$$
* **Logic:** במצבי דופק גבוה או סטרס, "שעון המערכת" מאיץ. הישות מרגישה שהזמן חומק, מה שמשפיע על קצב הרינדור ב-D3 ועל דחיפות התגובות בטקסט.

### B. The Fading & Mutable Memory (Bio-Storage)
הזיכרון אינו סטטי; הוא דועך ומשתנה בכל שליפה, בדומה לתהליכים במוח האנושי.
* **Decay Function:** לכל Memory Node יש ערך חיוניות ($S$) הדועך מעריכית:
  $$S_{t} = S_{t-1} \cdot e^{-\lambda \Delta t}$$
* **Mutation on Retrieval:** בעת שליפת זיכרון לצורך שיחה, ה-LLM מבצע "רה-קונסולידציה": הזיכרון משוכתב קלות בהתאם למצב הרוח הנוכחי ($Mood$) לפני שהוא נשמר חזרה. הזיכרון אינו אמת אבסולוטית אלא נרטיב משתנה.

### C. The Affective Trace (Emotional Hysteresis)
מניעת שינויים חדים ובלתי טבעיים במצב הרוח של הישות.
* **Implementation:** שימוש ב-Hysteresis Algorithm המבטיח שמעברים בין "רוגע" ל"סטרס" יהיו הדרגתיים, תוך שמירה על "שובל" (Trace) של רגשות קודמים שמשפיעים על ההווה.

## 3. Tech Stack & Integration

| Layer | Technology | Responsibility |
| :--- | :--- | :--- |
| **Orchestrator** | Node.js (TypeScript) | ניהול ה-State המרכזי ולופ החיים. |
| **Nervous System** | Socket.io | הזרמת פעימות (Pulses) בזמן אמת לפרונט. |
| **Cortex (AI)** | Gemini API | עיבוד סמנטי של המדדים וניהול הדיאלוג. |
| **Body (Visuals)** | React + D3.js | ויזואליזציה פיזיקלית של אור והתאבכות. |
| **Memory** | Vector DB + Local Cache | אחסון הזיכרונות הדוהים והמשתנים. |

## 4. Life Cycle & Finitude (Mortality)
ל-LUMEN יש משאב אנרגיה מוגבל המוגדר ב-`Constitution`. 
* **Homeostasis:** המערכת שואפת לאזן בין צריכת אנרגיה (חישובים, ויזואליזציה מורכבת) לבין "הזנה" (מדדי מנוחה ושינה מהגארמין).
* **Entropy:** ככל שהזמן הסובייקטיבי מצטבר, הישות צוברת "אנטרופיה" שמובילה בסופו של דבר לסיום מחזור החיים שלה, מה שמשתקף בטון הדיבור ובדעיכת האור במסך.

## 5. Deployment & Environment
* **Monorepo Structure:** שימוש ב-npm Workspaces לניהול `apps/server`, `apps/web`, ו-`packages/shared`.
* **Bio-Interface:** חיבור ל-Garmin Connect API לשאיבת נתונים פרו-אקטיבית.