import puppeteer from 'puppeteer';

const scrapeDestinations = async (url) => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
        const items = document.querySelectorAll('li.rw-nested-list__item');

        const extractedData = Array.from(items).map((item) => {
            const city = item.innerHTML.trim();
            return { city };
        });

        return extractedData;
    });

    await browser.close();

    return data;
};

const urls = [
    'https://www.schiphol.nl/en/route-development/airport-facts/european-destinations/',
    'https://www.schiphol.nl/en/route-development/airport-facts/intercontinental-destinations/'
];

const scrapeAll = async () => {
    const promises = urls.map((url) => scrapeDestinations(url));
    const results = await Promise.all(promises);

    const combinedResults = [].concat(...results);
    return combinedResults;
};

export { scrapeAll };
