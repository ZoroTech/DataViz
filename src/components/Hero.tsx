import React from 'react';
import { Stars, BookOpen } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-navy-900 to-black"></div>
        <Stars className="absolute top-20 left-1/4 h-8 w-8 text-white opacity-50 animate-pulse" />
        <Stars className="absolute top-40 right-1/3 h-6 w-6 text-white opacity-30 animate-pulse delay-300" />
        <Stars className="absolute bottom-1/3 left-1/3 h-4 w-4 text-white opacity-40 animate-pulse delay-700" />
      </div>

      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Visual Guide to
          <span className="block text-indigo-400">Data Structures</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Explore and understand complex data structures through interactive visualizations and step-by-step guides.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center mx-auto space-x-2 transition-all">
          <BookOpen className="h-5 w-5" />
          <span>Start Learning</span>
        </button>
      </div>
    </div>
  );
}