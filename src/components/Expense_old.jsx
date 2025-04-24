import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

function Expense() {
  const [expenseList, setExpenseList] = useState([]);
  const [form, setForm] = useState({ amount: "", currency: "GBP", date: "", note: "", category: "" });
  const [editId, setEditId] = useState(null);
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail"));
  const [filters, setFilters] = useState({ date: "", amount: "", currency: "", note: "", category: "" });
  const [chartFilters, setChartFilters] = useState({ date: "", currency: "GBP" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currencyOptions = ["GBP", "USD", "HKD", "JPY", "EUR"];
  const categoryOptions = ["Food", "Groceries", "Fashion", "Leisures", "Accommodation", "Insurance", "Miscellaneous"];

  const fetchExpense = () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      toast.error("User email not found. Please login.");
      return;
    }
    setUserEmail(email);

    fetch("http://localhost/CurrenClever_Backend/expense.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setExpenseList(data.expense);
        else toast.error(data.error || "Failed to fetch expenses");
      })
      .catch(() => toast.error("Server error"));
  };

  useEffect(() => {
    fetchExpense();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email: userEmail,
      ...form,
      ...(editId && { id: editId })
    };
    console.log("Sending payload:", payload);

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
          fetchExpense();
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
    (!filters.currency || item.currency.toLowerCase().includes(filters.currency.toLowerCase())) &&
    (!filters.note || item.note?.toLowerCase().includes(filters.note.toLowerCase())) &&
    (!filters.category || item.category?.toLowerCase().includes(filters.category.toLowerCase()))
  );
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const chartData = (expenseList || []).filter(item => {
    const currencyMatch = chartFilters.currency ? item.currency === chartFilters.currency : true;
    const dateMatch = chartFilters.date ? item.date.includes(chartFilters.date) : true;
    return currencyMatch && dateMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-100 p-6">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-pink-700">Expense Management</h1>
        <p className="text-gray-600">Add, update and track your expense records.</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow p-6 max-w-2xl mx-auto mb-10">
        <h2 className="text-xl font-semibold text-pink-600 mb-4">
          {editId ? "Edit Expense" : "Add Expense"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required className="w-full border rounded p-2" />
          <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full border rounded p-2">
            {currencyOptions.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="w-full border rounded p-2" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="w-full border rounded p-2">
            <option value="">Select Category</option>
            {categoryOptions.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="text" placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full border rounded p-2" />
          <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">
            {editId ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </div>

      {/* Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-pink-700 mb-4">Expense Chart</h3>
          <div className="flex gap-4 mb-4">
            <select value={chartFilters.currency} onChange={(e) => setChartFilters(prev => ({ ...prev, currency: e.target.value }))} className="border rounded p-2">
              {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="month" value={chartFilters.date} onChange={(e) => setChartFilters(prev => ({ ...prev, date: e.target.value }))} className="border rounded p-2" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#db2777" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow p-6 overflow-auto">
          <h3 className="text-lg font-semibold text-pink-700 mb-4">Expense Records</h3>
          <table className="w-full text-sm text-left">
            <thead className="bg-pink-100">
              <tr>
                {['Date', 'Amount', 'Currency', 'Category', 'Note', 'Action'].map((h, i) => (
                  <th key={i} className="p-2">{h}</th>
                ))}
              </tr>
              <tr className="bg-pink-50">
                <th className="p-1"><input type="text" placeholder="Filter" value={filters.date} onChange={(e) => handleFilterChange("date", e.target.value)} className="w-full border p-1 rounded" /></th>
                <th className="p-1"><input type="text" placeholder="Filter" value={filters.amount} onChange={(e) => handleFilterChange("amount", e.target.value)} className="w-full border p-1 rounded" /></th>
                <th className="p-1">
                  <select value={filters.currency} onChange={(e) => handleFilterChange("currency", e.target.value)} className="w-full border p-1 rounded">
                    <option value="">All</option>
                    {currencyOptions.map(c => <option key={c}>{c}</option>)}
                  </select>
                </th>
                <th className="p-1">
                  <select value={filters.category} onChange={(e) => handleFilterChange("category", e.target.value)} className="w-full border p-1 rounded">
                    <option value="">All</option>
                    {categoryOptions.map(c => <option key={c}>{c}</option>)}
                  </select>
                </th>
                <th className="p-1"><input type="text" placeholder="Filter" value={filters.note} onChange={(e) => handleFilterChange("note", e.target.value)} className="w-full border p-1 rounded" /></th>
                <th className="p-1 text-center">
                  <button onClick={() => { setFilters({ date: "", amount: "", currency: "", note: "", category: "" }); setCurrentPage(1); }} className="text-xs bg-pink-200 px-2 py-1 rounded">Reset</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">{item.amount}</td>
                  <td className="p-2">{item.currency}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.note}</td>
                  <td className="p-2">
                    <button onClick={() => handleEdit(item)} className="text-pink-600 hover:underline text-sm">Edit</button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-400 p-4 italic">No matching records found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded">Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expense;
