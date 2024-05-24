import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface BarChartProps {
    data: { country: string; co2: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear any previous content

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const x = d3
            .scaleBand()
            .domain(data.map(d => d.country))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.co2) as number])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const xAxis = (g: any) =>
            g
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).tickSizeOuter(0));

        const yAxis = (g: any) =>
            g.attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

        svg.append('g').call(xAxis);
        svg.append('g').call(yAxis);

        svg
            .append('g')
            .selectAll('rect')
            .data(data)
            .join('rect')
            .attr('x', d => x(d.country) as number)
            .attr('y', d => y(d.co2))
            .attr('height', d => y(0) - y(d.co2))
            .attr('width', x.bandwidth())
            .attr('fill', 'steelblue');
    }, [data]);

    return <svg ref={svgRef} width="800" height="400" />;
};

export default BarChart;
