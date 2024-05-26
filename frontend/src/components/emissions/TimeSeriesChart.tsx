import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface TimeSeriesChartProps {
    data: { year: number; country: string; co2: number }[];
    title: string;
    width: number;
    height: number;
    selectedYear: number;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, title, width, height, selectedYear }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (data.length === 0) return;

        const svg = d3.select(svgRef.current);
        const margin = { top: 50, right: 30, bottom: 100, left: 80 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        svg.selectAll('*').remove();

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear()
            .domain([2015, d3.max(data, d => d.year) || 2023])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.co2) || 0])
            .nice()
            .range([innerHeight, 0]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(data.map(d => d.country));

        const line = d3.line<{ year: number; country: string; co2: number }>()
            .x(d => xScale(d.year))
            .y(d => yScale(d.co2))
            .curve(d3.curveMonotoneX);

        const nestedData = Array.from(d3.group(data, d => d.country).entries());

        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));

        g.append('g')
            .call(d3.axisLeft(yScale));

        const countryLines = g.selectAll('.country-line')
            .data(nestedData)
            .enter()
            .append('g')
            .attr('class', 'country-line');

        countryLines.append('path')
            .attr('fill', 'none')
            .attr('stroke', ([country]) => colorScale(country) as string)
            .attr('stroke-width', 2)
            .attr('d', ([, values]) => line(values as { year: number; country: string; co2: number }[]));

        // Add selected year line
        g.append('line')
            .attr('x1', xScale(selectedYear))
            .attr('x2', xScale(selectedYear))
            .attr('y1', 0)
            .attr('y2', innerHeight)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4 4');

        // Add title
        svg.append('text')
            .attr('x', (width + margin.left + margin.right) / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('text-decoration', 'underline')
            .text(title);

        // Add legend
        const legend = svg.append('g')
            .attr('transform', `translate(${width - margin.right - 10},${margin.top})`);

        nestedData.forEach(([country], index) => {
            const legendRow = legend.append('g')
                .attr('transform', `translate(0, ${index * 20})`);

            legendRow.append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', colorScale(country) as string);

            legendRow.append('text')
                .attr('x', 20)
                .attr('y', 10)
                .attr('text-anchor', 'start')
                .style('font-size', '12px')
                .text(country);
        });
    }, [data, title, width, height, selectedYear]);

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
