'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/auth-provider';
import { useTranslation } from '@/app/translation-provider';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { encryptData, decryptData } from '@/lib/encryption/aes';

interface ChatMessage {
  id: string;
  userId: string;
  userEmail: string;
  message: string;
  timestamp: Date;
}

export default function ChatContent() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: ChatMessage[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        loadedMessages.push({
          id: doc.id,
          userId: data.userId,
          userEmail: data.userEmail,
          message: decryptData(data.message),
          timestamp: data.timestamp?.toDate() || new Date(),
        });
      });
      setMessages(loadedMessages);
      setLoading(false);
      scrollToBottom();
    });

    return unsubscribe;
  }, [user?.uid]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !user?.email || !newMessage.trim()) return;

    try {
      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, {
        userId: user.uid,
        userEmail: user.email,
        message: encryptData(newMessage),
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const isArabic = language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1A0F2E] to-[#0A0A0A]">
      <Navigation onMusicToggle={setMusicEnabled} musicEnabled={musicEnabled} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">{t('chat.title')}</h1>
          <p className="text-gray-400">{t('chat.subtitle')}</p>
        </motion.div>

        {/* Messages container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1A0F2E] border border-[#5D3B7F] rounded-lg p-6 h-96 overflow-y-auto mb-6 backdrop-blur-sm"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">{t('common.loading')}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">{t('chat.noMessages')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.userId === user?.uid ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.userId === user?.uid
                        ? 'bg-[#5D3B7F] text-white'
                        : 'bg-[#3D1F5C] text-gray-200'
                    }`}
                  >
                    <p className="text-xs text-gray-300 mb-1 font-semibold">
                      {msg.userId === user?.uid ? t('chat.you') : msg.userEmail}
                    </p>
                    <p className="break-words">{msg.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {msg.timestamp.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </motion.div>

        {/* Message input form */}
        <motion.form
          onSubmit={sendMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('chat.placeholder')}
            maxLength={1000}
            className="flex-1 px-4 py-3 bg-[#1A0F2E] border border-[#5D3B7F] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8B5CF6] transition"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="px-6 py-3 bg-[#5D3B7F] hover:bg-[#7D5BA3] disabled:bg-gray-600 text-white font-semibold rounded-lg transition duration-300"
          >
            {loading ? '...' : t('chat.send')}
          </button>
        </motion.form>

        <div className="text-center mt-4 text-sm text-gray-500">
          {newMessage.length}/1000
        </div>
      </main>
    </div>
  );
}
