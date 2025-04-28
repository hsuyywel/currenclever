import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { startOfWeek, format } from "date-fns"; // ✅ Added

function Expense() {
  const [expenseList, setExpenseList] = useState([]);
  const [form, setForm] = useState({ amount: "", currency: "GBP", date: "", note: "", category: "" });
  const [editId, setEditId] = useState(null);
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail"));
  const [filters, setFilters] = useState({ date: "", amount: "", currency: "", note: "", category: "" });
  const [chartFilters, setChartFilters] = useState({ date: "", currency: "GBP" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currencyOptions = ["GBP"];
  const categoryOptions = ["Food", "Groceries", "Fashion", "Leisures", "Accommodation", "Insurance", "Miscellaneous"];

  const fetchExpense = (email) => {
    fetch("http://localhost/CurrenClever_Backend/expense.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setExpenseList(data.expenses);
        else toast.error(data.error || "Failed to fetch expenses");
      })
      .catch(() => toast.error("Server error"));
  };

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
      fetchExpense(email);
    } else {
      toast.error("User email not found. Please login.");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email: userEmail,
      ...form,
      ...(editId && { id: editId })
    };

    fetch("http://localhost/CurrenClever_Backend/expense.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success(editId ? "Expense updated" : "Expense added");
          setForm({ amount: "", currency: "GBP", date: "", note: "", category: "" });
          setEditId(null);
          fetchExpense(userEmail);
        } else {
          toast.error(data.error || "Failed to save expense");
        }
      })
      .catch(() => toast.error("Server error"));
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ amount: item.amount, currency: item.currency, date: item.date, note: item.note, category: item.category });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredData = (expenseList || []).filter((item) =>
    (!filters.date || item.date.includes(filters.date)) &&
    (!filters.amount || String(item.amount).includes(filters.amount)) &&
    (!filters.currency || item.currency?.toLowerCase().includes(filters.currency.toLowerCase())) &&
    (!filters.note || item.note?.toLowerCase().includes(filters.note.toLowerCase())) &&
    (!filters.category || item.category?.toLowerCase().includes(filters.category.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Weekly Grouping and 3-week Moving Average
  const weeklyChartData = (() => {
    const filtered = (expenseList || []).filter((item) => {
      const currencyMatch = chartFilters.currency ? item.currency === chartFilters.currency : true;
      const dateMatch = chartFilters.date ? item.date.includes(chartFilters.date) : true;
      return currencyMatch && dateMatch;
    });

    const groupedByWeek = {};
    filtered.forEach(item => {
      const weekStart = format(startOfWeek(new Date(item.date), { weekStartsOn: 1 }), "yyyy-MM-dd");
      if (!groupedByWeek[weekStart]) {
        groupedByWeek[weekStart] = 0;
      }
      groupedByWeek[weekStart] += parseFloat(item.amount) || 0;
    });

    const weekArray = Object.entries(groupedByWeek).map(([week, amount]) => ({
      week,
      amount
    })).sort((a, b) => new Date(a.week) - new Date(b.week));

    const movingAvgArray = weekArray.map((entry, index, arr) => {
      const start = Math.max(0, index - 2);
      const slice = arr.slice(start, index + 1);
      const avg = slice.reduce((sum, e) => sum + e.amount, 0) / slice.length;
      return { ...entry, movingAvg: avg };
    });

    return movingAvgArray;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-100 p-6">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-pink-700">Expense Management</h1>
        <p className="text-gray-600">Add, update and track your expense records.</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 max-w-2xl mx-auto mb-10">
        <h2 className="text-xl font-semibold text-pink-600 mb-4">
          {editId ? "Edit Expense" : "Add Expense"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required className="w-full border rounded p-2" />
          <select name="currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full border rounded p-2">
            {currencyOptions.map((c) => (<option key={c}>{c}</option>))}
          </select>
          <input type="date" name="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="w-full border rounded p-2" />
          <select name="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded p-2">
            <option value="">Select Category</option>
            {categoryOptions.map((cat) => (<option key={cat}>{cat}</option>))}
          </select>
          <input type="text" name="note" placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full border rounded p-2" />
          <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">
            {editId ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </div>

      {/* Chart and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-pink-600">Expense Chart</h3>
            <div className="flex items-center gap-2">
              <input
                type="month"
                value={chartFilters.date}
                onChange={(e) => setChartFilters((prev) => ({ ...prev, date: e.target.value }))}
                className="border border-gray-300 rounded p-2 text-sm"
                placeholder="Filter date"
              />
              <select
                value={chartFilters.currency}
                onChange={(e) => setChartFilters((prev) => ({ ...prev, currency: e.target.value }))}
                className="border border-gray-300 rounded p-2 text-sm"
              >
                {currencyOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => [`£${value.toFixed(2)}`, "Amount"]} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#db2777"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Weekly Expense"
              />
              <Line
                type="monotone"
                dataKey="movingAvg"
                stroke="#6366f1"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                name="3-Week Avg"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

       {/* Table */}
       <div className="bg-white rounded-2xl shadow p-6 overflow-auto">
          <h3 className="text-lg font-semibold text-pink-700 mb-4">Expense Records</h3>
          <table className="w-full text-sm text-left">
            <thead className="bg-pink-100">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Currency</th>
                <th className="p-2">Note</th>
                <th className="p-2">Category</th>
                <th className="p-2">Action</th>
              </tr>
              <tr>
                <th className="p-2"><input className="w-full border rounded p-1" value={filters.date} onChange={e => handleFilterChange("date", e.target.value)} placeholder="Filter" /></th>
                <th className="p-2"><input className="w-full border rounded p-1" value={filters.amount} onChange={e => handleFilterChange("amount", e.target.value)} placeholder="Filter" /></th>
                <th className="p-2">
                  <select className="w-full border rounded p-1" value={filters.currency} onChange={e => handleFilterChange("currency", e.target.value)}>
                    <option value="">All</option>
                    {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </th>
                <th className="p-2"><input className="w-full border rounded p-1" value={filters.note} onChange={e => handleFilterChange("note", e.target.value)} placeholder="Filter" /></th>
                <th className="p-2">
                  <select className="w-full border rounded p-1" value={filters.category} onChange={e => handleFilterChange("category", e.target.value)}>
                    <option value="">All</option>
                    {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </th>
                <th className="p-2 text-center">
                  <button className="text-sm text-blue-600 underline" onClick={() => { setFilters({ date: "", amount: "", currency: "", note: "", category: "" }); setCurrentPage(1); }}>Reset</button>
                </th>
              </tr>
            </thead>
            <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                    <tr key={item.id} className="border-t">
                        <td className="p-2">{item.date}</td>
                        <td className="p-2">{item.amount}</td>
                        <td className="p-2">{item.currency}</td>
                        <td className="p-2">{item.note}</td>
                        <td className="p-2">{item.category}</td>
                        <td className="p-2 text-center">
                        <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Edit
                        </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="6" className="text-center text-gray-400 p-4 italic">
                        No expense records found.
                    </td>
                    </tr>
                )}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between items-center">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="space-x-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expense;
