import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import SortingVisualizer from '../components/algorithms/SortingVisualizer';
import SearchingVisualizer from '../components/algorithms/SearchingVisualizer';
import Quiz from '../components/Quiz';
import { useQuizzes } from '../hooks/useQuizzes';

type SortAlgorithm = 'bubble' | 'merge' | 'quick' | 'heap';
type SearchAlgorithm = 'linear' | 'binary';

export default function AlgorithmsPage() {
  const [array, setArray] = useState<number[]>([]);
  const [sortAlgorithm, setSortAlgorithm] = useState<SortAlgorithm>('bubble');
  const [searchAlgorithm, setSearchAlgorithm] = useState<SearchAlgorithm>('linear');
  const [isSorting, setIsSorting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const [customArrayInput, setCustomArrayInput] = useState('');
  const [error, setError] = useState('');
  const { questions, loading, error: quizError } = useQuizzes('algorithms');
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizComplete = async (score: number) => {
    setQuizCompleted(true);
    // Here you could save the quiz results to Supabase if needed
  };

  const generateRandomArray = (size: number): number[] => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
  };

  const handleGenerateArray = (size: number) => {
    setArray(generateRandomArray(size));
    setSearchResult(null);
    setError('');
  };

  const handleCustomArraySubmit = () => {
    try {
      const parsedArray = customArrayInput
        .split(',')
        .map(num => {
          const parsed = parseInt(num.trim());
          if (isNaN(parsed)) throw new Error('Invalid number');
          return parsed;
        });
      
      if (parsedArray.length === 0) throw new Error('Array cannot be empty');
      if (parsedArray.length > 15) throw new Error('Array too large (max 15 elements)');
      if (Math.max(...parsedArray) > 100) throw new Error('Numbers should be <= 100');
      
      setArray(parsedArray);
      setSearchResult(null);
      setError('');
      setCustomArrayInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please enter valid numbers separated by commas');
    }
  };

  const bubbleSort = async (arr: number[]): Promise<void> => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
  };

  const handleSort = async () => {
    if (array.length === 0) {
      setError('Please generate or enter an array first');
      return;
    }
    
    setIsSorting(true);
    const arrCopy = [...array];
    
    try {
      await bubbleSort(arrCopy);
    } catch (err) {
      console.error('Sorting error:', err);
    }
    
    setIsSorting(false);
  };

  const handleSearch = () => {
    setIsSearching(true);
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      setSearchResult(null);
      setIsSearching(false);
      return;
    }

    let result: number | null = null;
    if (searchAlgorithm === 'linear') {
      result = array.indexOf(value);
    } else {
      // For binary search, first sort the array
      const sortedArray = [...array].sort((a, b) => a - b);
      setArray(sortedArray); // Update the displayed array to show it sorted
      
      let left = 0;
      let right = sortedArray.length - 1;
      
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (sortedArray[mid] === value) {
          result = mid;
          break;
        }
        if (sortedArray[mid] < value) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
    }
    setSearchResult(result);
    setIsSearching(false);
  };

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Algorithms</h1>
        <p className="text-gray-400 mb-8">
          Explore various sorting and searching algorithms with interactive visualizations.
        </p>

        <div className="space-y-8">
          <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Array Controls</h2>
              
              {/* Random Array Generation */}
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={array.length || 10}
                  onChange={(e) => handleGenerateArray(parseInt(e.target.value, 10))}
                  className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white w-24"
                />
                <button
                  onClick={() => handleGenerateArray(10)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Generate Random</span>
                </button>
              </div>

              {/* Custom Array Input */}
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Enter numbers separated by commas (e.g., 5,2,8,1)"
                  value={customArrayInput}
                  onChange={(e) => setCustomArrayInput(e.target.value)}
                  className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white flex-1"
                />
                <button
                  onClick={handleCustomArraySubmit}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                >
                  Set Custom Array
                </button>
              </div>
              
              {error && (
                <p className="text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">Sorting Algorithm</h3>
                  <div className="flex flex-wrap gap-4">
                    {(['bubble', 'merge', 'quick', 'heap'] as SortAlgorithm[]).map((alg) => (
                      <button
                        key={alg}
                        onClick={() => setSortAlgorithm(alg)}
                        className={`px-4 py-2 rounded-lg ${
                          sortAlgorithm === alg
                            ? 'bg-indigo-600 text-white'
                            : 'bg-navy-900/50 text-gray-300 hover:bg-navy-900'
                        }`}
                      >
                        {alg.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <SortingVisualizer
                  array={array}
                  isSorting={isSorting}
                  onSort={handleSort}
                  algorithm={sortAlgorithm}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">Search Algorithm</h3>
                  <div className="flex space-x-4">
                    {(['linear', 'binary'] as SearchAlgorithm[]).map((alg) => (
                      <button
                        key={alg}
                        onClick={() => setSearchAlgorithm(alg)}
                        className={`px-4 py-2 rounded-lg ${
                          searchAlgorithm === alg
                            ? 'bg-indigo-600 text-white'
                            : 'bg-navy-900/50 text-gray-300 hover:bg-navy-900'
                        }`}
                      >
                        {alg.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <SearchingVisualizer
                  array={array}
                  searchValue={searchValue}
                  onSearchValueChange={setSearchValue}
                  onSearch={handleSearch}
                  searchResult={searchResult}
                  isSearching={isSearching}
                  algorithm={searchAlgorithm}
                />
              </div>
            </div>
          </div>

          <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Time Complexity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Sorting Algorithms</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>Bubble Sort: O(n²)</li>
                  <li>Merge Sort: O(n log n)</li>
                  <li>Quick Sort: O(n log n)</li>
                  <li>Heap Sort: O(n log n)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Search Algorithms</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>Linear Search: O(n)</li>
                  <li>Binary Search: O(log n)</li>
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
    </div>
  );
}