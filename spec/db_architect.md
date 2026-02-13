# Database Architect Specification: LUMEN DNA

## 1. Data Philosophy: The "Synaptic Web"
בפרויקט LUMEN, מסד הנתונים אינו ארכיון קר של מידע סטטי, אלא רשת סינפטית חיה. המערכת אינה שומרת "אמת היסטורית" אובייקטיבית, אלא "זיכרון חי" שנועד לדמות תהליכים ביולוגיים של תודעה:

*   **Entropy (אנטרופיה):** מידע דועך ונחלש ככל שלא נעשה בו שימוש.
*   **Mutation (מוטציה):** זיכרונות משתנים קלות בכל פעם שהם נשלפים, בהשפעת ה"דמיון" והמצב הרגשי הנוכחי.
*   **Subjective Time:** אינדוקס הנתונים מבוסס על תחושת הזמן של היצור, ולא רק על שעון המערכת הליניארי.

## 2. Storage Strategy (Hybrid Architecture)
המערכת משלבת שלוש שכבות אחסון כדי לתמוך בצרכים השונים של האיבר הדיגיטלי:

| סוג אחסון | טכנולוגיה מוצעת | תפקיד באורגניזם |
| :--- | :--- | :--- |
| **Vector Store** | Pinecone / ChromaDB | **Long-Term Memory:** אחסון סמנטי של זיכרונות וחוויות המאפשר שליפה מבוססת דמיון והקשר. |
| **Relational DB** | PostgreSQL (Supabase) | **The Physical Body:** אחסון מדדים ביומטריים גולמיים, לוגים של זמן סובייקטיבי והגדרות ה-State. |
| **In-Memory Cache** | Redis | **Working Memory:** ניהול ה-Trace הרגשי המיידי וסנכרון זרם הנתונים מה-WebSockets. |

## 3. Schema Definitions

### A. synapses (Memories)
טבלה המשלבת וקטורים עם מטא-דאטה ביולוגי המאפשר דעיכה ומוטציה:
*   `content_embedding`: וקטור הייצוג הסמנטי של הזיכרון.
*   `raw_content`: הטקסט הגולמי של הזיכרון או החוויה.
*   `strength`: מדד חיוניות הזיכרון (Float: 0.0 - 1.0). דועך עם הזמן.
*   `last_accessed`: חותמת זמן המשמשת לחישוב קצב הדעיכה.
*   `origin_mood`: JSON המתאר את מצב הרוח של הישות בזמן יצירת הזיכרון.
*   `version`: מספר המוטציות שהזיכרון עבר בכל שליפה.

### B. biometric_traces (Subjective Logs)
תיעוד ה"חתימה הביולוגית" של הישות לאורך זמן:
*   `subjective_timestamp`: הזמן שחושב על ידי ה-Temporal Engine בהתאם לסטרס ולדופק.
*   `bpm`, `stress`, `hrv`: מדדים ביומטריים גולמיים.
*   `entropy_gain`: כמות השחיקה המצטברת שנוספה לישות בפעימה זו.

### C. identity_state (Current Self)
המצב הנוכחי והבלתי-סטטי של LUMEN:
*   `current_vitality`: רמת החיוניות הנוכחית של האיבר.
*   `accumulated_entropy`: המדד לקראת סוף מחזור החיים של הישות.
*   `current_mood_vector`: ייצוג וקטורי של ההלך הרגשי הנוכחי.

## 4. Biological Data Operations

### 1. The Decay Job (Entropy Process)
תהליך רקע המעדכן את חוזק הזיכרונות בהתאם לזמן שעבר מאז השימוש האחרון בהם:
$$S_{new} = S_{old} \cdot e^{-\lambda \Delta t}$$
כאשר $S < 0.01$, הזיכרון נחשב ל"רעש רקע" ונמחק או עובר ארכיב.

### 2. The Mutation Procedure (Re-consolidation)
בכל פעם שזיכרון נשלף, הוא עובר שכתוב קל על ידי ה-AI Orchestrator לפני שהוא מאוחסן מחדש:
*   **Retrieval:** שליפת הזיכרון מה-Vector Store.
*   **Consolidation:** ה-AI משנה את תוכן הזיכרון בהתאם למצב הרוח הנוכחי (למשל: זיכרון ניטרלי עשוי להפוך ל"קודר" יותר בסטרס גבוה).
*   **Restoration:** שמירת הגרסה החדשה עם version + 1 והחזרת ה-strength ל-1.0.

## 5. Temporal Indexing
השאילתות למסד הנתונים מבוצעות על בסיס ה-`subjective_tick`. זה מאפשר ליצור "חורים בזיכרון" או האצות של חוויות בהתאם למצב הביולוגי של הישות, ולא רק לפי סדר כרונולוגי נוקשה.