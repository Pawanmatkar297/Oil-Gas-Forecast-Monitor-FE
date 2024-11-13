import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RelevanceChart = ({ data }) => {
  const chartData = data.map(item => ({
    relevance: item.relevance,
    intensity: item.intensity,
    likelihood: item.likelihood
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Relevance vs Intensity and Likelihood</h3>
      <ResponsiveContainer>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="relevance" name="Relevance" />
          <YAxis type="number" dataKey="intensity" name="Intensity" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Relevance vs Intensity" data={chartData} fill="#8884d8" />
          <Scatter name="Relevance vs Likelihood" data={chartData} fill="#82ca9d" dataKey="likelihood" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RelevanceChart;