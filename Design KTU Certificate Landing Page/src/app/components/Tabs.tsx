import { useState, ReactNode } from 'react';

interface TabItem {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
}

export function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-8 justify-center flex-wrap">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-2 rounded-full border transition-colors ${
              activeTab === index
                ? 'bg-pink-600 text-white border-pink-600'
                : 'bg-white text-gray-400 border-gray-300 hover:border-pink-300'
            }`}
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[activeTab].content}</div>
    </div>
  );
}
