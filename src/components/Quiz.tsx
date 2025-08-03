import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { user } = useAuth();

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const finalScore = Math.round((score / questions.length) * 100);
      
      if (user) {
        try {
          const { error } = await supabase
            .from('user_progress')
            .insert({
              user_id: user.id,
              quiz_id: questions[0].id.split('-')[0], // Assuming the first part of question ID is quiz ID
              score: finalScore,
            });

          if (error) throw error;
        } catch (err) {
          console.error('Error saving quiz progress:', err);
        }
      }

      setCompleted(true);
      onComplete(finalScore);
    }
  };

  if (completed) {
    return (
      <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Quiz Complete!</h3>
        <p className="text-lg text-gray-300 mb-4">
          Your score: {score} out of {questions.length}
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-400">Score: {score}</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-4">{question.question}</h3>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                selectedAnswer === null
                  ? 'bg-navy-900/50 hover:bg-navy-900 text-gray-300'
                  : selectedAnswer === index
                  ? index === question.correctAnswer
                    ? 'bg-green-500/20 border-green-500/40 text-green-400'
                    : 'bg-red-500/20 border-red-500/40 text-red-400'
                  : index === question.correctAnswer
                  ? 'bg-green-500/20 border-green-500/40 text-green-400'
                  : 'bg-navy-900/50 text-gray-400'
              } ${
                selectedAnswer === null ? 'border border-indigo-500/20' : 'border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {selectedAnswer !== null && (
                  <span>
                    {index === question.correctAnswer ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : selectedAnswer === index ? (
                      <XCircle className="h-5 w-5 text-red-400" />
                    ) : null}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className="mb-6 p-4 bg-navy-900/50 rounded-lg border border-indigo-500/20">
          <h4 className="text-lg font-semibold text-white mb-2">Explanation</h4>
          <p className="text-gray-300">{question.explanation}</p>
        </div>
      )}

      {selectedAnswer !== null && (
        <div className="flex justify-end">
          <button
            onClick={handleNextQuestion}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>{currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}