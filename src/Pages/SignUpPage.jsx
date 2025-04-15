import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import TermsAndCondition from '../Components/TermsAndCondition';
import logo2 from '../image/sign-up-animate.svg';

const SignUpPage = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const headerName = import.meta.env.VITE_HEADER_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const emailpattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const idPattern = /^\d{4}-\d{4}-\d{4,}$/;
  const [formData, setFormData] = useState({
    user_id: '',
    email: '',
    password: '',
    confirmPassword: '',
  });


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
  

  const handleTermsAccept = (accepted) => {
    setIsChecked(accepted);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
       
    e.preventDefault();
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

    if (!idPattern.test(formData.user_id)) {
      Swal.fire({ icon: 'error', title: 'Invalid Resident ID', text: 'Please enter a valid Resident ID in the format!',  customClass: {
        popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
        title: 'text-lg sm:text-xl font-semibold text-red-600',
        htmlContainer: 'text-sm sm:text-base text-gray-700',
        confirmButton: 'mt-4 bg-red-500 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
      } });
      return;
    }

    if (!emailpattern.test(formData.email)) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid Email Address!',  customClass: {
        popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
        title: 'text-lg sm:text-xl font-semibold text-red-600',
        htmlContainer: 'text-sm sm:text-base text-gray-700',
        confirmButton: 'mt-4 bg-red-500 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
      } });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Passwords do not match.',  customClass: {
        popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
        title: 'text-lg sm:text-xl font-semibold text-red-600',
        htmlContainer: 'text-sm sm:text-base text-gray-700',
        confirmButton: 'mt-4 bg-red-500 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
      } });
      return;
    }

    if (!passwordPattern.test(formData.password && formData.confirmPassword)) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Passwords too short atleast 8 character',  customClass: {
        popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
        title: 'text-lg sm:text-xl font-semibold text-red-600',
        htmlContainer: 'text-sm sm:text-base text-gray-700',
        confirmButton: 'mt-4 bg-red-500 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
      } });
      return;
    }


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

    Swal.fire({ title: 'Signing Up...', text: 'Please wait while we process your request.',   customClass: {
      popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
      title: 'text-lg sm:text-xl font-semibold text-green-600',
      htmlContainer: 'text-sm sm:text-base text-gray-700',
    }, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

    try {
      const response = await axios.post(`${apiUrl}/create_user`, {
        user_id: formData.user_id,
        email: formData.email,
        password: formData.password
      },{
        headers: {
          [headerName]:apiKey,
        }
      });

      if (response.status === 201) {
        Swal.fire({ icon: 'success', title: 'Success!', text: response.data.message ,  customClass: {
          popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
          title: 'text-lg sm:text-xl font-semibold text-green-600',
          htmlContainer: 'text-sm sm:text-base text-gray-700',
          confirmButton: 'mt-4 bg-green-600 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-green-600 focus:outline-none'
        }}).then(() => {
          navigate("/verification", { state: { email: formData.email,bt:"none"} });
        });
      }
    } catch (error) {
      let errorMessage = "Unstable Internet Connection. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      Swal.fire({ icon: 'error', title: 'Error', text: errorMessage ,  customClass: {
        popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
        title: 'text-lg sm:text-xl font-semibold text-red-600',
        htmlContainer: 'text-sm sm:text-base text-gray-700',
        confirmButton: 'mt-4 bg-red-500 text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-red-600 focus:outline-none'
      }});
    }
  };

  return (
<div className='flex flex-col md:flex-row w-full items-center p-4 md:h-screen md:justify-center pt-10 md:pt-0'>

      <div className='hidden md:block md:w-1/2'>
        <img src={logo2} alt='Sign Up Illustration' className='w-full h-auto' />
      </div>
      <div className='w-full md:w-1/2 flex flex-col items-center'>
        <h3 className='text-2xl font-extrabold mt-5'>Hey there! 👋</h3>
        <p className='font-semibold text-center'>Join us today and get your certificate with ease!</p>
        <form onSubmit={handleSignUp} className='space-y-4 w-full max-w-md mt-5 p-5 bg-white rounded-lg shadow-lg'>
          <div>
            <label className='block font-semibold'>Resident ID</label>
            <input type='text' name='user_id' placeholder='2025-4609-0000' value={formData.user_id} onChange={handleChange} className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500' required />
          </div>
          <div>
            <label className='block font-semibold'>Email</label>
            <input type='email' name='email' placeholder='sample@email.com' value={formData.email} onChange={handleChange} className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500' required />
          </div>
          <div>
            <label className='block font-semibold'>Password</label>
            <input type='password' name='password' placeholder='********' value={formData.password} onChange={handleChange} className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500' required />
          </div>
          <div>
            <label className='block font-semibold'>Confirm Password</label>
            <input type='password' name='confirmPassword' placeholder='********' value={formData.confirmPassword} onChange={handleChange} className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500' required />
          </div>
          <div className='flex flex-col items-center space-y-2'>
            <div className='flex items-center space-x-2'>
              <input type='checkbox' id='terms' checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
              <label htmlFor='terms' className='text-sm'>
                I accept the
                <span className='text-blue-500 cursor-pointer' onClick={() => setIsTermsOpen(true)}> Terms and Conditions</span>
              </label>
            </div>
          </div>
          <button type='submit' className={`w-full py-2 rounded-lg text-white font-bold ${!isChecked ? 'bg-gray-400 cursor-not-allowed' : 'bg-black'}`} disabled={!isChecked}>SIGN UP</button>
          <div className='text-center'>
            <p>Already have an account? <Link to='/' className='font-bold text-blue-500'>Sign in</Link></p>
          </div>
        </form>
      </div>
      <TermsAndCondition isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} onAccept={handleTermsAccept} />
    </div>
);

};

export default SignUpPage;
