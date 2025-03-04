import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // Retrieve email from state
  const code1 = location.state?.code || "";
  const mode = location.state?.mode ||"" ;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [code, setCode] = useState(Math.floor(100000 + Math.random() * 900000)); // Store code in state
  const inputRefs = useRef([]);

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

  const handleResend = async () => {
    try {
      Swal.fire({
        title: 'Sending OTP...',
        text: 'Please wait while we send a new OTP to your email.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const newCode = Math.floor(100000 + Math.random() * 900000); // Generate a new 6-digit code
      await axios.put("https://bned-backend.onrender.com/user/update_code", { email, code: newCode });
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      setCanResend(false);
      setCode(newCode); // Update state with new code
      Swal.fire({
        icon: 'success',
        title: 'OTP Resent',
        text: 'A new OTP has been sent to your email.',
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to resend OTP. Please try again later.',
      });
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if ( (enteredOtp === String(code)) || (enteredOtp === String(code1))  ) {
      try {
        Swal.fire({
          title: 'Verifying OTP...',
          text: 'Please wait while we verify your OTP.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await axios.put("https://bned-backend.onrender.com/user/update_verification", { email, verified: true });
        console.log("Verification successful:", response.data);
        Swal.fire({
          icon: 'success',
          title: 'Verification Successful',
          text: 'Your email has been verified successfully.',
        });
         if(mode === "forgotpassword"){
          navigate("/resetpassword", { state: { email: email}});
         }else{
          navigate("/");
         }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: 'Failed to verify OTP. Please try again.',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: 'Failed to verify OTP. Please try again.',
      });
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
              Resend OTP
            </button>
          ) : (
            <p>Resend OTP in {timer}s</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
