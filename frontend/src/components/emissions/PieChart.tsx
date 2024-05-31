import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface PieChartProps {
    data: { sector: string; co2: number }[];
    title: string;
    width: number;
    height: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, title, width, height }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (data.length === 0) return;

        const svg = d3.select(svgRef.current);
        const radius = Math.min(width, height) / 2;
        const g = svg
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie<{ sector: string; co2: number }>()
            .value(d => d.co2);

        const path = d3.arc<d3.PieArcDatum<{ sector: string; co2: number }>>()
            .outerRadius(radius - 10)
            .innerRadius(0);

        const label = d3.arc<d3.PieArcDatum<{ sector: string; co2: number }>>()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        const arc = g.selectAll('.arc')
            .data(pie(data))
            .enter().append('g')
            .attr('class', 'arc');

        arc.append('path')
            .attr('d', path as any)
            .attr('fill', d => color(d.data.sector));

        arc.append('text')
            .attr('transform', d => `translate(${label.centroid(d)})`)
            .attr('dy', '0.35em')
            .text(d => d.data.sector);

        // Adding title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('text-decoration', 'underline')
            .text(title);

    }, [data, title, width, height]);

    return (
        <svg
            ref={svgRef}
            width={width}
            height={height}
            style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
        />
    );
};

export default PieChart;
