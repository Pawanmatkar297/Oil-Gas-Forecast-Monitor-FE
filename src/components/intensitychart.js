import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const IntensityChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 70, right: 150, bottom: 120, left: 90 };
    const width = 1300 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

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
        intensity: d.intensity,
        topic: d.topic
      }))
      .sort((a, b) => a.date - b.date);

    // Create scales
    const x = d3.scaleTime()
      .domain(d3.extent(processedData, d => d.date))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.intensity)])
      .range([height, 0]);

    // Create and add the axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(d3.timeMonth.every(1))
        .tickFormat(d3.timeFormat("%b %Y")))
      .selectAll("text")  
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("font-size", "12px");

    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px");

    // Create a color scale for topics
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add the scatter plot with animated entrance
    svg.selectAll('.dot')
      .data(processedData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', 0)
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.intensity))
      .style('fill', d => color(d.topic))
      .style('opacity', 0.7)
      .transition()
      .duration(1000)
      .attr('r', 5);

    // Add interactivity
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    svg.selectAll('.dot')
      .on('mouseover', function(event, d) {
        d3.select(this).transition()
          .duration(100)
          .attr('r', 8)
          .style('opacity', 1);
        tooltip.transition()
          .duration(100)
          .style('opacity', .9);
        tooltip.html(`Topic: ${d.topic}<br/>Intensity: ${d.intensity}<br/>Date: ${d.date.toDateString()}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).transition()
          .duration(100)
          .attr('r', 5)
          .style('opacity', 0.7);
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Add a trend line
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.intensity))
      .curve(d3.curveBasis);

    svg.append("path")
      .datum(processedData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add X axis label
    svg.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.top})`)
      .style("text-anchor", "middle")
      .text("Date")
      .style("font-size", "16px")
      .style("font-weight", "bold");

    // Add Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Intensity")
      .style("font-size", "16px")
      .style("font-weight", "bold");

    // Add a title
    svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "24px") 
      .style("font-weight", "bold")
      .text("Intensity Over Time by Topic");

    // Add a three-column legend
    const legendData = color.domain();
    const legendItemHeight = 20;
    const legendItemWidth = 100;
    const legendColumns = 3;

    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + 20}, 0)`);

    const legendItems = legend.selectAll(".legend-item")
      .data(legendData)
      .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => {
        const column = i % legendColumns;
        const row = Math.floor(i / legendColumns);
        return `translate(${column * legendItemWidth}, ${row * legendItemHeight})`;
      });

    legendItems.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", color);

    legendItems.append("text")
      .attr("x", 20)
      .attr("y", 7.5)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(d => d)
      .style("font-size", "10px");

  }, [data]);

  return (
    <div className="intensity-chart">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default IntensityChart;