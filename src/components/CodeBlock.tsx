import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
  highlightedLines?: number[];
}

export default function CodeBlock({ code, language, highlightedLines = [] }: CodeBlockProps) {
  return (
    <div className="rounded-lg overflow-hidden">
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        showLineNumbers
        wrapLines
        lineProps={(lineNumber) => ({
          style: {
            backgroundColor: highlightedLines.includes(lineNumber) ? 'rgba(99, 102, 241, 0.1)' : undefined,
            display: 'block',
            width: '100%',
          },
        })}
        customStyle={{
          margin: 0,
          backgroundColor: '#1a1f35',
          padding: '1.5rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}