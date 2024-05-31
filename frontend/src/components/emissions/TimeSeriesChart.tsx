import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface TimeSeriesChartProps {
    data: { country: string; year: number; sector: string; co2: number }[];
    title: string;
    width: number;
    height: number;
    selectedYear: number;
    selectedSector: string;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, title, width, height, selectedYear, selectedSector }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (data.length === 0) return;

        const svg = d3.select(svgRef.current);
        const margin = { top: 50, right: 30, bottom: 50, left: 80 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        svg.selectAll('*').remove();

        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const allYears = data.map(d => d.year);
        const uniqueYears = Array.from(new Set(allYears));

        const x = d3
            .scaleTime()
            .domain([new Date(Math.min(...uniqueYears), 0, 1), new Date(Math.max(...uniqueYears), 0, 1)])
            .range([0, chartWidth]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.co2) || 0])
            .nice()
            .range([chartHeight, 0]);

        const line = d3
            .line<{ country: string; year: number; sector: string; co2: number }>()
            .x(d => x(new Date(d.year, 0, 1)))
            .y(d => y(d.co2));

        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${chartHeight})`)
            .call(d3.axisBottom(x).ticks(d3.timeYear.every(1)));

        g.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));

        const filteredData = data.filter(d => d.sector === selectedSector);

        const groupedData = d3.group(filteredData, d => d.country);

        groupedData.forEach((values, key) => {
            g.append('path')
                .datum(values)
                .attr('class', 'line')
                .attr('d', line as any)
                .style('stroke', d3.schemeCategory10[Math.floor(Math.random() * 10)])
                .style('fill', 'none')
                .style('stroke-width', 2);
        });

        const tooltip = d3
            .select('body')
            .append('div')
            .style('position', 'absolute')
            .style('background', 'white')
            .style('border', '1px solid #ddd')
            .style('padding', '5px')
            .style('display', 'none');

        g.selectAll('.dot')
            .data(filteredData)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(new Date(d.year, 0, 1)))
            .attr('cy', d => y(d.co2))
            .attr('r', 3)
            .on('mouseover', (event, d) => {
                tooltip
                    .style('display', 'block')
                    .html(`Country: ${d.country}<br>Sector: ${d.sector}<br>Year: ${d.year}<br>CO2: ${d.co2}`);
            })
            .on('mousemove', event => {
                tooltip
                    .style('left', `${event.pageX + 5}px`)
                    .style('top', `${event.pageY - 28}px`);
            })
            .on('mouseout', () => {
                tooltip.style('display', 'none');
            });

        // Adding title
        svg.append('text')
            .attr('x', (chartWidth + margin.left + margin.right) / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('text-decoration', 'underline')
            .text(title);

    }, [data, title, width, height, selectedYear, selectedSector]);

    return (
        <svg
            ref={svgRef}
            width={width}
            height={height}
            style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
        />
    );
};

export default TimeSeriesChart;
