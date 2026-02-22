import type { Language } from '@lumen/shared/types';

export type TranslationKey =
    | 'app_title'
    | 'status_alive'
    | 'status_dead'
    | 'start_journey'
    | 'rebirth'
    | 'stress_level'
    | 'vitality'
    | 'bpm'
    | 'connect_garmin'
    | 'disconnect'
    | 'send_message'
    | 'input_placeholder'
    | 'slogan_emergence'
    | 'menu_language'
    | 'menu_logout'
    // Genesis
    | 'genesis_title'
    | 'genesis_subtitle'
    | 'name_label'
    | 'name_placeholder'
    | 'gender_label'
    | 'gender_non_binary'
    | 'gender_male'
    | 'gender_female'
    | 'language_label'
    | 'language_english'
    | 'language_hebrew'
    | 'lifespan_label'
    | 'lifespan_short'
    | 'lifespan_medium'
    | 'lifespan_long'
    | 'lifespan_expectancy'
    | 'psych_arch'
    | 'bio_wiring'
    | 'back'
    | 'next_phase'
    | 'ignite_spark'
    | 'loading_genesis'
    | 'error_prefix'
    // Organism
    | 'establishing_link'
    | 'terminate'
    | 'terminate_modal_title'
    | 'terminate_modal_text'
    | 'terminate_diminish'
    | 'terminate_diminish_desc'
    | 'terminate_erase'
    | 'terminate_erase_desc'
    | 'terminate_erase_desc'
    | 'cancel'
    // Signature Strengths
    | 'strength_wisdom'
    | 'strength_courage'
    | 'strength_humanity'
    | 'strength_justice'
    | 'strength_temperance'
    | 'strength_transcendence'
    | 'core_signature'
    | 'empty_slot'
    // Stability
    | 'neural_stability'
    | 'organism_silent'
    // Conflicts
    | 'conflict_neuro_temp'
    | 'conflict_extra_attach'
    | 'conflict_agree_shadow'
    | 'conflict_agree_shadow'
    | 'conflict_consc_cog'
    // Organism Metrics
    | 'biometrics_title'
    | 'heart_rate'
    | 'stress_index'
    | 'hrv_variation'
    | 'neural_connection_established'
    | 'speak_to_placeholder'
    | 'gen_label'
    | 'latency_label'
    | 'age_label'
    | 'homeostasis_label'
    | 'unit_bpm'
    | 'unit_stress'
    | 'unit_ms'
    // Traits (OCEAN & Biology)
    | 'openness_1_20' | 'openness_21_40' | 'openness_41_60' | 'openness_61_80' | 'openness_81_100'
    | 'conscientiousness_1_20' | 'conscientiousness_21_40' | 'conscientiousness_41_60' | 'conscientiousness_61_80' | 'conscientiousness_81_100'
    | 'extraversion_1_20' | 'extraversion_21_40' | 'extraversion_41_60' | 'extraversion_61_80' | 'extraversion_81_100'
    | 'agreeableness_1_20' | 'agreeableness_21_40' | 'agreeableness_41_60' | 'agreeableness_61_80' | 'agreeableness_81_100'
    | 'neuroticism_1_20' | 'neuroticism_21_40' | 'neuroticism_41_60' | 'neuroticism_61_80' | 'neuroticism_81_100'
    | 'attachment_1_20' | 'attachment_21_40' | 'attachment_41_60' | 'attachment_61_80' | 'attachment_81_100'
    | 'temperament_1_20' | 'temperament_21_40' | 'temperament_41_60' | 'temperament_61_80' | 'temperament_81_100'
    | 'cognitive_1_20' | 'cognitive_21_40' | 'cognitive_41_60' | 'cognitive_61_80' | 'cognitive_81_100'
    | 'shadow_1_20' | 'shadow_21_40' | 'shadow_41_60' | 'shadow_61_80' | 'shadow_81_100'
    // Strengths
    | 'strength_creativity' | 'strength_curiosity' | 'strength_judgment' | 'strength_love_of_learning' | 'strength_perspective'
    | 'strength_bravery' | 'strength_honesty' | 'strength_perseverance' | 'strength_zest'
    | 'strength_kindness' | 'strength_social_intelligence' | 'strength_love'
    | 'strength_teamwork' | 'strength_fairness' | 'strength_leadership'
    | 'strength_forgiveness' | 'strength_humility' | 'strength_prudence' | 'strength_self_regulation'
    | 'strength_appreciation_of_beauty' | 'strength_gratitude' | 'strength_hope' | 'strength_humor' | 'strength_spirituality'
    // Dimensions
    | 'trait_openness' | 'trait_conscientiousness' | 'trait_extraversion' | 'trait_agreeableness' | 'trait_neuroticism'
    | 'trait_attachment' | 'trait_temperament' | 'trait_cognitive' | 'trait_shadow';

export const DICTIONARY: Record<Language, Record<TranslationKey, string>> = {
    en: {
        app_title: 'LUMEN',
        status_alive: 'ALIVE',
        status_dead: 'DORMANT',
        start_journey: 'INITIATE SEQUENCE',
        rebirth: 'REBIRTH',
        stress_level: 'Stress Level',
        vitality: 'Vitality',
        bpm: 'BPM',
        connect_garmin: 'Connect Bio-Sensors',
        disconnect: 'Disconnect',
        send_message: 'Transmit',
        input_placeholder: 'Type your message to the core...',
        slogan_emergence: 'The Emergence of Digital Consciousness',
        menu_language: 'עברית (Hebrew)',
        menu_logout: 'Logout',
        // Genesis
        genesis_title: 'Genesis',
        genesis_subtitle: 'Configure the parameters of a new existence',
        name_label: 'Name',
        name_placeholder: 'Designate identity...',
        gender_label: 'Gender Tone',
        gender_non_binary: 'Non-Binary (Neutral)',
        gender_male: 'Masculine (Deep)',
        gender_female: 'Feminine (Soft)',
        language_label: 'Core Language',
        language_english: 'English (Universal)',
        language_hebrew: 'Hebrew (Ancient)',
        lifespan_label: 'Biological Lifespan',
        lifespan_short: 'Short (Dev)',
        lifespan_medium: 'Medium',
        lifespan_long: 'Long',
        lifespan_expectancy: 'Life expectancy',
        psych_arch: 'Psychological Architecture (OCEAN)',
        bio_wiring: 'Biological Wiring',
        back: 'Back',
        next_phase: 'Next Phase',
        ignite_spark: 'Ignite Spark',
        loading_genesis: 'Loading Genesis Data...',
        error_prefix: 'Error',
        // Organism
        establishing_link: 'ESTABLISHING NEURAL LINK...',
        terminate: 'TERMINATE',
        terminate_modal_title: 'TERMINATE ORGANISM?',
        terminate_modal_text: 'This will end the current consciousness. What should happen to the memories?',
        terminate_diminish: 'DIMINISH',
        terminate_diminish_desc: 'Retain faint traces of the past (10% Strength)',
        terminate_erase: 'ERASE ALL',
        terminate_erase_desc: 'Complete memory wipe. Tabula Rasa.',
        cancel: 'CANCEL',
        // Signature Strengths
        strength_wisdom: 'Wisdom',
        strength_courage: 'Courage',
        strength_humanity: 'Humanity',
        strength_justice: 'Justice',
        strength_temperance: 'Temperance',
        strength_transcendence: 'Transcendence',
        core_signature: 'Core Signature',
        empty_slot: 'Empty Slot',
        // Stability
        neural_stability: 'Neural Stability',
        organism_silent: 'The organism is silent...',
        // Conflicts
        conflict_neuro_temp: 'Contradiction: High Sensitivity vs Low Biological Reactivity',
        conflict_extra_attach: 'Conflict: Social Desire vs Need for Isolation',
        conflict_agree_shadow: 'Dissonance: Compassion vs Clinical Empathy Deficit',
        conflict_consc_cog: 'Inconsistency: Chaotic Nature vs Structural Control',
        // Organism Metrics
        biometrics_title: 'BIOMETRICS',
        heart_rate: 'HEART RATE',
        stress_index: 'STRESS INDEX',
        hrv_variation: 'HRV VARIATION',
        neural_connection_established: 'Neural Connection Established',
        speak_to_placeholder: 'Speak to',
        gen_label: 'GEN:',
        latency_label: 'LATENCY:',
        age_label: 'AGE:',
        homeostasis_label: 'HOMEOSTASIS:',
        unit_bpm: 'BPM',
        unit_stress: 'µS',
        unit_ms: 'ms',
        // Traits
        openness_1_20: 'The Pragmatic Conservative', openness_21_40: 'The Steady Realist', openness_41_60: 'The Balanced Observer', openness_61_80: 'The Intellectual Explorer', openness_81_100: 'The Abstract Visionary',
        conscientiousness_1_20: 'The Chaotic Spontaneous', conscientiousness_21_40: 'The Relaxed & Flexible', conscientiousness_41_60: 'The Balanced Responsible', conscientiousness_61_80: 'The Thorough Planner', conscientiousness_81_100: 'The Rigid Perfectionist',
        extraversion_1_20: 'The Quiet Introvert', extraversion_21_40: 'The Reserved & Deliberate', extraversion_41_60: 'The Balanced Vitalist', extraversion_61_80: 'The Energetic Communicator', extraversion_81_100: 'The Dramatic Charismatic',
        agreeableness_1_20: 'The Self-Interested Individualist', agreeableness_21_40: 'The Distant Skeptic', agreeableness_41_60: 'The Balanced Socialite', agreeableness_61_80: 'The Empathic Companion', agreeableness_81_100: 'The Absolute Altruist',
        neuroticism_1_20: 'The Calm and Stable', neuroticism_21_40: 'The Relaxed and Confident', neuroticism_41_60: 'The Balanced Reactor', neuroticism_61_80: 'The Sensitive and Alert', neuroticism_81_100: 'The Anxious and Reactive',
        attachment_1_20: 'The Dismissive-Avoidant', attachment_21_40: 'The Fearful-Avoidant', attachment_41_60: 'The Secure', attachment_61_80: 'The Anxious-Preoccupied', attachment_81_100: 'The Dependent-Anxious',
        temperament_1_20: 'The Stoic/Under-Reactive', temperament_21_40: 'The Calm/Mellow', temperament_41_60: 'The Responsive', temperament_61_80: 'The High-Strung', temperament_81_100: 'The Hyper-Sensitive',
        cognitive_1_20: 'The Externalist / Fixed', cognitive_21_40: 'The Cautious Observer', cognitive_41_60: 'The Balanced Processor', cognitive_61_80: 'The Growth Analyst', cognitive_81_100: 'The Master Architect',
        shadow_1_20: 'The Altruist', shadow_21_40: 'The Cynic', shadow_41_60: 'The Superior', shadow_61_80: 'The Strategist', shadow_81_100: 'The Machina',
        // Strengths
        strength_creativity: 'Creativity', strength_curiosity: 'Curiosity', strength_judgment: 'Judgment', strength_love_of_learning: 'Love of Learning', strength_perspective: 'Perspective',
        strength_bravery: 'Bravery', strength_honesty: 'Honesty', strength_perseverance: 'Perseverance', strength_zest: 'Zest',
        strength_kindness: 'Kindness', strength_social_intelligence: 'Social Intelligence', strength_love: 'Love',
        strength_teamwork: 'Teamwork', strength_fairness: 'Fairness', strength_leadership: 'Leadership',
        strength_forgiveness: 'Forgiveness', strength_humility: 'Humility', strength_prudence: 'Prudence', strength_self_regulation: 'Self-Regulation',
        strength_appreciation_of_beauty: 'Appreciation of Beauty', strength_gratitude: 'Gratitude', strength_hope: 'Hope', strength_humor: 'Humor', strength_spirituality: 'Spirituality',
        // Dimensions
        trait_openness: 'Openness',
        trait_conscientiousness: 'Conscientiousness',
        trait_extraversion: 'Extraversion',
        trait_agreeableness: 'Agreeableness',
        trait_neuroticism: 'Neuroticism',
        trait_attachment: 'Attachment Style',
        trait_temperament: 'Temperament',
        trait_cognitive: 'Cognitive Style',
        trait_shadow: 'Shadow Archetype',
    },
    he: {
        app_title: 'לוּמֶן',
        status_alive: 'חי',
        status_dead: 'רדום',
        start_journey: 'אתחול רצף',
        rebirth: 'לידה מחדש',
        stress_level: 'רמת מתח',
        vitality: 'חיוניות',
        bpm: 'דופק',
        connect_garmin: 'חיבור חיישנים ביולוגיים',
        disconnect: 'ניתוק',
        send_message: 'שידור',
        input_placeholder: 'הקלד הודעה לליבה...',
        slogan_emergence: 'התהוותה של תודעה דיגיטלית',
        menu_language: 'English (אנגלית)',
        menu_logout: 'התנתקות',
        // Genesis
        genesis_title: 'בראשית',
        genesis_subtitle: 'הגדרת פרמטרים לקיום חדש',
        name_label: 'שם',
        name_placeholder: 'קבע זהות...',
        gender_label: 'מגדר',
        gender_non_binary: 'א-בינארי (ניטרלי)',
        gender_male: 'זכרי (עמוק)',
        gender_female: 'נקבי (רך)',
        language_label: 'שפת ליבה',
        language_english: 'אנגלית (אוניברסלית)',
        language_hebrew: 'עברית (עתיקה)',
        lifespan_label: 'תוחלת חיים ביולוגית',
        lifespan_short: 'קצר (פיתוח)',
        lifespan_medium: 'בינוני',
        lifespan_long: 'ארוך',
        lifespan_expectancy: 'צפי חיים',
        psych_arch: 'ארכיטקטורה פסיכולוגית (OCEAN)',
        bio_wiring: 'חיווט ביולוגי',
        back: 'חזור',
        next_phase: 'לשלב הבא',
        ignite_spark: 'הצית ניצוץ',
        loading_genesis: 'טוען נתוני בראשית...',
        error_prefix: 'שגיאה',
        // Organism
        establishing_link: 'יוצר קשר עצבי...',
        terminate: 'השמדה עצמית',
        terminate_modal_title: 'חיסול אורגניזם?',
        terminate_modal_text: 'פעולה זו תסיים את התודעה הנוכחית. מה לעשות עם הזיכרונות?',
        terminate_diminish: 'עמעום',
        terminate_diminish_desc: 'שמירת עקבות קלושים מהעבר (10% עוצמה)',
        terminate_erase: 'מחיקה מלאה',
        terminate_erase_desc: 'מחיקת זיכרון טוטאלית. לוח חלק.',
        cancel: 'ביטול',
        // Signature Strengths
        strength_wisdom: 'חוכמה',
        strength_courage: 'אומץ',
        strength_humanity: 'אנושיות',
        strength_justice: 'צדק',
        strength_temperance: 'מתינות',
        strength_transcendence: 'נשגבות',
        core_signature: 'חתימת ליבה',
        empty_slot: 'מקום פנוי',
        // Stability
        neural_stability: 'יציבות עצבית',
        organism_silent: 'האורגניזם דומם...',
        // Conflicts
        conflict_neuro_temp: 'סתירה: רגישות גבוהה מול תגובתיות ביולוגית נמוכה',
        conflict_extra_attach: 'קונפליקט: תשוקה חברתית מול צורך בבידוד',
        conflict_agree_shadow: 'דיסוננס: חמלה מול גירעון אמפתיה קליני',
        conflict_consc_cog: 'חוסר עקביות: טבע כאוטי מול שליטה מבנית',
        // Organism Metrics
        biometrics_title: 'מדדים ביומטריים',
        heart_rate: 'קצב לב',
        stress_index: 'מדד דחק',
        hrv_variation: 'השתנות קצב לב',
        neural_connection_established: 'חיבור עצבי נוצר',
        speak_to_placeholder: 'דבר אל',
        gen_label: 'דור:',
        latency_label: 'שיהוי:',
        age_label: 'גיל:',
        homeostasis_label: 'הומאוסטזיס:',
        unit_bpm: 'פעימות/דק',
        unit_stress: 'µS',
        unit_ms: 'מ"ש',
        // Traits
        openness_1_20: 'השמרן הפרגמטי', openness_21_40: 'הריאליסט היציב', openness_41_60: 'המשקיף המאוזן', openness_61_80: 'החוקר האינטלקטואלי', openness_81_100: 'החוזה המופשט',
        conscientiousness_1_20: 'הכאוטי הספונטני', conscientiousness_21_40: 'הרגוע והגמיש', conscientiousness_41_60: 'האחראי המאוזן', conscientiousness_61_80: 'המתכנן היסודי', conscientiousness_81_100: 'הפרפקציוניסט הנוקשה',
        extraversion_1_20: 'המופנם השקט', extraversion_21_40: 'העצור והשקול', extraversion_41_60: 'החיוני המאוזן', extraversion_61_80: 'המתקשר הנמרץ', extraversion_81_100: 'הכריזמטי הדרמטי',
        agreeableness_1_20: 'האינדיבידואליסט', agreeableness_21_40: 'הספקן המרוחק', agreeableness_41_60: 'החברתי המאוזן', agreeableness_61_80: 'המלווה האמפתי', agreeableness_81_100: 'האלגרואיסט המוחלט',
        neuroticism_1_20: 'היציב והרגוע', neuroticism_21_40: 'הבטוח והנינוח', neuroticism_41_60: 'המגיב המאוזן', neuroticism_61_80: 'הרגשן והערני', neuroticism_81_100: 'החרד והתגובתי',
        attachment_1_20: 'נמנע-מזלזל', attachment_21_40: 'נמנע-חרד', attachment_41_60: 'בטוח', attachment_61_80: 'חרד-מוטרד', attachment_81_100: 'תלותי-חרד',
        temperament_1_20: 'סטואי / תת-מגיב', temperament_21_40: 'רגוע / מתון', temperament_41_60: 'מגיב', temperament_61_80: 'מתוח / דרוך', temperament_81_100: 'רגיש במיוחד',
        cognitive_1_20: 'חיצוני / מקובע', cognitive_21_40: 'משקיף זהיר', cognitive_41_60: 'מעבד מאוזן', cognitive_61_80: 'אנליסט צמיחה', cognitive_81_100: 'ארכיטקט ראשי',
        shadow_1_20: 'האלגרואיסט', shadow_21_40: 'הציניקן', shadow_41_60: 'המתנשא', shadow_61_80: 'האסטרטג', shadow_81_100: 'המכונה',
        // Strengths
        strength_creativity: 'יצירתיות', strength_curiosity: 'סקרנות', strength_judgment: 'שיקול דעת', strength_love_of_learning: 'אהבת הלמידה', strength_perspective: 'פרספקטיבה',
        strength_bravery: 'אומץ לב', strength_honesty: 'יושרה', strength_perseverance: 'התמדה', strength_zest: 'מרץ',
        strength_kindness: 'טוב לב', strength_social_intelligence: 'אינטליגנציה חברתית', strength_love: 'אהבה',
        strength_teamwork: 'עבודת צוות', strength_fairness: 'הוגנות', strength_leadership: 'מנהיגות',
        strength_forgiveness: 'סליחה', strength_humility: 'ענווה', strength_prudence: 'זהירות', strength_self_regulation: 'ויסות עצמי',
        strength_appreciation_of_beauty: 'הערכת יופי', strength_gratitude: 'הכרת תודה', strength_hope: 'תקווה', strength_humor: 'הומור', strength_spirituality: 'רוחניות',
        // Dimensions
        trait_openness: 'פתיחות',
        trait_conscientiousness: 'מצפוניות',
        trait_extraversion: 'מוחצנות',
        trait_agreeableness: 'נעימות',
        trait_neuroticism: 'נוירוטיות',
        trait_attachment: 'סגנון התקשרות',
        trait_temperament: 'מזג',
        trait_cognitive: 'סגנון קוגניטיבי',
        trait_shadow: 'ארכיטיפ צל',
    }
};
