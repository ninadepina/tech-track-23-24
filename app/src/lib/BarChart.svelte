<script>
    import { onMount, afterUpdate } from 'svelte';
    import * as d3 from 'd3';
    // prettier-ignore
    const airportData = [
        { airport: 'IST', passengers: 64.5 },
        { airport: 'LHR', passengers: 61.6 },
        { airport: 'CDG', passengers: 57.5 },
        { airport: 'AMS', passengers: 52.5 },
        { airport: 'MAD', passengers: 50.6 },
        { airport: 'FRA', passengers: 48.9 },
        { airport: 'BCN', passengers: 41.6 },
        { airport: 'LGW', passengers: 32.8 },
        { airport: 'MUC', passengers: 31.6 },
        { airport: 'FCO', passengers: 29.3 }
    ];

    let tooltip;
    let topAirports = 5;
    let selectElement;

    onMount(async () => {
        drawChart();
        selectElement.value = topAirports;
    });

    afterUpdate(() => {
        d3.select('#bar').selectAll('*').remove(); // remove existing chart before redrawing
        drawChart();
        selectElement.value = topAirports;
    });

    const drawChart = () => {
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
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        const filteredData = airportData.slice(0, topAirports);

        const xScale = d3
            .scaleBand()
            .domain(filteredData.map((d) => d.airport))
            .range([0, width])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(filteredData, (d) => d.passengers)])
            .range([height, 0]);

        // draw bars
        svg.selectAll('rect')
            .data(filteredData)
            .enter()
            .append('rect')
            .attr('x', (d) => xScale(d.airport))
            .attr('y', (d) => yScale(d.passengers))
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => height - yScale(d.passengers))
            .attr('fill', (d) => d.airport === 'AMS' ? '#abe1fb' : 'lightgrey')
            .on('mouseover', (e, d) => {
                const bar = d3.select(e.currentTarget);
                const barX = parseFloat(bar.attr('x')) + xScale.bandwidth();
                const barY = parseFloat(bar.attr('y'));

                bar.attr('fill', (d) => d.airport === 'AMS' ? '#789eb0' : 'rgba(0,0,0,0.4)');

                tooltipSelection
                    .style('opacity', 1)
                    .style('left', barX + 13.5 + 'px')
                    .style('top', barY - 10 + 'px')
                    .html(`${d.passengers}M`);
            })
            .on('mouseout', (e) => {
                const bar = d3.select(e.currentTarget);
                bar.attr('fill', (d) => d.airport === 'AMS' ? '#abe1fb' : 'lightgrey');
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
    };
</script>

<div class="container">
    <div id="bar" />
    <div id="tooltip" bind:this={tooltip} class="tooltip" />
    <label for="select">Show Top:</label>
    <div class="select">
        <select id="select" bind:this={selectElement} bind:value={topAirports}>
            <option value="5">Top 5</option>
            <option value="10">Top 10</option>
        </select>
        <span class="focus" />
    </div>
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
        border: 1px solid var(--color-dark);
        border-radius: 4px;
        pointer-events: none;
        z-index: 1112 !important;
    }

    select {
        appearance: none;
        width: 100%;
        margin: 0;
        padding: 0 1em 0 0;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        background-color: transparent;
        border: none;
        outline: none;
        z-index: 1;

        cursor: inherit;
    }
    select::-ms-expand {
        display: none;
    }
    .select {
        position: absolute;
        top: -1em;
        right: 1.8em;
        display: grid;
        grid-template-areas: 'select';
        align-items: center;
        width: fit-content;
        padding: 0.2em 0.4em 0.1em 0.3em;
        font-size: 0.8em;
        line-height: 1.1;
        background-color: #fff;
        background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
        border: 1px solid var(--color-dark);
        border-radius: 0.25em;
        cursor: pointer;
    }
    .select select,
    .select::after {
        grid-area: select;
    }
    .select::after {
        content: '';
        justify-self: end;
        width: 0.4em;
        height: 0.4em;
        margin-top: -0.15em;
        border-color: var(--color-dark);
        border-style: solid;
        border-width: 0.1em 0.1em 0 0;
        transform: rotate(135deg);
    }
    select:active + .focus {
        position: absolute;
        top: -1px;
        left: -1px;
        bottom: -1px;
        right: -1px;
        border: 2px solid #abe1fb;
        border-radius: inherit;
    }

    label {
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        font-size: 0.6em;
        font-weight: 500;
    }
</style>
