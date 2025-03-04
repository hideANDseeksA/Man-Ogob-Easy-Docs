import React from "react";
import MenuBar from "../Components/MenuBar";

import AllTransaction from "../Components/AllTransaction";
import Transaction from "../Components/Transaction";

const HistoryPage = () => {
  return (
    <>
      <MenuBar />  
      <div className="w-[100%] h-screen space-y-5 p-5 md:w-[95%] mx-auto">
      <AllTransaction /> {/* Calls All Transactions */}
      <Transaction /> {/* Calls Individual Requested Records */}
      </div>
    </>
  );
};

export default HistoryPage;
