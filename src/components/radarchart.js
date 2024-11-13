import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

const SectorRadarChart = ({ data }) => {
  const sectorData = Object.entries(
    data.reduce((acc, item) => {
      if (!acc[item.sector]) {
        acc[item.sector] = { sector: item.sector, intensity: 0, likelihood: 0, relevance: 0, count: 0 };
      }
      acc[item.sector].intensity += item.intensity;
      acc[item.sector].likelihood += item.likelihood;
      acc[item.sector].relevance += item.relevance;
      acc[item.sector].count += 1;
      return acc;
    }, {})
  ).map(([, value]) => ({
    sector: value.sector,
    intensity: value.intensity / value.count,
    likelihood: value.likelihood / value.count,
    relevance: value.relevance / value.count,
  }));

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3>Sector Comparison</h3>
      <ResponsiveContainer>
        <RadarChart outerRadius={150} data={sectorData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="sector" />
          <PolarRadiusAxis angle={30} domain={[0, 10]} />
          <Radar name="Intensity" dataKey="intensity" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Radar name="Likelihood" dataKey="likelihood" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
          <Radar name="Relevance" dataKey="relevance" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectorRadarChart;