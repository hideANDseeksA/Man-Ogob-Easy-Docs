import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Footer = () => {
  const [status, setStatus] = useState("Not Available");
  const headerName = import.meta.env.VITE_HEADER_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const api = import.meta.env.VITE_GLOBAL_API;

  useEffect(() => {
    // Setup socket connection with custom header passed through auth
     const socket = io(api, {
        extraHeaders: {
         [headerName]: apiKey
        }
      });

    // Emit request to get status
    socket.emit("getStatus");

    // Listen for response
   socket.on("Barangay Hall", (status) => {
  setStatus(status || 'Unavailable');
});


    socket.on("status_updated", (data) => {
      setStatus(data.status);
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, [headerName, apiKey]);

  return (
    <div className="container mx-auto my-5 px-4">
      <footer className="text-gray-800 rounded-lg">
        <div className="py-8 px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            <div className="md:w-1/2">
              <h5 className="text-lg font-semibold mb-3 text-[#818963] tracking-wide">
                Barangay Easy Docs
              </h5>
              <p className="text-gray-700">
                Barangay Easy Docs is the official online platform of Barangay Alawihao, exclusively for its residents to conveniently request certificates and documents online.
              </p>
            </div>

            <div className="md:w-1/4">
              <h5 className="text-lg font-semibold mb-3 text-[#818963] tracking-wide">
                Links
              </h5>
              <ul className="space-y-2">
                <li>
                  <a href="https://web.facebook.com/barangay.alawihao" className="hover:underline text-gray-700">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://maps.app.goo.gl/uBjjjLQrs2bciawo6" className="hover:underline text-gray-700">
                    Location
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:w-1/4">
              <h5 className="text-lg font-semibold mb-3 text-[#818963] tracking-wide">
                Opening Hours
              </h5>
              <table className="w-full text-sm text-gray-700 border border-gray-400 mb-2">
                <tbody>
                  <tr className="border-b border-gray-400">
                    <td className="py-2 px-3">Monday - Friday:</td>
                    <td className="py-2 px-3">7:00 am - 5:00 pm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Barangay Office:</td>
                    <td className="py-2 px-3">Status: <strong>{status}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="text-center py-3 bg-[#376a63] text-sm text-white">
          © 2025 Copyright
        </div>
      </footer>
    </div>
  );
};

export default Footer;
