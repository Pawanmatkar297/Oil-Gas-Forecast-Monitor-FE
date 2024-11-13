import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BubbleChart = ({ data }) => {
  const chartData = data.map(item => ({
    x: item.intensity,
    y: item.likelihood,
    z: item.relevance,
    name: item.topic
  }));

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3>Intensity vs Likelihood vs Relevance</h3>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis dataKey="x" name="Intensity" />
          <YAxis dataKey="y" name="Likelihood" />
          <ZAxis dataKey="z" range={[40, 160]} name="Relevance" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Topics" data={chartData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BubbleChart;