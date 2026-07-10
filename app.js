let db = null;
let chart = null;

async function init() {
  // Load the sql.js WASM engine
  const SQL = await initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
  });

  db = new SQL.Database();

  // Load and run the actual schema.sql file
  const schemaText = await fetch('schema.sql').then(r => r.text());
  // Strip the commented example queries at the bottom, keep only CREATE TABLE
  const createTableSQL = schemaText.split('-- Example queries')[0];
  db.run(createTableSQL);

  refreshAll();
}

function refreshAll() {
  renderTransactions();
  renderSummary();
}

function renderTransactions() {
  const filter = document.getElementById('categoryFilter').value;

  let sql = 'SELECT id, date, category, amount, description FROM transactions';
  const params = [];
  if (filter !== 'All') {
    sql += ' WHERE category = ?';
    params.push(filter);
  }
  sql += ' ORDER BY date DESC;';

  const stmt = db.prepare(sql);
  stmt.bind(params);

  const tbody = document.getElementById('transactionBody');
  tbody.innerHTML = '';
  while (stmt.step()) {
    const row = stmt.getAsObject();
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.date}</td>
      <td>${row.category}</td>
      <td>₹${row.amount.toFixed(2)}</td>
      <td>${row.description || ''}</td>
      <td><button onclick="deleteTransaction(${row.id})">Delete</button></td>
    `;
    tbody.appendChild(tr);
  }
  stmt.free();

  const totalResult = db.exec('SELECT SUM(amount) AS total FROM transactions;');
  const total = totalResult.length ? totalResult[0].values[0][0] || 0 : 0;
  document.getElementById('totalSpend').textContent = total.toFixed(2);
}

function renderSummary() {
  const result = db.exec(
    'SELECT category, SUM(amount) AS total FROM transactions GROUP BY category ORDER BY total DESC;'
  );

  const labels = result.length ? result[0].values.map(r => r[0]) : [];
  const data = result.length ? result[0].values.map(r => r[1]) : [];

  const ctx = document.getElementById('summaryChart').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#4f46e5', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#e2e8f0' } } }
    }
  });
}

document.getElementById('transactionForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const description = document.getElementById('description').value;

  const stmt = db.prepare(
    'INSERT INTO transactions (date, category, amount, description) VALUES (?, ?, ?, ?);'
  );
  stmt.run([date, category, amount, description]);
  stmt.free();

  e.target.reset();
  refreshAll();
});

document.getElementById('categoryFilter').addEventListener('change', renderTransactions);

function deleteTransaction(id) {
  const stmt = db.prepare('DELETE FROM transactions WHERE id = ?;');
  stmt.run([id]);
  stmt.free();
  refreshAll();
}

init();