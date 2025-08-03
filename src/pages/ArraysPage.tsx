import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';
import Visualization from '../components/Visualization';
import Quiz from '../components/Quiz';
import { useQuizzes } from '../hooks/useQuizzes';
import { Plus, Minus, Search, RefreshCw } from 'lucide-react';

export default function ArraysPage() {
  const [array, setArray] = useState<number[]>([1, 2, 3, 4, 5]);
  const [newValue, setNewValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const { questions, loading, error } = useQuizzes('arrays');
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleInsert = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      setArray([...array, value]);
      setNewValue('');
    }
  };

  const handleDelete = (index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (!isNaN(value)) {
      const index = array.indexOf(value);
      setSearchResult(index);
    }
  };

  const handleQuizComplete = async (score: number) => {
    setQuizCompleted(true);
    // Here you could save the quiz results to Supabase if needed
  };

  const insertCode = `function insert(arr, value) {
  arr.push(value);
  return arr;
}`;

  const deleteCode = `function deleteAt(arr, index) {
  arr.splice(index, 1);
  return arr;
}`;

  const searchCode = `function search(arr, value) {
  return arr.indexOf(value);
}`;

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Arrays</h1>
        <p className="text-gray-400 mb-8">
          A fundamental data structure that stores elements in contiguous memory locations.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Visualization title="Array Operations">
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
                  onClick={handleInsert}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Insert</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {array.map((value, index) => (
                  <div
                    key={index}
                    className="relative group"
                  >
                    <div className="bg-indigo-900/50 border border-indigo-500/20 rounded p-3 text-white min-w-[60px] text-center">
                      {value}
                    </div>
                    <button
                      onClick={() => handleDelete(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Minus className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white"
                  placeholder="Search value"
                />
                <button
                  onClick={handleSearch}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>
                {searchResult !== null && (
                  <div className="flex items-center">
                    <span className="text-white">
                      {searchResult >= 0
                        ? `Found at index ${searchResult}`
                        : 'Not found'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Visualization>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Time Complexity</h3>
              <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
                <ul className="space-y-2 text-gray-300">
                  <li>Access: O(1)</li>
                  <li>Search: O(n)</li>
                  <li>Insertion: O(n)</li>
                  <li>Deletion: O(n)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Operations</h3>
              <div className="space-y-4">
                <CodeBlock
                  language="javascript"
                  code={insertCode}
                  highlightedLines={[2]}
                />
                <CodeBlock
                  language="javascript"
                  code={deleteCode}
                  highlightedLines={[2]}
                />
                <CodeBlock
                  language="javascript"
                  code={searchCode}
                  highlightedLines={[2]}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Common Use Cases</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Storing sequential data</li>
            <li>Implementing other data structures (stacks, queues)</li>
            <li>Buffer pools</li>
            <li>Lookup tables</li>
          </ul>
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