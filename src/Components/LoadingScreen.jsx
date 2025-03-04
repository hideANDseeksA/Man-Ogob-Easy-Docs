import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="w-12 h-12 border-4 border-[#fdd744] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-gray-600">Loading...</p>
    </div>
  );
};

export default LoadingScreen;