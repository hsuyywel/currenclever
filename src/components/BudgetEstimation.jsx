import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContex";
import PieChartDisplay from "./PieChartDisplay";

const categories = [
  "Food",
  "Groceries",
  "Fashion",
  "Leisures",
  "Accommodation",
  "Insurance",
  "Miscellaneous"
];

const colors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#C9CBCF"
];

function BudgetEstimation() {
  const { user } = useAuth();
  const [actual, setActual] = useState([]);
  const [estimated, setEstimated] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1-based
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
  const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;

  useEffect(() => {
    if (!user?.email) return;

    setIsLoading(true);

    const actualURL = `http://127.0.0.1:5000/budget?email=${user.email}&month=${selectedMonth}&year=${selectedYear}`;
    const estimatedURL = `http://127.0.0.1:5000/budget?email=${user.email}&month=${nextMonth}&year=${nextYear}`;

    Promise.all([axios.get(actualURL), axios.get(estimatedURL)])
      .then(([actualRes, estimatedRes]) => {
        setActual(actualRes.data.actual);
        setEstimated(estimatedRes.data.estimated);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching budget:", err);
        setActual([]);
        setEstimated([]);
        setIsLoading(false);
      });
  }, [user, selectedMonth, selectedYear]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white px-8 py-10 rounded-3xl shadow-2xl w-full max-w-xl mb-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Upcoming Budget Estimation</h2>
        <p className="text-gray-600 text-center">Select month and year to view actual and forecasted budgets.</p>

        <div className="flex justify-center mt-4 gap-4">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {(i + 1).toString().padStart(2, "0")}
              </option>
            ))}
          </select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {[2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-blue-600 font-medium">🔄 Loading your budget data...</p>
      ) : (
        <PieChartDisplay
          actual={actual}
          estimated={estimated}
          actualMonth={selectedMonth}
          actualYear={selectedYear}
          estimatedMonth={nextMonth}
          estimatedYear={nextYear}
        />
      )}
    </div>
  );
}

export default BudgetEstimation;
