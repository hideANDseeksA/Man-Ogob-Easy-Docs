import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const headerName = import.meta.env.VITE_HEADER_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const email = location.state?.email;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W_]{8,}$/;

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      Swal.fire({
        icon: "success",
        title: "Back Online",
        toast: true,
        timer: 3000,
        position: "top-end",
        showConfirmButton: false,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      Swal.fire({
        icon: "error",
        title: "No Internet Connection",
        text: "Please check your network connection.",
        toast: true,
        timer: 3000,
        position: "top-end",
        showConfirmButton: false,
      });
    };

    const checkPoorConnection = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const { effectiveType, downlink, rtt } = connection;
        const isSlowConnection = effectiveType.includes("2g") || rtt > 500 || downlink < 0.5;

        if (isSlowConnection) {
          Swal.fire({
            icon: "warning",
            title: "Poor Internet Connection",
            text: "Your connection is slow. Some features may not work properly.",
            toast: true,
            timer: 4000,
            position: "top-end",
            showConfirmButton: false,
          });
        }
      }
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener("change", checkPoorConnection);
      checkPoorConnection(); // Check initially on mount
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (connection) {
        connection.removeEventListener("change", checkPoorConnection);
      }
    };
  }, []);

  const handleReset = async () => {
    if (!navigator.onLine) {
      Swal.fire({
        icon: 'error',
        title: 'No Internet',
        text: 'You are currently offline. Please check your connection.',
        toast: true,
        timer: 3000,
        position: 'top-end',
        showConfirmButton: false,
      });
      return;
    }

    if (!passwordPattern.test(newPassword) || !passwordPattern.test(confirmPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Password Requirements Not Met',
        text: 'Your password must be at least 8 characters long, contain at least one letter and one number, and include only letters and numbers.',
        customClass: {
          popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
          title: 'text-lg sm:text-xl font-semibold text-red-600',
          htmlContainer: 'text-sm sm:text-base text-gray-700',
          confirmButton: 'mt-4 bg-red-600 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
        },
        didOpen: () => {
          const style = document.createElement('style');
          style.innerHTML = `
            @media (max-width: 600px) {
              .swal2-popup.responsive-swal {
                width: 90% !important;
                font-size: 14px;
              }
            }
            @media (min-width: 601px) {
              .swal2-popup.responsive-swal {
                font-size: 16px;
              }
            }
          `;
          document.head.appendChild(style);
        }
      });
      return;
    }


    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match',
        customClass: {
          popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
          title: 'text-lg sm:text-xl font-semibold text-red-600',
          htmlContainer: 'text-sm sm:text-base text-gray-700',
          confirmButton: 'mt-4 bg-red-600 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
        }
      });
      return;
    }

    if (!navigator.onLine) {
      Swal.fire({
        icon: 'error',
        title: 'No Internet',
        text: 'You are currently offline. Please check your connection.',
        toast: true,
        timer: 3000,
        position: 'top-end',
        showConfirmButton: false,
      });
      return;
    }

    Swal.fire({
      title: 'Please wait...',
      text: 'Updating your password',
      customClass: {
        popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
        title: 'text-lg sm:text-xl font-semibold text-red-600',
        htmlContainer: 'text-sm sm:text-base text-gray-700',
        confirmButton: 'mt-4 bg-red-600 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
      },
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await axios.put(`${apiUrl}/update_password`, {
        email,
        password: newPassword,
      }, {
        headers: {
          [headerName]: apiKey,
        }

      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        customClass: {
          popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
          title: 'text-lg sm:text-xl font-semibold text-red-600',
          htmlContainer: 'text-sm sm:text-base text-gray-700',
          confirmButton: 'mt-4 bg-red-600 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
        },
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
          className={`w-full p-2 rounded-lg font-semibold ${newPassword && confirmPassword ? "bg-yellow-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
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
