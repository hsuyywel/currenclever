import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const currencyOptions = ["GBP", "USD", "CNY", "JPY", "SGD", "MYR", "THB"];
const expenseCategories = ["Food", "Groceries", "Fashion", "Leisures", "Accommodation", "Insurance", "Miscellaneous"];


function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editingIncome, setEditingIncome] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [estimatedBudget, setEstimatedBudget] = useState(null);

  const validateForm = (form, requiredFields) => {
    for (const field of requiredFields) {
      if (!form[field].value.trim()) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
        return false;
      }
    }
    return true;
  };

  const fetchProfileData = () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      navigate("/login");
      return;
    }

    fetch("http://localhost/CurrenClever_Backend/get_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) setUser(data.user);
      else setError(data.error || "Failed to load profile.");
      })
      .catch(() => setError("Server error"));

    Promise.all([
      fetch("http://localhost/CurrenClever_Backend/get_income.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).then(res => res.json()),
      fetch("http://localhost/CurrenClever_Backend/get_expenses.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).then(res => res.json())
    ]).then(([incomeRes, expenseRes]) => {
      if (incomeRes.success) setIncome(incomeRes.income);
      if (expenseRes.success) setExpenses(expenseRes.expenses);
    });
  };

  useEffect(() => { fetchProfileData(); }, [navigate, refresh]);

  const handleAddIncome = (e) => {
    e.preventDefault();
    const form = e.target;
    const requiredFields = ["amount", "currency", "date"];
    if (!validateForm(form, requiredFields)) return;

    const payload = {
      email: user.email,
      amount: form.amount.value,
      currency: form.currency.value,
      date: form.date.value,
      note: form.note.value,
    };
    let endpoint = "add_income.php";
    if (editingIncome) {
      payload.id = editingIncome.id;
      endpoint = "update_income.php";
    }

    fetch(`http://localhost/CurrenClever_Backend/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
          toast.success(editingIncome ? "Income updated" : "Income added");
          setShowIncomeModal(false);
          setEditingIncome(null);
          setRefresh(prev => !prev);
        } else {
          toast.error("Failed to save income");
        }
      })
      .catch(() => toast.error("Server error"));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const form = e.target;
    const requiredFields = ["amount", "currency", "date", "category"];
    if (!validateForm(form, requiredFields)) return;

    const payload = {
      email: user.email,
      amount: form.amount.value,
      currency: form.currency.value,
      date: form.date.value,
      note: form.note.value,
      category: form.category.value,
    };
    fetch("http://localhost/CurrenClever_Backend/add_expense.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Expense added successfully");
          setShowExpenseModal(false);
          setRefresh(prev => !prev);
        } else {
          toast.error("Failed to add expense");
        }
      })
      .catch(() => toast.error("Server error"));
  };

  if (error) return <div className="p-10 text-red-500 text-center">{error}</div>;
  if (!user) return <div className="p-10 text-gray-500 text-center">Loading profile...</div>;

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-50 p-6 flex flex-col items-center space-y-6">
        <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">Your Profile</h2>
          <div className="text-gray-700 space-y-1 text-sm">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>DOB:</strong> {user.dob || "-"}</p>
            <p><strong>Occupation:</strong> {user.occupation}</p>
            {user.university && <p><strong>University:</strong> {user.university}</p>}
            {user.company && <p><strong>Company:</strong> {user.company}</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-4xl">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-blue-600">Income</h3>
            <button onClick={() => setShowIncomeModal(true)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">+ Add Income</button>
          </div>
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-2 py-1">Date</th>
                <th className="px-2 py-1">Amount</th>
                <th className="px-2 py-1">Currency</th>
                <th className="px-2 py-1">Note</th>
              </tr>
            </thead>
            <tbody>
              {income.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-2 py-1">{item.date}</td>
                  <td className="px-2 py-1">{item.amount}</td>
                  <td className="px-2 py-1">{item.currency}</td>
                  <td className="px-2 py-1">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-4xl">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-pink-600">Expenses</h3>
            <button onClick={() => setShowExpenseModal(true)} className="bg-pink-600 text-white px-3 py-1 rounded text-sm">+ Add Expense</button>
          </div>
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-pink-100">
              <tr>
                <th className="px-2 py-1">Date</th>
                <th className="px-2 py-1">Amount</th>
                <th className="px-2 py-1">Currency</th>
                <th className="px-2 py-1">Category</th>
                <th className="px-2 py-1">Note</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-2 py-1">{item.date}</td>
                  <td className="px-2 py-1">{item.amount}</td>
                  <td className="px-2 py-1">{item.currency}</td>
                  <td className="px-2 py-1">{item.category}</td>
                  <td className="px-2 py-1">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 rounded-xl shadow-inner border border-gray-200 p-6 w-full max-w-4xl text-center">
          <h3 className="text-xl font-bold text-gray-700 mb-2">Next Month Budget Estimation</h3>
          {estimatedBudget ? (
            <p className="text-2xl font-semibold text-green-600">Estimated Budget: £{estimatedBudget}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">🧠 Crunching the numbers... we'll show your smart budget soon!</p>
          )}
        </div>

        {showIncomeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm space-y-4">
              <h2 className="text-lg font-bold text-blue-600">Add Income</h2>
              <form onSubmit={handleAddIncome} className="space-y-3">
                <input name="amount" type="number" placeholder="Amount" required className="w-full border rounded p-2" />
                <select name="currency" className="w-full border rounded p-2">
                  {currencyOptions.map(c => <option key={c}>{c}</option>)}
                </select>
                <input name="date" type="date" required className="w-full border rounded p-2" />
                <input name="note" type="text" placeholder="Note" className="w-full border rounded p-2" />
                <div className="flex justify-end gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Save</button>
                  <button type="button" onClick={() => setShowIncomeModal(false)} className="text-gray-500">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showExpenseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm space-y-4">
              <h2 className="text-lg font-bold text-pink-600">Add Expense</h2>
              <form onSubmit={handleAddExpense} className="space-y-3">
                <input name="amount" type="number" placeholder="Amount" required className="w-full border rounded p-2" />
                <select name="currency" className="w-full border rounded p-2">
                  {currencyOptions.map(c => <option key={c}>{c}</option>)}
                </select>
                <input name="date" type="date" required className="w-full border rounded p-2" />
                <select name="category" className="w-full border rounded p-2">
                  {expenseCategories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
                <input name="note" type="text" placeholder="Note" className="w-full border rounded p-2" />
                <div className="flex justify-end gap-2">
                  <button type="submit" className="bg-pink-600 text-white px-4 py-1 rounded">Save</button>
                  <button type="button" onClick={() => setShowExpenseModal(false)} className="text-gray-500">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;