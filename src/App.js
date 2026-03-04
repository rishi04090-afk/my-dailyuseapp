import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('All');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];

  const addExpense = (e) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      category,
      description,
      date: new Date().toLocaleDateString(),
    };

    setExpenses([newExpense, ...expenses]);
    setAmount('');
    setDescription('');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const filteredExpenses = filter === 'All' 
    ? expenses 
    : expenses.filter(exp => exp.category === filter);

  const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="App">
      <div className="container">
        <h1>Expense Tracker</h1>

        <div className="form-section">
          <form onSubmit={addExpense}>
            <div className="form-group">
              <label>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you buy?"
              />
            </div>

            <button type="submit" className="btn-add">Add Expense</button>
          </form>
        </div>

        <div className="filter-section">
          <h3>Filter by Category</h3>
          <div className="filter-buttons">
            {['All', ...categories].map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="summary">
          <h2>Total: ${total.toFixed(2)}</h2>
        </div>

        <div className="expenses-list">
          <h3>Expenses</h3>
          {filteredExpenses.length === 0 ? (
            <p className="no-expenses">No expenses yet</p>
          ) : (
            filteredExpenses.map(exp => (
              <div key={exp.id} className="expense-item">
                <div className="expense-info">
                  <div className="expense-header">
                    <span className="expense-description">{exp.description}</span>
                    <span className="expense-category">{exp.category}</span>
                  </div>
                  <span className="expense-date">{exp.date}</span>
                </div>
                <div className="expense-right">
                  <span className="expense-amount">${exp.amount.toFixed(2)}</span>
                  <button 
                    className="btn-delete"
                    onClick={() => deleteExpense(exp.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
