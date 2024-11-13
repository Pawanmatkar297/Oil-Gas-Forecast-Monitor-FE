import React from 'react';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';

const TopicTreemap = ({ data }) => {
  const treeData = Object.entries(
    data.reduce((acc, item) => {
      if (!acc[item.topic]) {
        acc[item.topic] = { name: item.topic, value: 0 };
      }
      acc[item.topic].value += 1;
      return acc;
    }, {})
  ).map(([, value]) => value);

  const COLORS = [
    '#8889DD', '#9597E4', '#8DC77B', '#A5D297', '#E2CF45', '#F8C12D',
    '#F6C4E1', '#F79CD4', '#87CEFA', '#7B68EE', '#FF69B4', '#BA55D3'
  ];

  return (
    <div style={{ width: '100%', height: 500, padding: '20px', boxSizing: 'border-box' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Topic Distribution</h2>
      <ResponsiveContainer>
        <Treemap
          data={treeData}
          dataKey="value"
          aspectRatio={4/3}
          stroke="#fff"
          fill="#8884d8"
          content={<CustomizedContent colors={COLORS} />}
        >
          <Tooltip 
            formatter={(value, name, props) => [`Count: ${value}`, props.payload.name]}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '5px' }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

const CustomizedContent = (props) => {
  const { root, depth, x, y, width, height, index, colors, name, value } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[index % colors.length] : 'none',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 && (
        <>
          <text 
            x={x + width / 2} 
            y={y + height / 2} 
            textAnchor="middle" 
            fill="#fff" 
            fontSize={14}
            style={{
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              dominantBaseline: 'central'
            }}
          >
            {width > 50 ? name : ''}
          </text>
          <text 
            x={x + width / 2} 
            y={y + height - 10} 
            textAnchor="middle" 
            fill="#fff" 
            fontSize={12}
            style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {width > 40 ? value : ''}
          </text>
        </>
      )}
    </g>
  );
};

export default TopicTreemap;