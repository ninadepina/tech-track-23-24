import mapboxgl from 'mapbox-gl';
import { map } from './renderMap.js';

let hasSuggestions = true;
let processedData = [];
let marker;

const fetchData = async () => {
    try {
        const { data } = await (await fetch('coordinateData.json')).json();

        processedData = data.map((item) => ({
            label: `${item.city} (${item.iata})`,
            coordinates: { lat: item.lat, long: item.long }
        }));

        const suggestions = processedData.map((item) => item.label).sort();

        return suggestions;
    } catch (err) {
        console.error('Error fetching or processing data:', err);
    }
};

const updateMapMarker = (coordinates) => {
    if (marker) marker.remove();
    marker = new mapboxgl.Marker({ color: '#914bd2' }).setLngLat(coordinates).addTo(map);
};

const autocomplete = (input, array) => {
    let currentFocus;

    input.addEventListener('input', function (e) {
        !input.value 
            ? input.classList.add('border-radius') 
            : input.classList.remove('border-radius');

        let autocompleteList,
            autocompleteItem,
            i,
            value = this.value;

        closeAllLists();
        if (!value) return false;
        currentFocus = -1;

        autocompleteList = document.createElement('ul');
        autocompleteList.setAttribute('id', this.id + 'AutocompleteList');
        autocompleteList.setAttribute('class', 'autocompleteItems');

        input.parentNode.appendChild(autocompleteList);

        for (i = 0; i < array.length; i++) {
            if (array[i].toUpperCase().indexOf(value.toUpperCase()) > -1) {
                autocompleteItem = document.createElement('li');

                // if input value in array item => highlight value
                let suggestion = array[i].replace(
                    new RegExp(value, 'gi'),
                    '<strong>$&</strong>'
                );
                autocompleteItem.innerHTML = suggestion;
                autocompleteItem.innerHTML += "<input type='hidden' value='" + array[i] + "'>";

                autocompleteItem.addEventListener('click', function (e) {
                    const selectedLabel = this.getElementsByTagName('input')[0].value;
                    const selectedCoordinates = processedData.find((item) => item.label === selectedLabel)?.coordinates;

                    if (selectedCoordinates) {
                        map.flyTo({
                            center: [selectedCoordinates.long, selectedCoordinates.lat],
                            zoom: 4,
                            essential: true
                        });

                        updateMapMarker([selectedCoordinates.long, selectedCoordinates.lat]);
                    }

                    input.value = selectedLabel;
                    closeAllLists();

                    input.form && input.form.dispatchEvent(new Event('submit'));
                });

                // sorts items in the list based on if they start with the input value
                array[i].toUpperCase().startsWith(value.toUpperCase())
                    ? autocompleteList.insertBefore(autocompleteItem, autocompleteList.childNodes[0])
                    : autocompleteList.appendChild(autocompleteItem);
            }
        }

        hasSuggestions = autocompleteList.childNodes.length > 0;

        if (!hasSuggestions) {
            const noSuggestionItem = document.createElement('li');
            noSuggestionItem.setAttribute('class', 'empty');
            noSuggestionItem.textContent = 'No suggestions';
            autocompleteList.appendChild(noSuggestionItem);
        }
    });

    input.addEventListener('keydown', (e) => {
        // autocomplete container (for readability: 'x')
        let x = document.querySelector('#searchAutocompleteList');
        if (x) x = x.getElementsByTagName('li');

        switch (e.key) {
            case 'ArrowDown':
                if (hasSuggestions) {
                    currentFocus++;
                    addActive(x);
                }
                break;
            case 'ArrowUp':
                if (hasSuggestions) {
                    currentFocus--;
                    addActive(x);
                }
                break;
            case 'Enter':
                if (currentFocus > -1 && x) {
                    e.preventDefault();
                    x[currentFocus].click();
                }
                closeAllLists();
                input.classList.add('border-radius');
                break;
        }
    });

    const addActive = (x) => {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = x.length - 1;
        if (currentFocus < 0) currentFocus = 0;
        const currentNode = x[currentFocus];
        currentNode.classList.add('autocompleteActive');

        // makes sure the active suggestion is always visible
        if (currentNode.offsetTop + currentNode.offsetHeight > x[0].parentNode.scrollTop + x[0].parentNode.offsetHeight) {
            x[0].parentNode.scrollTop = currentNode.offsetTop + currentNode.offsetHeight - x[0].parentNode.offsetHeight;
        } else if (currentNode.offsetTop < x[0].parentNode.scrollTop) {
            x[0].parentNode.scrollTop = currentNode.offsetTop;
        }
    };

    const removeActive = (x) => {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove('autocompleteActive');
        }
    };

    const closeAllLists = (e) => {
        const x = document.getElementsByClassName('autocompleteItems');
        for (let i = 0; i < x.length; i++) {
            if (e != x[i] && e != input) {
                x[i].parentNode.removeChild(x[i]);
                hasSuggestions = true;
            }
        }
    };

    document.body.addEventListener('click', (e) => {
        const autocompleteLists = document.getElementsByClassName('autocompleteItems');
        const isClickInsideInput = e.target === input;
        let isClickInsideAutocompleteList = false;
    
        for (let i = 0; i < autocompleteLists.length; i++) {
            if (e.target === autocompleteLists[i] || autocompleteLists[i].contains(e.target)) {
                isClickInsideAutocompleteList = true;
                break;
            }
        }
    
        if (!isClickInsideInput && !isClickInsideAutocompleteList) {
            closeAllLists();
            input.classList.add('border-radius');
        }
    });
};

export { autocomplete, fetchData, marker };
