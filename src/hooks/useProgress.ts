import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface Progress {
  quiz_count: number;
  challenge_count: number;
  average_score: number;
  total_time: number;
  recent_activity: {
    type: 'quiz' | 'challenge';
    topic: string;
    score?: number;
    status?: string;
    completed_at: string;
  }[];
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProgress() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get quiz progress
        const { data: quizProgress, error: quizError } = await supabase
          .from('user_progress')
          .select('score, completed_at, quiz_id')
          .eq('user_id', user.id)
          .not('quiz_id', 'is', null)
          .order('completed_at', { ascending: false });

        if (quizError) throw quizError;

        const quizIds = quizProgress?.map(q => q.quiz_id) || [];
        const { data: quizDetails, error: quizDetailsError } = await supabase
          .from('quizzes')
          .select('id, topic, title')
          .in('id', quizIds);

        if (quizDetailsError) throw quizDetailsError;

        const quizMap = Object.fromEntries(quizDetails.map(q => [q.id, q]));

        // Get challenge progress
        const { data: challengeProgress, error: challengeError } = await supabase
          .from('user_progress')
          .select('score, completed_at, challenge_id')
          .eq('user_id', user.id)
          .not('challenge_id', 'is', null)
          .order('completed_at', { ascending: false });

        if (challengeError) throw challengeError;

        const challengeIds = challengeProgress?.map(c => c.challenge_id) || [];
        const { data: challengeDetails, error: challengeDetailsError } = await supabase
          .from('challenges')
          .select('id, topic, title')
          .in('id', challengeIds);

        if (challengeDetailsError) throw challengeDetailsError;

        const challengeMap = Object.fromEntries(challengeDetails.map(c => [c.id, c]));

        // Calculate statistics
        const quizCount = quizProgress?.length || 0;
        const challengeCount = challengeProgress?.length || 0;
        const totalScore = quizProgress?.reduce((sum, p) => sum + p.score, 0) || 0;
        const averageScore = quizCount > 0 ? Math.round((totalScore / quizCount) * 100) / 100 : 0;

        // Combine and sort recent activity
        const recentActivity = [
          ...(quizProgress?.map(p => ({
            type: 'quiz' as const,
            topic: quizMap[p.quiz_id]?.topic || 'Unknown',
            score: p.score,
            completed_at: p.completed_at
          })) || []),
          ...(challengeProgress?.map(p => ({
            type: 'challenge' as const,
            topic: challengeMap[p.challenge_id]?.topic || 'Unknown',
            status: p.score >= 80 ? 'Completed' : 'In Progress',
            completed_at: p.completed_at
          })) || [])
        ].sort((a, b) =>
          new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
        ).slice(0, 5);

        setProgress({
          quiz_count: quizCount,
          challenge_count: challengeCount,
          average_score: averageScore,
          total_time: 0, // Placeholder
          recent_activity: recentActivity
        });
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch progress');
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [user]);

  return { progress, loading, error };
}