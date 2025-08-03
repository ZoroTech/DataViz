import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, Play, Pause, RefreshCw } from 'lucide-react';
import Quiz from '../components/Quiz';
import { useQuizzes } from '../hooks/useQuizzes';

interface GraphNode {
  id: number;
  x: number;
  y: number;
}

interface GraphEdge {
  source: number;
  target: number;
  weight: number;
}

type GraphType = 'directed' | 'undirected' | 'weighted';

export default function GraphsPage() {
  const [graphType, setGraphType] = useState<GraphType>('directed');
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [startNode, setStartNode] = useState<number | null>(null);
  const [endNode, setEndNode] = useState<number | null>(null);
  const [shortestPath, setShortestPath] = useState<number[]>([]);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { questions, loading, error: quizError } = useQuizzes('graphs');
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizComplete = async (score: number) => {
    setQuizCompleted(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawGraph(ctx);
      }
    }

    return () => {
      const ctx = canvas?.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };
  }, [nodes, edges, hoveredNode, shortestPath, selectedNode, isAddingEdge]);

  const drawGraph = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw edges
    edges.forEach((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.source);
      const targetNode = nodes.find((node) => node.id === edge.target);
      
      if (!sourceNode || !targetNode) return;
      
      const isInPath = shortestPath.length > 0 && 
        shortestPath.includes(edge.source) && 
        shortestPath.includes(edge.target) &&
        Math.abs(shortestPath.indexOf(edge.source) - shortestPath.indexOf(edge.target)) === 1;

      ctx.beginPath();
      ctx.strokeStyle = isInPath ? '#22c55e' : '#6366f1';
      ctx.lineWidth = isInPath ? 3 : 2;
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      ctx.stroke();

      // Draw edge weight
      if (graphType === 'weighted') {
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(edge.weight.toString(), midX, midY);
      }

      // Draw arrow for directed graphs
      if (graphType === 'directed') {
        const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
        const arrowLength = 15;
        const arrowWidth = Math.PI / 6;
        
        // Calculate arrow tip position (slightly before the target node)
        const tipX = targetNode.x - 20 * Math.cos(angle);
        const tipY = targetNode.y - 20 * Math.sin(angle);
        
        ctx.beginPath();
        ctx.fillStyle = isInPath ? '#22c55e' : '#6366f1';
        ctx.moveTo(
          tipX - arrowLength * Math.cos(angle - arrowWidth),
          tipY - arrowLength * Math.sin(angle - arrowWidth)
        );
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(
          tipX - arrowLength * Math.cos(angle + arrowWidth),
          tipY - arrowLength * Math.sin(angle + arrowWidth)
        );
        ctx.closePath();
        ctx.fill();
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      
      // Node coloring logic
      if (node.id === selectedNode) {
        ctx.fillStyle = '#818cf8'; // Selected node
      } else if (node.id === startNode) {
        ctx.fillStyle = '#22c55e'; // Start node
      } else if (node.id === endNode) {
        ctx.fillStyle = '#ef4444'; // End node
      } else if (hoveredNode === node.id) {
        ctx.fillStyle = '#818cf8'; // Hovered node
      } else if (shortestPath.includes(node.id)) {
        ctx.fillStyle = '#22c55e'; // Path node
      } else {
        ctx.fillStyle = '#2563eb'; // Default node
      }
      
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      
      // Node label
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id.toString(), node.x, node.y);
    });

    // Draw preview edge when adding edge
    if (isAddingEdge && selectedNode !== null) {
      const sourceNode = nodes.find(node => node.id === selectedNode);
      if (sourceNode && hoveredNode !== null) {
        const targetNode = nodes.find(node => node.id === hoveredNode);
        if (targetNode) {
          ctx.beginPath();
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on existing node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance < 20;
    });

    if (clickedNode) {
      if (isAddingEdge) {
        if (selectedNode === null) {
          setSelectedNode(clickedNode.id);
        } else {
          handleCompleteEdge(clickedNode.id);
        }
      } else {
        handleNodeClick(clickedNode.id);
      }
    } else if (!isAddingEdge) {
      // Add new node if not clicking existing node and not adding edge
      const newNode = { id: nodes.length + 1, x, y };
      setNodes([...nodes, newNode]);
    }
  };

  const handleNodeClick = (nodeId: number) => {
    if (startNode === null) {
      setStartNode(nodeId);
    } else if (endNode === null && nodeId !== startNode) {
      setEndNode(nodeId);
    } else {
      setStartNode(nodeId);
      setEndNode(null);
      setShortestPath([]);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hovered = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance < 20;
    });

    setHoveredNode(hovered?.id || null);
  };

  const handleCompleteEdge = (targetNodeId: number) => {
    if (selectedNode === null || targetNodeId === selectedNode) return;
    
    // Check if edge already exists
    const edgeExists = edges.some(
      edge => 
        (edge.source === selectedNode && edge.target === targetNodeId) ||
        (graphType === 'undirected' && edge.source === targetNodeId && edge.target === selectedNode)
    );

    if (!edgeExists) {
      const weight = graphType === 'weighted' ? 
        parseInt(prompt('Enter edge weight:', '1') || '1') : 1;
      
      const newEdge: GraphEdge = { 
        source: selectedNode, 
        target: targetNodeId,
        weight: weight 
      };
      
      setEdges(prev => [...prev, newEdge]);
      if (graphType === 'undirected') {
        setEdges(prev => [...prev, { 
          source: targetNodeId, 
          target: selectedNode,
          weight: weight 
        }]);
      }
    }
    
    setIsAddingEdge(false);
    setSelectedNode(null);
  };

  const handleAddEdgeClick = () => {
    setIsAddingEdge(true);
    setSelectedNode(null);
    setStartNode(null);
    setEndNode(null);
    setShortestPath([]);
  };

  const handleClearGraph = () => {
    setNodes([]);
    setEdges([]);
    setStartNode(null);
    setEndNode(null);
    setShortestPath([]);
    setIsAddingEdge(false);
    setSelectedNode(null);
  };

  const findShortestPath = () => {
    if (startNode === null || endNode === null) return;

    const distances: { [key: number]: number } = {};
    const previous: { [key: number]: number | null } = {};
    const unvisited = new Set<number>();

    // Initialize distances
    nodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });
    distances[startNode] = 0;

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let current: number | null = null;
      let minDistance = Infinity;
      unvisited.forEach(nodeId => {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          current = nodeId;
        }
      });

      if (current === null || current === endNode) break;
      unvisited.delete(current);

      // Update distances to neighbors
      const currentEdges = edges.filter(edge => edge.source === current);
      currentEdges.forEach(edge => {
        const distance = distances[current!] + edge.weight;
        if (distance < distances[edge.target]) {
          distances[edge.target] = distance;
          previous[edge.target] = current;
        }
      });
    }

    // Reconstruct path
    const path: number[] = [];
    let current = endNode;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    setShortestPath(path);
  };

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Graph Visualization</h1>
        <p className="text-gray-400 mb-8">
          Create and analyze graphs with different algorithms. Click to add nodes, select nodes for shortest path, or add edges.
        </p>

        <div className="space-y-8">
          <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Graph Type</h3>
              <div className="flex space-x-4">
                {(['directed', 'undirected', 'weighted'] as GraphType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setGraphType(type);
                      handleClearGraph();
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      graphType === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-navy-900/50 text-gray-300 hover:bg-navy-900'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Graph Canvas</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddEdgeClick}
                    className={`px-4 py-2 rounded-lg ${
                      isAddingEdge
                        ? 'bg-indigo-600 text-white'
                        : 'bg-navy-900/50 text-gray-300 hover:bg-navy-900'
                    }`}
                  >
                    Add Edge
                  </button>
                  <button
                    onClick={findShortestPath}
                    disabled={startNode === null || endNode === null}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:bg-green-900 disabled:cursor-not-allowed"
                  >
                    Find Shortest Path
                  </button>
                  <button
                    onClick={handleClearGraph}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Clear Graph
                  </button>
                </div>
              </div>
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                className="w-full h-[400px] bg-navy-900/50 rounded-lg cursor-pointer"
              />
              <div className="text-gray-400 text-sm">
                {isAddingEdge 
                  ? selectedNode === null
                    ? "Click a node to start the edge"
                    : "Click another node to complete the edge"
                  : "Click to add nodes. Select two nodes to find shortest path."}
              </div>
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