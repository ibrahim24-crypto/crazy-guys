'use client';

import { ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      'app.title': 'Crazy Guys',
      'app.subtitle': 'A Journey of Understanding',
      'nav.apology': 'Apology',
      'nav.personal': 'Personal Messages',
      'nav.rules': 'Boundaries',
      'nav.gallery': 'Gallery',
      'nav.settings': 'Settings',
      'login.welcome': 'Welcome',
      'login.signIn': 'Sign In with Google',
      'login.unauthorized': 'This page is private. Only authorized users can access.',
      'button.enter': 'Enter',
      'button.logout': 'Logout',
      'button.save': 'Save',
      'button.delete': 'Delete',
    }
  },
  ar: {
    translation: {
      'app.title': 'الرجال المجانين',
      'app.subtitle': 'رحلة الفهم',
      'nav.apology': 'الاعتذار',
      'nav.personal': 'الرسائل الشخصية',
      'nav.rules': 'الحدود',
      'nav.gallery': 'المعرض',
      'nav.settings': 'الإعدادات',
      'login.welcome': 'أهلا وسهلا',
      'login.signIn': 'تسجيل الدخول عبر Google',
      'login.unauthorized': 'هذه الصفحة خاصة. فقط المستخدمون المصرحون يمكنهم الوصول.',
      'button.enter': 'دخول',
      'button.logout': 'تسجيل الخروج',
      'button.save': 'حفظ',
      'button.delete': 'حذف',
    }
  }
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
