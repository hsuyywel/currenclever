import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";

import Navbar from "./components/Navbar";
import CurrencyConverter from "./components/CurrencyConverter";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import BudgetEstimation from "./components/BudgetEstimation";
import Home from "./components/Home";
import Success from "./components/SUSuccess";
import Income from "./components/Income";
import Expense from "./components/Expense";
import { AuthProvider } from "./components/AuthContex";

function App() {
  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/convert" element={<CurrencyConverter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/budget" element={<BudgetEstimation />} />
        <Route path="/success" element={<Success />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/income" element={<Income />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;