'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/auth-provider';
import { useTranslation } from '@/app/translation-provider';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { encryptData, decryptData } from '@/lib/encryption/aes';

interface Rule {
  id: string;
  title: string;
  description: string;
  importance: 'Low' | 'Medium' | 'High';
  createdAt: Date;
}

export default function RulesContent() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [rules, setRules] = useState<Rule[]>([]);
  const [newRule, setNewRule] = useState({ title: '', description: '', importance: 'Medium' as const });
  const [loading, setLoading] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadRules();
    }
  }, [user?.uid]);

  const loadRules = async () => {
    if (!user?.uid) return;
    
    try {
      const rulesRef = collection(db, 'rules');
      const q = query(rulesRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      const loadedRules: Rule[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        loadedRules.push({
          id: doc.id,
          title: data.title,
          description: decryptData(data.description),
          importance: data.importance,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      
      setRules(loadedRules);
    } catch (error) {
      console.error('Error loading rules:', error);
    }
  };

  const addRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !newRule.title || !newRule.description) return;

    setLoading(true);
    try {
      const rulesRef = collection(db, 'rules');
      await addDoc(rulesRef, {
        userId: user.uid,
        title: newRule.title,
        description: encryptData(newRule.description),
        importance: newRule.importance,
        createdAt: serverTimestamp(),
      });

      setNewRule({ title: '', description: '', importance: 'Medium' });
      loadRules();
    } catch (error) {
      console.error('Error adding rule:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      await deleteDoc(doc(db, 'rules', ruleId));
      loadRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'High':
        return 'border-red-500/50 bg-red-500/10';
      case 'Medium':
        return 'border-yellow-500/50 bg-yellow-500/10';
      default:
        return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1A0F2E] to-[#0A0A0A]">
      <Navigation onMusicToggle={setMusicEnabled} musicEnabled={musicEnabled} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">{t('rules.title')}</h1>
          <p className="text-gray-300">{t('rules.subtitle')}</p>
        </motion.div>

        {/* Add new rule form */}
        <motion.form
          onSubmit={addRule}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#1A0F2E] border border-[#5D3B7F] rounded-lg p-6 mb-12 backdrop-blur-sm"
        >
          <h2 className="text-xl font-semibold text-[#C084FC] mb-4">{t('rules.addNew')}</h2>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t('rules.titlePlaceholder')}
              value={newRule.title}
              onChange={(e) => setNewRule({...newRule, title: e.target.value})}
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#5D3B7F] rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#8B5CF6]"
              required
            />
            
            <textarea
              placeholder={t('rules.descriptionPlaceholder')}
              value={newRule.description}
              onChange={(e) => setNewRule({...newRule, description: e.target.value})}
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#5D3B7F] rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#8B5CF6] h-24 resize-none"
              required
            ></textarea>
            
            <select
              value={newRule.importance}
              onChange={(e) => setNewRule({...newRule, importance: e.target.value as any})}
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#5D3B7F] rounded text-white focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="Low">{t('rules.priority.low')}</option>
              <option value="Medium">{t('rules.priority.medium')}</option>
              <option value="High">{t('rules.priority.high')}</option>
            </select>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-[#5D3B7F] hover:bg-[#7D5BA3] disabled:bg-gray-600 text-white font-semibold rounded-lg transition duration-300"
            >
              {loading ? t('rules.saving') : t('rules.button')}
            </button>
          </div>
        </motion.form>

        {/* Rules list */}
        <div className="space-y-4">
          {rules.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 py-12"
            >
              <p>{t('rules.noRules')}</p>
            </motion.div>
          ) : (
            rules.map((rule, index) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg p-6 backdrop-blur-sm ${getImportanceColor(rule.importance)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{rule.title}</h3>
                    <span className="text-xs px-2 py-1 bg-[#5D3B7F]/50 text-[#C084FC] rounded mt-1 inline-block">
                      {rule.importance} Priority
                    </span>
                  </div>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition"
                  >
                    {t('rules.delete')}
                  </button>
                </div>
                <p className="text-gray-300">{rule.description}</p>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
