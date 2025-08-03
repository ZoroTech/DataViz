import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';
import Visualization from '../components/Visualization';
import Quiz from '../components/Quiz';
import { useQuizzes } from '../hooks/useQuizzes';
import { Plus, ArrowUpCircle, Eye } from 'lucide-react';

const MAX_STACK_SIZE = 8;

export default function StacksPage() {
  const [stack, setStack] = useState<number[]>([]);
  const [newValue, setNewValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [peekHighlight, setPeekHighlight] = useState(false);
  const { questions, loading, error: quizError } = useQuizzes('stacks');
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizComplete = async (score: number) => {
    setQuizCompleted(true);
    // Here you could save the quiz results to Supabase if needed
  };

  const handlePush = () => {
    const value = parseInt(newValue);
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }

    if (stack.length >= MAX_STACK_SIZE) {
      setError('Stack overflow! Cannot push more elements.');
      return;
    }

    setStack([...stack, value]);
    setNewValue('');
    setError(null);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setError('Stack underflow! Cannot pop from empty stack.');
      return;
    }

    setStack(stack.slice(0, -1));
    setError(null);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setError('Stack is empty!');
      return;
    }

    setPeekHighlight(true);
    setTimeout(() => setPeekHighlight(false), 1000);
    setError(null);
  };

  const pushCode = `function push(value) {
  if (this.size >= this.maxSize) {
    throw new Error('Stack overflow');
  }
  this.items[this.size++] = value;
}`;

  const popCode = `function pop() {
  if (this.size === 0) {
    throw new Error('Stack underflow');
  }
  return this.items[--this.size];
}`;

  const peekCode = `function peek() {
  if (this.size === 0) {
    throw new Error('Stack is empty');
  }
  return this.items[this.size - 1];
}`;

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Stacks</h1>
        <p className="text-gray-400 mb-8">
          A Last-In-First-Out (LIFO) data structure that supports push and pop operations.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <Visualization title="Stack Operations">
              <div className="w-full p-4">
                <div className="flex space-x-4 mb-6">
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white"
                    placeholder="Enter value"
                  />
                  <button
                    onClick={handlePush}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Push</span>
                  </button>
                  <button
                    onClick={handlePop}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                  >
                    <ArrowUpCircle className="h-4 w-4" />
                    <span>Pop</span>
                  </button>
                  <button
                    onClick={handlePeek}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Peek</span>
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300">
                    {error}
                  </div>
                )}

                <div className="flex justify-center">
                  <div className="relative w-32">
                    <div className="absolute inset-0 border-l-2 border-r-2 border-b-2 border-indigo-500/20 rounded-b-lg" />
                    <div className="flex flex-col-reverse space-y-reverse space-y-2">
                      {stack.map((value, index) => (
                        <div
                          key={index}
                          className={`bg-indigo-900/50 border border-indigo-500/20 rounded p-3 text-white text-center transform transition-all ${
                            peekHighlight && index === stack.length - 1
                              ? 'bg-indigo-600/50 scale-110'
                              : ''
                          }`}
                        >
                          {value}
                        </div>
                      ))}
                      {Array(MAX_STACK_SIZE - stack.length)
                        .fill(null)
                        .map((_, index) => (
                          <div
                            key={`empty-${index}`}
                            className="h-12 border border-dashed border-indigo-500/10 rounded"
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </Visualization>

            <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Stack Properties</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Maximum size: {MAX_STACK_SIZE}</li>
                <li>Current size: {stack.length}</li>
                <li>Space available: {MAX_STACK_SIZE - stack.length}</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Time Complexity</h3>
              <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
                <ul className="space-y-2 text-gray-300">
                  <li>Push: O(1)</li>
                  <li>Pop: O(1)</li>
                  <li>Peek: O(1)</li>
                  <li>Search: O(n)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Operations</h3>
              <div className="space-y-4">
                <CodeBlock
                  language="javascript"
                  code={pushCode}
                  highlightedLines={[2, 3, 5]}
                />
                <CodeBlock
                  language="javascript"
                  code={popCode}
                  highlightedLines={[2, 3, 5]}
                />
                <CodeBlock
                  language="javascript"
                  code={peekCode}
                  highlightedLines={[2, 3, 5]}
                />
              </div>
            </div>

            <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Common Use Cases</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Function call stack in programming languages</li>
                <li>Undo/Redo operations in editors</li>
                <li>Expression evaluation</li>
                <li>Backtracking algorithms</li>
              </ul>
            </div>
          </div>
        </div>

        {!loading && questions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Test Your Knowledge</h2>
            <Quiz questions={questions} onComplete={handleQuizComplete} />
          </div>
        )}
      </div>
    </div>
  );
}