<script>
    import { onMount } from 'svelte';
    import { map } from '$lib/renderMap.js';
    import { observe } from '$lib/intersectionObserver.js';
    import BarChart from '$lib/BarChart.svelte';
    import LayerSwitchButton from '$lib/LayerSwitchButton.svelte';
    import StyleSwitchButton from '$lib/StyleSwitchButton.svelte';
    import Search from '$lib/Search.svelte';
    import Map from '$lib/Map.svelte';

    let labelsLayer = ['Dots', 'Lines'];

    let dotsActive = true;
    let linesActive = false;
    // prettier-ignore
    const toggleLayer = (oldLayer, newLayer) => {
        const layerMap = {
            Dots: 'other-dots',
            Lines: 'lines-layer'
        };

        const visibilityMap = {
            Dots: dotsActive,
            Lines: linesActive
        };

        visibilityMap[oldLayer] = false;
        visibilityMap[newLayer] = true;

        map.setLayoutProperty(layerMap['Dots'], 'visibility', visibilityMap['Dots'] ? 'visible' : 'none');
        map.setLayoutProperty(layerMap['Lines'], 'visibility', visibilityMap['Lines'] ? 'visible' : 'none');
    };
    // prettier-ignore
    onMount(() => {
        const scaleControl = document.querySelector('.mapboxgl-ctrl.mapboxgl-ctrl-scale');

        document.querySelector('.mapboxgl-ctrl-bottom-left').removeChild(scaleControl);
        document.querySelector('.mapboxgl-ctrl-bottom-right').appendChild(scaleControl);

        // intersection observer
        const faders = document.querySelectorAll('#intro section:not(:first-of-type)');
        observe(faders);

        // line path animation
        const introContainer = document.querySelector('#intro');
        const button = document.querySelector('section.seven button');

        sessionStorage.getItem('seenIntro') === 'true'
            ? introContainer.classList.remove('show')
            : introContainer.classList.add('show');

        button.addEventListener('click', () => {
            sessionStorage.setItem("seenIntro", "true");
            introContainer.classList.remove('show');
        });

        let path = document.querySelector('path');
        let pathLength = path.getTotalLength();

        path.style.strokeDasharray = pathLength + ' ' + pathLength;
        path.style.strokeDashoffset = pathLength;

        window.addEventListener('scroll', () => {
            const scrollPercentage = 
                (document.documentElement.scrollTop + document.body.scrollTop) /
                (document.documentElement.scrollHeight - document.documentElement.clientHeight);

            const drawLength = pathLength * scrollPercentage;

            path.style.strokeDashoffset = pathLength - drawLength;
        });

        // layer style switcher
        const layerList = document.getElementById('menu');
        const inputs = layerList.getElementsByTagName('input');

        for (const input of inputs) {
            input.addEventListener('click', (e) => {
                const layerId = e.target.id;
                const currentLayerUrl = map.getStyle().sprite.split('/');

                if (currentLayerUrl[currentLayerUrl.length - 1] !== layerId) {
                    map.setStyle('mapbox://styles/mapbox/' + layerId);
                    document.querySelector('#radio-Dots').checked = true;
                }
            });
        }
    });
</script>

<svelte:head>
    <!-- prettier-ignore -->
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
    <title>Schiphol</title>
</svelte:head>

<div id="intro">
    <div class="line-container">
        <svg viewBox="0 0 726 2226" fill="none" preserveAspectRatio="xMidYMax meet">
            <path
                d="M315.953 67.7539L260.952 40.2547C217.952 20.2547 114.352 -13.7453 43.9518 10.2547C-44.0482 40.2547 -3.54819 202.254 260.952 342.254C525.452 482.254 567.953 581.254 552.953 626.254C544.591 651.34 471.453 660.754 487.453 598.254C495.389 567.254 531.834 545.69 567.953 550.754C649.286 577.421 787.553 679.454 689.953 874.254C638.953 962.754 601.953 962.254 584.953 960.754C567.953 959.254 501.953 850.754 451.453 850.754C400.953 850.754 364.953 920.754 332.953 922.254C300.953 923.754 299.453 892.754 276.953 890.254C254.453 887.754 234.953 898.754 229.953 887.254C224.953 875.754 231.953 860.754 226.453 858.754C220.953 856.754 203.453 870.254 196.453 877.254C189.453 884.254 183.953 892.754 180.953 892.254C177.953 891.754 164.953 862.754 152.453 847.754C139.953 832.754 114.953 798.754 116.953 793.754C118.953 788.754 265.453 820.754 267.953 824.254C270.453 827.754 261.453 825.754 254.453 831.754C247.453 837.754 244.453 842.754 241.453 842.754C238.453 842.754 180.953 816.754 161.953 808.754C142.953 800.754 130.453 796.254 128.953 797.754C127.453 799.254 155.953 818.754 187.953 834.254C219.953 849.754 230.453 852.754 232.953 856.754C237.016 863.254 235.853 883.254 237.453 883.254C241.453 883.254 244.453 856.354 244.453 848.754C241.453 842.754 173.053 811.154 99.4531 784.754C7.45312 751.754 -69.2147 949.529 161.953 1051.75C360.953 1139.75 428.453 1170.25 441.453 1221.75C451.302 1318.34 467.2 1522.9 452 1568.5C433 1625.5 415 1546.5 416.5 1534C418 1521.5 433.5 1349 402.5 1337C371.5 1325 309.5 1342.5 306.5 1301.5C303.5 1260.5 311 1235.5 286.5 1237.5C262 1239.5 266 1250 265.5 1272.5C265 1295 267 1301.5 259 1301.5C251 1301.5 250 1294 250 1260C250 1226 259.5 1222 283 1223.5C306.5 1225 321.5 1223.5 321.5 1265C321.5 1306.5 317 1307 329 1308.5C341 1310 361.5 1308 372.5 1310.5C383.5 1313 395.5 1312.5 396 1310.5C396.5 1308.5 387 1304.5 371 1303C355 1301.5 226 1299.5 214 1324C202 1348.5 205.5 1353.5 207.5 1398C209.5 1442.5 202.5 1526 203 1534C203.5 1542 202.5 1550.5 214 1553.5C225.5 1556.5 239.5 1563 244.5 1565.5C249.5 1568 260 1573.5 261.5 1563.5C263 1553.5 262 1507.5 260 1495.5C258 1483.5 253.5 1395 258.5 1379.5C263.5 1364 256.5 1319 296.5 1321.5C336.5 1324 429 1310 432.5 1327.5C436 1345 437 1410 436.5 1426C436 1442 435 1519 435 1525C435 1531 436.5 1572 422 1574.5C407.5 1577 395 1581 396 1590C397 1599 405 1602.5 410 1602C415 1601.5 423 1596 423.5 1587.5C424 1579 419.5 1572.5 406 1572.5C392.5 1572.5 320.5 1591.5 296 1589C271.5 1586.5 244.5 1578.5 227.5 1568.5C210.5 1558.5 210 1560.5 208.5 1562C207 1563.5 209.5 1574 217.5 1578C225.5 1582 241.5 1587 241.5 1592C241.5 1597 236.5 1601.5 229.5 1601C222.5 1600.5 217.5 1595.5 217.5 1587.5C217.5 1579.5 222.5 1577.5 225.5 1578C228.5 1578.5 267.5 1598 278.5 1598C289.5 1598 297 1602.5 296 1613C295 1623.5 288.5 1628.5 282.5 1627.5C276.5 1626.5 272 1622 272.5 1615.5C273 1609 278 1602 286 1602C290.833 1602.17 299.9 1605.4 297.5 1617C295.1 1628.6 291.5 1640.83 290 1645.5C264.667 1671.5 207.4 1711.6 203 1758C195.034 1842 265.715 1901.88 278.5 1975C299.355 2094.27 266.592 2165.38 181.5 2224.45"
                stroke="black"
                stroke-width="3"
            />
        </svg>
    </div>

    <section class="one">
        <div>
            <h2>Schiphol Hub</h2>
            <p>A 3D map that displays all of Schiphol's destinations.</p>
        </div>
        <div>
            <img src="paper-airplane.png" alt="throwing paper airplane illustration" />
        </div>
    </section>

    <section class="two">
        <p>
            Welcome to Schiphol Airport (AMS), the primary international airport
            of the Netherlands. A bustling hub near Amsterdam, Schiphol connects
            travellers worldwide with efficient services and modern facilities
            since 1916.
        </p>
    </section>

    <section class="three">
        <p>In 2022, Schiphol welcomed 52.5 million passengers...</p>
    </section>

    <section class="four">
        <p>...which made it the 4th busiest airport in Europe that year...</p>
    </section>

    <section class="five">
        <p>
            ...with only Istanbul Airport (IST), London Heathrow (LHR) and Paris
            Charles de Gaulle (CDG) welcoming more passengers.
        </p>
    </section>

    <section class="six">
        <BarChart />
    </section>

    <section class="seven">
        <button>Explore all of Schiphol’s destinations</button>
        <img src="bubble.png" alt="bubble" />
    </section>
</div>

<div id="mapInfo">
    <div class="header">
        <h1>Upcoming flights from/to Schiphol</h1>
        <Search />
    </div>
    <div class="switches">
        <LayerSwitchButton {labelsLayer} {toggleLayer} />
        <StyleSwitchButton />
    </div>
</div>
<Map />

<style>
    #intro {
        display: none;
        position: absolute;
        inset: 0;
        background-color: var(--color-light);
        z-index: 999;
    }

    #intro section:not(:first-of-type) {
        opacity: 0;
        transform: translateY(10%);
        transition: opacity 150ms ease-in, transform 250ms ease-in;
    }

    .line-container {
        position: absolute;
        top: 28.2em;
        left: 18%;
        width: 80%;
        height: 200%;
        text-align: center;
        overflow: hidden;
    }

    svg {
        display: inline-block;
        height: 100%;
    }

    h2 {
        font-family: var(--font-family-title);
        font-size: 5em;
        line-height: 1em;
    }

    p,
    button {
        font-family: var(--font-family);
        text-align: center;
    }
    section:not(section.one) p,
    button {
        font-size: 1.2em;
    }

    button {
        border: none;
        background-color: transparent;
    }

    /* section one */
    section.one {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 102vh;
        padding-top: 7.8em;
    }

    section.one > div:first-of-type {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    section.one > div:last-of-type {
        margin-left: 54.3vw;
        overflow: hidden;
    }

    section.one p {
        max-width: 14em;
        font-size: 2em;
    }

    section.one img {
        width: 39%;
        min-width: 555.75px;
        overflow-x: visible;
    }

    /* section two */
    section.two {
        padding: 2% 0 18% 20%;
    }

    section.two p {
        max-width: 34%;
    }

    /* section three */
    section.three {
        padding: 2% 0 2% 30%;
    }

    section.three p {
        max-width: 20%;
    }

    /* section four */
    section.four {
        display: flex;
        justify-content: end;
        padding: 3% 13% 4% 0;
    }

    section.four p {
        max-width: 18%;
    }

    /* section five */
    section.five {
        padding: 4% 0 0 20%;
    }

    section.five p {
        max-width: 25%;
    }

    /* section six */
    section.six {
        display: flex;
        justify-content: end;
        margin: -2% 0;
        padding-right: 12%;
    }

    /* section seven */
    section.seven {
        position: relative;
        width: fit-content;
        margin: 4em 0 0 30%;
        padding-bottom: 10em;
    }

    section.seven button {
        display: block;
        max-width: 67%;
        padding: 0.6em 1em;
        text-align: center;
        background-color: #d3effb;
        border-radius: 6px;
        cursor: pointer;
    }
    section.seven button:hover {
        color: #fff;
        background-color: var(--color-dark);
        outline: 2px solid var(--color-dark);
    }
    section.seven button:focus-visible {
        outline: 2px solid var(--color-dark);
    }

    section.seven img {
        position: absolute;
        top: -4.7em;
        left: 0;
        width: 66%;
        z-index: -1;
    }

    #mapInfo {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: fit-content;
        height: 100svh;
    }

    #mapInfo > div {
        width: fit-content;
        z-index: 1;
    }

    .header {
        display: flex;
        flex-direction: column;
    }

    h1 {
        position: relative;
        display: inline-block;
        width: var(--searchbar-width);
        margin: var(--standard-margin);
        padding: 0.4em 0.4em 0.2em 0.4em;
        font-family: var(--font-family-title);
        font-size: 2.4em;
        line-height: 1em;
        word-wrap: break-word;
        text-align: center;
        color: var(--color-dark);
        background-color: var(--color-light);
        border-radius: var(--border-radius);
        z-index: 1;
    }

    .switches {
        display: flex;
        gap: var(--standard-margin);
        margin: 0 0 var(--standard-margin) var(--standard-margin);
    }

    @media screen and (max-width: 450px) {
        .switches {
            flex-direction: column;
        }
    }
</style>
