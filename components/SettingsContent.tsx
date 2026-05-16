'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useState } from 'react';
import { useAuth } from '@/app/auth-provider';
import { useTranslation } from '@/app/translation-provider';
import { useRouter } from 'next/navigation';

export default function SettingsContent() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const router = useRouter();
  const [musicEnabled, setMusicEnabled] = useState(false);
  const isArabic = language === 'ar';

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1A0F2E] to-[#0A0A0A]">
      <Navigation onMusicToggle={setMusicEnabled} musicEnabled={musicEnabled} />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">{t('settings.title')}</h1>
          <p className="text-gray-300">{t('settings.subtitle')}</p>
        </motion.div>

        <div className="space-y-6">
          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1A0F2E] border border-[#5D3B7F] rounded-lg p-6 backdrop-blur-sm"
          >
            <h2 className="text-xl font-semibold text-[#C084FC] mb-4">{t('settings.account')}</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400">{t('settings.email')}</label>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">{t('settings.userId')}</label>
                <p className="text-white font-medium text-sm break-all">{user?.uid}</p>
              </div>
            </div>
          </motion.div>

          {/* Language Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1A0F2E] border border-[#5D3B7F] rounded-lg p-6 backdrop-blur-sm"
          >
            <h2 className="text-xl font-semibold text-[#C084FC] mb-4">{t('settings.language')}</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded transition ${
                  language === 'en'
                    ? 'bg-[#5D3B7F] text-white'
                    : 'bg-[#0A0A0A] text-gray-300 hover:bg-[#1A0F2E]'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-4 py-2 rounded transition ${
                  language === 'ar'
                    ? 'bg-[#5D3B7F] text-white'
                    : 'bg-[#0A0A0A] text-gray-300 hover:bg-[#1A0F2E]'
                }`}
              >
                العربية
              </button>
            </div>
          </motion.div>

          {/* Audio Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1A0F2E] border border-[#5D3B7F] rounded-lg p-6 backdrop-blur-sm"
          >
            <h2 className="text-xl font-semibold text-[#C084FC] mb-4">{t('settings.audio')}</h2>
            <div className="flex items-center justify-between">
              <label className="text-gray-300">{t('settings.music')}</label>
              <button
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`px-4 py-2 rounded transition ${
                  musicEnabled
                    ? 'bg-[#5D3B7F] text-white'
                    : 'bg-[#0A0A0A] text-gray-300'
                }`}
              >
                {musicEnabled ? `🔊 ${t('settings.enabled')}` : `🔇 ${t('settings.disabled')}`}
              </button>
            </div>
          </motion.div>

          {/* Privacy & Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1A0F2E] border border-[#5D3B7F] rounded-lg p-6 backdrop-blur-sm"
          >
            <h2 className="text-xl font-semibold text-[#C084FC] mb-4">{t('settings.privacy')}</h2>
            <p className="text-gray-300 text-sm mb-4">
              {t('settings.privacyNote')}
            </p>
            <p className="text-gray-400 text-xs">
              {t('settings.encryption')}
            </p>
          </motion.div>

          {/* Logout */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300"
          >
            {t('settings.logout')}
          </motion.button>
        </div>
      </main>
    </div>
  );
}
