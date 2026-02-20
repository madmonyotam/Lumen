import { DICTIONARY, type TranslationKey } from '../i18n/locales';
import { LUMEN_CONFIG } from '../lumen.config';

export const useTranslation = () => {
    const lang = LUMEN_CONFIG.LANGUAGE;

    const t = (key: TranslationKey): string => {
        return DICTIONARY[lang][key] || key;
    };

    const isRTL = lang === 'he';

    return { t, lang, isRTL };
};
