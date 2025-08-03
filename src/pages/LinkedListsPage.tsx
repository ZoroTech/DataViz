import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';
import Visualization from '../components/Visualization';
import Quiz from '../components/Quiz';
import { useQuizzes } from '../hooks/useQuizzes';
import { Plus, Minus, Search, ArrowRight, ArrowLeft } from 'lucide-react';

interface Node {
  value: number;
  next: Node | null;
  prev: Node | null;
}

type ListType = 'singly' | 'doubly' | 'circular';

export default function LinkedListsPage() {
  const [listType, setListType] = useState<ListType>('singly');
  const [nodes, setNodes] = useState<Node[]>([
    { value: 1, next: null, prev: null },
    { value: 2, next: null, prev: null },
    { value: 3, next: null, prev: null },
  ]);
  const [newValue, setNewValue] = useState<string>('');
  const [insertPosition, setInsertPosition] = useState<'start' | 'end' | 'middle'>('end');
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const { questions, loading, error: quizError } = useQuizzes('linked-lists');
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizComplete = async (score: number) => {
    setQuizCompleted(true);
    // Here you could save the quiz results to Supabase if needed
  };

  const handleInsert = () => {
    const value = parseInt(newValue);
    if (isNaN(value)) return;

    const newNode: Node = { value, next: null, prev: null };
    let newNodes = [...nodes];

    switch (insertPosition) {
      case 'start':
        newNodes.unshift(newNode);
        break;
      case 'end':
        newNodes.push(newNode);
        break;
      case 'middle':
        if (selectedNode !== null && selectedNode < nodes.length) {
          newNodes.splice(selectedNode + 1, 0, newNode);
        }
        break;
    }

    setNodes(newNodes);
    setNewValue('');
  };

  const handleDelete = (index: number) => {
    setNodes(nodes.filter((_, i) => i !== index));
  };

  const insertCode = {
    start: `function insertAtStart(value) {
  const newNode = { value, next: this.head };
  this.head = newNode;
  if (!this.tail) this.tail = newNode;
}`,
    end: `function insertAtEnd(value) {
  const newNode = { value, next: null };
  if (this.tail) this.tail.next = newNode;
  this.tail = newNode;
  if (!this.head) this.head = newNode;
}`,
    middle: `function insertAfter(node, value) {
  const newNode = { value, next: node.next };
  node.next = newNode;
}`
  };

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Linked Lists</h1>
        <p className="text-gray-400 mb-8">
          A dynamic data structure where elements are stored in nodes connected by pointers.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">List Type</h3>
              <div className="flex space-x-4">
                {(['singly', 'doubly', 'circular'] as ListType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setListType(type)}
                    className={`px-4 py-2 rounded-lg ${
                      listType === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-navy-900/50 text-gray-300 hover:bg-navy-900'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Visualization title="Linked List Operations">
              <div className="w-full p-4">
                <div className="flex space-x-4 mb-6">
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white"
                    placeholder="Enter value"
                  />
                  <select
                    value={insertPosition}
                    onChange={(e) => setInsertPosition(e.target.value as 'start' | 'end' | 'middle')}
                    className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white"
                  >
                    <option value="start">Start</option>
                    <option value="end">End</option>
                    <option value="middle">After Selected</option>
                  </select>
                  <button
                    onClick={handleInsert}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Insert</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {nodes.map((node, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className={`relative group cursor-pointer ${
                          selectedNode === index ? 'ring-2 ring-indigo-500' : ''
                        }`}
                        onClick={() => setSelectedNode(index)}
                        onMouseEnter={() => setHighlightedNode(index)}
                        onMouseLeave={() => setHighlightedNode(null)}
                      >
                        <div className={`bg-indigo-900/50 border border-indigo-500/20 rounded-full w-12 h-12 flex items-center justify-center ${
                          highlightedNode === index ? 'bg-indigo-700/50' : ''
                        }`}>
                          <span className="text-white">{node.value}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(index);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Minus className="h-3 w-3 text-white" />
                        </button>
                      </div>
                      {index < nodes.length - 1 && (
                        <div className="flex items-center px-2">
                          {listType === 'doubly' && <ArrowLeft className="h-4 w-4 text-indigo-400 mx-1" />}
                          <ArrowRight className="h-4 w-4 text-indigo-400" />
                        </div>
                      )}
                      {index === nodes.length - 1 && listType === 'circular' && (
                        <div className="flex items-center px-2">
                          <ArrowRight className="h-4 w-4 text-indigo-400 transform rotate-90" />
                        </div>
                      )}
                    </div>
                  ))}
                  {listType === 'circular' && nodes.length > 0 && (
                    <div className="w-px h-20 bg-indigo-400/20 mx-4" />
                  )}
                </div>
              </div>
            </Visualization>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Time Complexity</h3>
              <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
                <ul className="space-y-2 text-gray-300">
                  <li>Access: O(n)</li>
                  <li>Search: O(n)</li>
                  <li>Insertion at start: O(1)</li>
                  <li>Insertion at end: O(1) with tail pointer</li>
                  <li>Deletion: O(n)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Operations</h3>
              <div className="space-y-4">
                <CodeBlock
                  language="javascript"
                  code={insertCode[insertPosition]}
                  highlightedLines={[2, 3]}
                />
              </div>
            </div>

            <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Common Use Cases</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Implementation of stacks and queues</li>
                <li>Undo/redo functionality</li>
                <li>Memory allocation</li>
                <li>Music playlist (circular)</li>
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