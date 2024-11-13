import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Container } from 'react-bootstrap';
import Globe from 'react-globe.gl';
import IntensityChart from './intensitychart';
import LikelihoodChart from './likelihoodchart';
import TopicsDistribution from './topicsdistribution';
import RegionMap from './regionmap';
import DashboardFilters from './dashboardfilters';
import RelevanceChart from './relevancechart';
import CountryView from './countryview';
import BubbleChart from './bubblechart';
import RadarChart from './radarchart';
import Treemap from './treemap';
import CityView from './cityview';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState(null);
  const globeEl = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/data');
        if (response.data && Array.isArray(response.data)) {
          setData(response.data);
          setFilteredData(response.data);
        } else {
          throw new Error('Data is not in the expected format');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  const handleFilterChange = (newFilters) => {
    const newFilteredData = data.filter(item => {
      return Object.entries(newFilters).every(([key, value]) => {
        if (!value) return true; // Skip empty filters
        return String(item[key]).toLowerCase() === String(value).toLowerCase();
      });
    });
    setFilteredData(newFilteredData);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const renderChart = (ChartComponent, title, className = '') => {
    if (!filteredData || filteredData.length === 0) {
      return <div className="no-data">No data available</div>;
    }
    return (
      <Card 
        className={`dashboard-card ${className} ${activeChart === title ? 'active' : ''}`}
        onClick={() => setActiveChart(activeChart === title ? null : title)}
      >
        <Card.Header>{title}</Card.Header>
        <Card.Body>
          <ChartComponent data={filteredData} />
        </Card.Body>
      </Card>
    );
  };

  const renderExpandedChart = (ChartComponent, title, className = '') => {
    if (!filteredData || filteredData.length === 0) {
      return <div className="no-data">No data available</div>;
    }
    return (
      <Card className={`dashboard-card expanded-chart ${className}`}>
        <Card.Header>{title}</Card.Header>
        <Card.Body>
          <ChartComponent data={filteredData} />
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="dashboard">
      <div className="globe-container">
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </div>
      <div className="dashboard-content">
        <div className="sidebar">
          <h2>Energy Sector Insights Dashboard</h2>
          <DashboardFilters onApplyFilters={handleFilterChange} data={data} />
        </div>
        <div className="main-content">
          <div className="dashboard-grid">
            <div className="full-width-row">
              {renderExpandedChart(IntensityChart, "Intensity", "intensity-chart-container")}
            </div>
            <div className="grid-row">
              {renderChart(LikelihoodChart, "Likelihood")}
            
            </div>
            <div classname="grid-row">
            {renderChart(RelevanceChart, "Relevance")}
            </div>
            <div className="full-width-row">
              {renderExpandedChart(TopicsDistribution, "Topics Distribution")}
            </div>
            <div className="full-width-row">
            {renderExpandedChart(RegionMap, "Region Map", "region-map-container")}
            </div>
            <div className="grid-row">
              {renderChart(CountryView, "Country View")}
              {renderChart(CityView, "City View")}
            </div>
            <div className="grid-row">
              {renderChart(BubbleChart, "Bubble Chart")}
              {renderChart(RadarChart, "Radar Chart")}
            </div>

              <div className="grid-row">
              {renderExpandedChart(Treemap, "Treemap", "tree-map-Container")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;