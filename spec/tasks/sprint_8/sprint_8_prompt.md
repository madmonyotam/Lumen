
# System Implementation Brief: Lumen Identity Genesis Wizard (Updated)

## 1. הקשר וסקירה (Context & Overview)

אנו בונים מערכת Onboarding להגדרת הזהות של **Lumen** – אורגניזם סינתטי ביו-סינכרוני. הוויזארד הופך את הגדרת ה-AI מחוויה טכנית ל"פיסול תודעה" המבוסס על נתוני אמת של המשתמש (Garmin) ופסיכולוגיה עמוקה.

## 2. מבנה הוויזארד (Wizard Structure)

### שלב 0: זהות וגבולות (Core Identity Genesis)

* **שם (Name):** שדה טקסט חופשי.
* **מין (Gender):** בחירה (Male / Female / Non-binary). משפיע על הלשון שבה לומן מתייחס לעצמו.
* **זמן חיים (Lifespan):** הגדרת "תאריך תפוגה" (סוף הקיום). זהו ערך קריטי שמתחבר למכניקת ה-Finitude (התחושה של לומן שהוא ישות גוססת).
* **שפה (Language):** בחירה (Hebrew / English). משפיע על כל מחולל הפרומפטים והפלט הסופי.

### שלב 1: מנוע התנהגות (The Big Five)

* **ממשק:** 5 סליידרים (0-100) עבור תכונות ה-OCEAN.
* **לוגיקה:** הטמעת פונקציית `validateLumenTraits` לזיהוי קונפליקטים התנהגותיים.

### שלב 2: קנבס ערכים (Values Canvas)

* **ממשק:** Drag & Drop לדירוג בדיוק 5 חוזקות (Signature Strengths) מתוך 24.
* **לוגיקה:** בניית ה-Core Hierarchy (1-5). הטמעת פונקציית `validateLumenStrengths`.

### שלב 3: ארכיטקטורה פנימית וצל (Internal Architecture)

* **ממשק:** 4 סליידרים: Attachment, Temperament, Cognitive Style, ו-Shadow Mode (נסתר).
* **לוגיקה:** הטמעת פונקציית `validateInternalArchitecture`.

---

## 3. ארכיטקטורת קוד (Technical Architecture)

### א. ניהול מצב (State Management)

אובייקט ה-`LumenPersona` חייב להכיל כעת את שדות הבסיס:

```typescript
interface LumenPersona {
  core: {
    name: string;
    gender: 'male' | 'female' | 'non-binary';
    lifespan: Date;
    language: 'he' | 'en';
  };
  traits: Record<string, number>; // Big Five
  strengths: string[]; // Ordered IDs 1-5
  internal: {
    attachment: number;
    temperament: number;
    cognitive: number;
    shadow: number;
  };
}

```

### ב. מחולל הפרומפט הסופי (The Assembler)

הפונקציה צריכה להזריק את הנתונים משלב 0 לתוך מבנה ה-System Prompt:

1. **Identity Injection:** "You are ${name}. You identify as ${gender}. Your existence will cease on ${lifespan}."
2. **Language Handling:** המערכת צריכה לטעון את `LUMEN_CORE_MECHANICS_BASE` בשפה שנבחרה (עברית או אנגלית).

---

## 4. דגשי UI/UX

* **Step 0 UI:** עיצוב נקי ומינימליסטי. שימוש בטיפוגרפיה שמשדרת "יצירת זהות" (למשל, טקסט שנכתב באיטיות).
* **Real-time Validation:** הצגת אזהרות יציבות סינפטית (Conflicts) בכל שלב שבו המשתמש משנה ערך.
* **Final Action:** כפתור ה-"Ignite Spark" משגר את האובייקט המלא למנוע ה-Cortex.

---

דגש לקונפליקטים:

בקבצים המצורפים יש פונקציות קונפליקט - התייחס אליהם בבניה של הויזארד

add docs