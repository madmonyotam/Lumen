# Sprint Backlog: Lumen Genesis Wizard - Advanced Logic & Integration

## 1. ניהול נתונים ו-API (Backend Integration)

* **Prompt Options Fetching:** מימוש קריאה לשרת (Firestore/API) למשיכת כל אפשרויות הפרומפטים הזמינות (Base Mechanics, Trait Descriptions, Strength Definitions). הנתונים יאוחסנו ב-Store המרכזי כדי למנוע Hard-coding בתוך הקומפוננטות.
* **Schema Mapping:** וידוא שכל אובייקט שנמשך מהשרת מכיל את ה-`personaName` (המפתח הלוגי)  או ה-`label` (הטקסט להצגה).

## 2. שדרוגי Step 3: Signature Strengths [מבוסס screen-3.jpg]

* **Category Tabs:** מימוש הטאבים העליונים לחלוקת 24 החוזקות לקטגוריות (Wisdom, Courage, Humanity, Justice, Temperance, Transcendence).
* **Logic:** לחיצה על טאב תפלטר את רשימת ה-Available Strengths המוצגות למטה.


* **Visual State:** סימון ויזואלי על חוזקות שכבר שובצו ב-Core Hierarchy (למשל Overlay של "Assigned" כפי שמופיע בעיצוב).

## 3. דינמיקה של סליידרים ו-Tooltips [מבוסס screen-1.png, screen-2.jpg]

* **Live Tooltip:** בכל הזזה (onDrag/onChange) של סליידר (OCEAN או Biology), יופיע Tooltip צף מעל הידית (Thumb).
* **Content:** ה-Tooltip יציג את ה-`personaName` של הערך הנוכחי (למשל: "neuroticism_high" או "attachment_secure").


* **Persistence:** הבטחת עדכון ה-Store רק בסיום הגרירה (onDragEnd) כדי למנוע קריאות מיותרות לתיקוף.

## 4. מנגנון Conflict Engine משופר

* **Conflict Visualization:** כאשר מזוהה התנגשות על ידי פונקציות ה-Validation:
* המערכת תציג את ה-`label` של הקונפליקט למשתמש (למשל: "סתירה בין פתיחות לשמרנות").
* עבור הלוגיקה הפנימית והדיבאג, המערכת תתעד את ה-`personaNames` שגרמו להתנגשות (למשל: `[openness_low, conscientiousness_high]`).


* **Stability Alert:** עדכון ה-System Status ב-Header (מ-25% לערך המשקף את יציבות הסינפסות).

---

## הגדרת Done (DoD) מעודכנת

1. הטאבים ב-Strengths עובדים ומפלטרים את האפשרויות.
2. סליידרים מציגים Tooltip עם ה-`personaName` הנכון בזמן אמת.
3. אפשרויות הפרומפטים נמשכות מהשרת בטעינה ראשונית.
4. קונפליקטים מוצגים עם לייבלים ברורים למשתמש ומיפוי לוגי למפתחים.