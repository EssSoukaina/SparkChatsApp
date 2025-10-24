import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome back',
      paywallTitle: 'Unlock SparkChats Pro',
      trialCta: 'Continue trial',
    },
  },
  fr: {
    translation: {
      welcome: 'Bon retour',
      paywallTitle: 'Débloquez SparkChats Pro',
      trialCta: 'Continuer l’essai',
    },
  },
  ar: {
    translation: {
      welcome: 'مرحباً بعودتك',
      paywallTitle: 'افتح مزايا سبارك شاتس برو',
      trialCta: 'متابعة التجربة',
    },
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: Localization.locale.split('-')[0] ?? 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
