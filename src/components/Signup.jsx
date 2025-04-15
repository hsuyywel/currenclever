import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";

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
        const response = await fetch("./backend/signup.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
          alert("Signup successful!");
        } else {
          alert("Signup failed: " + result.error);
        }
      } catch (error) {
        console.error("Signup error:", error);
        alert("An error occurred.");
      }
    };
    const [occupation, setOccupation] = useState('');
    const [universities, setUniversities] = useState([]);
    const isStudent = occupation.includes("Student");
    const isEmployed = occupation.includes("Employed");
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Your Account</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" className="mt-1 block w-full p-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 block w-full p-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" className="mt-1 block w-full p-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" className="mt-1 block w-full p-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth <span className="text-gray-400" title="Used for data insights">ℹ️</span></label>
              <input type="date" className="mt-1 block w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Occupational Status</label>
              <select className="mt-1 block w-full p-2 border border-gray-300 rounded-lg" value={occupation} onChange={(e) => setOccupation(e.target.value)} required>
                <option value="">Select</option>
                <option>Full Time Employed</option>
                <option>Part Time Employed</option>
                <option>Full Time Student</option>
                <option>Part Time Student</option>
                <option>Full Time Employed and Part Time Student</option>
                <option>Part Time Employed and Full Time Student</option>
              </select>
            </div>
            {isStudent && (
              <div>
                <label className="block text-sm font-medium text-gray-700">University (optional)</label>
  <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-lg" placeholder="Enter your university" />
              </div>
            )}
            {isEmployed && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name (optional)</label>
                <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-lg" />
              </div>
            )}
            <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded-full shadow hover:bg-pink-600 transition">Sign Up</button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-500">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
        </div>
      </div>
    );
  }
export default Signup;

