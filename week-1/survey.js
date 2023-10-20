const url = 'https://opensheet.elk.sh/1bOqOXqsuALPR0U26nJu5URFzg2Js54oS7uHoMCBEZHY/responses';
//prettier-ignore
const monthMap = {
	januari: '/1/', jan: '/1/', februari: '/2/', feb: '/2/', maart: '/3/', mrt: '/3/', april: '/4/', mei: '/5/', juni: '/6/', jul: '/7/', juli: '/7/', augustus: '/8/', aug: '/8/', september: '/9/', sept: '/9/', oktober: '/10/', okt: '/10/', november: '/11/', nov: '/11/', december: '/12/', dec: '/12/'
};

const replaceMonthInDate = (date) => {
	for (const monthName in monthMap) {
		const monthNumber = monthMap[monthName];
		const monthRegExp = new RegExp(monthName, 'gi');
		date = date.replace(monthRegExp, monthNumber);
	}
	return date;
};

const getData = async () => {
	try {
		const data = await (await fetch(url)).json();

		const updatedData = data.map((item) => {
			const updatedItem = {};
			//prettier-ignore
			for (const key in item) {
				const modifiedKey = key.charAt(0).toLowerCase() + key.slice(1);

				if (key === 'Wat was je lievelingsdatum ook alweer?') {
					const lievelingsdatum = item[key]
						.toLowerCase()
						.replace(/\s/g, '')
						.replace(/-/g, '/')
						.replace(/(^|\/)0+/g, '$1');

					const dateParts = lievelingsdatum.split('/');
					updatedItem['lievelingsdatum'] =
						dateParts.length === 3 && dateParts.every((part) => !isNaN(part)) ? lievelingsdatum : '';

				} else if (key === 'Wat wilde je later worden als je groot bent, maar nu toen je zelf 8 was?') {
					updatedItem['jeugdberoep'] = item[key].toLowerCase();

				} else if (key === 'Naam' || key === 'Unicorns') {
					updatedItem[modifiedKey] = item[key].charAt(0).toUpperCase() + item[key].slice(1).toLowerCase();
					
				} else {
					updatedItem[modifiedKey] = item[key].toLowerCase();
				}
			}

			return updatedItem;
		});

		console.log(updatedData);
	} catch (err) {
		console.error(err);
	}
};

getData();
