/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Muraja3aLevel } from './types';

export const CATEGORIES: Category[] = [
  { id: 'morning', name: 'Morning', nameAr: 'أذكار الصباح', icon: '☀️' },
  { id: 'evening', name: 'Evening', nameAr: 'أذكار المساء', icon: '🌙' },
  { id: 'after_prayer', name: 'After Prayer', nameAr: 'بـعد الصلاة', icon: '📿' },
  { id: 'sleep', name: 'Sleep', nameAr: 'أذكار الـنوم', icon: '🛌' },
];

export const MURAJA3A_LEVELS: Muraja3aLevel[] = [
  { id: 'beginner', name: 'Beginner', nameAr: 'مبتدئ', sessionsCount: 5 },
  { id: 'intermediate', name: 'Intermediate', nameAr: 'متوسط', sessionsCount: 5 },
  { id: 'advanced', name: 'Advanced', nameAr: 'متقدم', sessionsCount: 5 },
];

export const TRANSLATIONS = {
  ar: {
    adhkar: 'الأذكار',
    muraja3a: 'مراجعة',
    search: 'البحث',
    profile: 'حسابي',
    morning: 'أذكار الصباح',
    evening: 'أذكار المساء',
    after_prayer: 'بـعد الصلاة',
    sleep: 'أذكار الـنوم',
    reset: 'إعادة المسار',
    completed: 'تـمَّت الأذكار!',
    mashallah: 'ما شاء الله! لقد أكملت هذا القسم.',
    tapToCount: 'المتبقي',
    remaining: 'متبقي',
    wisdom: 'ابحث عن الحكمة',
    wisdomDesc: 'ابحث في القرآن والسنة بالسياق',
    searching: 'جاري البحث في أعماق المعرفة...',
    noResults: 'لم يتم العثور على نتائج',
    streak: 'أيام متتالية',
    totalAdhkar: 'إجمالي الأذكار',
    preferences: 'التفضيلات',
    language: 'اللغة',
    settings: 'الإعدادات العالمية',
    close: 'إغلاق',
    finish: 'إنهاء',
    completed_btn: 'تم بنجاح',
    marhala: 'مرحلة',
    addVerse: 'أضف آية',
    addHadith: 'أضف حديث',
    addNote: 'أضف ملاحظة',
    reflections: 'ملاحظات وتأملات',
    insights: 'رؤى',
    copied: 'تم النسخ إلى الحافظة',
    copy: 'نسخ',
    path: 'المسار الروحي'
  },
  en: {
    adhkar: 'Adhkar',
    muraja3a: 'Revise',
    search: 'Search',
    profile: 'Profile',
    morning: 'Morning',
    evening: 'Evening',
    after_prayer: 'After Prayer',
    sleep: 'Sleep',
    reset: 'Reset Progress',
    completed: 'Dhikr Completed!',
    mashallah: 'Mashallah! You have completed this category.',
    tapToCount: 'Remaining',
    remaining: 'remaining',
    wisdom: 'Search Wisdom',
    wisdomDesc: 'Explore Quran and Hadith contextually',
    searching: 'Searching the depths of knowledge...',
    noResults: 'No results found',
    streak: 'Day Streak',
    totalAdhkar: 'Total Adhkar',
    preferences: 'Preferences',
    language: 'Language',
    settings: 'Global Settings',
    close: 'Close',
    finish: 'Finish',
    completed_btn: 'Completed',
    marhala: 'Stage',
    addVerse: 'Add Verse',
    addHadith: 'Add Hadith',
    addNote: 'Add Note',
    reflections: 'Notes & Reflections',
    insights: 'Insights',
    copied: 'Copied to clipboard',
    copy: 'Copy',
    path: 'Spiritual Path'
  }
};
