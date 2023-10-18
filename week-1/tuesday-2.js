let data = ['robert', 'vincent', 'lAuRa', 'Cas', 'wIMER', 'rOOs'];

function convertArrayStringsToCapitalized() {
	data = data.map((item) => {
		return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
	});

	console.log(data);
}

convertArrayStringsToCapitalized();
