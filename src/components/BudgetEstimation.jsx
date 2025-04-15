import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";

function BudgetEstimation() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white px-8 py-10 rounded-3xl shadow-2xl w-full max-w-xl">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Upcoming Budget Estimation</h2>
          <p className="text-gray-600 text-center">Soon you'll see your AI-based upcoming month's expense forecast here!</p>
        </div>
      </div>
    );
  }

  export default BudgetEstimation;