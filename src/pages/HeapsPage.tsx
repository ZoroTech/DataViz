import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';
import Visualization from '../components/Visualization';
import { Plus, Minus, Play, Pause, RotateCcw } from 'lucide-react';

interface HeapNode {
  value: number;
  x?: number;
  y?: number;
}

type HeapType = 'max' | 'min';

export default function HeapsPage() {
  const [heapType, setHeapType] = useState<HeapType>('max');
  const [heap, setHeap] = useState<HeapNode[]>([]);
  const [newValue, setNewValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isHeapifying, setIsHeapifying] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);


  const heapifyUp = (arr: HeapNode[], index: number) => {
    let currentIndex = index;
    let parentIndex = Math.floor((currentIndex - 1) / 2);

    while (currentIndex > 0 && compare(arr[currentIndex], arr[parentIndex])) {
      // Swap elements
      [arr[currentIndex], arr[parentIndex]] = [arr[parentIndex], arr[currentIndex]];
      currentIndex = parentIndex;
      parentIndex = Math.floor((currentIndex - 1) / 2);
    }
  };

  const heapifyDown = (arr: HeapNode[], index: number) => {
    let currentIndex = index;
    let leftChildIndex = 2 * currentIndex + 1;
    let rightChildIndex = 2 * currentIndex + 2;
    let largestIndex = currentIndex;

    if (leftChildIndex < arr.length && compare(arr[leftChildIndex], arr[largestIndex])) {
      largestIndex = leftChildIndex;
    }

    if (rightChildIndex < arr.length && compare(arr[rightChildIndex], arr[largestIndex])) {
      largestIndex = rightChildIndex;
    }

    if (largestIndex !== currentIndex) {
      // Swap elements
      [arr[currentIndex], arr[largestIndex]] = [arr[largestIndex], arr[currentIndex]];
      heapifyDown(arr, largestIndex);
    }
  };

  const compare = (a: HeapNode, b: HeapNode): boolean => {
    if (heapType === 'max') {
      return a.value > b.value;
    } else {
      return a.value < b.value;
    }
  };

  const handleInsert = () => {
    const value = parseInt(newValue);
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }

    setHeap([...heap, { value }]);
    heapifyUp(heap, heap.length - 1);
    setNewValue('');
    setError(null);
  };

  const handleExtract = () => {
    if (heap.length === 0) {
      setError('Heap is empty!');
      return;
    }

    const newHeap = [...heap];
    [newHeap[0], newHeap[newHeap.length - 1]] = [newHeap[newHeap.length - 1], newHeap[0]];
    const extractedValue = newHeap.pop()!.value;
    heapifyDown(newHeap, 0);
    setHeap(newHeap);
    setError(null);
  };

  const handleHeapify = () => {
    if (heap.length === 0) {
      setError('Heap is empty!');
      return;
    }

    setIsHeapifying(true);
    const newHeap = [...heap];
    const animationSteps = [];

    const heapify = (arr: HeapNode[], n: number) => {
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapifyDown(arr, i);
      }
    };

    heapify(newHeap, newHeap.length);
    setHeap(newHeap);
    setIsHeapifying(false);
  };

  const calculateNodePositions = (heap: HeapNode[], levelWidth: number = 4): Map<number, { x: number; y: number }> => {
    const positions = new Map<number, { x: number; y: number }>();
    let level = 0;
    let nodesInLevel = 1;
    let nodeIndex = 0;
    let x = 400;
    let y = 50;
    const horizontalSpacing = 200 / levelWidth;

    while (nodeIndex < heap.length) {
      for (let i = 0; i < nodesInLevel; i++) {
        if (nodeIndex < heap.length) {
          positions.set(heap[nodeIndex].value, { x: x - (nodesInLevel * horizontalSpacing) / 2 + i * horizontalSpacing, y });
          nodeIndex++;
        }
      }
      level++;
      nodesInLevel *= 2;
      y += 80;
    }
    return positions;
  };

  const nodePositions = calculateNodePositions(heap);

  const renderHeap = (heap: HeapNode[], positions: Map<number, { x: number; y: number }>) => {
    return (
      <g>
        {heap.map((node, index) => {
          const pos = positions.get(node.value);
          if (!pos) return null;
          return (
            <g key={node.value} transform={`translate(${pos.x}, ${pos.y})`}>
              <circle r="20" className="fill-indigo-900/50 stroke-2 stroke-indigo-500/20" />
              <text className="fill-white text-sm" textAnchor="middle" dominantBaseline="middle" y="20">
                {node.value}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Heaps</h1>
        <p className="text-gray-400 mb-8">
          A specialized tree-based data structure that satisfies the heap property.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Heap Type</h3>
              <div className="flex space-x-4">
                {(['max', 'min'] as HeapType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setHeapType(type)}
                    className={`px-4 py-2 rounded-lg ${
                      heapType === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-navy-900/50 text-gray-300 hover:bg-navy-900'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <Visualization title="Heap Operations">
              <div className="w-full p-4">
                <div className="flex flex-wrap gap-4 mb-6">
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
                  <button
                    onClick={handleExtract}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                  >
                    <Minus className="h-4 w-4" />
                    <span>Extract</span>
                  </button>
                  <button
                    onClick={handleHeapify}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Heapify</span>
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300">
                    {error}
                  </div>
                )}

                <div className="relative w-full h-[400px] overflow-auto">
                  <svg width="800" height="400" className="mx-auto">
                    {renderHeap(heap, nodePositions)}
                  </svg>
                </div>
              </div>
            </Visualization>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Time Complexity</h3>
              <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
                <ul className="space-y-2 text-gray-300">
                  <li>Insert: O(log n)</li>
                  <li>Extract: O(log n)</li>
                  <li>Heapify: O(n)</li>
                  <li>Search: O(n)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Operations</h3>
              <div className="space-y-4">
                <CodeBlock language="typescript" code={`//Insert
function insert(value) {
  this.heap.push(value);
  this.heapifyUp(this.heap.length - 1);
}`} />
                <CodeBlock language="typescript" code={`//Extract
function extract() {
  if (this.heap.length === 0) {
    throw new Error('Heap is empty');
  }
  const root = this.heap[0];
  this.heap[0] = this.heap.pop();
  this.heapifyDown(0);
  return root;
}`} />
                <CodeBlock language="typescript" code={`//Heapify
function heapify(arr, n) {
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    this.heapifyDown(arr, i);
  }
}`} />
              </div>
            </div>

            <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Common Use Cases</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Priority Queues</li>
                <li>Heap Sort</li>
                <li>Finding the kth largest/smallest element</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
