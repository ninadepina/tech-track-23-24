import { map } from './renderMap.js';

let hasSuggestions = true;
let processedData = [];

const fetchData = async () => {
    try {
        const data = await (await fetch('coordinateData.json')).json();

        processedData = data.data.map((item) => ({
            label: `${item.city} (${item.iata})`,
            coordinates: { lat: item.lat, long: item.long }
        }));

        const suggestions = processedData.map((item) => item.label);
        return suggestions;
    } catch (err) {
        console.error('Error fetching or processing data:', err);
    }
};

const autocomplete = (input, array) => {
    let currentFocus;

    input.addEventListener('input', function (e) {
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

                // checks if the input value is in the array item (if yes, highlights it)
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

    input.addEventListener('keydown', function (e) {
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
                break;
        }
    });

    const addActive = (x) => {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = x.length - 1;
        if (currentFocus < 0) currentFocus = 0;
        x[currentFocus].classList.add('autocompleteActive');

        // makes sure the active suggestion is always visible
        if (x[currentFocus].offsetTop + x[currentFocus].offsetHeight > x[0].parentNode.scrollTop + x[0].parentNode.offsetHeight) {
            x[0].parentNode.scrollTop = x[currentFocus].offsetTop + x[currentFocus].offsetHeight - x[0].parentNode.offsetHeight;
        } else if (x[currentFocus].offsetTop < x[0].parentNode.scrollTop) {
            x[0].parentNode.scrollTop = x[currentFocus].offsetTop;
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
};

export { autocomplete, fetchData };