import React from 'react';
import { Table } from 'react-bootstrap';

const CountryView = ({ data }) => {
  const countryData = data.reduce((acc, item) => {
    if (item.country) {
      if (!acc[item.country]) {
        acc[item.country] = { count: 0, avgIntensity: 0 };
      }
      acc[item.country].count += 1;
      acc[item.country].avgIntensity += item.intensity;
    }
    return acc;
  }, {});

  Object.keys(countryData).forEach(country => {
    countryData[country].avgIntensity /= countryData[country].count;
  });

  const sortedCountries = Object.entries(countryData)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10);

  return (
    <div>
      <h3>Top 10 Countries by Event Count</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Country</th>
            <th>Event Count</th>
            <th>Avg Intensity</th>
          </tr>
        </thead>
        <tbody>
          {sortedCountries.map(([country, data]) => (
            <tr key={country}>
              <td>{country}</td>
              <td>{data.count}</td>
              <td>{data.avgIntensity.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CountryView;