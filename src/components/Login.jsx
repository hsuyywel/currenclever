import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";

function Login() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 block w-full p-2 border border-gray-300 rounded-lg" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" className="mt-1 block w-full p-2 border border-gray-300 rounded-lg" placeholder="••••••••" required />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-full shadow hover:bg-blue-600 transition">Login</button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-500">Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link></p>
        </div>
      </div>
    );
  }

  export default Login;

  