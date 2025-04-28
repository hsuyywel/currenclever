import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { startOfWeek, format } from "date-fns"; // ✅ Added for weekly grouping
import { BASE_URL } from "../config/api.config";

function Income() {
  const [incomeList, setIncomeList] = useState([]);
  const [form, setForm] = useState({ amount: "", currency: "GBP", date: "", note: "" });
  const [editId, setEditId] = useState(null);
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail"));
  const [filters, setFilters] = useState({ date: "", amount: "", currency: "", note: "" });
  const [chartFilters, setChartFilters] = useState({ date: "", currency: "GBP" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currencyOptions = ["GBP", "USD", "HKD", "JPY", "EUR"];

  const fetchIncome = () => {
    fetch(`${BASE_URL}/income`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setIncomeList(data.income);
      });
  };

  useEffect(() => {
    fetchIncome();
    const storedEmail = localStorage.getItem("userEmail");
    if (!storedEmail) {
      toast.error("User email not found. Please login.");
    } else {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email: userEmail,
      ...form,
      ...(editId && { id: editId })
    };

    fetch(`${BASE_URL}/income`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success(editId ? "Income updated" : "Income added");
          setForm({ amount: "", currency: "GBP", date: "", note: "" });
          setEditId(null);
          fetchIncome();
        } else {
          toast.error("Failed to save income");
        }
      })
      .catch(() => toast.error("Server error"));
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ amount: item.amount, currency: item.currency, date: item.date, note: item.note });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredData = incomeList.filter((item) =>
    (!filters.date || item.date.includes(filters.date)) &&
    (!filters.amount || String(item.amount).includes(filters.amount)) &&
    (!filters.currency || item.currency.toLowerCase().includes(filters.currency.toLowerCase())) &&
    (!filters.note || item.note?.toLowerCase().includes(filters.note.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Weekly grouped + 3-week moving average
  const weeklyChartData = (() => {
    const filtered = (incomeList || []).filter(item => {
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
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-50 p-6">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-blue-700">Income Management</h1>
        <p className="text-gray-600">Add, update and track your income records.</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 max-w-2xl mx-auto mb-10">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          {editId ? "Edit Income" : "Add Income"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required className="w-full border rounded p-2" />
          <select name="currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full border rounded p-2">
            {currencyOptions.map((c) => (<option key={c}>{c}</option>))}
          </select>
          <input type="date" name="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="w-full border rounded p-2" />
          <input type="text" name="note" placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full border rounded p-2" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? "Update Income" : "Add Income"}
          </button>
        </form>
      </div>

      {/* Chart and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-700">Income Chart</h3>
            <div className="flex gap-2">
              <input
                type="month"
                placeholder="Filter date"
                className="border p-2 text-sm rounded"
                value={chartFilters.date}
                onChange={(e) => setChartFilters(prev => ({ ...prev, date: e.target.value }))}
              />
              <select
                className="border p-2 text-sm rounded"
                value={chartFilters.currency}
                onChange={(e) => setChartFilters(prev => ({ ...prev, currency: e.target.value }))}
              >
                {currencyOptions.map((c) => (
                  <option key={c}>{c}</option>
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
              <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} name="Weekly Income" />
              <Line type="monotone" dataKey="movingAvg" stroke="#6b21a8" strokeWidth={3} strokeDasharray="5 5" dot={false} name="3-Week Avg" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-700">Income Records</h3>
            <button
              onClick={() => {
                setFilters({ date: "", amount: "", currency: "", note: "" });
                setCurrentPage(1);
              }}
              className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Refresh
            </button>
          </div>

          <table className="w-full text-sm text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Currency</th>
                <th className="p-2">Note</th>
                <th className="p-2">Action</th>
              </tr>
              <tr>
                <th className="p-1">
                  <input type="text" placeholder="Search date" className="w-full border p-1 text-xs" value={filters.date} onChange={(e) => handleFilterChange("date", e.target.value)} />
                </th>
                <th className="p-1">
                  <input type="text" placeholder="Search amount" className="w-full border p-1 text-xs" value={filters.amount} onChange={(e) => handleFilterChange("amount", e.target.value)} />
                </th>
                <th className="p-1">
                  <select className="w-full border p-1 text-xs" value={filters.currency} onChange={(e) => handleFilterChange("currency", e.target.value)}>
                    <option value="">All</option>
                    <option value="GBP">GBP</option>
                  </select>
                </th>
                <th className="p-1">
                  <input type="text" placeholder="Search note" className="w-full border p-1 text-xs" value={filters.note} onChange={(e) => handleFilterChange("note", e.target.value)} />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">{item.amount}</td>
                  <td className="p-2">{item.currency}</td>
                  <td className="p-2">{item.note}</td>
                  <td className="p-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-400 p-4 italic">
                    No matching income records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end items-center gap-2 text-sm">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Income;
