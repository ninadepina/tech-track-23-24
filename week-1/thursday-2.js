let data = [
	{
		id: 1,
		name: 'ROBERT',
		kaas: false,
		coords: {
			lat: '52.3676',
			long: '4.9041'
		}
	},
	{
		id: '2',
		name: 'viNcent',
		kaas: 'true',
		coords: {
			lat: '52.3676',
			long: '4.9041'
		}
	},
	{
		id: 3,
		name: 'laura',
		kaas: true,
		coords: {
			lat: '52.3676',
			long: '4.9041'
		}
	}
];

function transformArrOfObj(data) {
	data = data.map((item) => {
		return {
			id: parseInt(item.id, 10),
			name: item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase(),
			kaas: item.kaas.toString(),
			coords: `lat: ${item.coords.lat}, long: ${item.coords.long}`
		};
	});
	return data;
}

function generateTable() {
	const transformedData = transformArrOfObj(data);
	const thead = document.querySelector('thead');
	const tbody = document.querySelector('tbody');

	Object.keys(transformedData[0]).forEach((key) => {
		const th = document.createElement('th');
		th.innerText = key;
		thead.appendChild(th);
	});

	transformedData.forEach((item) => {
		const tr = document.createElement('tr');
		tbody.appendChild(tr);

		for (const [key, value] of Object.entries(item)) {
			const td = document.createElement('td');
			td.textContent = value;
			tr.appendChild(td);
		}
	});
}

generateTable();
