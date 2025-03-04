import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert2

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Check if user is on Sign In, Sign Up, or Verification page
  const isAuthPage = ["/", "/signUp", "/verification"].includes(location.pathname);
  const isVerificationPage = location.pathname === "/verification";

  // Handle sign out confirmation using SweetAlert2
  const handleSignOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be signed out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, sign out!",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/", { replace: true });
        
        setTimeout(() => {
          window.history.pushState(null, null, window.location.href);
          window.onpopstate = () => {
            window.history.pushState(null, null, window.location.href);// Redirect to Sign In after logging out
          };
        }, 0);
      }
    });
  };

  return (
    <div className='flex flex-col items-center relative z-50'>
      <nav className='flex md:w-[95%] w-[85%] h-[70px] rounded-[18px] items-center justify-between text-white font-semibold space-x-5 px-5 mt-5 bg-fixed bg-[#376a63] shadow-lg z-50'>
        <div className='inline-flex items-center md:space-x-5 space-x-2'>
          <img className='h-[50px] w-auto' src="./images/logo.png" alt="logo"/>
          <p className='text-left'>Barangay Easy Docs</p>
        </div>

        {/* Desktop Navigation */}
        <ul className='hidden md:flex space-x-5'>
          {isAuthPage ? (
            <>
              <li>
                {isVerificationPage ? (
                  <span className="text-gray-400 cursor-not-allowed">Sign Up</span> // Disabled
                ) : (
                  <Link to="/signUp">Sign Up</Link>
                )}
              </li>
              <li>
                {isVerificationPage ? (
                  <span className="text-gray-400 cursor-not-allowed">Sign In</span> // Disabled
                ) : (
                  <Link to="/">Sign In</Link>
                )}
              </li>
            </>
          ) : (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleSignOut} className="hover:text-red-400">Sign Out</button></li>
            </>
          )}
        </ul>
        
        {/* Mobile Menu Button */}
        <div className='md:hidden'>
          <button onClick={toggleMenu} className='focus:outline-none'>
            <svg 
              className='w-6 h-6' 
              fill='none' 
              stroke='currentColor' 
              strokeWidth='2' 
              viewBox='0 0 24 24' 
              strokeLinecap='round' 
              strokeLinejoin='round'
            >
              <path d='M4 6h16M4 12h16M4 18h16'></path>
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isOpen && (
        <ul className='md:hidden w-[70%] bg-black text-white flex flex-col space-y-3 p-3 absolute top-[90px] mt-2 rounded-[10px] pl-10 font-semibold'>
          {isAuthPage ? (
            <>
              <li>
                {isVerificationPage ? (
                  <span className="text-gray-400 cursor-not-allowed">Sign Up</span> // Disabled
                ) : (
                  <Link to="/signUp" onClick={() => setIsOpen(false)}>Sign Up</Link>
                )}
              </li>
              <li>
                {isVerificationPage ? (
                  <span className="text-gray-400 cursor-not-allowed">Sign In</span> // Disabled
                ) : (
                  <Link to="/" onClick={() => setIsOpen(false)}>Sign In</Link>
                )}
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
              </li>
              <li>
                <button onClick={handleSignOut} className="hover:text-red-400">
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default Header;
