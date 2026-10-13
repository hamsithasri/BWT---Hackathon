
import { useState, useEffect } from "react";
import "./App.css";

const Wallet = () => <span>◈</span>;
const TrendingDown = () => <span>↘</span>;
const Receipt = () => <span>▤</span>;
const Plus = () => <span>+</span>;
const Pencil = () => <span>✎</span>;
const Trash2 = () => <span>▥</span>;
const X = () => <span>×</span>;
const LayoutDashboard = () => <span>▦</span>;
const CreditCard = () => <span>▰</span>;
const CalendarDays = () => <span>▦</span>;

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Education",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  category: "Food",
  amount: "",
  description: "",
};

function formatRupees(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    fetch("http://localhost:5000/api/expenses")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load expenses");
        }
        return response.json();
      })
      .then((data) => {
        setExpenses(
          data.map((item) => ({
            id: item._id,
            description: item.title,
            amount: item.amount,
            category: item.category,
            date: item.date.slice(0, 10),
          }))
        );
      })
      .catch((error) => {
        console.error("Error loading expenses:", error);
      });
  }, []);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  function handleLogin(event) {
    event.preventDefault();
    setIsLoggedIn(true);
  }

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="login-logo">◈</div>
          <h1>Welcome to SpendWise</h1>
          <p>Manage your expenses, one step at a time.</p>

          <label>
            Email
            <input type="email" placeholder="you@example.com" required />
          </label>

          <label>
            Password
            <input type="password" placeholder="Enter any password" required />
          </label>

          <button type="submit" className="primary-btn">
            Login →
          </button>

          <span className="login-note">
            Simple demo login for SpendWise
          </span>
        </form>
      </div>
    );
  }
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const thisMonth = expenses
    .filter((item) => item.date.slice(0, 7) === new Date().toISOString().slice(0, 7))
    .reduce((sum, item) => sum + item.amount, 0);

  const visibleExpenses = expenses.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filter === "All" || item.category === filter;
    return matchesSearch && matchesCategory;
  });

  
  async function handleSubmit(event) {
    event.preventDefault();

    const amount = Number(form.amount);

    if (
      !form.date ||
      !form.description.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError("Enter a date, description, and amount greater than ₹0.");
      return;
    }

    const expenseData = {
      title: form.description.trim(),
      amount,
      category: form.category,
      date: form.date,
    };

    try {
      const response = await fetch(
        editingId !== null
          ? `http://localhost:5000/api/expenses/${editingId}`
          : "http://localhost:5000/api/expenses",
        {
          method: editingId !== null ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expenseData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save expense");
      }

      const savedExpense = {
        id: data._id,
        description: data.title,
        amount: data.amount,
        category: data.category,
        date: data.date.slice(0, 10),
      };

      if (editingId !== null) {
        setExpenses((current) =>
          current.map((item) =>
            item.id === editingId ? savedExpense : item
          )
        );
      } else {
        setExpenses((current) => [savedExpense, ...current]);
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      setError("");
    } catch (error) {
      console.error("Error saving expense:", error);
      setError(error.message || "Could not save expense. Please try again.");
    }
  }

  function handleEdit(item) {
    setForm({
      date: item.date,
      category: item.category,
      amount: String(item.amount),
      description: item.description,
    });
    setEditingId(item.id);
    setShowForm(true);
    setError("");
  }

  
  async function handleDelete(id) {
    if (!window.confirm("Delete this expense?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/expenses/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete expense");
      }

      setExpenses((current) =>
        current.filter((item) => item.id !== id)
      );

      setError("");
    } catch (error) {
      console.error("Error deleting expense:", error);
      setError(error.message || "Could not delete expense.");
      window.alert("Could not delete expense. Please try again.");
    }
  }

  function cancelForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Wallet size={23} /></div>
          <div>
            <h2>SpendWise</h2>
            <span>EXPENSE MANAGER</span>
          </div>
        </div>
        <p className="nav-label">MENU</p>
        <div className="nav-item active">
          <LayoutDashboard /> Home
        </div>
        <div className="sidebar-bottom">
          <div className="secure-icon"><CreditCard size={20} /></div>
          <p>Your finances,<br /><strong>under control.</strong></p>
          <span>Track every rupee. Spend smarter.</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR FINANCIAL OVERVIEW</p>
            <h1>Dashboard <span className="wave">✦</span></h1>
            <p className="subheading">Keep track of where your money goes.</p>
          </div>
          <button className="primary-btn" onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
            setError("");
          }}>
            <Plus size={18} /> Add Expense
          </button>
        </header>

        <section className="stats-grid">
          <article className="stat-card featured">
            <div className="stat-top">
              <span>Total Expenses</span>
              <div className="stat-icon blue"><Wallet size={20} /></div>
            </div>
            <h2>{formatRupees(total)}</h2>
            <p><span className="stat-note">All recorded expenses</span></p>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>This Month</span>
              <div className="stat-icon purple"><TrendingDown size={20} /></div>
            </div>
            <h2>{formatRupees(thisMonth)}</h2>
            <p><span className="stat-note">Current month spending</span></p>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Transactions</span>
              <div className="stat-icon green"><Receipt size={20} /></div>
            </div>
            <h2>{expenses.length}</h2>
            <p><span className="stat-note">Total expense records</span></p>
          </article>
        </section>

        {showForm && (
          <section className="form-card">
            <div className="section-heading">
              <div>
                <h2>{editingId !== null ? "Edit Expense" : "Add New Expense"}</h2>
                <p>Enter the details of your transaction.</p>
              </div>
              <button className="icon-btn" onClick={cancelForm} aria-label="Close form">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Date
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </label>
                <label>
                  Category
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {categories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <label>
                  Amount (₹)
                  <input type="number" min="0.01" step="0.01" placeholder="e.g. 250" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                </label>
                <label>
                  Description
                  <input type="text" maxLength="120" placeholder="e.g. Lunch with friends" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                </label>
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={cancelForm}>Cancel</button>
                <button type="submit" className="primary-btn">{editingId !== null ? "Save Changes" : "Save Expense"}</button>
              </div>
            </form>
          </section>
        )}

        <section className="expenses-card" id="expenses-section">
          <div className="section-heading expense-heading">
            <div>
              <h2>Recent Expenses</h2>
              <p>Your recorded transactions at a glance.</p>
            </div>
            <span className="record-count">{expenses.length} records</span>
          </div>

          <div className="table-tools">
            <input
              className="search-input"
              type="search"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter category">
              <option>All</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>EXPENSE</th>
                  <th>CATEGORY</th>
                  <th>DATE</th>
                  <th>AMOUNT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {visibleExpenses.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="expense-name">{item.description}</div>
                      <div className="expense-id">EXP-{String(item.id).slice(-6)}</div>
                    </td>
                    <td><span className="category-pill">{item.category}</span></td>
                    <td><span className="date-cell"><CalendarDays size={14} /> {item.date}</span></td>
                    <td className="amount-cell">{formatRupees(item.amount)}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn edit-btn" onClick={() => handleEdit(item)} aria-label="Edit expense"><Pencil size={16} /></button>
                        <button className="icon-btn delete-btn" onClick={() => handleDelete(item.id)} aria-label="Delete expense"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleExpenses.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon"><Receipt size={27} /></div>
              <h3>{expenses.length === 0 ? "No expenses yet" : "No matching expenses"}</h3>
              <p>{expenses.length === 0 ? "Add your first expense to start tracking your spending." : "Try another search term or category."}</p>
              {expenses.length === 0 && <button className="primary-btn" onClick={() => setShowForm(true)}><Plus size={17} /> Add your first expense</button>}
            </div>
          )}

          <div className="table-footer">
            Showing {visibleExpenses.length} of {expenses.length} expenses
          </div>
        </section>

        <footer className="page-footer">
          <span>SpendWise <span className="footer-dot">•</span> Expense Management</span>
          <span>Built with the MERN stack</span>
        </footer>
      </main>
    </div>
  );
}