'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/translation-provider';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const [musicToggle, setMusicToggle] = useState(false);
  const isArabic = language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A0F2E] to-[#0A0A0A] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#5D3B7F] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#8B5CF6] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <h1 className="text-white text-2xl font-bold">{t('app.title')}</h1>
        <div className="flex gap-4">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
            className="px-3 py-2 rounded-lg bg-[#5D3B7F] hover:bg-[#7D5BA3] text-white text-sm transition"
          >
            {isArabic ? 'EN' : 'عربي'}
          </button>
          
          {/* Music toggle */}
          <button
            onClick={() => setMusicToggle(!musicToggle)}
            className="px-3 py-2 rounded-lg bg-[#5D3B7F] hover:bg-[#7D5BA3] text-white text-sm transition"
          >
            {musicToggle ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center px-4 max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {t('landing.welcome')}
            </h2>
            <p className="text-xl md:text-2xl text-[#C084FC] mb-4">
              {t('landing.subtitle')}
            </p>
            <p className="text-base md:text-lg text-gray-300 mb-12 leading-relaxed">
              {t('landing.description')}
              <br />
              <span className="text-sm text-[#8B5CF6]">{t('landing.note')}</span>
            </p>

            <button
              onClick={() => router.push('/login')}
              className="px-8 py-4 bg-gradient-to-r from-[#5D3B7F] to-[#8B5CF6] hover:from-[#7D5BA3] hover:to-[#A78BFA] text-white font-semibold rounded-lg transition duration-300 transform hover:scale-105 text-lg"
            >
              {t('landing.enter')}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-gray-400 text-sm">
        <p>{t('landing.footer')}</p>
      </footer>
    </div>
  );
}
