import React, { useEffect } from "react";
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, Code, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { progress, loading: progressLoading, error } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || progressLoading) {
    return (
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-indigo-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-6 text-red-300">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Completed Quizzes', 
      value: progress?.quiz_count || 0, 
      icon: BookOpen 
    },
    { 
      label: 'Average Score', 
      value: `${progress?.average_score || 0}%`, 
      icon: Award 
    },
    { 
      label: 'Solved Challenges', 
      value: progress?.challenge_count || 0, 
      icon: Code 
    },
    { 
      label: 'Study Time', 
      value: '0h', 
      icon: Clock 
    },
  ];

  const recommendedTopics = [
    {
      title: 'Binary Search Trees',
      description: 'Master tree traversal algorithms',
      path: '/trees'
    },
    {
      title: 'Graph Algorithms',
      description: 'Learn DFS and BFS implementations',
      path: '/graphs'
    },
    {
      title: 'Dynamic Programming',
      description: 'Solve optimization problems efficiently',
      path: '/algorithms'
    }
  ];

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-6 w-6 text-indigo-400" />
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <h3 className="text-gray-400">{stat.label}</h3>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {progress?.recent_activity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-navy-900/50 rounded-lg"
                >
                  <div>
                    <h3 className="text-white font-medium">{activity.topic}</h3>
                    <p className="text-sm text-gray-400">
                      {activity.type === 'quiz' 
                        ? `Quiz Score: ${activity.score}%` 
                        : activity.status}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(activity.completed_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {(!progress?.recent_activity || progress.recent_activity.length === 0) && (
                <p className="text-gray-400 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>

          <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Recommended Topics</h2>
            <div className="space-y-4">
              {recommendedTopics.map((topic, index) => (
                <div
                  key={index}
                  className="p-4 bg-navy-900/50 rounded-lg cursor-pointer hover:bg-navy-900"
                  onClick={() => navigate(topic.path)}
                >
                  <h3 className="text-white font-medium">{topic.title}</h3>
                  <p className="text-sm text-gray-400">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}