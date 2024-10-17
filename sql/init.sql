CREATE DATABASE IF NOT EXISTS forex_rates;

USE forex_rates;

CREATE TABLE IF NOT EXISTS forex_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currency_pair VARCHAR(10),
    date DATE,
    rate DECIMAL(10, 6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
