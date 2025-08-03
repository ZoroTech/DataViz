import React from 'react';
import { Search } from 'lucide-react';

interface SearchingVisualizerProps {
  array: number[];
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSearch: () => void;
  searchResult: number | null;
  isSearching: boolean;
  algorithm: string;
}

export default function SearchingVisualizer({
  array,
  searchValue,
  onSearchValueChange,
  onSearch,
  searchResult,
  isSearching,
  algorithm
}: SearchingVisualizerProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">{algorithm} Search</h3>
      <div className="flex space-x-4">
        <input
          type="number"
          value={searchValue}
          onChange={(e) => onSearchValueChange(e.target.value)}
          className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white"
          placeholder="Search Value"
        />
        <button 
          onClick={onSearch} 
          disabled={isSearching}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2 disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {array.map((value, index) => (
          <div
            key={index}
            className={`px-4 py-2 rounded ${
              searchResult === index
                ? 'bg-indigo-600'
                : 'bg-navy-900/50'
            } border border-indigo-500/20`}
          >
            <span className="text-white">{value}</span>
          </div>
        ))}
      </div>
      {searchResult !== null && (
        <div className="text-white">
          {searchResult >= 0 ? `Found at index ${searchResult}` : 'Not found'}
        </div>
      )}
    </div>
  );
}