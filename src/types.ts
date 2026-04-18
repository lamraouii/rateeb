/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryId = 'morning' | 'evening' | 'after_prayer' | 'sleep';
export type Language = 'ar' | 'en';

export interface Category {
  id: CategoryId;
  name: string;
  nameAr: string;
  icon: string;
}

export interface Dhikr {
  id: string;
  text: string;
  count: number;
  category: CategoryId;
  translation?: string;
  source?: string;
}

export interface Muraja3aSession {
  id: string;
  title: string;
  content: {
    ayat: string[];
    hadith: string[];
    notes: string[];
  };
  comments: string;
  isCompleted: boolean;
}

export interface Muraja3aLevel {
  id: string;
  name: string;
  nameAr: string;
  sessionsCount: number;
}

export interface UserStats {
  totalAdhkar: number;
  streak: number;
  lastActive: string;
}
