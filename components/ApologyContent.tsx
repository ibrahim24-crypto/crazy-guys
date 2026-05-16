'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/auth-provider';
import { useTranslation } from '@/app/translation-provider';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function ApologyContent() {
  const [musicEnabled, setMusicEnabled] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isMarkedRead, setIsMarkedRead] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const markApologyAsRead = async () => {
      if (!user?.uid) return;

      try {
        const apologyRef = doc(db, 'apologyStatus', user.uid);
        const apologyDoc = await getDoc(apologyRef);

        if (apologyDoc.exists()) {
          setIsMarkedRead(true);
        } else {
          // First time reading - mark as read
          await setDoc(apologyRef, {
            userId: user.uid,
            readAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error('Error marking apology as read:', error);
      } finally {
        setLoading(false);
      }
    };

    markApologyAsRead();
  }, [user?.uid]);

  const sections = [
    {
      titleKey: 'apology.section1.title',
      contentKey: 'apology.section1.content',
    },
    {
      titleKey: 'apology.section2.title',
      contentKey: 'apology.section2.content',
    },
    {
      titleKey: 'apology.section3.title',
      contentKey: 'apology.section3.content',
    },
    {
      titleKey: 'apology.section4.title',
      contentKey: 'apology.section4.content',
    },
    {
      titleKey: 'apology.section5.title',
      contentKey: 'apology.section5.content',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1A0F2E] to-[#0A0A0A]">
      <Navigation onMusicToggle={setMusicEnabled} musicEnabled={musicEnabled} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <p className="text-gray-400">{t('common.loading')}</p>
          </div>
        ) : isMarkedRead ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-20"
          >
            <div className="bg-[#1A0F2E] border border-[#5D3B7F] rounded-lg p-8 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('apology.alreadyRead')}
              </h2>
              <p className="text-gray-300 mb-6">{t('apology.thankyou')}</p>
              <a
                href="/rules"
                className="inline-block px-8 py-3 bg-[#5D3B7F] hover:bg-[#7D5BA3] text-white font-semibold rounded-lg transition duration-300"
              >
                {t('apology.goToRules')}
              </a>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  {t('apology.title')}
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <p className="text-xl text-[#C084FC]">{t('apology.subtitle')}</p>
              </motion.div>
            </div>

            <div className="space-y-12">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="bg-[#1A0F2E] border border-[#5D3B7F] rounded-lg p-8 backdrop-blur-sm hover:border-[#8B5CF6] transition duration-300">
                    <h2 className="text-2xl font-semibold text-[#C084FC] mb-4">
                      {t(section.titleKey)}
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {t(section.contentKey)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Call to action */}
            <div className="mt-16 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-300 mb-6">{t('apology.callToAction')}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <a
                  href="/rules"
                  className="inline-block px-8 py-3 bg-[#5D3B7F] hover:bg-[#7D5BA3] text-white font-semibold rounded-lg transition duration-300 transform hover:scale-105"
                >
                  {t('apology.setBoundaries')}
                </a>
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
