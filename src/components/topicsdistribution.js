import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TopicsDistribution = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 50, right: 50, bottom: 100, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Count occurrences of each topic
    const topicCounts = d3.rollup(data, v => v.length, d => d.topic);

    // Convert Map to array of objects and sort by count
    let sortedData = Array.from(topicCounts, ([key, value]) => ({ topic: key, count: value }))
      .sort((a, b) => b.count - a.count);

    // Take top 9 topics and sum the rest as "Other"
    if (sortedData.length > 9) {
      const topNine = sortedData.slice(0, 9);
      const otherCount = sortedData.slice(9).reduce((sum, item) => sum + item.count, 0);
      sortedData = [...topNine, { topic: 'Other', count: otherCount }];
    }

    // X axis
    const x = d3.scaleBand()
      .range([0, width])
      .domain(sortedData.map(d => d.topic))
      .padding(0.3);
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px");

    // Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.count) * 1.1]) // Add 10% padding to the top
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px");

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(sortedData.map(d => d.topic))
      .range(d3.schemeCategory10);

    // Bars
    svg.selectAll("mybar")
      .data(sortedData)
      .enter()
      .append("rect")
        .attr("x", d => x(d.topic))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("fill", d => color(d.topic))
        .attr("rx", 5) // Rounded corners
        .attr("ry", 5);

    // Labels
    svg.selectAll(".label")
      .data(sortedData)
      .enter()
      .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.topic) + x.bandwidth() / 2)
        .attr("y", d => y(d.count) - 10)
        .attr("text-anchor", "middle")
        .text(d => d.count)
        .style("font-size", "12px")
        .style("font-weight", "bold");

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text("Top Topics Distribution");

    // X axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Topics");

    // Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (height / 2))
      .attr("y", 0 - margin.left + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Count");

  }, [data]);

  return (
    <div className="topics-distribution" style={{ overflow: 'auto', padding: '20px' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default TopicsDistribution;