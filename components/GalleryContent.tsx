'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/auth-provider';
import { useTranslation } from '@/app/translation-provider';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, listAll, getBytes, deleteObject } from 'firebase/storage';

interface GalleryItem {
  id: string;
  name: string;
  url: string;
  timestamp: Date;
}

export default function GalleryContent() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      // For now, show a placeholder gallery
      // In production, load from Firebase Storage
      const mockItems: GalleryItem[] = [
        {
          id: '1',
          name: 'Memory 1',
          url: 'https://via.placeholder.com/400x300?text=Memory+1',
          timestamp: new Date(),
        },
        {
          id: '2',
          name: 'Memory 2',
          url: 'https://via.placeholder.com/400x300?text=Memory+2',
          timestamp: new Date(),
        },
      ];
      setItems(mockItems);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1A0F2E] to-[#0A0A0A]">
      <Navigation onMusicToggle={setMusicEnabled} musicEnabled={musicEnabled} />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">{t('gallery.title')}</h1>
          <p className="text-gray-300">{t('gallery.subtitle')}</p>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-300">{t('gallery.loading')}</div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>{t('gallery.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-lg overflow-hidden border border-[#5D3B7F]"
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-64 object-cover rounded-lg transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4 rounded-lg">
                  <div>
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <p className="text-gray-200 text-sm">{item.timestamp.toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
