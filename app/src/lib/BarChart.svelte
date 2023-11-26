<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    const airportData = [
        {
            airport: 'IST',
            passengers: 64.5
        },
        {
            airport: 'LHR',
            passengers: 61.6
        },
        {
            airport: 'CDG',
            passengers: 57.5
        },
        {
            airport: 'AMS',
            passengers: 52.5
        },
        {
            airport: 'MAD',
            passengers: 50.6
        }
    ];

    onMount(async () => {
        const width = 250;
        const height = 250;
        const margin = { top: 20, right: 20, bottom: 40, left: 55 };

        const svg = d3
            .select('#bar')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr(
                'transform',
                'translate(' + margin.left + ',' + margin.top + ')'
            );

        const xScale = d3
            .scaleBand()
            .domain(airportData.map((d) => d.airport))
            .range([0, width])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(airportData, (d) => d.passengers)])
            .range([height, 0]);

        // draw bars
        svg.selectAll('rect')
            .data(airportData)
            .enter()
            .append('rect')
            .attr('x', (d) => xScale(d.airport))
            .attr('y', (d) => yScale(d.passengers))
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => height - yScale(d.passengers))
            .attr('fill', (d) =>
                d.airport === 'AMS' ? '#abe1fb' : 'lightgrey'
            );

        // draw x-axis
        svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(xScale));

        // draw y-axis
        svg.append('g').call(d3.axisLeft(yScale).tickFormat((d) => d + 'M'));

        // x-axis title
        svg.append('text')
            .attr('x', width / 1.35)
            .attr('y', height + margin.bottom - 10)
            .attr('text-anchor', 'right')
            .style('font-size', '0.6em')
            .style('font-style', 'italic')
            .style('fill', 'grey')
            .text('Airports (iata)');

        // y-axis title
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2.2)
            .attr('y', -margin.left + 15)
            .attr('text-anchor', 'right')
            .style('font-size', '0.6em')
            .style('font-style', 'italic')
            .style('fill', 'grey')
            .text('Passengers (in millions)');
    });
</script>

<div id="bar" />
