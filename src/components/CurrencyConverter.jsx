import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";

const currencyList = ["EUR", "GBP", "USD", "HKD", "JPY"];
const flagEmoji = {
  EUR: "💶",
  GBP: "🇬🇧",
  USD: "🇺🇸",
  HKD: "🇭🇰",
  JPY: "🇯🇵",
};

function CurrencyConverter() {
  const [fromCurrency] = useState("GBP");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("0.00");
  const [converted, setConverted] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [todayRate, setTodayRate] = useState(null);
  const [hasExchanged, setHasExchanged] = useState(false);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setHasExchanged(false); // Reset output until exchange
  };

  const handleExchange = async () => {
    setHasExchanged(false);
    setForecastData([]);
    setTodayRate(null);
    setConverted("");

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ currency: `GBP_${toCurrency}` }),
        mode: "cors"  // ✅ make sure this is included
      });
      const data = await res.json();
      console.log("Prediction response:", data);

      if (Array.isArray(data)) {
        const formatted = data.map(([date, rate]) => ({
          date: new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }),
          rate: parseFloat(rate.toFixed(4)),
        }));

        setForecastData(formatted);
        setTodayRate(formatted[0]?.rate ?? null);

        const num = parseFloat(amount);
        if (!isNaN(num) && formatted[0]) {
          setConverted((num * formatted[0].rate).toFixed(2));
        }

        setHasExchanged(true);
      } else {
        console.error("Unexpected API response:", data);
      }
    } catch (err) {
      console.error("Exchange fetch failed:", err);
    }
  };

  const rateDisplay = todayRate
    ? `1 ${fromCurrency} = ${todayRate.toFixed(6)} ${toCurrency}`
    : hasExchanged
      ? "Failed to load rate"
      : "Loading rate...";

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-50 p-8 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Currency Converter</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">You send</label>
            <div className="flex gap-2">
              <div className="p-2 border border-gray-300 rounded-lg w-1/3 bg-gray-100 text-gray-700 flex items-center justify-center">
                🇬🇧 GBP
              </div>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                className="p-2 border border-gray-300 rounded-lg w-2/3"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Recipient gets</label>
            <div className="flex gap-2">
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg w-1/3"
              >
                {currencyList.map((cur) =>
                  cur !== "GBP" ? (
                    <option key={cur} value={cur}>
                      {flagEmoji[cur]} {cur}
                    </option>
                  ) : null
                )}
              </select>
              <input
                type="number"
                value={converted}
                disabled
                className="p-2 border border-gray-300 rounded-lg w-2/3 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <button
            onClick={handleExchange}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            🔁 Exchange
          </button>
        </div>

        <div className="text-center text-green-600 font-semibold mb-6">{rateDisplay}</div>

        <div>
          <h3 className="text-base font-medium text-blue-700 text-center mb-1">📈 7-Day Forecast</h3>
          {forecastData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={forecastData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b7280" }}>
                  <Label value="Date (dd/mm)" offset={-10} position="insideBottom" style={{ fill: '#9ca3af', fontSize: 10 }} />
                </XAxis>
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: "#6b7280" }}>
                  <Label angle={-90} value="Rate" position="insideLeft" style={{ fill: '#9ca3af', fontSize: 10 }} />
                </YAxis>
                <Tooltip contentStyle={{ fontSize: "0.75rem" }} />
                <Line type="monotone" dataKey="rate" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            hasExchanged && <div className="text-center text-sm text-gray-400">No forecast data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CurrencyConverter;
