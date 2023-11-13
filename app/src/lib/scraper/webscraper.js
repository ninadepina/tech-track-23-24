import puppeteer from 'puppeteer';
import fs from 'fs/promises';

const start = async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('https://www.schipholairport.eu/flights.shtml', {
        waitUntil: 'domcontentloaded'
    });

    const data = await page.evaluate(() => {
        const items = document.querySelectorAll('div.data3.alone .item');
        const extractedData = [];

        items.forEach((item) => {
            const city = item.querySelector('.col1 span');
            const iata = item.querySelector('.col2 span');
            const operator = item.querySelector('.col3 span');

            if (city && iata) {
                const cityText = city.textContent.trim().replace('Airport', '');
                const iataText = iata.textContent.trim();
                const operatorText = operator.textContent.trim().replace(' and', ',');

                extractedData.push({
                    city: cityText,
                    iata: iataText,
                    operator: operatorText
                });
            }
        });

        return extractedData;
    });

    await browser.close();

    const filePath = 'static/destinations.json';
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

start();
