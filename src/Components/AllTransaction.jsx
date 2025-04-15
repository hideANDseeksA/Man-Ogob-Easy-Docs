import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {  useLocation } from "react-router-dom";
// Wrap SweetAlert2 with React content support
const MySwal = withReactContent(Swal);

const AllTransaction = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("userData"));
  const api = import.meta.env.VITE_GLOBAL_API;
  const headerName = import.meta.env.VITE_HEADER_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const resident_id = user.resident_id;

  // Fetch transactions from the API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `${api}/api/transaction/history_residents/${resident_id}`,
          {
            headers: {
           [headerName]:apiKey
            }
          }
        );
        
  
        if (!response.ok) {
          throw new Error("Failed to fetch transaction history");
        }
  
        const data = await response.json();
  
        // Handle empty response without throwing an error
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTransactions();
  }, [resident_id]);
  

  // Function: showDetails
  const showDetails = (certificateDetails) => {
    const formattedDetails = Object.entries(certificateDetails)
      .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
      .join("<br>");

    Swal.fire({
      title: "Certificate Information",
      html: `<div class='text-left p-4 bg-gray-100 rounded-lg text-sm leading-6'>${formattedDetails}</div>`,
      icon: "info",
      confirmButtonText: "Close",
      customClass: {
        popup: "w-[90%] md:w-[400px] p-6",
        title: "text-lg md:text-xl",
        confirmButton: "text-sm md:text-base px-5 py-2 bg-[#4CAF50] text-white rounded-lg",
      },
    });
  };




  return (
    <div className="p-6 border rounded-lg w-[90%] md:w-[75%] mx-auto mt-10 bg-white shadow-lg">
      {/* Dropdown Toggle */}
      <div
        className="flex items-center justify-between cursor-pointer px-4 py-2 bg-gray-100 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold">All Transactions</span>
        {isOpen ? <FaChevronUp className="text-xl" /> : <FaChevronDown className="text-xl" />}
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-center py-4 text-gray-600">Loading transactions...</p>}

      {/* Transactions Table */}
      {!loading && transactions.length > 0 && (
        <motion.div
          initial={{ maxHeight: 0, opacity: 0 }}
          animate={isOpen ? { maxHeight: 600, opacity: 1 } : { maxHeight: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`overflow-hidden ${!isOpen ? "hidden" : "block"} mt-3`}
        >
          <div className="overflow-x-auto w-full max-h-[400px] overflow-y-auto scrollbar-hide">
            <table className="w-full min-w-[700px] border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#4CAF50] text-white text-sm uppercase sticky top-0">
                  <th className="border p-3">Request #</th>
                  <th className="border p-3">Requested Document</th>
                  <th className="border p-3">Date Requested</th>
                  <th className="border p-3">Status</th>
                  <th className="border p-3">Certificate Details</th>
                  <th className="border p-3">Date Issued</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="text-center border text-sm">
                    {/* Transaction ID */}
                    <td className="border p-3">{transaction.transaction_id}</td>
                    {/* Requested Document */}
                    <td className="border p-3">{transaction.certificate_type}</td>
                    {/* Date Requested */}
                    <td className="border p-3">{new Date(transaction.date_requested).toLocaleString()}</td>
                    {/* Status */}
                    <td
                      className={`border p-3 font-semibold ${
                        transaction.status === "Pending"
                          ? "text-yellow-500"
                          : transaction.status === "Approved"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {transaction.status}
                    </td>
                    {/* Certificate Details */}
                    <td
                      className="border p-3 text-blue-600 underline cursor-pointer hover:text-blue-800"
                      onClick={() => showDetails(transaction.certificate_details)}
                    >
                      View Details
                    </td>
                    {/* Pick-up Schedule */}
                    <td className="border p-3">
                      {transaction.date_issued ? `Issued on ${new Date(transaction.date_issued).toLocaleString()}` : "Not Available"}
                    </td>
                
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* No Transactions Found */}
      {!loading && transactions.length === 0 && (
        <p className="text-center py-4 text-gray-600">No transactions found.</p>
      )}
    </div>
  );
};

export default AllTransaction;
