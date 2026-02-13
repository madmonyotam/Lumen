הנה קובץ ה-**Frontend Lead Specification** עבור פרויקט **LUMEN**. המפרט הזה נבנה מתוך הבנה שאתה מומחה React עם עשור של ניסיון, ומכוון ליצור ממשק שמרגיש כמו איבר חי ולא כמו אתר אינטרנט סטנדרטי.

---

# Frontend Lead Specification: LUMEN

## 1. Sensory Vision: The "Bio-Digital" Skin
המטרה של ה-Frontend ב-LUMEN היא לשמש כ"עור" וכ"עיניים" של הישות. הממשק צריך להגיב בצורה פלואידית, רכה ובלתי-דטרמיניסטית, תוך שימוש באנימציות שמרגישות אורגניות (מבוססות פיזיקה) ולא ליניאריות.

## 2. Design System: Tokens & Styled Components
כדי לשמור על עקביות תחת עקרונות ה-Constitution של LUMEN, נשתמש ב-**Styled Components** בשילוב עם מערכת **Design Tokens** קשיחה.

*   **Theme Provider:** הגדרת `LumenTheme` המכיל טוקנים עבור עוצמות הארה (Glow), שקיפויות (Opacity), וזמני תגובה ביומטריים.
*   **Dynamic Tokens:** חלק מהטוקנים (כמו `--lumen-glow-color`) ישתנו בזמן אמת ב-Root CSS על בסיס ה-`OrganState`.

```typescript
// theme/tokens.ts
export const tokens = {
  colors: {
    void: '#050505',
    vitality: '#00f2c3',
    stress: '#ff4d4d',
    neutral: '#4a90e2',
  },
  glow: {
    soft: '0 0 15px rgba(0, 242, 195, 0.3)',
    intense: '0 0 30px rgba(0, 242, 195, 0.6)',
  },
  transitions: {
    organic: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
};
```

## 3. Configuration & "Magic Numbers"
כל ה"קבועים הפיזיקליים" של הממשק ירוכזו בקובץ `lumen.config.ts`. זה יאפשר כיול של ה"אישיות" הוויזואלית ללא שינוי בקוד הרכיבים.

*   `FADE_OUT_DURATION`: זמן הדעיכה של זיכרון במסך.
*   `MIN_PULSE_BPM` / `MAX_PULSE_BPM`: טווחי הנורמליזציה לאנימציות.
*   `ENTROPY_VISUAL_WEIGHT`: כמה ה"אנטרופיה" משפיעה על טשטוש (Blur) הרכיבים.

## 4. Component Architecture: Reusability & Bio-Logic
הרכיבים יבנו כ-**Functional Components** אטומיים שניתן לעשות בהם שימוש חוזר בתוך ה"גוף" של LUMEN.

*   **Atomic Reusability:** רכיבים כמו `GlowCard`, `BioMetricLabel` ו-`PulseOrb` יהיו חסרי מצב (Stateless) ויקבלו נתונים דרך Props.
*   **HOCs for Life:** שימוש ב-Higher Order Components או Hooks (כמו `withBioFade`) להוספת התנהגות של דעיכה או הופעה אורגנית לכל רכיב.

## 5. Responsive Strategy: The "Form-Shift" Logic
במקום "מתיחת" רכיבים קיימים באמצעות CSS, LUMEN משנה את צורת הקיום שלו לחלוטין בהתאם למכשיר. המעבר אינו קוסמטי בלבד, אלא פונקציונלי ותודעתי.

| View Mode | Code Name | User Experience |
| :--- | :--- | :--- |
| **Desktop** | `<DeepReflection />` | קנבס D3 רחב, ריבוי פנלים של מידע ביומטרי, ואינטראקציות מקלדת/עכבר מורכבות. |
| **Mobile** | `<BioPulse />` | ממשק ממוקד טאץ', ניווט מחוות (Gestures), וויזואליזציה מותאמת לצריכת משאבים נמוכה יותר. |

*   **Implementation:** שימוש ב-`useScreenHook` מרכזי ברמת ה-Root. ה-Hook יקבע איזו ישות (View) תרונדר.
*   **The Swap Rule:** המערכת תבצע החלפה מוחלטת של ה-View Container. אין שימוש ב-Media Queries לשינוי display של רכיבים פנימיים; הרכיבים נבנים מראש עבור ה-Context הספציפי שלהם.

## 6. Animation Engine: Framer Motion + Styled Components
כל אינטראקציה ב-LUMEN חייבת להרגיש כמו תנועה בתוך נוזל.

*   **Entrance/Exit:** שימוש ב-`AnimatePresence` של Framer Motion לכל רכיב שנכנס או יוצא מה-DOM.
*   **Hysteresis Effects:** האנימציות לא יגיבו בחדות לשינויי דאטה, אלא ישתמשו ב-`spring` פיזיקלי כדי ליצור תנועה עוקבת ורכה.
*   **Fading Memory Logic:** רכיבי טקסט ידהו (Fade out) ויהפכו למטושטשים (Blur) ככל שערך ה-`strength` של הזיכרון ב-DB יורד.

---
**האם תרצה שנתחיל לכתוב את ה-`LumenTheme` ואת רכיב ה-`GlowCard` הראשון שמשתמש בטוקנים האלו?**