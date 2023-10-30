<script>
    import LinePlot from '$lib/LinePlot.svelte';
    import * as d3 from 'd3';

    let data = d3.ticks(-2, 2, 200).map(Math.sin);

    function onMousemove(event) {
        const [x, y] = d3.pointer(event);
        data = data.slice(-200).concat(Math.atan2(x, y));
    }
</script>

<svelte:head>
    <title>ninadepina</title>
    <link rel="icon" href="/images/favicon.png" type="image/png" />
</svelte:head>

<h1>ninadepina</h1>

<div role="figure" on:mousemove={onMousemove}>
    <LinePlot {data} />
</div>
