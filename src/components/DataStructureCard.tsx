import React from 'react';
import { ChevronRight } from 'lucide-react';

interface DataStructureCardProps {
  title: string;
  description: string;
  complexity: string;
  icon: React.ReactNode;
}

export default function DataStructureCard({ title, description, complexity, icon }: DataStructureCardProps) {
  return (
    <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6 hover:border-indigo-500/40 transition-all cursor-pointer group">
      <div className="flex items-start justify-between">
        <div className="p-2 bg-indigo-900/50 rounded-lg">
          {icon}
        </div>
        <ChevronRight className="h-5 w-5 text-indigo-400 transform group-hover:translate-x-1 transition-transform" />
      </div>
      <h3 className="text-xl font-semibold text-white mt-4">{title}</h3>
      <p className="text-gray-400 mt-2">{description}</p>
      <div className="mt-4 inline-block px-3 py-1 bg-indigo-900/30 rounded-full text-sm text-indigo-300">
        {complexity}
      </div>
    </div>
  );
}