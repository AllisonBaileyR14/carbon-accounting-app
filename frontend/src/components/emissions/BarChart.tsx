import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface BarChartProps {
    data: { country: string; co2: number; sector: string; year: number }[];
    title: string;
    width: number;
    height: number;
    selectedYear: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, title, width, height, selectedYear }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (data.length === 0) return;

        const svg = d3.select(svgRef.current);
        const margin = { top: 50, right: 30, bottom: 100, left: 80 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        svg.selectAll('*').remove();

        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleBand()
            .domain(data.map(d => `${d.country} (${d.sector})`))
            .range([0, chartWidth])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.co2) || 0])
            .nice()
            .range([chartHeight, 0]);

        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${chartHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        g.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));

        const tooltip = d3
            .select('body')
            .append('div')
            .style('position', 'absolute')
            .style('background', 'white')
            .style('border', '1px solid #ddd')
            .style('padding', '5px')
            .style('display', 'none');

        g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(`${d.country} (${d.sector})`) as number)
            .attr('y', d => y(d.co2) as number)
            .attr('width', x.bandwidth())
            .attr('height', d => chartHeight - y(d.co2))
            .on('mouseover', (event, d) => {
                tooltip
                    .style('display', 'block')
                    .html(`Country: ${d.country}<br>Sector: ${d.sector}<br>CO2: ${d.co2}`);
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

        // Adding a line to indicate the selected year
        if (selectedYear) {
            g.append('line')
                .attr('x1', 0)
                .attr('x2', chartWidth)
                .attr('y1', y(selectedYear))
                .attr('y2', y(selectedYear))
                .attr('stroke', 'black')
                .attr('stroke-dasharray', '4')
                .attr('stroke-width', 2);
        }

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

export default BarChart;
