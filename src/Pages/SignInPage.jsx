import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import LoadingScreen from '../Components/LoadingScreen';
import ForgotPasswordModal from '../Components/ForgotPasswordModal'; // Import the first modal

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false); // State for first modal
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async () => {
    setLoading(true);

    try {
      const response = await axios.post('https://bned-backend.onrender.com/api/login', formData);

      if (response.status === 200) {
        const { email } = formData;
        const verifyResponse = await axios.get(`https://bned-backend.onrender.com/user/verify_email/${email}`);

        if (verifyResponse.status === 200 && verifyResponse.data.verified) {
          const userData = {
            ...verifyResponse.data.resident_info, // Spread resident_info data
            email: email // Manually add email
          };

          // Store user session
          localStorage.setItem("userData", JSON.stringify(userData));

          // Pass user data to profile page
          navigate("/profile", { state: { user: userData } });

        } else {

          navigate("/verification", { state: { email } });
          Swal.fire({
            icon: 'error',
            title: 'Email not verified',
            text: 'Please verify your email before logging in.',
          });
        }
      }
    } catch (err) {
      if (err.response?.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: err.response.data.error,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Opss...',
          text: 'Inavlid email or password. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const openForgotPasswordModal = () => setIsForgotPasswordModalOpen(true);
  const closeForgotPasswordModal = () => setIsForgotPasswordModalOpen(false);

  return (
    <>
      {loading && <LoadingScreen />} {/* Show loading overlay when processing */}

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={closeForgotPasswordModal}
      />
      <div className='flex w-[100%] h-screen items-center justify-center'>
        <div className='w-[50%] h-[100%] hidden md:block'></div>


        <div className='md:w-[50%] w-[100%] h-[100%] md:px-0 px-9'>
          <div className='md:pr-28 md:left-0'>
            <div className=''>
              <div className='flex flex-col md:items-center mt-11 md:mt-20 px-[15px] gap-3 md:gap-8'>
                <h3 className='text-[30px] font-extrabold'>Nice to see you!</h3>
                <p>Please enter your email and password to sign in.</p>
              </div>

              <div className='space-y-4 md:items-center flex flex-col'>
                <div className='mt-10'>
                  <p>Email</p>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    required
                    placeholder='sample@email.com'
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    onChange={handleChange}
                    className='w-[95%] md:w-[300px] border text-[12px] border-black rounded-[15px] p-2 focus:outline-none focus:ring-2 focus:ring-[blue-500]'
                  />
                </div>

                <div className='flex flex-col'>
                  <p>Password</p>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    required
                    placeholder='input password...'
                    onChange={handleChange}
                    className='w-[95%] md:w-[300px] mb-5 border text-[12px] border-black rounded-[15px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div className='w-full flex justify-center'>
                  {/* Button to open the Forgot Password modal */}
                  <button
                    onClick={openForgotPasswordModal}
                    className='text-sm md:text-base hover:underline'
                  >
                    Forgot Password?
                  </button>
                </div>
                <button
                  onClick={handleSignIn}
                  className='md:w-[300px] w-[95%] h-[35px] bg-black rounded-full text-center items-center flex justify-center font-extrabold text-white'
                  disabled={loading} // Prevent multiple clicks
                >
                  {loading ? "Signing In..." : "SIGN IN"}
                </button>
                <div className='inline-flex space-x-1 justify-center'>
                  <p>Don't have an account?</p>
                  <button className='font-bold ' onClick={() => navigate("/signUp")}>Sign up</button>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default SignInPage;
