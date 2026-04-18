/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, createContext, useContext } from 'react';
import {
  Book,
  Search as SearchIcon,
  User,
  Home,
  ChevronRight,
  Plus,
  Star,
  CheckCircle2,
  Trophy,
  History,
  TrendingUp,
  Settings as SettingsIcon,
  Globe,
  Copy,
  PlusCircle,
  MessageSquare,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, MURAJA3A_LEVELS, TRANSLATIONS } from './constants';
import { CategoryId, Dhikr, Muraja3aSession, Language } from './types';
import { searchQuranAndHadith } from './services/geminiService';
import initialAdhkar from './data/adhkar.json';

// --- Context for Language ---

const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}>({
  lang: 'ar',
  setLang: () => {},
  t: (key: string) => key,
});

const useTranslation = () => useContext(LanguageContext);

// --- Components ---

const Logo = () => (
    <div className="flex items-center justify-center space-x-2 space-x-reverse mb-6">
      <svg width="40" height="40" viewBox="0 0 100 100" className="logo-symbol drop-shadow-md">
        <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" strokeWidth="2" stroke="currentColor" fill="none" opacity="0.3" />
        <rect x="30" y="30" width="40" height="40" transform="rotate(22.5 50 50)" strokeWidth="4" stroke="currentColor" fill="none" />
        <circle cx="50" cy="50" r="5" fill="currentColor" />
      </svg>
      <span className="logo-text">رطب</span>
    </div>
);

const AdhkarScreen = () => {
  const { lang, t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('morning');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingCount, setRemainingCount] = useState(0);
  const [adhkarData, setAdhkarData] = useState<Dhikr[]>(initialAdhkar as Dhikr[]);

  const filteredAdhkar = useMemo(() =>
          adhkarData.filter(d => d.category === selectedCategory),
      [selectedCategory, adhkarData]
  );

  const currentDhikr = filteredAdhkar[currentIndex];

  useEffect(() => {
    if (currentDhikr) {
      setRemainingCount(currentDhikr.count);
    }
  }, [currentDhikr]);

  const handleTap = () => {
    if (remainingCount > 1) {
      setRemainingCount(prev => prev - 1);
    } else {
      if (currentIndex < filteredAdhkar.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsCompletedModalOpen(true);
      }
    }
  };

  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  const handleCategoryChange = (id: CategoryId) => {
    setSelectedCategory(id);
    setCurrentIndex(0);
    setIsCompletedModalOpen(false);
  };

  return (
      <div className={`flex flex-col h-full bg-transparent p-6 relative z-10 overflow-y-auto no-scrollbar ${lang === 'ar' ? 'rtl' : ''}`}>
        <header className="text-center mb-6 pt-2">
          <Logo />
          <h1 className="text-[24px] font-arabic font-bold text-moroccan-green opacity-90">
            سبق المفردون
          </h1>
        </header>

        {/* Category selector */}
        <div className="w-full flex space-x-2 space-x-reverse overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 mb-2">
          {CATEGORIES.map(cat => (
              <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`whitespace-nowrap chip flex-shrink-0 flex items-center space-x-2 space-x-reverse ${
                      selectedCategory === cat.id ? 'chip-active scale-105 shadow-md' : ''
                  }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{lang === 'ar' ? cat.nameAr : cat.name}</span>
              </button>
          ))}
        </div>

        {/* Main card */}
        <div className="flex-1 flex flex-col items-center py-4">
          <div className="w-full max-w-md relative">
            <AnimatePresence mode="wait">
              {currentDhikr && !isCompletedModalOpen ? (
                  <motion.div
                      key={currentDhikr.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="w-full spiritual-card relative flex flex-col p-8 tap-effect cursor-pointer select-none min-h-[300px]"
                      onClick={handleTap}
                  >
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <p className="text-2xl md:text-3xl arabic-text text-center text-text-main leading-loose">
                        {currentDhikr.text}
                      </p>

                      <div className="mt-12 flex flex-col items-center">
                        <span className="tap-indicator">{t('tapToCount')}</span>
                        <div className="counter-text">
                          {remainingCount}
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-moroccan-cream/50 text-center">
                      <div className="progress-bar h-1 w-32 bg-[#EAE2D8] rounded-full mx-auto overflow-hidden">
                        <div
                            className="h-full bg-moroccan-gold transition-all duration-500"
                            style={{ width: `${(1 - remainingCount / currentDhikr.count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
              ) : isCompletedModalOpen ? (
                  <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full h-full spiritual-card flex flex-col items-center justify-center p-8 text-center space-y-6"
                  >
                    <div className="w-24 h-24 rounded-full bg-moroccan-gold/20 flex items-center justify-center text-moroccan-gold">
                      <CheckCircle2 size={64} />
                    </div>
                    <h2 className="text-3xl font-arabic font-bold text-moroccan-green">{t('completed')}</h2>
                    <p className="font-display text-moroccan-green/60">{t('mashallah')}</p>
                    <button
                        onClick={() => handleCategoryChange(selectedCategory)}
                        className="px-8 py-3 bg-moroccan-red text-white rounded-full font-display shadow-lg hover:bg-moroccan-red-dark transition-all"
                    >
                      {t('reset')}
                    </button>
                  </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <footer className="mt-6 flex flex-col items-center text-text-light text-xs font-sans uppercase tracking-widest space-y-2">
          <div className={`flex items-center space-x-2 space-x-reverse ${lang === 'ar' ? 'rtl' : ''}`}>
            <span>{currentIndex + 1}</span>
            <span>/</span>
            <span>{filteredAdhkar.length}</span>
            <span>{t('adhkar')}</span>
          </div>
          <div className="flex space-x-1">
            {filteredAdhkar.map((_, idx) => (
                <div
                    key={idx}
                    className={`w-1 h-1 rounded-full ${idx === currentIndex ? 'bg-moroccan-red' : 'bg-moroccan-red/10'}`}
                />
            ))}
          </div>
        </footer>
      </div>
  );
};

const Muraja3aScreen = () => {
  const { lang, t } = useTranslation();
  const [activeLevel, setActiveLevel] = useState<string>('beginner');
  const [sessions, setSessions] = useState<Muraja3aSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<Muraja3aSession | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ratb_muraja3a');
    if (saved) {
      setSessions(JSON.parse(saved));
    } else {
      const initial: Muraja3aSession[] = [];
      MURAJA3A_LEVELS.forEach(level => {
        for(let i=1; i<=5; i++) {
          initial.push({
            id: `${level.id}-${i}`,
            title: lang === 'ar' ? `جلسة ${i}` : `Session ${i}`,
            content: { ayat: [], hadith: [], notes: [] },
            comments: '',
            isCompleted: false
          });
        }
      });
      setSessions(initial);
    }
  }, [lang]);

  const saveSessions = (updated: Muraja3aSession[]) => {
    setSessions(updated);
    localStorage.setItem('ratb_muraja3a', JSON.stringify(updated));
  };

  const levelSessions = sessions.filter(s => s.id.startsWith(activeLevel));

  const updateSession = (updatedSession: Muraja3aSession) => {
    const newSessions = sessions.map(s => s.id === updatedSession.id ? updatedSession : s);
    saveSessions(newSessions);
    setSelectedSession(updatedSession);
  };

  return (
      <div className={`flex flex-col h-full bg-transparent overflow-y-auto pb-32 relative z-10 ${lang === 'ar' ? 'rtl' : ''}`}>
        <header className="p-6 pt-10 text-center">
          <h2 className="text-3xl font-arabic font-bold text-moroccan-green mb-4">{t('marhala')}</h2>
          <div className="flex justify-center flex-wrap gap-2">
            {MURAJA3A_LEVELS.map(level => (
                <button
                    key={level.id}
                    onClick={() => setActiveLevel(level.id)}
                    className={`chip ${
                        activeLevel === level.id ? 'chip-active shadow-md' : ''
                    }`}
                >
                  {lang === 'ar' ? level.nameAr : level.name}
                </button>
            ))}
          </div>
        </header>

        <main className="px-6 space-y-4">
          {levelSessions.map((session, idx) => (
              <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: lang === 'ar' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedSession(session)}
                  className={`spiritual-card p-6 flex items-center justify-between group cursor-pointer ${
                      session.isCompleted ? 'border-moroccan-gold/40 bg-moroccan-gold/5' : ''
                  }`}
              >
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      session.isCompleted ? 'bg-moroccan-gold text-white' : 'bg-moroccan-cream text-moroccan-gold'
                  }`}>
                    {session.isCompleted ? <CheckCircle2 size={24} /> : <Book size={24} />}
                  </div>
                  <div>
                    <h3 className="font-arabic text-xl text-moroccan-green">{session.title}</h3>
                    <p className="text-xs text-moroccan-green/40 uppercase tracking-widest font-sans">
                      {session.content.ayat.length + session.content.hadith.length + session.content.notes.length} {t('insights')}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`text-moroccan-gold opacity-0 group-hover:opacity-100 transition-all transform ${lang === 'ar' ? '-rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </motion.div>
          ))}
        </main>

        <AnimatePresence>
          {selectedSession && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-moroccan-green/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
              >
                <motion.div
                    layoutId={selectedSession.id}
                    className={`bg-moroccan-cream w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[40px] sm:rounded-[40px] shadow-2xl flex flex-col relative overflow-hidden ${lang === 'ar' ? 'rtl' : ''}`}
                >
                  <div className="p-8 flex items-center justify-between border-b border-moroccan-cream-dark">
                    <button
                        onClick={() => setSelectedSession(null)}
                        className="text-moroccan-green/40 hover:text-moroccan-red transition-colors font-bold text-sm"
                    >
                      {t('close')}
                    </button>
                    <h3 className="text-2xl font-arabic font-bold text-moroccan-green">{selectedSession.title}</h3>
                    <button
                        onClick={() => updateSession({ ...selectedSession, isCompleted: !selectedSession.isCompleted })}
                        className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full text-xs font-sans font-bold transition-all ${
                            selectedSession.isCompleted ? 'bg-moroccan-gold text-white' : 'bg-moroccan-cream text-moroccan-gold border border-moroccan-gold/20'
                        }`}
                    >
                      {selectedSession.isCompleted ? t('completed_btn') : t('finish')}
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Ayat Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-sans font-bold text-moroccan-gold uppercase tracking-widest flex items-center space-x-2 space-x-reverse">
                          <Star size={14} />
                          <span>{t('addVerse')}</span>
                        </label>
                      </div>
                      <div className="space-y-3">
                        {selectedSession.content.ayat.map((txt, i) => (
                            <motion.div key={i} className="spiritual-card p-5 arabic-text text-lg relative group">
                              {txt}
                              <button
                                  onClick={() => {
                                    const newAyat = [...selectedSession.content.ayat];
                                    newAyat.splice(i, 1);
                                    updateSession({...selectedSession, content: {...selectedSession.content, ayat: newAyat}});
                                  }}
                                  className="absolute -top-2 -left-2 w-6 h-6 bg-moroccan-red text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                <Plus size={14} className="rotate-45" />
                              </button>
                            </motion.div>
                        ))}
                        <button
                            onClick={() => {
                              const txt = prompt(lang === 'ar' ? 'أدخل الآية:' : 'Enter Ayah:');
                              if(txt) updateSession({
                                ...selectedSession,
                                content: { ...selectedSession.content, ayat: [...selectedSession.content.ayat, txt] }
                              });
                            }}
                            className="w-full py-4 border-2 border-dashed border-moroccan-cream-dark rounded-2xl text-moroccan-green/30 hover:text-moroccan-gold hover:border-moroccan-gold/40 transition-all flex items-center justify-center space-x-2 space-x-reverse"
                        >
                          <PlusCircle size={20} />
                          <span className="font-sans text-sm font-medium">{t('addVerse')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="space-y-4">
                      <label className="text-xs font-sans font-bold text-moroccan-gold uppercase tracking-widest flex items-center space-x-2 space-x-reverse">
                        <MessageSquare size={14} />
                        <span>{t('reflections')}</span>
                      </label>
                      <textarea
                          value={selectedSession.comments}
                          onChange={(e) => updateSession({ ...selectedSession, comments: e.target.value })}
                          placeholder={lang === 'ar' ? 'تأملاتك وملاحظاتك هنا...' : 'Your reflections here...'}
                          className="w-full h-32 p-6 rounded-[24px] bg-white border border-moroccan-cream-dark focus:ring-2 focus:ring-moroccan-gold/20 focus:border-moroccan-gold outline-none transition-all font-arabic text-lg shadow-inner"
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

const SearchScreen = () => {
  const { lang, t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    const text = await searchQuranAndHadith(query);
    setResults(text);
    setIsLoading(false);
  };

  return (
      <div className={`flex flex-col h-full bg-transparent p-6 pb-24 relative z-10 ${lang === 'ar' ? 'rtl' : ''}`}>
        <header className="pt-4 mb-2 flex flex-col items-center">
          <Logo />
          <h2 className="text-3xl font-display font-bold text-moroccan-green mt-2">{t('wisdom')}</h2>
          <p className="text-sm text-moroccan-green/40 mt-1">{t('wisdomDesc')}</p>
        </header>

        <div className="relative group">
          <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={lang === 'ar' ? 'مثال: الصبر، المغفرة، الصلاة...' : 'e.g. Forgiveness, Patience...'}
              className="w-full bg-white rounded-3xl p-6 pr-16 pl-16 shadow-sm border border-moroccan-cream-dark focus:ring-2 focus:ring-moroccan-red/20 outline-none transition-all font-sans"
          />
          <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-moroccan-red text-white rounded-2xl flex items-center justify-center hover:bg-moroccan-red-dark transition-all ${lang === 'ar' ? 'left-4' : 'right-4'}`}
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <SearchIcon size={20} />}
          </button>
        </div>

        <div className="mt-8 flex-1 overflow-y-auto pb-8">
          <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full border-4 border-moroccan-gold/10 border-t-moroccan-gold animate-spin" />
                  <p className="font-arabic text-xl text-moroccan-gold pulse-soft">{t('searching')}</p>
                </motion.div>
            ) : results ? (
                <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-white spiritual-card p-8 pb-16 arabic-text leading-loose text-lg text-moroccan-green whitespace-pre-wrap"
                >
                  {results}
                  <button
                      onClick={() => {
                        navigator.clipboard.writeText(results);
                        alert(t('copied'));
                      }}
                      className={`absolute bottom-4 p-2 bg-moroccan-cream rounded-xl text-moroccan-gold hover:bg-moroccan-gold hover:text-white transition-all shadow-sm flex items-center space-x-2 space-x-reverse ${lang === 'ar' ? 'left-4' : 'right-4'}`}
                  >
                    <Copy size={20} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">{t('copy')}</span>
                  </button>
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20 text-center grayscale">
                  <History size={80} />
                  <p className="mt-4 font-display font-bold">Your spiritual query awaits</p>
                </div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
};

const ProfileScreen = () => {
  const { lang, setLang, t } = useTranslation();

  return (
      <div className={`flex flex-col h-full bg-transparent p-6 pb-24 relative z-10 overflow-y-auto no-scrollbar ${lang === 'ar' ? 'rtl' : ''}`}>
        <header className="pt-4 mb-8 flex flex-col items-center">
          <Logo />
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-moroccan-red to-moroccan-gold p-1 shadow-xl mt-4">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-moroccan-red">
              <User size={48} />
            </div>
          </div>
          <h2 className="mt-6 text-2xl font-display font-bold text-moroccan-green">Faithful User</h2>
          <p className="text-moroccan-green/40 text-sm font-sans tracking-widest mt-1 uppercase">EST. Ramadan 2026</p>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="spiritual-card p-6 flex flex-col items-center text-center">
            <TrendingUp className="text-moroccan-red mb-2" size={24} />
            <span className="text-3xl font-display font-bold text-moroccan-red">7</span>
            <span className="text-[10px] text-moroccan-green/40 uppercase font-bold tracking-widest leading-tight">{t('streak')}</span>
          </div>
          <div className="spiritual-card p-6 flex flex-col items-center text-center">
            <Trophy className="text-moroccan-gold mb-2" size={24} />
            <span className="text-3xl font-display font-bold text-moroccan-gold">1.2K</span>
            <span className="text-[10px] text-moroccan-green/40 uppercase font-bold tracking-widest leading-tight">{t('totalAdhkar')}</span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-sans font-bold text-moroccan-gold uppercase tracking-widest">{t('preferences')}</label>

          <div className="spiritual-card p-6 flex items-center justify-between cursor-pointer group">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Globe className="text-moroccan-gold" size={20} />
              <span className="font-display font-bold text-moroccan-green">{t('language')}</span>
            </div>
            <div className="flex items-center space-x-1 border border-moroccan-cream-dark rounded-full p-1 bg-moroccan-cream">
              <button
                  onClick={(e) => { e.stopPropagation(); setLang('ar'); }}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${lang === 'ar' ? 'bg-moroccan-red text-white' : 'text-moroccan-green/40'}`}
              >
                عربي
              </button>
              <button
                  onClick={(e) => { e.stopPropagation(); setLang('en'); }}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${lang === 'en' ? 'bg-moroccan-red text-white' : 'text-moroccan-green/40'}`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="spiritual-card p-6 flex items-center justify-between cursor-pointer group">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Star className="text-moroccan-gold" size={20} />
              <span className="font-display font-bold text-moroccan-green">{t('path')}</span>
            </div>
            <ChevronRight size={16} className={`text-moroccan-green/20 group-hover:text-moroccan-gold transition-colors ${lang === 'ar' ? '-rotate-180' : ''}`} />
          </div>

          <div className="spiritual-card p-6 flex items-center justify-between cursor-pointer group">
            <div className="flex items-center space-x-4 space-x-reverse">
              <SettingsIcon className="text-moroccan-green/40" size={20} />
              <span className="font-display font-bold text-moroccan-green">{t('settings')}</span>
            </div>
            <ChevronRight size={16} className={`text-moroccan-green/20 group-hover:text-moroccan-gold transition-colors ${lang === 'ar' ? '-rotate-180' : ''}`} />
          </div>
        </div>

        <div className="mt-auto pt-16 text-center">
          <p className="text-[10px] text-moroccan-green/20 font-sans tracking-[0.3em] uppercase">Ratb رطب v1.2.0</p>
        </div>
      </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'adhkar' | 'muraja3a' | 'search' | 'profile'>('adhkar');
  const [lang, setLang] = useState<Language>('ar');

  const t = (key: string) => {
    return (TRANSLATIONS[lang] as any)[key] || key;
  };

  return (
      <LanguageContext.Provider value={{ lang, setLang, t }}>
        <div className={`h-screen w-screen flex flex-col overflow-hidden select-none bg-moroccan-cream relative ${lang === 'ar' ? 'rtl' : ''}`}>
          <div className="fixed inset-0 cultural-pattern pointer-events-none z-0" />

          <div className="flex-1 overflow-hidden relative z-10">
            <AnimatePresence mode="wait">
              {activeTab === 'adhkar' && (
                  <motion.div key="adhkar" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <AdhkarScreen />
                  </motion.div>
              )}
              {activeTab === 'muraja3a' && (
                  <motion.div key="muraja3a" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Muraja3aScreen />
                  </motion.div>
              )}
              {activeTab === 'search' && (
                  <motion.div key="search" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SearchScreen />
                  </motion.div>
              )}
              {activeTab === 'profile' && (
                  <motion.div key="profile" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ProfileScreen />
                  </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="glass-nav px-8 flex items-center justify-around fixed bottom-0 left-0 w-full z-40">
            {[
              { id: 'adhkar', icon: Home, label: t('adhkar') },
              { id: 'muraja3a', icon: Book, label: t('muraja3a') },
              { id: 'search', icon: SearchIcon, label: t('search') },
              { id: 'profile', icon: User, label: t('profile') },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex flex-col items-center justify-center space-y-1 transition-all ${
                        activeTab === tab.id ? 'text-moroccan-red scale-110' : 'text-moroccan-green/30 hover:text-moroccan-green/60'
                    }`}
                >
                  <tab.icon size={26} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                  <span className={`text-[10px] font-sans font-black tracking-widest uppercase transition-all ${
                      activeTab === tab.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                {tab.label}
              </span>
                </button>
            ))}
          </nav>
        </div>
      </LanguageContext.Provider>
  );
}
