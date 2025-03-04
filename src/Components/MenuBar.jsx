import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";


const menuItems = [
  { name: "Announcement", path: "/profile" },
  { name: "Get Certification", path: "/getCertification" },
  { name: "History", path: "/history" },
]; 



const MenuBar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
  const user = location.state?.user || JSON.parse(localStorage.getItem("userData"));

// If no user data is available, show a loading or fallback message
if (!user) {
  return <p className="text-center mt-10 text-gray-500">Loading user data...</p>;
}

  return (
    <div className="flex justify-center mt-8">
      <div
        className="flex flex-col w-[85%] h-auto py-3 gap-3 md:justify-between 
        md:py-3 md:w-[95%] md:flex-row md:px-5 rounded-[18px] border items-center"
      >
        {/* Profile Section */}
        <div className="md:flex md:flex-row gap-3 md:gap-5 flex flex-col justify-center items-center">
          <img className="h-[80px] w-auto" src="./images/logo.png" alt="logo" />
          <div className="flex flex-col justify-center items-center md:place-items-start">
            <h2 className="font-semibold">{user.first_name} {user.middle_name ? user.middle_name + ' ' : ''}{user.last_name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="w-[80%] md:w-[75%] relative">
          <ul className="flex flex-col gap-1 justify-center text-center md:flex-row relative">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setSelected(item.path)}>
                <li
                  className="relative border rounded-[10px] h-[40px] 
                  flex items-center justify-center md:w-36 text-gray-700 
                  transition-all duration-300 ease-in-out"
                >
                  {/* Background Animation */}
                  {selected === item.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#fdd744] rounded-[10px] -z-1"
                      transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    />
                  )}
                  {/* Text with Black for Unselected */}
                  <span className={`relative ${selected === item.path ? "text-white" : "text-black"}`}>
                    {item.name}
                  </span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
