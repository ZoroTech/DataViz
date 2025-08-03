import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';
import Visualization from '../components/Visualization';
import Quiz from '../components/Quiz';
import { useQuizzes } from '../hooks/useQuizzes';
import { Plus, Minus, Eye, ArrowRight, ArrowLeft, ArrowUpCircle } from 'lucide-react';

type QueueType = 'simple' | 'circular' | 'priority' | 'deque';

interface QueueItem {
  value: number;
  priority?: number;
}

const MAX_QUEUE_SIZE = 8;

export default function QueuesPage() {
  const [queueType, setQueueType] = useState<QueueType>('simple');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [newValue, setNewValue] = useState<string>('');
  const [priority, setPriority] = useState<string>('1');
  const [error, setError] = useState<string | null>(null);
  const [peekHighlight, setPeekHighlight] = useState(false);
  const { questions, loading, error: quizError } = useQuizzes('queues');
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizComplete = async (score: number) => {
    setQuizCompleted(true);
  };

  const handleEnqueue = (position: 'front' | 'rear' = 'rear') => {
    const value = parseInt(newValue);
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }

    if (queue.length >= MAX_QUEUE_SIZE) {
      setError('Queue is full!');
      return;
    }

    const newItem: QueueItem = { value };
    if (queueType === 'priority') {
      newItem.priority = parseInt(priority);
    }

    let newQueue = [...queue];
    if (queueType === 'priority') {
      newQueue.push(newItem);
      newQueue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    } else if (position === 'front' && (queueType === 'deque')) {
      newQueue.unshift(newItem);
    } else {
      newQueue.push(newItem);
    }

    setQueue(newQueue);
    setNewValue('');
    setError(null);
  };

  const handleDequeue = (position: 'front' | 'rear' = 'front') => {
    if (queue.length === 0) {
      setError('Queue is empty!');
      return;
    }

    if (position === 'front') {
      setQueue(queue.slice(1));
    } else {
      setQueue(queue.slice(0, -1));
    }
    setError(null);
  };

  const handlePeek = () => {
    if (queue.length === 0) {
      setError('Queue is empty!');
      return;
    }

    setPeekHighlight(true);
    setTimeout(() => setPeekHighlight(false), 1000);
    setError(null);
  };

  const enqueueCode = `function enqueue(value${queueType === 'priority' ? ', priority' : ''}) {
  if (this.size >= this.maxSize) {
    throw new Error('Queue is full');
  }
  ${queueType === 'priority' 
    ? 'this.items.push({ value, priority });\\n  this.items.sort((a, b) => b.priority - a.priority);'
    : 'this.items[this.rear++] = value;'}
}`;

  const dequeueCode = `function dequeue() {
  if (this.size === 0) {
    throw new Error('Queue is empty');
  }
  ${queueType === 'priority'
    ? 'return this.items.shift().value;'
    : 'return this.items[this.front++];'}
}`;

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Queues</h1>
        <p className="text-gray-400 mb-8">
          A First-In-First-Out (FIFO) data structure with various implementations.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Queue Type</h3>
              <div className="flex flex-wrap gap-4">
                {(['simple', 'circular', 'priority', 'deque'] as QueueType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setQueueType(type);
                      setQueue([]);
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      queueType === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-navy-900/50 text-gray-300 hover:bg-navy-900'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Visualization title="Queue Operations">
              <div className="w-full p-4">
                <div className="flex flex-wrap gap-4 mb-6">
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white"
                    placeholder="Enter value"
                  />
                  {queueType === 'priority' && (
                    <input
                      type="number"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white w-32"
                      placeholder="Priority"
                      min="1"
                    />
                  )}
                  <div className="flex gap-2">
                    {queueType === 'deque' && (
                      <button
                        onClick={() => handleEnqueue('front')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Front</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleEnqueue()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Enqueue</span>
                    </button>
                    <button
                      onClick={() => handleDequeue()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                    >
                      <Minus className="h-4 w-4" />
                      <span>Dequeue</span>
                    </button>
                    {queueType === 'deque' && (
                      <button
                        onClick={() => handleDequeue('rear')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span>Rear</span>
                      </button>
                    )}
                    <button
                      onClick={handlePeek}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Peek</span>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300">
                    {error}
                  </div>
                )}

                <div className="flex justify-center">
                  <div className="relative">
                    <div className="flex items-center space-x-2">
                      {queue.map((item, index) => (
                        <div key={index} className="relative">
                          <div
                            className={`bg-indigo-900/50 border border-indigo-500/20 rounded-lg p-3 min-w-[60px] text-center transform transition-all ${
                              peekHighlight && index === 0 ? 'bg-indigo-600/50 scale-110' : ''
                            }`}
                          >
                            <div className="text-white">{item.value}</div>
                            {item.priority && (
                              <div className="text-xs text-indigo-400 mt-1">
                                Priority: {item.priority}
                              </div>
                            )}
                          </div>
                          {index < queue.length - 1 && (
                            <ArrowRight className="absolute -right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400" />
                          )}
                        </div>
                      ))}
                      {Array(MAX_QUEUE_SIZE - queue.length)
                        .fill(null)
                        .map((_, index) => (
                          <div
                            key={`empty-${index}`}
                            className="w-[60px] h-[60px] border border-dashed border-indigo-500/10 rounded-lg"
                          />
                        ))}
                    </div>
                    {queueType === 'circular' && queue.length > 0 && (
                      <div className="absolute -bottom-8 left-0 right-0 flex justify-between">
                        <ArrowUpCircle className="h-4 w-4 text-indigo-400 transform -rotate-90" />
                        <ArrowUpCircle className="h-4 w-4 text-indigo-400 transform rotate-90" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Visualization>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Time Complexity</h3>
              <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
                <ul className="space-y-2 text-gray-300">
                  <li>Enqueue: {queueType === 'priority' ? 'O(log n)' : 'O(1)'}</li>
                  <li>Dequeue: O(1)</li>
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
                  code={enqueueCode}
                  highlightedLines={[2, 3, 5]}
                />
                <CodeBlock
                  language="javascript"
                  code={dequeueCode}
                  highlightedLines={[2, 3, 5]}
                />
              </div>
            </div>

            <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Common Use Cases</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Task scheduling in operating systems</li>
                <li>Print job management</li>
                <li>Breadth-first search in graphs</li>
                <li>Message queues in distributed systems</li>
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