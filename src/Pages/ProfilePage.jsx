import React, { useEffect, useState, useRef } from 'react';
import MenuBar from '../Components/MenuBar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import logo1 from '../image/alawihaoLogo.svg';
import logo2 from '../image/sulongAlawihao.svg';

const ProfilePage = () => {
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("userData"));
  const [transactions, setTransactions] = useState([]);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const hasFetchedTransactions = useRef(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  

  useEffect(() => {
    if (user?.resident_id && !hasFetchedTransactions.current) {
      fetchTransactions(user.resident_id);
      hasFetchedTransactions.current = true;
    }
  }, [user]);

  const fetchTransactions = async (resident_id) => {
    Swal.fire({
      title: 'Loading...',
      text: 'Fetching transactions, please wait.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await axios.get(`https://bned-backend.onrender.com/certificate_transaction/${resident_id}`);
      if (response.status === 200) {
        setTransactions(response.data);
        Swal.close();
      }
    } catch (err) {
      Swal.close();
    }
  };

  const handleCancelTransaction = async (transaction_id, status) => {
    if (status !== 'Pending') {
      Swal.fire('Warning!', 'Only pending transactions can be cancelled.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this transaction?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '# d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`https://bned-backend.onrender.com/certificate_transaction/${transaction_id}`, { status: 'Cancelled' });
          setTransactions(transactions.filter(transaction => transaction.transaction_id !== transaction_id));
          Swal.fire('Cancelled!', 'Your transaction has been cancelled.', 'success');
        } catch (error) {
          Swal.fire('Error!', 'Failed to cancel the transaction.', 'error');
        }
      }
    });
  };

  return (
    <>
      <MenuBar />

      <div className='w-[100%] h-auto space-y-5 md:flex md:flex-row md:gap-5 md:space-y-0 p-5 md:w-[95%] mx-auto md:justify-center'>
        <div className='md:w-[50%] h-auto border rounded-[10px] border-black drop-shadow-md hover:shadow-2xl shadow-black'>
          <div className='w-[100%] p-5 h-14 bg-[#376a63] text-center rounded-[10px] flex items-center justify-center text-white md:text-[20px] text-[17px] font-semibold gap-3'>

            <h2>Barangay Announcements</h2>

          </div>
          <div className="w-full p-5">
            {/* Header with logos and announcement title */}
            <div className="flex items-center justify-center gap-6 text-xl font-bold md:text-2xl">
  {/* Left Logo */}
  <img
    src={logo1}
    alt="Barangay Logo Left"
    className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 transition-all"
  />

  {/* Center Text */}
  <p className="text-center">BARANGAY ALAWIHAO</p>

  {/* Right Logo */}
  <img
    src={logo2}
    alt="Barangay Logo Right"
    className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 transition-all"
  />
</div>


            {/* Announcement content */}
            <div className="mt-6 md:text-lg text-base text-gray-800">
              <h2 className="font-bold text-xl mb-4 text-center text-gray-900">Certification &amp; Services Processing</h2>
              <p className="text-justify leading-relaxed">
                Greetings to all residents of Barangay Alawihao. We are pleased to inform you that we are now processing certification requests and other essential services. Kindly take note of the following details:
              </p>
              <ul className="list-disc mx-auto max-w-md mt-4 pl-5 space-y-2">
                <li><strong>Processing Schedule:</strong> Monday to Friday, 8:00 AM - 4:00 PM</li>
                <li><strong>Location:</strong> Barangay Hall, Alawihao</li>
                <li>
                  <strong>Required Documents:</strong> A valid government-issued ID, a duly accomplished application form, and any supporting documents as necessary.
                </li>
                <li>
                  <strong>For Inquiries:</strong> Please contact us at (123) 456-7890 or email us at <a href="mailto:info@barangaymanogob.gov.ph" className="underline text-blue-600 hover:text-blue-800">info@barangayalawihao.gov.ph</a>.
                </li>
              </ul>
              <p className="mt-5 leading-relaxed">
                We kindly request all visitors to observe health and safety protocols while within the premises. Your cooperation is highly valued, and we look forward to serving you.
              </p>
              <p className="mt-5 font-semibold text-gray-900">Barangay Alawihao, 2025</p>
            </div>


          </div>

        </div>


        <div className='md:w-[25%] h-auto rounded-[10px] border border-black drop-shadow-md hover:shadow-2xl shadow-black'>
          <div className='w-[100%] p-5 h-14 bg-[#376a63] rounded-[10px] flex items-center text-white md:text-[20px] text-[17px] font-semibold justify-center'>
            <h2>Transactions</h2>
          </div>
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <div key={transaction.transaction_id} className="p-5 border-b">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setExpandedTransaction(expandedTransaction === transaction.transaction_id ? null : transaction.transaction_id)
                  }
                >
                  <div>
                    <p>{transaction.certificate_type}</p>
                    <p className="text-[13px]">{new Date(transaction.date_requested).toLocaleString()}</p>
                  </div>
                  <p
                    className={`text-[13px] font-bold uppercase rounded p-1 ${transaction.status === "Ready to Claim" ? "text-green-400" : "text-red-400"
                      }`}
                  >
                    {transaction.status}
                  </p>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedTransaction === transaction.transaction_id ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="mt-3 p-3 border-t">
                    <p>Note: You can cancel your request if the status is pending</p>
                    {transaction.status !== "claimable" && (
                      <button
                        className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition-all duration-300"
                        onClick={() => handleCancelTransaction(transaction.transaction_id,transaction.status)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

            ))
          ) : (
            <div className='p-5'>
              <p className='text-center text-gray-500'>No transactions found.</p>
            </div>
          )}
        </div>

        {/* Profile Information Section */}
        <div className='md:w-[25%] h-auto rounded-[10px] border border-black drop-shadow-md hover:shadow-2xl shadow-black'>
          <div className='w-[100%] p-5 h-14 bg-[#376a63] rounded-[10px] flex items-center text-white md:text-[20px] text-[17px] font-semibold justify-center' >
            <h2>Profile Information</h2>
          </div>

          <div className='w-[100%] p-5 space-y-5'>
            <div>
              <p className='text-gray-700'>Full Name:</p>
              <p>{`${user.first_name} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name}`}</p>
            </div>
            <div>
              <p className='text-gray-700'>Resident ID:</p>
              <p>{user.resident_id}</p>
            </div>
            <div>
              <p className='text-gray-700'>Email:</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className='text-gray-700'>Address:</p>
              <p>{user.address} Barangay Alawihao Daet Camarines Norte</p>
            </div>
            <div>
              <p className='text-gray-700'>Birthday:</p>
              <p>{formatDate(user.birthday)}</p>
            </div>
            <div>
              <p className='text-gray-700'>Gender:</p>
              <p>{user.sex === "M" ? "Male" : "Female"}</p>
            </div>
            <div>
              <p className='text-gray-700'>Marital Status:</p>
              <p>{user.status}</p>
            </div>
            <div>
              <p className='text-gray-700'>Birthplace:</p>
              <p>{user.birthplace}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
