import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import LoadingScreen from '../Components/LoadingScreen';
import ForgotPasswordModal from '../Components/ForgotPasswordModal';
import illustration from '../image/illustration.svg';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const SignInPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setIsOnline] = useState(navigator.onLine);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;
  const headerName = import.meta.env.VITE_HEADER_URL;
  const apiKey = import.meta.env.VITE_API_KEY;

  const openForgotPasswordModal = () => setIsForgotPasswordModalOpen(true);
  const closeForgotPasswordModal = () => setIsForgotPasswordModalOpen(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    
  if (!navigator.onLine) {
    Swal.fire({
      icon: 'warning',
      title: 'You are offline',
      toast: true,
      timer: 3000,
      position: 'top-end',
      showConfirmButton: false,
    });
  } else {
    Swal.fire({
      icon: 'success',
      title: 'Back Online',
      toast: true,
      timer: 3000,
      position: 'top-end',
      showConfirmButton: false,
    });
  }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const checkConnectionQuality = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection && ['slow-2g', '2g'].includes(connection.effectiveType)) {
        Swal.fire({
          icon: 'info',
          title: 'Poor Connection',
          text: 'Your internet is slow. Some actions may take longer.',
          toast: true,
          timer: 3000,
          position: 'top-end',
          showConfirmButton: false,
        });
      }
    };
    checkConnectionQuality();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async () => {
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

    const emailpattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailpattern.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid Email Address!',
        toast: true,
        timer: 3000,
        position: 'top-end',
        showConfirmButton: false,
      });
      return;
    }

    // Check for slow connection speed before sending request
    if (navigator.connection?.downlink < 0.5) {
      Swal.fire({
        icon: 'info',
        title: 'Slow Connection',
        text: 'Your connection speed is low. Sign-in might be delayed.',
        toast: true,
        timer: 3000,
        position: 'top-end',
        showConfirmButton: false,
      });
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/login`, formData, {
        headers: { [headerName]: apiKey },
        timeout: 10000,
      });

      if (response.status === 200) {
        const { email } = formData;
        const verifyResponse = await axios.get(`${apiUrl}/verify_email/${email}`, {
          headers: { [headerName]: apiKey },
        });

        const data = response.data;

        if (verifyResponse.status === 200 && verifyResponse.data.verified) {
          const userData = {
            ...verifyResponse.data.resident_info,
            email: email,
          };

          localStorage.setItem("userData", JSON.stringify(userData));
          localStorage.setItem('authToken', data.token);

          navigate("/profile", { state: { user: userData } });
        } else {
          navigate("/verification", { state: { email:email, mode: "login",bt:null } });
          Swal.fire({
            icon: 'error',
            title: 'Email not verified',
            text: 'Please verify your email before logging in.',
            showConfirmButton: true,
            customClass: {
              popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
              title: 'text-lg sm:text-xl font-semibold text-red-600',
              htmlContainer: 'text-sm sm:text-base text-gray-700',
              confirmButton: 'mt-4 bg-red-600 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
            }
          });
        }
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        Swal.fire({
          icon: 'error',
          title: 'Network Timeout',
          text: 'The request took too long. Please check your internet connection.',
          toast: true,
          timer: 3000,
          position: 'top-end',
          showConfirmButton: false,
        });
      } else if (!navigator.onLine || err.message === 'Network Error') {
        Swal.fire({
          icon: 'error',
          title: 'No Internet',
          text: 'Cannot connect to server. Please check your internet connection.',
          toast: true,
          timer: 3000,
          position: 'top-end',
          showConfirmButton: false,
        });
      } else if (err.response?.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: err.response.data.error,
          toast: true,
          timer: 3000,
          position: 'top-end',
          showConfirmButton: false,
        });
      } else if (err.response?.status === 429) {
        Swal.fire({
          icon: 'error',
          title: 'Too Many Attempts',
          text: 'Please try again later.',
          showConfirmButton: true,
          customClass: {
            popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
            title: 'text-lg sm:text-xl font-semibold text-red-600',
            htmlContainer: 'text-sm sm:text-base text-gray-700',
            confirmButton: 'mt-4 bg-red-500 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
          }
        });
        
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Invalid email or password. Please try again.',
          showConfirmButton: true,
          customClass: {
            popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
            title: 'text-lg sm:text-xl font-semibold text-red-600',
            htmlContainer: 'text-sm sm:text-base text-gray-700',
            confirmButton: 'mt-4 bg-red-500 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
          }
        });
        
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <ForgotPasswordModal isOpen={isForgotPasswordModalOpen} onClose={closeForgotPasswordModal} />

      <div className='flex flex-col md:flex-row w-full items-center p-4 md:h-screen md:justify-center pt-10 md:pt-0'>
        <div className='hidden md:flex md:w-1/2 h-full items-center justify-center'>
          <img
            src={illustration}
            alt="Sign Up Illustration"
            className='w-full max-w-lg h-auto object-contain'
          />
        </div>

        <div className='md:w-1/2 w-full flex flex-col items-center justify-center px-6 md:px-12 lg:px-20'>
          <div className='w-full max-w-sm'>
            <div className='text-center'>
              <h3 className='text-2xl font-extrabold'>Nice to see you!</h3>
              <p className='mt-2 text-gray-600'>Please enter your email and password to sign in.</p>
            </div>

            <div className='mt-8 space-y-6'>
              <div>
                <label className='block text-sm font-medium'>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder='sample@email.com'
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  onChange={handleChange}
                  className='w-full border border-gray-400 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    required
                    placeholder='Enter your password...'
                    onChange={handleChange}
                    className='w-full border border-gray-400 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12'
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>

              <div className='flex justify-end'>
                <button
                  onClick={openForgotPasswordModal}
                  className='text-sm text-blue-600 hover:underline'
                >
                  Forgot Password?
                </button>
              </div>

              <button
                onClick={handleSignIn}
                className={`w-full py-2 rounded-lg text-white font-bold flex justify-center items-center 
                  ${loading || !formData.email || !formData.password ? 'bg-gray-400 cursor-not-allowed' : 'bg-black'}`}
                disabled={loading || !formData.email || !formData.password}
              >
                {loading ? "Signing In..." : "SIGN IN"}
              </button>
            </div>

            <div className='mt-4 text-center'>
              <p className='text-sm'>Don't have an account? <button className='font-bold text-blue-600 hover:underline' onClick={() => navigate("/signUp")}>Sign up</button></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
