import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';
import Visualization from '../components/Visualization';
import { Plus, Minus, Search } from 'lucide-react';

interface HashTableItem {
  key: string;
  value: any;
}

export default function HashingPage() {
  const [hashTable, setHashTable] = useState<HashTableItem[][]>(Array(10).fill(null).map(() => []));
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);

  const handleInsert = () => {
    const hashCode = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10;
    setHashTable(
      hashTable.map((bucket, index) =>
        index === hashCode ? [...bucket, { key, value }] : bucket
      )
    );
    setKey('');
    setValue('');
  };

  const handleDelete = (index: number, key: string) => {
    const hashCode = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10;
    setHashTable(
      hashTable.map((bucket, i) =>
        i === hashCode ? bucket.filter((item) => item.key !== key) : bucket
      )
    );
  };

  const handleSearch = () => {
    const hashCode = searchKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10;
    const foundItem = hashTable[hashCode].find((item) => item.key === searchKey);
    setSearchResult(foundItem ? foundItem.value : null);
    setSearchKey('');
  };

  const insertCode = `function insert(key, value) {
  const index = this.hash(key) % this.capacity;
  this.table[index].push({ key, value });
}`;

  const deleteCode = `function delete(key) {
  const index = this.hash(key) % this.capacity;
  this.table[index] = this.table[index].filter((item) => item.key !== key);
}`;

  const searchCode = `function search(key) {
  const index = this.hash(key) % this.capacity;
  const item = this.table[index].find((item) => item.key === key);
  return item ? item.value : null;
}`;

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Hash Tables</h1>
        <p className="text-gray-400 mb-8">
          A data structure that uses a hash function to map keys to indices in an array, enabling fast lookups, insertions, and deletions.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Visualization title="Hash Table Visualization">
            <div className="grid grid-cols-5 gap-4">
              {hashTable.map((bucket, index) => (
                <div key={index} className="bg-navy-900 border border-indigo-500/20 rounded p-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Bucket {index}</h4>
                  <ul className="space-y-2 text-gray-300">
                    {bucket.map((item) => (
                      <li key={item.key} className="flex items-center">
                        <span className="text-white">{item.key}: </span>
                        <span>{item.value}</span>
                        <button onClick={() => handleDelete(index, item.key)} className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Visualization>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Operations</h3>
              <div className="space-y-4">
                <CodeBlock language="javascript" code={insertCode} />
                <CodeBlock language="javascript" code={deleteCode} />
                <CodeBlock language="javascript" code={searchCode} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white"
            placeholder="Key"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white"
            placeholder="Value"
          />
          <button onClick={handleInsert} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Insert</span>
          </button>
        </div>

        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white"
            placeholder="Search Key"
          />
          <button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
          {searchResult !== null && (
            <div className="flex items-center">
              <span className="text-white">Result: {searchResult}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
