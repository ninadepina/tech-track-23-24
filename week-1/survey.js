const url = 'https://opensheet.elk.sh/1bOqOXqsuALPR0U26nJu5URFzg2Js54oS7uHoMCBEZHY/responses';

const getData = async () => {
	try {
		const data = await (await fetch(url)).json();

		const updatedData = data.map((item) => {
			const updatedItem = {};

			for (const key in item) {
				if (key === 'Wat was je lievelingsdatum ook alweer?') continue;

				const modifiedKey = key.charAt(0).toLowerCase() + key.slice(1);
				const value = item[key];

				switch (key) {
					case 'Wat wilde je later worden als je groot bent, maar nu toen je zelf 8 was?':
						updatedItem['jeugdberoep'] = value.toLowerCase();
						break;

					case 'Naam':
					case 'Unicorns':
						updatedItem[modifiedKey] = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
						break;

					case 'Dag':
						const date = value.split('/');
						const [m, d, y] = date;
						updatedItem['lievelingsdatum (dd/mm/yyyy)'] = `${d}/${m}/${y}`;
						break;

					case 'Timestamp':
						const [datePart, timePart] = value.split(' ');
						const [mm, dd, yy] = datePart.split('/');
						updatedItem[`${modifiedKey} (dd/mm/yyyy hh/mm/ss)`] = `${dd}/${mm}/${yy} ${timePart}`;
						break;

					default:
						updatedItem[modifiedKey] = value.toLowerCase();
						break;
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
