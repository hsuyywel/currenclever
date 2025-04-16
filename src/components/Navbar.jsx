import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const updateUser = () => {
      const email = localStorage.getItem("userEmail");
      setUserEmail(email);
    };
  
    // Initial load
    updateUser();
  
    // Listen for login event
    window.addEventListener("userLoggedIn", updateUser);
  
    return () => {
      window.removeEventListener("userLoggedIn", updateUser);
    };
  }, []);

  const handleLogout = () => {
    // Remove login data
    localStorage.removeItem("userEmail");
  
    // Trigger any listeners
    window.dispatchEvent(new Event("userLoggedOut"));
  
    // Navigate to login, then refresh the page
    navigate("/login");
    setTimeout(() => {
      window.location.reload(); // ✅ refresh so Navbar updates fully
    }, 100); 
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-blue-600 font-bold text-xl">
        <Link to="/">💸 CurrenClever</Link>
      </div>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
        <Link to="/convert" className="text-gray-700 hover:text-blue-500">Converter</Link>

        {/* Show Login only if user not logged in */}
        {!userEmail && (
          <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
        )}

        {/* Show email and logout if logged in */}
          {userEmail && (
    <>
      <Link
        to="/profile"
        className="text-sm text-blue-600 font-semibold hover:underline"
      >
        {userEmail}
      </Link>
      <button
        onClick={handleLogout}
        className="text-sm text-red-500 hover:underline ml-2"
      >
        Logout
      </button>
    </>
  )}

      </div>
    </nav>
  );
}

export default Navbar;
