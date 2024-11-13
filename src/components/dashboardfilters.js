import React, { useState } from 'react';
import { Form, Button, Row, Col, Accordion, Badge } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import './DashboardFilters.css'; // We'll create this file for custom animations

const FilterSelect = ({ label, options, value, onChange }) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">All {label}s</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Form.Select>
  </Form.Group>
);

const DashboardFilters = ({ onApplyFilters, data }) => {
  const [filters, setFilters] = useState({
    end_year: '',
    intensity: '',
    sector: '',
    topic: '',
    region: '',
    start_year: '',
    country: '',
    relevance: '',
    pestle: '',
    source: '',
    likelihood: ''
  });

  const [isOpen, setIsOpen] = useState(true);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      end_year: '',
      intensity: '',
      sector: '',
      topic: '',
      region: '',
      start_year: '',
      country: '',
      relevance: '',
      pestle: '',
      source: '',
      likelihood: ''
    });
    onApplyFilters({});
  };

  const getUniqueValues = (field) => {
    return [...new Set(data.map(item => item[field]).filter(Boolean))].sort();
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Accordion defaultActiveKey="0" className="mb-4">
      <Accordion.Item eventKey="0">
        <Accordion.Header onClick={() => setIsOpen(!isOpen)}>
          Dashboard Filters
          {activeFiltersCount > 0 && (
            <CSSTransition in={true} timeout={300} classNames="badge-animation">
              <Badge bg="primary" className="ms-2">
                {activeFiltersCount} active
              </Badge>
            </CSSTransition>
          )}
        </Accordion.Header>
        <CSSTransition in={isOpen} timeout={300} classNames="accordion-animation" unmountOnExit>
          <Accordion.Body>
            <Form>
              <Row>
                <Col md={4}>
                  <FilterSelect
                    label="End Year"
                    options={getUniqueValues('end_year')}
                    value={filters.end_year}
                    onChange={(value) => handleFilterChange('end_year', value)}
                  />
                </Col>
                <Col md={4}>
                  <FilterSelect
                    label="Start Year"
                    options={getUniqueValues('start_year')}
                    value={filters.start_year}
                    onChange={(value) => handleFilterChange('start_year', value)}
                  />
                </Col>
                <Col md={4}>
                  <FilterSelect
                    label="Sector"
                    options={getUniqueValues('sector')}
                    value={filters.sector}
                    onChange={(value) => handleFilterChange('sector', value)}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FilterSelect
                    label="Topic"
                    options={getUniqueValues('topic')}
                    value={filters.topic}
                    onChange={(value) => handleFilterChange('topic', value)}
                  />
                </Col>
                <Col md={4}>
                  <FilterSelect
                    label="Region"
                    options={getUniqueValues('region')}
                    value={filters.region}
                    onChange={(value) => handleFilterChange('region', value)}
                  />
                </Col>
                <Col md={4}>
                  <FilterSelect
                    label="Country"
                    options={getUniqueValues('country')}
                    value={filters.country}
                    onChange={(value) => handleFilterChange('country', value)}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FilterSelect
                    label="PESTLE"
                    options={getUniqueValues('pestle')}
                    value={filters.pestle}
                    onChange={(value) => handleFilterChange('pestle', value)}
                  />
                </Col>
                <Col md={4}>
                  <FilterSelect
                    label="Source"
                    options={getUniqueValues('source')}
                    value={filters.source}
                    onChange={(value) => handleFilterChange('source', value)}
                  />
                </Col>
                <Col md={4}>
                  <FilterSelect
                    label="Intensity"
                    options={getUniqueValues('intensity')}
                    value={filters.intensity}
                    onChange={(value) => handleFilterChange('intensity', value)}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FilterSelect
                    label="Likelihood"
                    options={getUniqueValues('likelihood')}
                    value={filters.likelihood}
                    onChange={(value) => handleFilterChange('likelihood', value)}
                  />
                </Col>
                <Col md={6}>
                  <FilterSelect
                    label="Relevance"
                    options={getUniqueValues('relevance')}
                    value={filters.relevance}
                    onChange={(value) => handleFilterChange('relevance', value)}
                  />
                </Col>
              </Row>
              <div className="mt-3 d-flex justify-content-between">
                <Button variant="outline-secondary" onClick={handleResetFilters}>
                  Reset Filters
                </Button>
                <Button variant="primary" onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
              </div>
            </Form>
          </Accordion.Body>
        </CSSTransition>
      </Accordion.Item>
    </Accordion>
  );
};

export default DashboardFilters;
