<script>
    import { onMount } from 'svelte';
    import { map } from '$lib/renderMap.js';
    import { moveScaleControl } from '$lib/utils/visualEl.js';
    
    import Intro from '$lib/Intro.svelte';
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
        moveScaleControl();
        changeLayer();
    });
</script>

<svelte:head>
    <!-- prettier-ignore -->
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
    <title>Schiphol Hub</title>
</svelte:head>

<Intro />

<div id="mapInfo">
    <div class="header">
        <div class="schipholHub">
            <h1>Schiphol Hub</h1>
            <svg viewBox="0 0 862 1222">
                <path d="M790.065 687.882C781.094 724.837 768.721 773.868 754.998 826.325C731.365 918.763 718.382 969.154 708.443 998.302C703.309 1013.36 697.745 1026.66 689.838 1038.49C681.749 1050.59 672.908 1058.44 667.387 1063.35L667.022 1063.67C663.917 1066.46 660.587 1069.45 657.209 1072.49C646.915 1081.73 636.188 1091.36 630.124 1096.99C623.179 1103.44 615.814 1108.87 610.814 1112.45C609.16 1113.64 607.282 1114.96 605.823 1115.99C605.18 1116.44 604.618 1116.84 604.193 1117.14C602.55 1118.3 602.011 1118.71 602.009 1118.71C602.009 1118.71 602.016 1118.7 602.03 1118.69C600.756 1119.71 599.727 1120.56 598.782 1121.33C598.631 1121.45 598.471 1121.59 598.304 1121.72C597.523 1122.36 596.594 1123.13 595.734 1123.82C593.165 1125.89 590.654 1127.8 587.272 1130.11C587.328 1130.08 587.049 1130.3 585.068 1131.78C583.002 1133.33 579.981 1135.54 576.173 1137.95C568.274 1142.97 558.605 1147.87 546.192 1152.08C522.119 1160.23 489.385 1165.2 441.723 1165.2C391.276 1165.2 351.736 1156.92 323.925 1148.05C310.048 1143.62 299.143 1139.07 291.295 1135.37C287.371 1133.52 284.21 1131.88 281.821 1130.57C280.892 1130.06 280.079 1129.61 279.383 1129.21C279.293 1129.16 279.199 1129.11 279.102 1129.06C278.108 1128.54 276.723 1127.82 275.147 1126.98C272.113 1125.38 267.925 1123.15 264.438 1121.19C251.891 1114.14 238.17 1105.43 232.053 1101.18L264 1055.19L232.053 1101.18C231.171 1100.57 230.172 1099.88 229.079 1099.14C222.046 1094.32 211.111 1086.83 202.475 1078.64C188.009 1064.93 176.779 1048.4 171.739 1040.84L171.282 1040.15L170.845 1039.45C166.53 1032.55 163.685 1024.24 162.881 1021.89C162.828 1021.73 162.783 1021.6 162.748 1021.5C161.218 1017.1 159.482 1011.69 157.639 1005.72C153.92 993.673 149.239 977.629 143.997 959.142C133.488 922.076 120.395 874.017 107.623 825.906C94.8523 777.796 82.3291 729.352 72.971 691.517C68.3027 672.643 64.3506 656.12 61.5362 643.492C60.1384 637.22 58.9335 631.519 58.0493 626.793C58.0297 626.688 58.0086 626.576 57.986 626.456C57.4253 623.473 56 615.888 56 608.746C56 567.952 85.3759 542.401 105.963 528.555C128.775 513.212 160.12 499.221 197.455 485.22L197.588 485.17L197.721 485.121C208.538 481.127 218.822 477.203 228.01 473.594C225.503 463.793 222.541 452.856 219.233 441.443L219.158 441.183L219.085 440.922C213.254 420.054 207.844 400.119 203.861 384.813C201.881 377.203 200.181 370.46 198.945 365.213C198.337 362.635 197.748 360.023 197.278 357.674L197.277 357.667C197.223 357.423 195.752 350.782 195.752 343.824C195.752 331.917 199.492 323.039 201.368 319.095C203.534 314.54 205.892 311.096 207.419 309.024C210.47 304.884 213.597 301.686 215.555 299.778C219.718 295.722 224.41 291.912 228.614 288.711C237.204 282.171 248.159 274.847 259.885 267.923C260.115 267.78 260.343 267.639 260.569 267.499C259.344 257.955 258.393 247.345 257.816 236.951L257.81 236.844L257.804 236.737C256.92 219.636 256.247 201.501 260.515 183.397C265.052 164.154 274.095 149.246 282.218 136.436C299.095 109.788 322.513 88.7641 348.84 75.6007C413.619 43.2113 494.177 50.6392 547.185 100.735C588.166 139.245 608.627 187.118 603.493 243.737C602.992 251.235 602.25 258.803 601.36 265.863C611.183 271.658 620.89 277.925 628.921 283.79C633.161 286.887 637.917 290.583 642.216 294.566C644.329 296.523 647.224 299.366 650.104 302.91C651.927 305.152 657.373 311.944 660.823 322.108C663.356 329.506 663.781 335.619 663.915 337.637C664.152 341.18 664.059 344.235 663.954 346.247C663.739 350.333 663.228 354.324 662.752 357.521C661.767 364.142 660.221 372.022 658.445 380.219C654.839 396.855 649.571 418.038 643.633 439.914L643.536 440.272L643.434 440.629C640.057 452.447 637.004 463.72 634.42 473.771C643.506 477.328 653.637 481.191 664.261 485.114C702.238 499.122 733.955 513.209 756.965 529.028C778.989 544.17 806 570.046 806 609.961C806 616.93 804.494 624.535 804.067 626.694C804.036 626.847 804.012 626.973 803.993 627.069C803.196 631.198 802.106 636.325 800.82 642.108C798.23 653.761 794.546 669.423 790.065 687.882ZM639.536 727.897C639.535 727.898 639.529 727.946 639.518 728.036C639.531 727.941 639.537 727.896 639.536 727.897ZM224.659 727.594C224.658 727.595 224.663 727.656 224.675 727.783C224.666 727.658 224.659 727.593 224.659 727.594ZM367.031 746.533L369.243 758.892L432.989 759.949L493.634 760.619C494.392 754.102 495.176 747.005 495.921 739.807L442.985 740.089C410.13 740.433 385.062 740.825 366.042 741.345C366.324 742.827 366.61 744.32 366.899 745.822L366.967 746.177L367.031 746.533ZM255.187 771.319C255.228 771.302 255.249 771.293 255.25 771.292C255.252 771.291 255.23 771.3 255.187 771.319Z" />
            </svg>                                                    
        </div>

        <Search />
    </div>
    <div class="switches">
        <LayerSwitchButton {labelsLayer} {toggleLayer} />
        <StyleSwitchButton />
    </div>
</div>

<Map />

<style>
    h1 {
        font-family: var(--font-family-title);
        font-size: 4em;
        line-height: 1em;
        padding: 0.1em 0.3em 0 0.3em;
    }

    .schipholHub {
        position: relative;
        margin: 2em 0 var(--standard-margin) var(--standard-margin);
        background-color: white;
        border-radius: var(--border-radius);
    }

    .schipholHub svg {
        position: absolute;
        top: -27%;
        left: 28.3%;
        width: 7%;
        fill: none;
    }

    .schipholHub svg path {
        fill: var(--color-dark);
        stroke: var(--color-light);
        stroke-width: 112;
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
