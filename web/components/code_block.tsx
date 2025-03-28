'use client'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function CodeBlock ({ code, language = 'ts' })  {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Copied!');
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={handleCopy}
        style={{ position: 'absolute', right: '8px', top: '8px' }}
      >
        Copy
      </button>
      <SyntaxHighlighter language={language} 
    //   style={tomorrow}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

// Usage in MDX:
