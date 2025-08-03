import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { QuizQuestion } from '../components/Quiz';

// Log environment variables to verify they're loaded
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Anon Key length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length);

let supabase;
try {
  supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );
} catch (err) {
  console.error('Failed to initialize Supabase client:', err);
}

export function useQuizzes(topic: string) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          throw new Error('Missing Supabase environment variables');
        }

        // First, try a simple health check
        const { data: healthCheck, error: healthError } = await supabase
          .from('quizzes')
          .select('count')
          .limit(1);

        if (healthError) {
          throw new Error(`Supabase connection failed: ${healthError.message}`);
        }

        // Get all quizzes for the topic
        const { data: quizzes, error: quizError } = await supabase
          .from('quizzes')
          .select('id')
          .eq('topic', topic);

        if (quizError) throw quizError;

        if (!quizzes || quizzes.length === 0) {
          setQuestions([]);
          return;
        }

        // Get questions for the first quiz
        const { data: questions, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', quizzes[0].id)
          .order('order');

        if (questionsError) throw questionsError;

        setQuestions(
          (questions || []).map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correct_answer,
            explanation: q.explanation
          }))
        );
      } catch (err) {
        console.error('Quiz fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch quiz');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchQuizzes();
  }, [topic]);

  return { questions, loading, error };
}