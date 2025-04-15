import React, { useEffect, useState } from "react";
import MenuBar from "../Components/MenuBar";
import BarangayIndigency from "../Components/Barangay Certificates/CertificationOfGoodmoral";
import BarangayClearance from "../Components/Barangay Certificates/CertificationOfIndigency";
import CertificateOfNstp from "../Components/Barangay Certificates/CertificationOfNstp";
import CertificateOfOwnership from "../Components/Barangay Certificates/CertificationOfOwnership";
import CertificateOfResidents from "../Components/Barangay Certificates/CertificationOfResidency";
import Swal from "sweetalert2";

const GetCertification = () => {
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
        <BarangayClearance 
          title="Certification of Indigency" 
          content="This certificate is issued to verify that the individual is a resident of the barangay and belongs to an indigent family. It is often used for availing government assistance or programs." 
        />
        <BarangayIndigency 
          title="Certification of Good Moral" 
          content="This certificate is issued to attest to the good moral character of the individual as verified by the barangay officials. It is commonly required for employment, school admission, or other formal applications." 
        />
        <CertificateOfNstp
          title="Certification of NSTP" 
          content="This certificate is issued to confirm that the individual has successfully completed the National Service Training Program, which is a requirement for college students. It serves as proof of compliance with the NSTP law." 
        />
        <CertificateOfOwnership
          title="Certification of Ownership" 
          content="This certificate is issued to confirm ownership of a property or asset within the barangay. It is often required for legal or financial transactions." 
        />
        <CertificateOfResidents
          title="Certification of Residency" 
          content="This certificate is issued to verify that the individual is a bona fide resident of the barangay. It is commonly used for identification, legal purposes, or availing local services." 
        />
      </div>
    </>
  );
};

export default GetCertification;
