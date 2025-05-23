import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Transaction = () => {
  const [isOpen, setIsOpen] = useState({});
  const [transactions, setTransactions] = useState([]);
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("userData"));
  const resident_id = user.resident_id;
  const api = import.meta.env.VITE_GLOBAL_API;
  const headerName = import.meta.env.VITE_HEADER_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  useEffect(() => {
    fetchTransactionHistory(resident_id);
  }, [resident_id]);

  const fetchTransactionHistory = async (resident_id) => {
    Swal.fire({
      title: 'Loading...',
      text: 'Fetching transaction history, please wait.',
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
      const response = await axios.get(`${api}/api/transaction/history_residents/${resident_id}`, {
        headers: {
          [headerName]: apiKey
        }
      });
      if (response.status === 200) {
        setTransactions(response.data);
        Swal.close();
      } 
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch transaction history. Please try again later.',
        customClass: {
          popup: 'w-[90%] sm:w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-xl',
          htmlContainer: 'text-sm sm:text-base text-gray-700',
        }
      });
    } finally {
      Swal.close();
    }
  };

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const { certificate_type } = transaction;
    if (!acc[certificate_type]) {
      acc[certificate_type] = [];
    }
    acc[certificate_type].push(transaction);
    return acc;
  }, {});

  const toggleDropdown = (type) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };

  return (
    <div className="p-6 border rounded-lg w-[90%] md:w-[75%] mx-auto mt-10 bg-white shadow-lg">
      {Object.keys(groupedTransactions).map((type) => (
        <div key={type} className="mb-8">
          {/* Dropdown Toggle */}
          <div
            className="flex items-center justify-between cursor-pointer p-4 bg-gray-100 rounded-md"
            onClick={() => toggleDropdown(type)}
          >
            <span className="text-lg font-medium">{type}</span>
            {isOpen[type] ? <FaChevronUp className="text-xl" /> : <FaChevronDown className="text-xl" />}
          </div>

          {/* Dropdown Content with Table */}
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={isOpen[type] ? { maxHeight: 500, opacity: 1 } : { maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`overflow-hidden bg-white rounded-lg ${!isOpen[type] ? "hidden" : "block"} mt-3`}
          >
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-hide">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#7DCB80] text-white text-sm uppercase sticky top-0">
                    <th className="border p-3">Request #</th>
                    <th className="border p-3">Requested Document</th>
                    <th className="border p-3">Date Requested</th>
                    <th className="border p-3">Status</th>
                    <th className="border p-3">Date Issued</th>
                    <th className="border p-3">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedTransactions[type].map((transaction, index) => (
                    <tr key={index} className="text-center border">
                      <td className="border p-3">{transaction.transaction_id}</td>
                      <td className="border p-3">{transaction.certificate_type}</td>
                      <td className="border p-3">{new Date(transaction.date_requested).toLocaleDateString()}</td>
                      <td className="border p-3">{transaction.status}</td>
                      <td className="border p-3">{transaction.date_issued ? new Date(transaction.date_issued).toLocaleDateString() : "Not Available"}</td>
                      <td className="border p-3">{transaction.certificate_details.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default Transaction;
