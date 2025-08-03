import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { Play, Copy, Check } from 'lucide-react';

type Language = 'javascript' | 'python' | 'cpp' | 'java';

interface CodeEditorProps {
  initialCode: string;
  language: Language;
  title?: string;
  onRun?: (code: string) => void;
}

const languageExtensions = {
  javascript: [javascript({ jsx: true })],
  python: [python()],
  cpp: [cpp()],
  java: [java()]
};

const languageNames = {
  javascript: 'JavaScript',
  python: 'Python',
  cpp: 'C++',
  java: 'Java'
};

export default function CodeEditor({ initialCode, language, title, onRun }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running...');

    try {
      if (onRun) {
        await onRun(code);
      } else {
        // Default behavior: show code in output
        setOutput(`// Code execution simulation\n${code}`);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="bg-navy-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-navy-900/50 border-b border-indigo-500/20">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-white">
            {title || languageNames[language]}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
            title="Copy code"
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="h-4 w-4" />
            <span className="text-sm">Run</span>
          </button>
        </div>
      </div>

      <div className="border-b border-indigo-500/20">
        <CodeMirror
          value={code}
          height="300px"
          theme={vscodeDark}
          extensions={languageExtensions[language]}
          onChange={(value) => setCode(value)}
          className="text-sm"
        />
      </div>

      {output && (
        <div className="p-4 bg-navy-900/50 border-t border-indigo-500/20">
          <h4 className="text-sm font-medium text-white mb-2">Output:</h4>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}