<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    // prettier-ignore
    const airportData = [
        { airport: 'IST', passengers: 64.5 },
        { airport: 'LHR', passengers: 61.6 },
        { airport: 'CDG', passengers: 57.5 },
        { airport: 'AMS', passengers: 52.5 },
        { airport: 'MAD', passengers: 50.6 }
    ];

    let tooltip;

    onMount(async () => {
        const width = 250;
        const height = 250;
        const margin = { top: 20, right: 20, bottom: 40, left: 55 };
        const tooltipSelection = d3.select(tooltip);

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
            )
            .on('mouseover', (e, d) => {
                const bar = d3.select(e.currentTarget);
                const barX = parseFloat(bar.attr('x')) + xScale.bandwidth();
                const barY = parseFloat(bar.attr('y'));

                bar.attr('fill', (d) => (d.airport === 'AMS' ? '#789eb0' : 'rgba(0,0,0,0.4)'));

                tooltipSelection
                    .style('opacity', 1)
                    .style('left', barX + 13.5 + 'px')
                    .style('top', barY - 10 + 'px')
                    .html(`${d.passengers}M`);
            })
            .on('mouseout', (e) => {
                const bar = d3.select(e.currentTarget);
                bar.attr('fill', (d) => (d.airport === 'AMS' ? '#abe1fb' : 'lightgrey'));
                tooltipSelection.style('opacity', 0);
            });

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

<div class="container">
    <div id="bar" />
    <div id="tooltip" bind:this={tooltip} class="tooltip" />
</div>

<style>
    .container {
        position: relative;
    }

    #bar {
        z-index: 1111 !important;
    }

    .tooltip {
        opacity: 0;
        position: absolute;
        text-align: left;
        padding: 4px;
        font-size: 0.6em;
        border: 1px solid #000;
        border-radius: 4px;
        pointer-events: none;
        z-index: 1112 !important;
    }
</style>
