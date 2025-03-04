import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import TermsAndCondition from '../Components/TermsAndCondition';

const SignUpPage = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const handleTermsAccept = (accepted) => {
    setIsChecked(accepted);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match.',
      });
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit verification code

    Swal.fire({
      title: 'Signing Up...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post('https://bned-backend.onrender.com/api/create_user', {
        user_id: formData.user_id,
        email: formData.email,
        password: formData.password,
        code: code,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User added successfully. Verification code sent.',
        }).then(() => {
          navigate("/verification", { state: { email: formData.email, code: code } });
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create user. Please try again later.',
      });
    }
  };

  return (
    <>
      <div className='flex w-[100%] h-screen items-center justify-center'>
        <div className='w-[50%] h-[100%] hidden md:block'></div>
        <div className='md:w-[50%] w-[100%] h-[100%] md:px-0 px-9'>
          <div>
            <div className='flex flex-col items-center text-center md:items-center mt-11 md:mt-20 px-[15px] gap-3 md:gap-8'>
              <h3 className='text-[30px] font-extrabold'>Welcome!</h3>
              <p className='font-semibold'>Please sign up to sign in.</p>
            </div>
            <form onSubmit={handleSignUp} className='space-y-4 md:mx-40 border-black border rounded-[10px] flex flex-col items-center justify-center mt-11 md:mt-14'>
              <div className='mt-10 w-[85%] md:flex md:flex-col md:justify-center items-start'>
                <p className='font-semibold text-[15px] text-left md:pl-10'>Resident ID</p>
                <input
                  type="text"
                  name="user_id"
                  placeholder='2025-4609-0000'
                  value={formData.user_id}
                  onChange={handleChange}
                  className='mx-auto w-[100%] md:w-[300px] border text-[12px] border-black rounded-[15px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div className='mt-10 w-[85%] md:flex md:flex-col md:justify-center items-start'>
                <p className='font-semibold text-[15px] text-left md:pl-10'>Email</p>
                <input
                  type="email"
                  name="email"
                  placeholder='sample@email.com'
                  value={formData.email}
                  onChange={handleChange}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  className='mx-auto w-[100%] md:w-[300px] border text-[12px] border-black rounded-[15px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div className='mt-10 w-[85%] md:flex md:flex-col md:justify-center items-start'>
                <p className='font-semibold text-[15px] text-left md:pl-10'>Password</p>
                <input
                  type="password"
                  name="password"
                  placeholder='********'
                  value={formData.password}
                  onChange={handleChange}
                  minLength="8"
                  className='mx-auto w-[100%] md:w-[300px] border text-[12px] border-black rounded-[15px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div className='mt-10 w-[85%] md:flex md:flex-col md:justify-center items-start'>
                <p className='font-semibold text-[15px] text-left md:pl-10'>Confirm Password</p>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder='********'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength="8"
                  className='mx-auto w-[100%] md:w-[300px] border text-[12px] border-black md:mb-10 mb-8 rounded-[15px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>

              <div className='flex items-center space-x-2'>
                <input type='checkbox' id='terms' checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
                <label htmlFor='terms' className='text-sm'>
                  I accept the
                  <span className='text-blue-500 cursor-pointer' onClick={() => setIsTermsOpen(true)}> Terms and Conditions</span>
                </label>
              </div>

              <div className='md:w-[80%] w-[85%] h-[35px] bg-black rounded-full text-center items-center flex justify-center font-extrabold'>
                <button onClick={handleSignUp} className={`text-white ${!isChecked ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isChecked}>SIGN UP</button>
              </div>
              <div className='inline-flex space-x-1 justify-center py-5'>
                <p>Already have an account?</p>
                <Link to="/">
                  <p className='font-bold'>Sign in</p>
                </Link>
              </div>
            </form>
          </div>
          {/* Terms and Conditions Modal */}
          <TermsAndCondition
            isOpen={isTermsOpen}
            onClose={() => setIsTermsOpen(false)}
            onAccept={handleTermsAccept}
          />
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
