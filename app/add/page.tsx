'use client';

import { useRouter } from 'next/navigation';
import QuestForm from '@/components/QuestForm';

export default function AddQuestPage() {
  const router = useRouter();

  const handleSave = () => {
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <QuestForm onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}
