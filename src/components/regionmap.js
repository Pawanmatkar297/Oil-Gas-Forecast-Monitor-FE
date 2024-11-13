import React, { useEffect, useRef, useState } from 'react';
import { select, json, geoPath, geoMercator, scaleSequential, max, interpolateYlOrRd, axisBottom, scaleLinear, zoom, scaleBand, axisLeft } from 'd3';

const worldMapUrl = process.env.PUBLIC_URL + '/world.geojson';

const RegionMap = ({ data }) => {
  const svgRef = useRef();
  const [worldData, setWorldData] = useState(null);

  useEffect(() => {
    json(worldMapUrl).then(setWorldData);
  }, []);

  useEffect(() => {
    if (!worldData || !data) return;

    const width = 960;
    const height = 1000; // Increased height to accommodate both map and heat chart
    const mapHeight = 600; // Increased height for the map
    const heatChartHeight = 300; // Increased height for the heat chart

    // Clear any existing SVG content
    select(svgRef.current).selectAll("*").remove();

    const svg = select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

    const g = svg.append('g');

    const projection = geoMercator()
      .scale(140)
      .translate([width / 2, mapHeight / 2]);

    const path = geoPath(projection);

    // Function to map region names to GeoJSON properties
    const mapRegionToProperty = (region) => {
      const regionMappings = {
        'Northern America': ['United States of America', 'Canada', 'Mexico'],
        'Europe': ['Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Russia', 'Ukraine', 'Poland', 'Romania', 'Netherlands'],
        'Asia': ['China', 'India', 'Japan', 'South Korea', 'Indonesia', 'Pakistan', 'Bangladesh', 'Vietnam', 'Thailand', 'Malaysia'],
        'Africa': ['Nigeria', 'Ethiopia', 'Egypt', 'Democratic Republic of the Congo', 'South Africa', 'Kenya', 'Tanzania', 'Algeria', 'Sudan', 'Uganda'],
        'South America': ['Brazil', 'Colombia', 'Argentina', 'Peru', 'Venezuela', 'Chile', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay'],
        'Oceania': ['Australia', 'New Zealand', 'Papua New Guinea', 'Fiji', 'Solomon Islands', 'Vanuatu', 'New Caledonia', 'French Polynesia', 'Samoa', 'Tonga'],
        'Central America': ['Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama', 'Belize'],
        'Caribbean': ['Cuba', 'Haiti', 'Dominican Republic', 'Jamaica', 'Trinidad and Tobago', 'Bahamas', 'Barbados', 'Saint Lucia', 'Grenada', 'Antigua and Barbuda'],
        'Middle East': ['Saudi Arabia', 'Iran', 'Turkey', 'Iraq', 'Israel', 'United Arab Emirates', 'Lebanon', 'Jordan', 'Kuwait', 'Oman']
      };

      return (feature) => {
        const countryName = feature.properties.ADMIN;
        const countryCode = feature.properties.ISO_A3;

        if (regionMappings[region] && regionMappings[region].includes(countryName)) {
          return true;
        }

        const matchesAdmin = countryName.toLowerCase() === region.toLowerCase();
        const matchesISO = countryCode.toLowerCase() === region.toLowerCase();

        return matchesAdmin || matchesISO;
      };
    };

    // Aggregate data by region
    const regionData = new Map();
    data.forEach(d => {
      const currentValue = regionData.get(d.region) || 0;
      regionData.set(d.region, currentValue + (Number(d.intensity) || 0));
    });

    const colorScale = scaleSequential(interpolateYlOrRd)
      .domain([0, max(Array.from(regionData.values())) || 1]);

    g.selectAll('path')
      .data(worldData.features)
      .enter().append('path')
      .attr('d', path)
      .attr('fill', d => {
        const matchingRegion = Array.from(regionData.keys()).find(region => mapRegionToProperty(region)(d));
        return matchingRegion ? colorScale(regionData.get(matchingRegion) || 0) : '#ccc';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .on('mouseover', function(event, d) {
        select(this).attr('stroke', '#000').attr('stroke-width', 1.5);
        tooltip.style('visibility', 'visible');
      })
      .on('mousemove', function(event, d) {
        const matchingRegion = Array.from(regionData.keys()).find(region => mapRegionToProperty(region)(d));
        const value = regionData.get(matchingRegion);
        tooltip
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px')
          .text(matchingRegion && value !== undefined
            ? `${d.properties.ADMIN}: ${value.toFixed(2)}`
            : `${d.properties.ADMIN}: No data`);
      })
      .on('mouseout', function() {
        select(this).attr('stroke', '#fff').attr('stroke-width', 0.5);
        tooltip.style('visibility', 'hidden');
      });

    // Tooltip
    const tooltip = select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px');

    // Legend
    const legendWidth = 300;
    const legendHeight = 20;
    const legend = svg.append('g')
      .attr('transform', `translate(${width - legendWidth - 10}, ${mapHeight - 40})`);

    const legendScale = scaleLinear()
      .domain(colorScale.domain())
      .range([0, legendWidth]);

    const legendAxis = axisBottom(legendScale)
      .ticks(5)
      .tickSize(legendHeight);

    legend.append('g')
      .call(legendAxis)
      .select('.domain')
      .remove();

    const defs = svg.append('defs');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'linear-gradient');

    linearGradient.selectAll('stop')
      .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale(t) })))
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#linear-gradient)');

    // Add a title
    svg.append("text")
      .attr("x", width / 2)             
      .attr("y", 30)
      .attr("text-anchor", "middle")  
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text("Intensity by Region");

    // Add zoom functionality
    const zoomBehavior = zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Heat Chart
    const heatChartMargin = { top: 20, right: 30, bottom: 30, left: 100 };
    const heatChartWidth = width - heatChartMargin.left - heatChartMargin.right;
    const heatChartInnerHeight = heatChartHeight - heatChartMargin.top - heatChartMargin.bottom;

    const heatChart = svg.append('g')
      .attr('transform', `translate(${heatChartMargin.left}, ${mapHeight + 50})`);

    const sortedRegionData = Array.from(regionData.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Top 10 regions

    const x = scaleLinear()
      .domain([0, max(sortedRegionData, d => d[1])])
      .range([0, heatChartWidth]);

    const y = scaleBand()
      .domain(sortedRegionData.map(d => d[0]))
      .range([0, heatChartInnerHeight])
      .padding(0.1);

    heatChart.selectAll('rect')
      .data(sortedRegionData)
      .enter().append('rect')
      .attr('y', d => y(d[0]))
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d[1]))
      .attr('fill', d => colorScale(d[1]));

    heatChart.append('g')
      .attr('transform', `translate(0, ${heatChartInnerHeight})`)
      .call(axisBottom(x).ticks(5));

    heatChart.append('g')
      .call(axisLeft(y));

    heatChart.append('text')
      .attr('x', heatChartWidth / 2)
      .attr('y', -heatChartMargin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Top 10 Regions by Intensity');

  }, [worldData, data]);

  return (
    <div className="region-map">
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
};

export default RegionMap;
