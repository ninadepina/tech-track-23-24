<script>
    export let data;
    const { flights } = data;
</script>

<h1>Test</h1>
<h2>First arriving flight: {flights.arrival.flightName}</h2>
<h2>First departing flight: {flights.departure.flightName}</h2>
