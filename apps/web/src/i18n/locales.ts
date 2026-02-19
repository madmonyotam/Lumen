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
    | 'input_placeholder';

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
        input_placeholder: 'Type your message to the core...'
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
        input_placeholder: 'הקלד הודעה לליבה...'
    }
};
