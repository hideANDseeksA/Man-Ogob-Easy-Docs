import React, { useEffect, useState } from 'react';
import MenuBar from '../Components/MenuBar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import logo1 from '../image/alawihaoLogo.svg';
import logo2 from '../image/sulongAlawihao.svg';
import { io } from 'socket.io-client';

const ProfilePage = () => {
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("userData"));
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const residentId = user.resident_id; // Updated resident ID
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const api = import.meta.env.VITE_GLOBAL_API;
  const headerName = import.meta.env.VITE_HEADER_URL;
  const apiKey = import.meta.env.VITE_API_KEY;





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
      setLoading(false);
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



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };


  useEffect(() => {
    const socket = io(api, {
      extraHeaders: {
     [headerName]:apiKey
      }
    });
    let isUnmounting = false; // 🔸 Add this flag

    // Emit the resident ID to get their transactions
    if (residentId) {
      socket.emit("getTransactionsByResident", residentId);
    }

    // Listen for response
    socket.on('transactions', (data) => {
      setTransactions(data);
      setLoading(false);

    });

    socket.on('new_transaction', (newTransaction) => {
      if (newTransaction.resident_id === residentId) {
    setTransactions(prev => [newTransaction, ...prev]);
  }
    });

    socket.on('remove_transaction', ({ transaction_id }) => {
      setTransactions(prev => prev.filter(req => req.transaction_id !== transaction_id));

    });

    socket.on("transaction_updated", ({ transaction_id, status }) => {
      setTransactions(prev =>
        prev.map(req =>
          req.transaction_id === transaction_id ? { ...req, status } : req
        )
      );
    });
    socket.on('disconnect', () => {
      if (!isUnmounting) { // 🔸 Only show alert if not unmounting
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "No Internet Connection",
          text: "Please check your network connection.",
          toast: true,
          timer: 3000,
          position: "top-end",
          showConfirmButton: false,
        });
      }
    });
  

    return () => {
      isUnmounting = true; // 🔸 Set before disconnecting
      socket.disconnect();
    };
  }, [residentId]); // Make sure this runs again when residentId changes




  
  const handleCancelTransaction = async (transaction_id, status) => {
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

    if (status !== 'Pending') {
      Swal.fire('Warning!', 'Only pending transactions can be cancelled.', 'warning');
      return;
    }
  
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this transaction?",
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
        title: 'text-lg sm:text-xl font-semibold text-red-600',
        htmlContainer: 'text-sm sm:text-base text-gray-700',
      },
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Cancelling...',
          text: 'Please wait while we cancel your transaction.',
          customClass: {
            popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
            htmlContainer: 'text-sm sm:text-base text-gray-700',
          },
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        try {
          await axios.put(
            `${api}/api/transaction/certificate_transaction/${transaction_id}`,
            { status: 'Cancelled' },
            {
              headers: {
                [headerName]:apiKey
              }
            }
          );
  
          setTransactions(prev =>
            prev.filter(transaction => transaction.transaction_id !== transaction_id)
          );
  
          Swal.fire({
            title:'Cancelled!', 
            text:'Your transaction has been cancelled.',
            icon: 'success',
            customClass: {
              popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
              htmlContainer: 'text-sm sm:text-base text-gray-700',
            }});
        } catch (error) {
          Swal.fire('Error!', 'Failed to cancel the transaction.', 'error');
        }
      }
    });
  };
  

  return (
    <>
      <MenuBar />

      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Barangay Announcements */}
          <div className="col-span-1 md:col-span-2 bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="bg-[#376a63] text-white p-4 text-center rounded-t-xl text-lg md:text-xl font-semibold">
              Barangay Announcements
            </div>
            <div className="p-6 space-y-6">
              {/* Header with logos */}
              <div className="flex items-center justify-center gap-4 md:gap-6 text-lg md:text-2xl font-bold">
                <img src={logo1} alt="Barangay Logo Left" className="h-16 w-16 md:h-20 md:w-20" />
                <p className="text-center">BARANGAY ALAWIHAO</p>
                <img src={logo2} alt="Barangay Logo Right" className="h-20 w-20 md:h-24 md:w-24" />
              </div>

              {/* Announcement Content */}
              <div className="text-gray-800 text-justify leading-relaxed">
                <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900">
                  Certification & Services Processing
                </h2>
                <p>
                  Greetings to all residents of Barangay Alawihao. We are pleased to inform you that we are now processing
                  certification requests and other essential services. Kindly take note of the following details:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Processing Schedule:</strong> Monday to Friday, 7:00 AM - 5:00 PM</li>
                  <li><strong>Location:</strong> Barangay Hall, Alawihao</li>
                  <li>
                    <strong>Required Documents:</strong> A valid government-issued ID, a duly accomplished application form,
                    and any necessary supporting documents.
                  </li>
                  <li>
                  <strong>For Inquiries:</strong> Contact us at (123) 456-7890 or email us at{' '}
<a href="mailto:info@barangayalawihao.gov.ph" className="underline text-blue-600 hover:text-blue-800">
  info@barangayalawihao.gov.ph
</a>.

                  </li>
                </ul>
                <p className="mt-5 text-gray-900 font-semibold">Barangay Alawihao, 2025</p>
              </div>
            </div>
          </div>

          {/* Transactions Section */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="bg-[#376a63] text-white p-4 text-center rounded-t-xl text-lg md:text-xl font-semibold">
              Transactions
            </div>
            <div className="p-5 space-y-4 max-h-[550px] overflow-y-auto scrollbar-hide">
              {loading ? (
                <p className="text-center text-gray-500 animate-pulse">Loading transactions...</p>
              ) :
                (transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <div key={transaction.transaction_id} className="p-5 border-b">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() =>
                          setExpandedTransaction(expandedTransaction === transaction.transaction_id ? null : transaction.transaction_id)
                        }
                      >
                        <div>
                          <p className="text-base md:text-xs ">{transaction.certificate_type}</p>
                          <p className="text-sm md:text-xs ">{new Date(transaction.date_requested).toLocaleString()}</p>
                        </div>
                        <p
                          className={`text-sm md:text-xs font-bold uppercase rounded p-1 text-right  ${transaction.status === "Approved"
                            ? "text-green-500"
                            : transaction.status === "On Process"
                              ? "text-orange-400"
                              : transaction.status === "Ready To Claim"
                                ? "text-blue-400"
                                : "text-red-400"
                            }`}
                        >
                          {transaction.status === "Ready To Claim" ? "Claim Now" : transaction.status}
                        </p>

                      </div>

                      {/* Expandable Details */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedTransaction === transaction.transaction_id ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                          }`}
                      >
                        <div className="mt-3 p-3 border-t">
                          <p>Note: You can cancel your request if the status is pending</p>
                          {transaction.status === "Pending" && (
                            <button
                              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition-all duration-300"
                              onClick={() => handleCancelTransaction(transaction.transaction_id, transaction.status)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No transactions found.</p>
                ))}
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="bg-[#376a63] text-white p-4 text-center rounded-t-xl text-lg md:text-xl font-semibold">
              Profile Information
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-gray-600">Full Name:</p>
                <p className="font-semibold">{`${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`}</p>
              </div>
              <div>
                <p className="text-gray-600">Resident ID:</p>
                <p className="font-semibold">{user.resident_id}</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Address:</p>
                <p className="font-semibold">{user.address}, Barangay Alawihao, Daet, Camarines Norte</p>
              </div>
              <div>
                <p className="text-gray-600">Birthday:</p>
                <p className="font-semibold">{formatDate(user.birthday)}</p>
              </div>
              <div>
                <p className="text-gray-600">Gender:</p>
                <p className="font-semibold">{user.sex === "M" ? "Male" : "Female"}</p>
              </div>
              <div>
                <p className="text-gray-600">Marital Status:</p>
                <p className="font-semibold">{user.status}</p>
              </div>
              <div>
                <p className="text-gray-600">Birthplace:</p>
                <p className="font-semibold">{user.birthplace}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProfilePage;
