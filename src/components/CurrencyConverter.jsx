import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";

const exchangeRates = {
  SGD: { GBP: 0.5683, USD: 0.74, CNY: 5.27, MYR: 3.49, THB: 26.15 },
  GBP: { SGD: 1.7593, USD: 1.3, CNY: 9.26, MYR: 6.14, THB: 46.01 },
  USD: { GBP: 0.77, SGD: 1.35, CNY: 7.12, MYR: 4.72, THB: 35.5 },
  CNY: { GBP: 0.11, USD: 0.14, SGD: 0.19, MYR: 0.66, THB: 4.99 },
  MYR: { GBP: 0.16, USD: 0.21, SGD: 0.29, CNY: 1.51, THB: 7.61 },
  THB: { GBP: 0.022, USD: 0.028, SGD: 0.038, CNY: 0.2, MYR: 0.13 },
};

const currencyList = ["SGD", "GBP", "USD", "CNY", "MYR", "THB"];
const flagEmoji = {
  SGD: "🇸🇬",
  GBP: "🇬🇧",
  USD: "🇺🇸",
  CNY: "🇨🇳",
  MYR: "🇲🇾",
  THB: "🇹🇭",
};

function CurrencyConverter() {
    const [fromCurrency, setFromCurrency] = useState("SGD");
    const [toCurrency, setToCurrency] = useState("GBP");
    const [amount, setAmount] = useState("435");
    const [converted, setConverted] = useState((435 * exchangeRates.SGD.GBP).toFixed(2));
  
    const getExchangeRate = (from, to) => {
      return exchangeRates[from]?.[to] || 1;
    };
  
    const handleAmountChange = (e) => {
      const input = e.target.value;
      setAmount(input);
      const num = parseFloat(input);
      if (!isNaN(num)) {
        const rate = getExchangeRate(fromCurrency, toCurrency);
        setConverted((num * rate).toFixed(2));
      } else {
        setConverted("");
      }
    };
  
    const handleConvertedChange = (e) => {
      const input = e.target.value;
      setConverted(input);
      const num = parseFloat(input);
      if (!isNaN(num)) {
        const rate = getExchangeRate(fromCurrency, toCurrency);
        setAmount((num / rate).toFixed(2));
      } else {
        setAmount("");
      }
    };
  
    const swapCurrencies = () => {
      const temp = fromCurrency;
      setFromCurrency(toCurrency);
      setToCurrency(temp);
      const rate = getExchangeRate(toCurrency, fromCurrency);
      const num = parseFloat(amount);
      if (!isNaN(num)) {
        setConverted((num * rate).toFixed(2));
      } else {
        setConverted("");
      }
    };
  
    const rateDisplay = `1 ${fromCurrency} = ${getExchangeRate(fromCurrency, toCurrency).toFixed(6)} ${toCurrency}`;
  
    const forecastData = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
      const rate = getExchangeRate(fromCurrency, toCurrency) * (1 + (Math.random() - 0.5) * 0.02);
      return { date: formattedDate, rate: rate.toFixed(4) };
    });
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-50 p-8 flex justify-center items-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Currency Converter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700">You send</label>
              <div className="flex gap-2">
                <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="p-2 border border-gray-300 rounded-lg w-1/3">
                  {currencyList.map((cur) => (
                    <option key={cur} value={cur}>{flagEmoji[cur]} {cur}</option>
                  ))}
                </select>
                <input type="number" value={amount} onChange={handleAmountChange} className="p-2 border border-gray-300 rounded-lg w-2/3" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700">Recipient gets</label>
              <div className="flex gap-2">
                <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="p-2 border border-gray-300 rounded-lg w-1/3">
                  {currencyList.map((cur) => (
                    <option key={cur} value={cur}>{flagEmoji[cur]} {cur}</option>
                  ))}
                </select>
                <input type="number" value={converted} onChange={handleConvertedChange} className="p-2 border border-gray-300 rounded-lg w-2/3" />
              </div>
            </div>
          </div>
          <div className="text-center mb-4">
            <button onClick={swapCurrencies} className="text-sm text-blue-500 hover:text-blue-700 underline">🔁 Swap currencies</button>
          </div>
          <div className="text-center text-green-600 font-semibold mb-6">{rateDisplay}</div>
          <div>
            <h3 className="text-base font-medium text-blue-700 text-center mb-1">📈 7-Day Forecast</h3>
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
          </div>
        </div>
      </div>
    );
  }

  export default CurrencyConverter;