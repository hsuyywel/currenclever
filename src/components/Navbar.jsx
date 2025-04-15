import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";

function Navbar() {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-blue-600 font-bold text-xl">
        <Link to="/">💸 CurrenClever</Link>
      </div>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
        <Link to="/convert" className="text-gray-700 hover:text-blue-500">Converter</Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
      </div>
    </nav>
  );
}

  export default Navbar;
