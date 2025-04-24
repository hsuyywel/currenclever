// PieChartDisplay.jsx
import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register everything
ChartJS.register(ArcElement, ChartTooltip, Legend, ChartDataLabels);

// 🌸 Pastel color palette
const categories = [
  "Food",
  "Groceries",
  "Fashion",
  "Leisures",
  "Accommodation",
  "Insurance",
  "Miscellaneous",
];
const colors = [
  "#FFC1CC", // pastel pink
  "#AEEEEE", // pale cyan
  "#FFFACD", // lemon chiffon
  "#B0E0E6", // powder blue
  "#E6E6FA", // lavender
  "#FAD6A5", // peach
  "#D8BFD8", // thistle
];

// 📊 Pie chart data function
const pieData = (data) => ({
  labels: categories,
  datasets: [
    {
      label: "Amount (£)",
      data: data,
      backgroundColor: colors,
      borderColor: "#fff",
      borderWidth: 2,
    },
  ],
});

// 💅 Pie chart config
const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        font: { size: 13 },
        usePointStyle: true,
        padding: 12,
      },
    },
    datalabels: {
      color: "#333",
      anchor: "end",
      align: "start",
      font: {
        size: 12,
        weight: "bold",
      },
      formatter: (value) => (value > 0 ? `£${value.toFixed(2)}` : ""),
    },
  },
  animation: {
    animateRotate: true,
    duration: 1000,
  },
};

// 🧼 Utility
const isEmptyData = (data) =>
  !data || data.length === 0 || data.every((val) => Number(val) === 0);

const NoDataMessage = ({ label }) => (
  <div className="h-60 flex items-center justify-center text-gray-500 text-center text-sm">
    {`No ${label} data available. Try submitting your budget first!`}
  </div>
);

const PieChartDisplay = ({
  actual,
  estimated,
  actualMonth,
  actualYear,
  estimatedMonth,
  estimatedYear,
}) => {
  const formatLabel = (month, year) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mt-10">
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-center font-bold text-xl text-blue-700 mb-4">
          Actual Budget ({formatLabel(actualMonth, actualYear)})
        </h3>
        {isEmptyData(actual) ? (
          <NoDataMessage label="actual" />
        ) : (
          <Pie data={pieData(actual)} options={pieOptions} />
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-center font-bold text-xl text-purple-700 mb-4">
          Estimated Budget ({formatLabel(estimatedMonth, estimatedYear)})
        </h3>
        {isEmptyData(estimated) ? (
          <NoDataMessage label="estimated" />
        ) : (
          <Pie data={pieData(estimated)} options={pieOptions} />
        )}
      </div>
    </div>
  );
};

export default PieChartDisplay;
