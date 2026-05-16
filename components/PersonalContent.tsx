'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useState } from 'react';
import { useTranslation } from '@/app/translation-provider';

const personalMessages = [
  {
    name: 'Charifa',
    role: 'Friend',
    message: 'To Charifa: You\'ve been incredibly patient with me, and I haven\'t always returned that kindness. I appreciate your strength and your ability to see the best in people, even when they don\'t deserve it right away. I want to earn that trust again.'
  },
  {
    name: 'Ibrahim',
    role: 'Friend',
    message: 'To all my friends: I recognize that I have work to do. I\'m committed to showing up better, listening more, and being the friend you deserve. Thank you for giving me this chance to reflect and grow.'
  }
];

export default function PersonalContent() {
  const [musicEnabled, setMusicEnabled] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1A0F2E] to-[#0A0A0A]">
      <Navigation onMusicToggle={setMusicEnabled} musicEnabled={musicEnabled} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">{t('personal.title')}</h1>
          <p className="text-gray-300">{t('personal.subtitle')}</p>
        </motion.div>

        <div className="grid gap-8">
          {personalMessages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#1A0F2E] border border-[#5D3B7F] rounded-lg p-8 backdrop-blur-sm hover:border-[#8B5CF6] transition duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#5D3B7F] flex items-center justify-center text-white font-bold text-lg">
                  {msg.name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#C084FC]">{msg.name}</h3>
                  <p className="text-sm text-gray-400">{msg.role}</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                {msg.message}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-300 mb-6">
            {t('personal.cta')}
          </p>
          <a
            href="/rules"
            className="inline-block px-8 py-3 bg-[#5D3B7F] hover:bg-[#7D5BA3] text-white font-semibold rounded-lg transition duration-300 transform hover:scale-105"
          >
            {t('personal.button')}
          </a>
        </motion.div>
      </main>
    </div>
  );
}
