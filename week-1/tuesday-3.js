let data = [
	{
		name: 'robert',
		age: '29',
		residence: 'amsterdam',
		work: {
			title: 'Lecturer',
			employer: 'Hogeschool van Amsterdam'
		}
	},
	{
		name: 'berend',
		age: '32',
		residence: 'rotterdam',
		work: {
			title: 'Front-end Developer',
			employer: 'DEPT'
		}
	},
	{
		name: 'ubaida',
		age: '26',
		residence: 'Amersfoort',
		work: {
			title: 'Project Manager',
			employer: 'Clarify'
		}
	}
];

function transformArrOfObj(data) {
	data = data
		.filter((item) => !isNaN(parseInt(item.age, 10)))
		.map((item) => {
			return {
				name: item.name.toLowerCase().charAt(0).toUpperCase() + item.name.slice(1).toLowerCase(),
				age: parseInt(item.age, 10),
				residence: item.residence.toLowerCase().charAt(0).toUpperCase() + item.residence.slice(1).toLowerCase()
			};
		});

	console.log(data);
}

transformArrOfObj(data);
