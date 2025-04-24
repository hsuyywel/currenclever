import { useNavigate, Link } from "react-router-dom";
import React from "react";
import { useAuth } from "./AuthContex";

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleForecastClick = () => {
    if (user) {
      navigate("/profile"); // ✅ Redirect to profile when logged in
    } else {
      navigate("/login");   // Otherwise, go to login
    }
  };

  return (
    <div className="bg-gradient-to-b from-pink-100 to-blue-50 min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">Smart Budget & Currency Forecast</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-6">
        Easily estimate your monthly expenses, forecast currency trends, and manage your financial plans with AI-powered tools. Personalized, insightful, and super easy to use.
      </p>
      <div className="space-x-4">
        <Link to="/convert">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-full shadow hover:bg-blue-600 transition">
            Start Converting
          </button>
        </Link>
        <button
          onClick={handleForecastClick}
          className="bg-pink-500 text-white px-6 py-3 rounded-full shadow hover:bg-pink-600 transition"
        >
          Forecast Now
        </button>
      </div>
      <div className="mt-10 text-sm text-gray-400">© 2025 CurrenClever. All rights reserved.</div>
    </div>
  );
}

export default Home;
