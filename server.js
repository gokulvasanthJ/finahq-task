const schedule = require('node-schedule');
const { scrapeForexRates } = require('./scraper');
const db = require('./db'); 

const express = require('express');
const app = express();
app.use(express.json());

const job = schedule.scheduleJob('0 6 * * *', async () => {
    const rate = await scrapeForexRates();
    if (rate) {
        const currencyPair = 'GBP/USD'; 
        const date = new Date();

        db.query('INSERT INTO forex_data (currency_pair, date, rate) VALUES (?, ?, ?)', 
                 [currencyPair, date, rate], (err, results) => {
            if (err) {
                console.error('Error inserting data:', err);
            } else {
                console.log('Data inserted successfully');
            }
        });
    }
});

app.get('/api/average-rate', (req, res) => {
    const { currencyPair, startDate, endDate } = req.query;
    const query = `
        SELECT AVG(rate) as average_rate 
        FROM forex_data 
        WHERE currency_pair = ? AND date BETWEEN ? AND ?;
    `;
    db.query(query, [currencyPair, startDate, endDate], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ average_rate: results[0].average_rate });
    });
});

app.get('/api/closing-rate', (req, res) => {
    const { currencyPair, date } = req.query;
    const query = `
        SELECT rate as closing_rate 
        FROM forex_data 
        WHERE currency_pair = ? AND date = ?;
    `;
    db.query(query, [currencyPair, date], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ closing_rate: results[0].closing_rate });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
