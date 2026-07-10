# Expense Tracker

A simple, fully client-side expense tracker that runs real SQL in the browser — no backend, no server, no database setup.

## Live Demo

https://tadepallimeghana.github.io/Expense-Tracker/

## Repository

https://github.com/TadepalliMeghana/Expense-Tracker

## About

This app lets you log expenses, categorize them, and see where your money goes. Every action — adding an expense, deleting one, filtering by category, or totaling your spend — is backed by an actual SQL query, executed live in the browser using **SQLite compiled to WebAssembly (sql.js)**.

## Features

- Add expenses with date, category, amount, and description
- Delete individual transactions
- Filter transactions by category
- View total spend at a glance
- Visual breakdown of spending by category (pie chart)

## Tech Stack

- **HTML / CSS / JavaScript** — frontend
- **SQL (SQLite via sql.js)** — data storage and queries, running entirely client-side
- **Chart.js** — spending visualization

## Files

- `index.html` — page structure
- `style.css` — styling
- `app.js` — app logic and all SQL queries (INSERT, DELETE, SELECT with WHERE, GROUP BY + SUM)
- `schema.sql` — database schema
