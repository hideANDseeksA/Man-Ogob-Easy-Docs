import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Hook for navigation


  if (!isOpen) return null;

  const handleResetPassword = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch("https://bned-backend.onrender.com/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        const code = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit verification code
        try {
          await fetch("https://bned-backend.onrender.com/user/update_code", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
          });
          navigate("/verification", { state: { email: email,code:code, mode:'forgotpassword'} });
        } catch (error) {
          console.error("Error resending OTP:", error);
          alert('Failed to resend OTP. Please try again later.');
        }
       
       
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }

    setLoading(false); // Stop loading
  };




  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
          <p className="text-gray-700 mb-4">
            Enter your email address to reset your password.
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            required
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleResetPassword}
            className="w-full bg-[#376a63] text-white py-2 rounded-lg hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Checking..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
