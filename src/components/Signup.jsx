import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    occupation: '',
    university: '',
    company: ''
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost/CurrenClever_Backend/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      console.log("Signup result:", result);
      
      if (result.success) {
        navigate("/success");
      } else {
        alert("Error: " + result.error);
      }      
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred.");
    }
  };

  const isStudent = formData.occupation.includes("Student");
  const isEmployed = formData.occupation.includes("Employed");

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Your Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="date" name="dob" placeholder="DOB" value={formData.dob} onChange={handleChange} className="w-full p-2 border rounded" />

          <select name="occupation" value={formData.occupation} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select Occupation</option>
            <option>Full Time Employed</option>
            <option>Part Time Employed</option>
            <option>Full Time Student</option>
            <option>Part Time Student</option>
            <option>Full Time Employed and Part Time Student</option>
            <option>Part Time Employed and Full Time Student</option>
          </select>

          {isStudent && (
            <input type="text" name="university" placeholder="University" value={formData.university} onChange={handleChange} className="w-full p-2 border rounded" />
          )}

          {isEmployed && (
            <input type="text" name="company" placeholder="Company" value={formData.company} onChange={handleChange} className="w-full p-2 border rounded" />
          )}

          <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded-full shadow hover:bg-pink-600 transition">Sign Up</button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-500">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
export default Signup;

