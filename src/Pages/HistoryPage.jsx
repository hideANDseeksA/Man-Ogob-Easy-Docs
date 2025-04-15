import React, { useEffect, useState } from "react";
import MenuBar from "../Components/MenuBar";
import AllTransaction from "../Components/AllTransaction";
import Transaction from "../Components/Transaction";
import Swal from "sweetalert2";

const HistoryPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
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
  
  return (
    <>
      <MenuBar />
      <div className="w-full space-y-5 p-5 md:w-[95%] mx-auto flex-1">
        <AllTransaction /> {/* Calls All Transactions */}
        <Transaction /> {/* Calls Individual Requested Records */}
      </div>
    </>
  );
};

export default HistoryPage;
