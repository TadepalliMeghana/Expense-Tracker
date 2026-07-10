-- schema.sql
-- Expense Tracker database schema
-- This is executed by app.js when the page loads (via sql.js)

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT
);

-- Example queries used by the app (see app.js for how these are run):

-- Insert a new transaction
-- INSERT INTO transactions (date, category, amount, description) VALUES (?, ?, ?, ?);

-- Delete a transaction
-- DELETE FROM transactions WHERE id = ?;

-- Get all transactions, most recent first
-- SELECT id, date, category, amount, description FROM transactions ORDER BY date DESC;

-- Get transactions filtered by category
-- SELECT id, date, category, amount, description FROM transactions WHERE category = ? ORDER BY date DESC;

-- Get total spend
-- SELECT SUM(amount) AS total FROM transactions;

-- Get spend grouped by category (for the pie chart)
-- SELECT category, SUM(amount) AS total FROM transactions GROUP BY category ORDER BY total DESC;