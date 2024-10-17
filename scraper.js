const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeForexRates() {
    const url = 'https://www.x-rates.com/';
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const rate = $('table.ratesTable tbody tr:first-child td:nth-child(2)').text().trim();

        return parseFloat(rate);
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

module.exports = { scrapeForexRates };
