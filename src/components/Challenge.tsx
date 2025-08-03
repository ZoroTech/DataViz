import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import { Play, CheckCircle2, XCircle } from 'lucide-react';

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode: string;
  language: 'javascript' | 'python' | 'cpp' | 'java';
  testCases: TestCase[];
}

interface ChallengeProps {
  challenge: CodingChallenge;
  onComplete: (passed: boolean) => void;
}

export default function Challenge({ challenge, onComplete }: ChallengeProps) {
  const [results, setResults] = useState<{ passed: boolean; output: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async (code: string) => {
    setIsRunning(true);
    setResults([]);

    try {
      // In a real implementation, this would send the code to a backend service
      // for secure execution. For now, we'll simulate the results
      const simulatedResults = challenge.testCases.map(testCase => ({
        passed: Math.random() > 0.5,
        output: `Test case output for ${testCase.input}`
      }));

      setResults(simulatedResults);
      const allPassed = simulatedResults.every(result => result.passed);
      onComplete(allPassed);
    } catch (error) {
      console.error('Error running code:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{challenge.title}</h3>
        <div className="flex items-center space-x-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            challenge.difficulty === 'easy'
              ? 'bg-green-500/20 text-green-400'
              : challenge.difficulty === 'medium'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
          </span>
        </div>
        <p className="text-gray-300 mb-6">{challenge.description}</p>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-2">Test Cases</h4>
          <div className="space-y-3">
            {challenge.testCases.map((testCase, index) => (
              <div key={index} className="bg-navy-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">Test Case {index + 1}</span>
                  {results[index] && (
                    <span>
                      {results[index].passed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-400">Input:</span>
                    <pre className="text-sm text-gray-300 bg-navy-900 rounded p-2 mt-1">
                      {testCase.input}
                    </pre>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Expected Output:</span>
                    <pre className="text-sm text-gray-300 bg-navy-900 rounded p-2 mt-1">
                      {testCase.expectedOutput}
                    </pre>
                  </div>
                  {results[index] && (
                    <div>
                      <span className="text-sm text-gray-400">Your Output:</span>
                      <pre className="text-sm text-gray-300 bg-navy-900 rounded p-2 mt-1">
                        {results[index].output}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <CodeEditor
          initialCode={challenge.starterCode}
          language={challenge.language}
          onRun={handleRunCode}
        />
      </div>
    </div>
  );
}