import React from 'react';
import Hero from '../components/Hero';
import DataStructureCard from '../components/DataStructureCard';
import { 
  PlayIcon as ArrayIcon,
  Link,
  TreePine,
  Network,
  FileStack as Stack,
  AlignStartHorizontal,
  Hash,
  Binary
} from 'lucide-react';

export default function Home() {
  const dataStructures = [
    {
      title: 'Arrays',
      description: 'Sequential collection of elements with constant-time access.',
      complexity: 'Access: O(1)',
      icon: <ArrayIcon className="h-6 w-6 text-indigo-400" />
    },
    {
      title: 'Linked Lists',
      description: 'Sequential collection with dynamic size and efficient insertion.',
      complexity: 'Insert: O(1)',
      icon: <Link className="h-6 w-6 text-indigo-400" />
    },
    {
      title: 'Trees',
      description: 'Hierarchical structure with parent-child relationships.',
      complexity: 'Search: O(log n)',
      icon: <TreePine className="h-6 w-6 text-indigo-400" />
    },
    {
      title: 'Graphs',
      description: 'Collection of nodes connected by edges for complex relationships.',
      complexity: 'Varies by algorithm',
      icon: <Network className="h-6 w-6 text-indigo-400" />
    },
    {
      title: 'Stacks',
      description: 'LIFO data structure for managing function calls and undo operations.',
      complexity: 'Push/Pop: O(1)',
      icon: <Stack className="h-6 w-6 text-indigo-400" />
    },
    {
      title: 'Queues',
      description: 'FIFO data structure for managing tasks and scheduling.',
      complexity: 'Enqueue/Dequeue: O(1)',
      icon: <AlignStartHorizontal className="h-6 w-6 text-indigo-400" />
    },
    {
      title: 'Hash Tables',
      description: 'Key-value pairs with constant-time access and insertion.',
      complexity: 'Average: O(1)',
      icon: <Hash className="h-6 w-6 text-indigo-400" />
    },
    {
      title: 'Binary Trees',
      description: 'Tree structure where each node has at most two children.',
      complexity: 'Search: O(log n)',
      icon: <Binary className="h-6 w-6 text-indigo-400" />
    }
  ];

  return (
    <div>
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dataStructures.map((ds, index) => (
            <DataStructureCard
              key={index}
              title={ds.title}
              description={ds.description}
              complexity={ds.complexity}
              icon={ds.icon}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
