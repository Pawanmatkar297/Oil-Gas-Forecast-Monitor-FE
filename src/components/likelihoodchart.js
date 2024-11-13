import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { format } from 'date-fns';

const LikelihoodChart = ({ data }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [activeTopics, setActiveTopics] = useState({});

  useEffect(() => {
    const topics = [...new Set(data.map(item => item.topic))];
    const initialActiveTopics = topics.reduce((acc, topic) => {
      acc[topic] = true;
      return acc;
    }, {});
    setActiveTopics(initialActiveTopics);
  }, [data]);

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 40, right: 250, bottom: 50, left: 60 }; // Adjusted right margin
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse the date
    const parseDate = d3.timeParse("%B, %d %Y %H:%M:%S");

    // Process and sort the data
    const processedData = data
      .map(d => ({
        date: parseDate(d.added),
        likelihood: d.likelihood,
        topic: d.topic
      }))
      .sort((a, b) => a.date - b.date);

    // Create scales
    const x = d3.scaleTime()
      .domain(d3.extent(processedData, d => d.date))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.likelihood)])
      .range([height, 0]);

    // Create and add the axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    svg.append('g')
      .call(d3.axisLeft(y));

    // Create a color scale for topics
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add the scatter plot
    svg.selectAll('.dot')
      .data(processedData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', 5)
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.likelihood))
      .style('fill', d => color(d.topic))
      .style('opacity', d => activeTopics[d.topic] ? 1 : 0)
      .on('mouseover', (event, d) => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`
          <strong>${d.topic}</strong><br/>
          Likelihood: ${d.likelihood.toFixed(2)}<br/>
          Date: ${format(d.date, 'MMM d, yyyy HH:mm:ss')}
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        d3.select(tooltipRef.current).transition().duration(500).style('opacity', 0);
      });

    // Add X axis label
    svg.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.top})`)
      .style("text-anchor", "middle")
      .text("Date");

    // Add Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Likelihood");

    // Add a title
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Likelihood Over Time by Topic");

    // Create three-column legend
    const topics = color.domain();
    const itemsPerColumn = Math.ceil(topics.length / 3);
    const legendItemHeight = 25;
    const columnWidth = 80; // Reduced column width for more compact layout

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width + 20}, 0)`);

    topics.forEach((topic, i) => {
      const column = Math.floor(i / itemsPerColumn);
      const row = i % itemsPerColumn;

      const legendItem = legend.append('g')
        .attr('class', 'legend-item')
        .attr('transform', `translate(${column * columnWidth}, ${row * legendItemHeight})`);

      legendItem.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color(topic))
        .style('opacity', activeTopics[topic] ? 1 : 0.3)
        .style('cursor', 'pointer')
        .on('click', () => {
          setActiveTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
        });

      legendItem.append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'start')
        .style('font-size', '12px') // Slightly smaller font for better fit
        .text(topic);
    });

  }, [data, activeTopics]);

  return (
    <div className="relative w-full h-[600px] p-4 bg-gray-50 rounded-lg shadow-md overflow-hidden">
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef} className="absolute opacity-0 bg-white p-2 rounded shadow-lg border border-gray-200"></div>
    </div>
  );
};

export default LikelihoodChart; 