import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-50 p-10 flex flex-col items-center space-y-10">
        {/* Profile Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-3xl">
          <h2 className="text-4xl font-bold text-blue-600 text-center mb-8">Your Profile</h2>
          <div className="space-y-5 text-gray-700 text-base leading-relaxed">
            <div className="flex justify-between border-b pb-3">
              <span className="font-semibold">Name:</span><span>{user.name}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="font-semibold">Email:</span><span>{user.email}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="font-semibold">Phone:</span><span>{user.phone}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="font-semibold">DOB:</span><span>{user.dob || "-"}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="font-semibold">Occupation:</span><span>{user.occupation}</span>
            </div>
            {user.university && (
              <div className="flex justify-between border-b pb-3">
                <span className="font-semibold">University:</span><span>{user.university}</span>
              </div>
            )}
            {user.company && (
              <div className="flex justify-between">
                <span className="font-semibold">Company:</span><span>{user.company}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
