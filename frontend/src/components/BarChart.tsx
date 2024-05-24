import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface BarChartProps {
    data: { country: string; co2: number }[];
    title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (data.length === 0) return;

        const svg = d3.select(svgRef.current);
        const margin = { top: 50, right: 30, bottom: 100, left: 80 };
        const width = 700 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        svg.selectAll('*').remove();

        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleBand()
            .domain(data.map(d => d.country))
            .range([0, width])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.co2) || 0])
            .nice()
            .range([height, 0]);

        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
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
            .attr('x', d => x(d.country)!)
            .attr('y', d => y(d.co2))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.co2))
            .on('mouseover', (event, d) => {
                tooltip
                    .style('display', 'block')
                    .html(`Country: ${d.country}<br>CO2: ${d.co2}`);
            })
            .on('mousemove', event => {
                tooltip
                    .style('left', `${event.pageX + 5}px`)
                    .style('top', `${event.pageY - 28}px`);
            })
            .on('mouseout', () => {
                tooltip.style('display', 'none');
            });

        svg.append('text')
            .attr('x', (width + margin.left + margin.right) / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('text-decoration', 'underline')
            .text(title);
    }, [data, title]);

    return (
        <svg
            ref={svgRef}
            width={700}
            height={500}
            style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
        />
    );
};

export default BarChart;
