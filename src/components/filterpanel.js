import React from 'react';
import { Form } from 'react-bootstrap';

const FilterPanel = ({ filters, onFilterChange }) => {
  return (
    <div className="filter-panel">
      <h3>Filters</h3>
      {Object.entries(filters).map(([filterType, values]) => (
        <Form.Group key={filterType}>
          <Form.Label>{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</Form.Label>
          <Form.Control 
            as="select" 
            onChange={(e) => onFilterChange(filterType, e.target.value)}
          >
            <option value="">All</option>
            {values.map((value, index) => (
              <option key={index} value={value}>{value}</option>
            ))}
          </Form.Control>
        </Form.Group>
      ))}
    </div>
  );
};

export default FilterPanel;