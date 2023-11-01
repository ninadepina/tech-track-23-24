<script>
    import Map from '$lib/Map.svelte';
    import SwitchButton from '$lib/SwitchButton.svelte';
</script>

<svelte:head>
    <!-- prettier-ignore -->
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
    <title>Schiphol</title>
</svelte:head>

<h1>Schiphol destinations</h1>
<SwitchButton label1="Dots" label2="Lines" />
<Map />

<style>
    h1 {
        position: relative;
        display: inline-block;
        margin: var(--standard-margin);
        padding: 0.1em 0.4em;
        font-weight: var(--font-weight-title);
        color: var(--color-dark);
        background-color: var(--color-light);
        border-radius: var(--border-radius);
        z-index: 1;
    }
</style>
