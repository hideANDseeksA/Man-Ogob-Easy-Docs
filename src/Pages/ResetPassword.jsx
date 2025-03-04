import React, { useState } from "react";
import axios from "axios";
import { useLocation,useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; 

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match',
      });
      return;
    }

    Swal.fire({
      title: 'Please wait...',
      text: 'Updating your password',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await axios.put("https://bned-backend.onrender.com/user/update_password", {
        email,
        password: newPassword,
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
      }).then((result) => {
        navigate('/')
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center md:mt-44 mt-[150px] bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-auto text-center border border-green-500">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <p className="text-gray-600 mb-4">Enter your new password below.</p>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 mb-3 border-2 border-gray-300 rounded focus:outline-none focus:border-yellow-500"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-3 border-2 border-gray-300 rounded focus:outline-none focus:border-yellow-500"
        />

        <button
          className={`w-full p-2 rounded-lg font-semibold ${
            newPassword && confirmPassword ? "bg-yellow-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!newPassword || !confirmPassword}
          onClick={handleReset}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
