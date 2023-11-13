const data = [
	{
		id: 1,
		name: 'Robert',
		kaas: true
	},
	{
		id: 2,
		name: 'Vincent',
		kaas: false
	},
	{
		id: 3,
		name: 'Laura',
		kaas: true
	}
];

const generateTable = () => {
	// const table = document.querySelector('table');
	const thead = document.querySelector('thead');
	const tbody = document.querySelector('tbody');

	Object.keys(data[0]).forEach((key) => {
		const th = document.createElement('th');
		th.innerText = key;
		thead.appendChild(th);
	});

	data.forEach((item) => {
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
