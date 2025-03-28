import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="absolute top-2 right-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-300" />}
    </button>
  );
};

export const Tabs = ({ items, children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="m-4">
      <div className="flex mb-2">
        {items.map((item, index) => (
          <p
            key={item}
            className={`px-4 py-2 font-medium cursor-pointer ${
              activeTab === index
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {item}
          </p>
        ))}
      </div>
      {React.Children.toArray(children)[activeTab]}
    </div>
  );
};

export const Tab = ({ children }) => {
  const codeContent = React.Children.toArray(children).find(
    (child): child is React.ReactElement => React.isValidElement(child) && child.type === 'pre'
  );

  return (
    <div className="relative">
      {children}
      {/* {codeContent && React.isValidElement(codeContent?.props?.children) && (
        <CopyButton text={codeContent?.props?.children?.props?.children} />
      )} */}
    </div>
  );
};