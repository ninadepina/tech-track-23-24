<script>
    import { onMount } from 'svelte';
    import { map } from '$lib/renderMap.js';
    import { observe, moveScaleControl, linePathAnimation } from '$lib/utils/visualEl.js';
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

    const changeLayer = () => {
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
    }

    onMount(() => {
        const faders = document.querySelectorAll('#intro section:not(:first-of-type)');
        observe(faders);

        moveScaleControl();
        linePathAnimation();
        changeLayer();
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
            <div class="schipholHub">
                <h2>Schiphol Hub</h2>
                <svg viewBox="0 0 638 998" fill="none">
                    <path d="M43 562H604.5L561 750.5H74.5L43 562Z" fill="white"/>
                    <path d="M261.884 13.6887C244.87 22.1953 229.072 36.1706 217.528 54.3992C201.729 79.3115 199.907 86.6029 201.729 121.845C202.945 143.719 205.983 165.593 209.021 171.062C212.667 178.961 205.375 186.252 176.817 203.873C156.158 216.026 139.752 228.786 139.752 231.824C139.752 235.47 149.474 272.534 161.019 313.852C173.171 355.778 181.07 392.235 179.855 394.666C178.032 397.096 144.613 411.071 105.118 425.654C32.2038 452.997 0 474.264 0 496.746C0 517.405 97.219 883.191 106.333 897.774C111.194 905.066 119.475 916.972 129 926C135 931.687 143.019 936.949 152 943.187C156.519 946.326 168.713 954.103 179.855 960.359C185.51 963.534 194.5 968.187 194.5 968.187C194.5 968.187 241.26 997.203 329.723 997.203C418.185 997.203 434 978.5 443.5 972C447.758 969.087 449.001 967.818 455 963C460.001 958.983 471.512 951.852 480.019 943.953C488.526 936.054 505.539 920.864 517.691 909.927C539.566 890.483 540.781 888.052 588.783 700.298C616.126 595.788 638 505.252 638 497.961C638 474.264 607.011 452.997 532.882 425.654C493.387 411.071 459.968 397.096 458.752 395.273C456.929 392.843 465.436 355.778 477.589 313.245C489.133 270.711 497.64 232.431 495.817 228.178C494.602 223.925 477.589 211.772 458.752 200.835C432.625 185.645 425.333 178.961 428.979 171.062C431.409 165.593 434.448 146.15 435.663 127.313C439.309 89.0334 426.549 57.4372 396.775 29.4868C362.749 -2.71702 308.063 -9.40085 261.884 13.6887ZM441.131 618.27C438.701 644.397 435.055 674.778 433.232 685.715L430.194 705.159L320.215 703.944L210.236 702.121L199.907 644.397C193.83 612.801 188.97 584.85 188.97 582.42C187.754 575.129 214.49 573.306 330.545 572.09L444.777 571.483L441.131 618.27ZM157.981 647.435C164.665 680.247 169.526 707.59 168.918 708.805C162.842 714.273 87.4971 733.717 84.459 730.679C77.7752 723.388 53.4705 619.485 57.1162 615.839C61.3695 610.978 141.575 583.635 144.006 586.066C145.221 586.673 151.297 614.624 157.981 647.435ZM557.794 601.864C571.769 608.548 583.314 616.447 583.314 620.092C583.314 632.852 558.402 726.426 553.541 731.287C551.11 733.717 532.882 730.071 513.438 722.172L478.804 708.805L482.449 663.841C489.741 585.458 490.956 582.42 512.83 587.281C523.16 589.104 543.211 595.788 557.794 601.864Z" fill="black"/>
                </svg>                                       
            </div>
            <p>A 3D map that displays all of Schiphol's destinations.</p>
        </div>
        <div>
            <img src="paper-airplane.png" alt="throwing paper airplane illustration" />
        </div>
        <span class="chevron"></span>
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

    .line-container {
        position: absolute;
        top: 28.15em;
        left: 18%;
        width: 80%;
        height: 200%;
        text-align: center;
        overflow: hidden;
    }

    .line-container svg {
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

    .chevron {
        position: absolute;
        bottom: 2.9375em;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        animation: chevronDown 1.5s infinite;
    }
    .chevron::before {
        content: '';
        display: inline-block;
        position: relative;
        top: 0;
        left: 0.15em;
        width: 0.8em;
        height: 0.8em;
        vertical-align: top;
        border-color: var(--color-dark);
        border-style: solid;
        border-width: 0.25em 0.25em 0 0;
        transform: rotate(135deg);
    }

    /* section one */
    section.one {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 102dvh;
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

    section.one .schipholHub {
        position: relative;
    }

    section.one .schipholHub svg {
        position: absolute;
        top: -32%;
        left: 26.6%;
        width: 6%;
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
        border: 2px solid #d3effb;
        border-radius: 6px;
        transition: background-color 150ms ease-in-out, color 150ms ease-in-out, border 150ms ease-in-out;
        cursor: pointer;
    }
    section.seven button:hover {
        color: #fff;
        background-color: var(--color-dark);
        border: 2px solid var(--color-dark);
    }
    section.seven button:focus-visible {
        border: 2px solid var(--color-dark);
    }

    section.seven img {
        position: absolute;
        top: -4.6em;
        left: 0;
        width: 66%;
        z-index: -1;
    }

    #mapInfo {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: fit-content;
        height: 100dvh;
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

    @media (prefers-reduced-motion: no-preference) {
        #intro section:not(:first-of-type) {
            opacity: 0;
            transform: translateY(10%);
            transition: opacity 150ms ease-in, transform 250ms ease-in;
        }

        /* prettier-ignore */
        @keyframes chevronDown {
            0% { transform: translate(-50%, 0); }
            20% { transform: translate(-50%, 0.9375em); }
            40% { transform: translate(-50%, 0); }
        }
    }

    @media screen and (max-width: 450px) {
        .switches {
            flex-direction: column;
        }
    }
</style>
