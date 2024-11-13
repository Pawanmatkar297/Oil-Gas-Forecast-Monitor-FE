import React, { useState } from 'react';
import TopicsDistribution from './topicsdistribution';
import RegionMap from './regionmap';

const DashboardTabs = ({ data }) => {
  const [activeTab, setActiveTab] = useState('topics');

  const tabs = [
    { id: 'topics', label: 'Topics Distribution', component: TopicsDistribution },
    { id: 'regions', label: 'Region Map', component: RegionMap },
    // Add more tabs here as needed
  ];

  return (
    <div>
      <div className="tab-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`visualization-container ${activeTab === tab.id ? 'active' : ''}`}
        >
          <tab.component data={data} />
        </div>
      ))}
    </div>
  );
};

export default DashboardTabs;
