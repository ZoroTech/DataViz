import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';
import Visualization from '../components/Visualization';
import { Search } from 'lucide-react';

export default function StringsPage() {
  const [text, setText] = useState('');
  const [pattern, setPattern] = useState('');
  const [matches, setMatches] = useState<number[]>([]);

  const handleSearch = () => {
    const matches = [];
    let i = 0;
    while ((i = text.indexOf(pattern, i)) !== -1) {
      matches.push(i);
      i += pattern.length;
    }
    setMatches(matches);
  };

  const naivePatternMatchingCode = `function naivePatternMatching(text, pattern) {
  const matches = [];
  for (let i = 0; i <= text.length - pattern.length; i++) {
    let match = true;
    for (let j = 0; j < pattern.length; j++) {
      if (text[i + j] !== pattern[j]) {
        match = false;
        break;
      }
    }
    if (match) matches.push(i);
  }
  return matches;
}`;

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Strings</h1>
        <p className="text-gray-400 mb-8">
          Sequences of characters with various operations for pattern matching and manipulation.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Visualization title="String Matching Visualization">
            <div className="p-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white w-full h-32 mb-4"
                placeholder="Enter text"
              />
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white mb-4"
                placeholder="Enter pattern"
              />
              <button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
              {matches.length > 0 && (
                <div className="mt-4">
                  <p className="text-white">Matches found at indices: {matches.join(', ')}</p>
                </div>
              )}
            </div>
          </Visualization>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Operations</h3>
              <div className="space-y-4">
                <CodeBlock language="javascript" code={naivePatternMatchingCode} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
