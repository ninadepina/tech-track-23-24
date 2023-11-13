let data = [1, 2, '3', '4', 5];

const convertArrayStringsToNumbers = () => {
	data = data.map((item) => Number(item));

	console.log(data);
}

convertArrayStringsToNumbers();
