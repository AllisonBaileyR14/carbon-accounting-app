import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface PieChartProps {
    data: { sector: string; co2: number }[];
    width: number;
    height: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, width, height }) => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!data.length) return;

        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const radius = Math.min(width, height) / 2;
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const arc = d3
            .arc<d3.PieArcDatum<{ sector: string; co2: number }>>()
            .innerRadius(0)
            .outerRadius(radius);

        const pie = d3
            .pie<{ sector: string; co2: number }>()
            .value(d => d.co2);

        const arcs = svg
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`)
            .selectAll('arc')
            .data(pie(data))
            .enter()
            .append('g');

        arcs
            .append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.sector))
            .append('title')
            .text(d => `${d.data.sector}: ${d.data.co2.toLocaleString()} CO2`);

        arcs
            .append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .text(d => d.data.sector)
            .style('fill', 'white')
            .style('font-size', '12px');
    }, [data, width, height]);

    return <svg ref={ref} width={width} height={height}></svg>;
};

export default PieChart;
