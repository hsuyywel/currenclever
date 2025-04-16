import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-blue-600 mb-4"
        >
          🎉 Success!
        </motion.h2>
        <p className="text-gray-600 mb-6">
          Your account has been created successfully.
        </p>
        <Link to="/login">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600 transition">
            Go to Login
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

export default Success;