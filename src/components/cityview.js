import React from 'react';
import { Table } from 'react-bootstrap';

const CityView = ({ data }) => {
  const cityData = data.reduce((acc, item) => {
    if (item.city) {
      if (!acc[item.city]) {
        acc[item.city] = { count: 0, avgRelevance: 0 };
      }
      acc[item.city].count += 1;
      acc[item.city].avgRelevance += item.relevance;
    }
    return acc;
  }, {});

  Object.keys(cityData).forEach(city => {
    cityData[city].avgRelevance /= cityData[city].count;
  });

  const sortedCities = Object.entries(cityData)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10);

  return (
    <div>
      <h3>Top 10 Cities by Event Count</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>City</th>
            <th>Event Count</th>
            <th>Avg Relevance</th>
          </tr>
        </thead>
        <tbody>
          {sortedCities.map(([city, data]) => (
            <tr key={city}>
              <td>{city}</td>
              <td>{data.count}</td>
              <td>{data.avgRelevance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CityView;