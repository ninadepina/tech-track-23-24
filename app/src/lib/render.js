import mapboxgl from 'mapbox-gl';
import * as d3 from 'd3';
import { gsap, Elastic } from 'gsap';

const renderMap = () => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoibmluYWRlcGluYSIsImEiOiJjbG9kN2g4YmgwNzA1MmtwOGNwZ2pmYm5oIn0.ZxK0Rzq_visQwBFGqSWIZA';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [8, 52],
        zoom: 2,
        minZoom: 1.2
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());

    d3.json('coordinateData.json').then((data) => {
        update(data);
    });

    const update = (data) => {
        const coordinatesData = data.data.map((item) => item.coordinates);
        const container = map.getCanvasContainer();

        const svg = d3
            .select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('position', 'absolute')
            .style('z-index', 2);

        const project = (d) => {
            return map.project(new mapboxgl.LngLat(d[0], d[1]));
        };

        const dots = svg
            .selectAll('.dot')
            .data(coordinatesData)
            .enter()
            .append('circle')
            .classed('dot', true)
            .attr('r', 5)
            .style('fill', (d, i) => (i === 0 ? '#914BD2' : '#1B60DB'));

        const render = () => {
            dots.attr('cx', (d) => {
                return project(d).x;
            }).attr('cy', (d) => {
                return project(d).y;
            });
        };

        const dotTl = gsap.timeline();

        dotTl
            .from('.dot', {
                duration: 1,
                opacity: 0
            })
            .from('.dot', {
                opacity: 0,
                scale: 0
            })
            .to('.dot', {
                scale: 1,
                opacity: 0.7,
                stagger: 0.007,
                ease: Elastic.easeOut.config(1, 0.3)
            });

        render();

        map.on('viewreset', render);
        map.on('move', render);
        map.on('moveend', render);
    };
};

export { renderMap };
