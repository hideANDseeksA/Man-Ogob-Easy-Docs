import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // Retrieve email from state
  const mode = location.state?.mode ||"" ;
  const bt = location.state?.bt ||"" ;
  const[buttonName,setbuttonName]=useState("Resend Otp");
  const apiUrl = import.meta.env.VITE_API_URL;
  const headerName = import.meta.env.VITE_HEADER_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
  

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  const updateMode = (newMode) => {
    navigate(location.pathname, {
      state: { ...location.state, bt: newMode },
      replace: true // prevents pushing a new history entry
    });
    setbuttonName('Resend Otp');
  };
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if a number is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (index, e) => {
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    const fetchCountdown = async () => {
     
      if  (bt ==="" ){
        setbuttonName("Send Otp");
      }
      try {
        const response = await axios.post(
          `${apiUrl}/check_count_code_expirtation`,
          { email },
          {
            headers: {
             [headerName]:apiKey,
            },
          }
        );

        setTimer(response.data.countdown);
        setCanResend(response.data.countdown <= 0);
      } catch (error) {
       
       setTimer(0);
      }
    };

    fetchCountdown();
  }, [email]);

  
  const handleResend = async () => {
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
    try {
      Swal.fire({
        title: 'Sending OTP...',
        text: 'Please wait while we send a new OTP to your email.',
        customClass: {
          popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
          title: 'text-lg sm:text-xl font-semibold text-green-600',
          htmlContainer: 'text-sm sm:text-base text-gray-700',
        
        },
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      await axios.put(`${apiUrl}/update_code`, { email,mode },{
        headers:{
  [headerName]:apiKey,
          }
      });
      setOtp(["", "", "", "", "", ""]);
      setTimer(180);
      setCanResend(false);
      Swal.fire({
        icon: 'success',
        title: 'OTP Resent',
        text: 'A new OTP has been sent to your email.',
        customClass: {
          popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
          title: 'text-lg sm:text-xl font-semibold text-green-600',
          htmlContainer: 'text-sm sm:text-base text-gray-700',
        }
      });
      updateMode("none");
    } catch (error) {
      console.error("Error resending OTP:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to resend OTP. Please try again later.',
        showConfirmButton:true,
        customClass: {
          popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
          title: 'text-lg sm:text-xl font-semibold text-red-600',
          htmlContainer: 'text-sm sm:text-base text-gray-700',
          confirmButton: 'mt-4 bg-red-600 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
        }
      });
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
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
  
    if (enteredOtp.length !== 6) {
      return Swal.fire({
        icon: 'warning',
        title: 'Incomplete OTP',
        text: 'Please enter the full OTP.',
        customClass: {
          popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
          title: 'text-lg sm:text-xl font-semibold text-re-600',
          htmlContainer: 'text-sm sm:text-base text-gray-700',
          confirmButton: 'mt-4 bg-red-500 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
        }
      });
    }

  
  
    try {
      Swal.fire({
        title: 'Verifying OTP...',
        text: 'Please wait while we verify your OTP.',
        customClass: {
          popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
          title: 'text-lg sm:text-xl font-semibold text-green-600',
          htmlContainer: 'text-sm sm:text-base text-gray-700',
        },
        allowOutsideClick: false,
        
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      const response =  await axios.post(`${apiUrl}/verify_account`, {
          email,
          code:parseInt(enteredOtp)
        }, {
          headers: {
          [headerName]:apiKey,
          }
        });
  
      Swal.close(); // close loading
      updateMode("");
  
     
  
      if (mode === "forgot_password") {
        navigate("/resetpassword", { state: { email } });
      } else {
         await Swal.fire({
        icon: 'success',
        title: 'Verification Successful',
        text: 'Your email has been verified successfully.',
        customClass: {
          popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
          title: 'text-lg sm:text-xl font-semibold text-green-600',
          htmlContainer: 'text-sm sm:text-base text-gray-700',
          confirmButton: 'mt-4 bg-green-600 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-green-600 focus:outline-none'
        }
      });
        navigate("/");
      }
    } catch (error) {
      Swal.close(); // close loading if it fails
    
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: error.response?.data?.message || 'Failed to verify OTP. Please try again.',
        customClass: {
          popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
          title: 'text-lg sm:text-xl font-semibold text-red-600',
          htmlContainer: 'text-sm sm:text-base text-gray-700',
          confirmButton: 'mt-4 bg-red-500 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
        }
      });
    }    
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(paste)) {
      const newOtp = paste.split("");
      setOtp(newOtp);
      // Focus the last input
      inputRefs.current[5]?.focus();
    }
  };
  
  

  const isOtpFilled = otp.every((digit) => digit !== "");

  return (
    <div className="flex flex-col items-center justify-center  md:mt-44 mt-[150px] bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-auto text-center border border-green-500">
        <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
        <p className="text-gray-600 mb-4">Enter the 6-digit code sent to your email.</p>

        <div className="flex justify-center space-x-2 mb-4">
          {otp.map((digit, index) => (
        <input
        key={index}
        ref={(el) => (inputRefs.current[index] = el)}
        type="text"
        maxLength="1"
        value={digit}
        onChange={(e) => handleChange(index, e)}
        onKeyDown={(e) => handleBackspace(index, e)}
        onPaste={(e) => handlePaste(e)}
        className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded focus:outline-none focus:border-yellow-500"
      />
      
          ))}
        </div>

        <button
          className={`w-full p-2 rounded-lg font-semibold ${
            isOtpFilled ? "bg-yellow-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!isOtpFilled}
          onClick={handleVerify}
        >
          Verify OTP
        </button>

        <div className="mt-4 text-gray-600">

     


          {canResend ? (
            <button className="text-green-500 font-semibold" onClick={handleResend}>
              {buttonName}
            </button>
          ) : (
            <p>Resend OTP in {formatTime(timer)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;