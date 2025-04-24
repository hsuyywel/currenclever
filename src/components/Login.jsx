import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContex";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Use login function from context
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const res = await fetch("http://localhost/CurrenClever_Backend/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const result = await res.json();

    if (result.success) {
      localStorage.setItem("userEmail", formData.email);
      window.dispatchEvent(new Event("userLoggedIn"));

      // ✅ Also update auth context
      login({ name: result.name, email: formData.email });

      navigate("/profile");
    } else {
      alert(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white px-8 py-10 rounded-3xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login to CurrenClever</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-full shadow hover:bg-blue-600 transition">Login</button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-500">Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a></p>
      </div>
    </div>
  );
}
