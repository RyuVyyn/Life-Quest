'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Quest } from '@/types';
import { questStorage } from '@/utils/localStorage';
import QuestForm from '@/components/QuestForm';

export default function EditQuestPage() {
  const router = useRouter();
  const params = useParams();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const questData = questStorage.getById(params.id as string);
      if (questData) {
        setQuest(questData);
      }
      setLoading(false);
    }
  }, [params.id]);

  const handleSave = () => {
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-quest-blue"></div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Quest Not Found</h2>
          <p className="text-white/70 mb-6">The quest you are looking for does not exist.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-quest-blue text-white rounded-lg hover:bg-quest-blue/80 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-4">
      <QuestForm questId={quest.id} onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}
