import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';
import Visualization from '../components/Visualization';
import Quiz from '../components/Quiz';
import { useQuizzes } from '../hooks/useQuizzes';
import { Plus, Minus, Play, Pause, RotateCcw } from 'lucide-react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  height: number;
  x?: number;
  y?: number;
}

type TreeType = 'binary' | 'bst' | 'avl';
type TraversalType = 'inorder' | 'preorder' | 'postorder' | 'levelorder';

export default function TreesPage() {
  const [treeType, setTreeType] = useState<TreeType>('binary');
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [newValue, setNewValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [traversalType, setTraversalType] = useState<TraversalType>('inorder');
  const [traversalPath, setTraversalPath] = useState<number[]>([]);
  const [isTraversing, setIsTraversing] = useState(false);
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const { questions, loading, error: quizError } = useQuizzes('trees');
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizComplete = async (score: number) => {
    setQuizCompleted(true);
  };

  const getHeight = (node: TreeNode | null): number => {
    if (!node) return 0;
    return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  };

  const getBalanceFactor = (node: TreeNode | null): number => {
    if (!node) return 0;
    return getHeight(node.left) - getHeight(node.right);
  };

  const rotateRight = (y: TreeNode): TreeNode => {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;

    return x;
  };

  const rotateLeft = (x: TreeNode): TreeNode => {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;

    return y;
  };

  const insertNode = (node: TreeNode | null, value: number): TreeNode | null => {
    if (!node) {
      return { value, left: null, right: null, height: 1 };
    }

    if (value < node.value) {
      node.left = insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = insertNode(node.right, value);
    } else {
      return node;
    }

    if (treeType === 'avl') {
      node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
      const balance = getBalanceFactor(node);

      // Left Left Case
      if (balance > 1 && value < node.left!.value) {
        return rotateRight(node);
      }

      // Right Right Case
      if (balance < -1 && value > node.right!.value) {
        return rotateLeft(node);
      }

      // Left Right Case
      if (balance > 1 && value > node.left!.value) {
        node.left = rotateLeft(node.left!);
        return rotateRight(node);
      }

      // Right Left Case
      if (balance < -1 && value < node.right!.value) {
        node.right = rotateRight(node.right!);
        return rotateLeft(node);
      }
    }

    return node;
  };

  const handleInsert = () => {
    const value = parseInt(newValue);
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }

    setRoot((prevRoot) => insertNode(prevRoot, value));
    setNewValue('');
    setError(null);
  };

  const inorderTraversal = (node: TreeNode | null, path: number[] = []): number[] => {
    if (!node) return path;
    inorderTraversal(node.left, path);
    path.push(node.value);
    inorderTraversal(node.right, path);
    return path;
  };

  const preorderTraversal = (node: TreeNode | null, path: number[] = []): number[] => {
    if (!node) return path;
    path.push(node.value);
    preorderTraversal(node.left, path);
    preorderTraversal(node.right, path);
    return path;
  };

  const postorderTraversal = (node: TreeNode | null, path: number[] = []): number[] => {
    if (!node) return path;
    postorderTraversal(node.left, path);
    postorderTraversal(node.right, path);
    path.push(node.value);
    return path;
  };

  const levelorderTraversal = (node: TreeNode | null): number[] => {
    if (!node) return [];
    const result: number[] = [];
    const queue: TreeNode[] = [node];

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current.value);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }

    return result;
  };

  const startTraversal = () => {
    let path: number[] = [];
    switch (traversalType) {
      case 'inorder':
        path = inorderTraversal(root);
        break;
      case 'preorder':
        path = preorderTraversal(root);
        break;
      case 'postorder':
        path = postorderTraversal(root);
        break;
      case 'levelorder':
        path = levelorderTraversal(root);
        break;
    }
    setTraversalPath(path);
    setIsTraversing(true);
    animateTraversal(path);
  };

  const animateTraversal = (path: number[]) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < path.length) {
        setHighlightedNode(path[i]);
        i++;
      } else {
        clearInterval(interval);
        setIsTraversing(false);
        setHighlightedNode(null);
      }
    }, 1000);
  };

  const calculateNodePositions = (
    node: TreeNode | null,
    x: number = 400,
    y: number = 50,
    horizontalSpacing: number = 200
  ): Map<number, { x: number; y: number }> => {
    const positions = new Map<number, { x: number; y: number }>();
  
    const traverse = (currentNode: TreeNode | null, currentX: number, currentY: number, depth: number = 0) => {
      if (!currentNode) return;
  
      positions.set(currentNode.value, { x: currentX, y: currentY });
  
      const spacingFactor = Math.pow(2, currentY / 80);
  
      if (currentNode.left) {
        const leftX = currentX - horizontalSpacing / spacingFactor;
        traverse(currentNode.left, leftX, currentY + 80, depth + 1);
      }
  
      if (currentNode.right) {
        const rightX = currentX + horizontalSpacing / spacingFactor;
        traverse(currentNode.right, rightX, currentY + 80, depth + 1);
      }
    };
  
    traverse(node, x, y);
  
    return positions;
  };
  
  const renderTree = (node: TreeNode | null, positions: Map<number, { x: number; y: number }>) => {
    if (!node) return null;
  
    const pos = positions.get(node.value);
    if (!pos) return null;
  
    const isHighlighted = highlightedNode !== undefined && highlightedNode === node.value;
  
    return (
      <g key={node.value}>
        {node.left && positions.get(node.left.value) && (
          <line
            x1={pos.x}
            y1={pos.y}
            x2={positions.get(node.left.value)!.x}
            y2={positions.get(node.left.value)!.y}
            stroke="#6366f1"
            strokeWidth="2"
            strokeOpacity="0.8"
          />
        )}
        {node.right && positions.get(node.right.value) && (
          <line
            x1={pos.x}
            y1={pos.y}
            x2={positions.get(node.right.value)!.x}
            y2={positions.get(node.right.value)!.y}
            stroke="#6366f1"
            strokeWidth="2"
            strokeOpacity="0.8"
          />
        )}
        <g transform={`translate(${pos.x}, ${pos.y})`}>
          <circle
            r="20"
            className={`${
              isHighlighted ? 'fill-indigo-600' : 'fill-indigo-900/50'
            } stroke-2 stroke-indigo-500/20`}
          />
          <text
            className="fill-white text-sm"
            textAnchor="middle"
            dominantBaseline="middle"
            y="5"
          >
            {node.value}
          </text>
          {treeType === 'avl' && typeof getBalanceFactor === 'function' && (
            <text
              className="fill-indigo-400 text-xs"
              textAnchor="middle"
              dominantBaseline="middle"
              y="-25"
            >
              bf: {getBalanceFactor(node)}
            </text>
          )}
        </g>
        {renderTree(node.left, positions)}
        {renderTree(node.right, positions)}
      </g>
    );
  };

  const insertCode = {
    binary: `function insert(value) {
  if (!this.root) {
    this.root = { value, left: null, right: null, height: 1 };
    return;
  }
  let queue = [this.root];
  while (queue.length > 0) {
    let node = queue.shift();
    if (!node.left) {
      node.left = { value, left: null, right: null, height: 1 };
      return;
    }
    if (!node.right) {
      node.right = { value, left: null, right: null, height: 1 };
      return;
    }
    queue.push(node.left);
    queue.push(node.right);
  }
}`,
    bst: `function insert(value) {
  this.root = this._insert(this.root, value);
}

function _insert(node, value) {
  if (!node) {
    return { value, left: null, right: null, height: 1 };
  }
  if (value < node.value) {
    node.left = this._insert(node.left, value);
  } else if (value > node.value) {
    node.right = this._insert(node.right, value);
  } else {
    return node;
  }
  return node;
}`,
    avl: `function insert(value) {
  this.root = this._insert(this.root, value);
}

function _insert(node, value) {
  if (!node) {
    return { value, left: null, right: null, height: 1 };
  }
  if (value < node.value) {
    node.left = this._insert(node.left, value);
  } else if (value > node.value) {
    node.right = this._insert(node.right, value);
  } else {
    return node;
  }

  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  const balance = getBalanceFactor(node);

  if (balance > 1 && value < node.left!.value) {
    return rotateRight(node);
  }
  if (balance < -1 && value > node.right!.value) {
    return rotateLeft(node);
  }
  if (balance > 1 && value > node.left!.value) {
    node.left = rotateLeft(node.left!);
    return rotateRight(node);
  }
  if (balance < -1 && value < node.right!.value) {
    node.right = rotateRight(node.right!);
    return rotateLeft(node);
  }

  return node;
}`
  };

  const nodePositions = calculateNodePositions(root);

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Trees</h1>
        <p className="text-gray-400 mb-8">
          Hierarchical data structures with various implementations and balancing strategies.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Tree Type</h3>
              <div className="flex flex-wrap gap-4">
                {(['binary', 'bst', 'avl'] as TreeType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setTreeType(type);
                      setRoot(null);
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      treeType === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-navy-900/50 text-gray-300 hover:bg-navy-900'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <Visualization title="Tree Operations">
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
                  <select
                    value={traversalType}
                    onChange={(e) => setTraversalType(e.target.value as TraversalType)}
                    className="bg-navy-900 border border-indigo-500/20 rounded px-3 py-2 text-white"
                  >
                    <option value="inorder">Inorder</option>
                    <option value="preorder">Preorder</option>
                    <option value="postorder">Postorder</option>
                    <option value="levelorder">Level Order</option>
                  </select>
                  <button
                    onClick={startTraversal}
                    disabled={isTraversing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isTraversing ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    <span>Traverse</span>
                  </button>
                  <button
                    onClick={() => setRoot(null)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300">
                    {error}
                  </div>
                )}

                <div className="relative w-full h-[400px] overflow-auto">
                  <svg width="800" height="400" className="mx-auto">
                    {renderTree(root, nodePositions)}
                  </svg>
                </div>

                {traversalPath.length > 0 && (
                  <div className="mt-4 p-4 bg-navy-900/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Traversal Path:</h4>
                    <div className="flex flex-wrap gap-2">
                      {traversalPath.map((value, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded ${
                            highlightedNode === value
                              ? 'bg-indigo-600 text-white'
                              : 'bg-navy-800 text-gray-300'
                          }`}
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Visualization>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Time Complexity</h3>
              <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
                <ul className="space-y-2 text-gray-300">
                  <li>Insert: {treeType === 'avl' ? 'O(log n)' : treeType === 'bst' ? 'O(h)' : 'O(1)'}</li>
                  <li>Search: {treeType === 'binary' ? 'O(n)' : 'O(h)'}</li>
                  <li>Delete: {treeType === 'avl' ? 'O(log n)' : treeType === 'bst' ? 'O(h)' : 'O(n)'}</li>
                  <li>Traversal: O(n)</li>
                  <li>Height: {treeType === 'avl' ? 'O(log n)' : 'O(n)'}</li>
                </ul>
                <p className="text-gray-400 mt-2 text-sm">
                  Note: h = height of tree, which is O(log n) for balanced trees and O(n) for skewed trees
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Operations</h3>
              <div className="space-y-4">
                <CodeBlock
                  language="javascript"
                  code={insertCode[treeType]}
                  highlightedLines={treeType === 'avl' ? [2, 3, 15, 16, 19, 23, 27, 31, 35] : [2, 3, 4]}
                />
              </div>
            </div>

            <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Common Use Cases</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>File system hierarchies</li>
                <li>Database indexing (B-Trees)</li>
                <li>Expression parsing</li>
                <li>Network routing tables</li>
                {treeType === 'avl' && (
                  <>
                    <li>Self-balancing data structures</li>
                    <li>Guaranteed O(log n) operations</li>
                  </>
                )}
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