import React from 'react';

interface VisualizationProps {
  children: React.ReactNode;
  title: string;
}

export default function Visualization({ children, title }: VisualizationProps) {
  return (
    <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="aspect-video bg-navy-900/50 rounded-lg flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}