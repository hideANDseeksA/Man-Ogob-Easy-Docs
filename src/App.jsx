import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation,Navigate  } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import Header from "./Components/Header";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import ProfilePage from "./Pages/ProfilePage";
import GetCertification from "./Pages/GetCertification";
import HistoryPage from "./Pages/HistoryPage";
import FooterPAGE from "./Components/f";
import VerificationPage from "./Pages/VerificationPage";
import ResetPasswordModal  from "./Pages/ResetPassword";
import { isTokenValid } from "./utils/tokenUtils"; // import utility

function AnimatedRoutes() {
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  const isValid = token && isTokenValid(token);


  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><SignInPage /></PageWrapper>} />
        <Route path="/verification" element={<PageWrapper><VerificationPage /></PageWrapper>} />
        <Route path="/resetpassword" element={<ResetPasswordModal/>}/>
        <Route path="/signUp" element={<PageWrapper><SignUpPage /></PageWrapper>} />

        <Route path="/profile" element={isValid? <ProfilePage />: <Navigate to="/" />} />
        <Route path="/getCertification" element={isValid ?<GetCertification/> :<Navigate to="/" /> }/>
        <Route path="/history" element={isValid?<HistoryPage/>:<Navigate to="/" />}/>
    
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <AnimatedRoutes />
      <FooterPAGE/>
    </Router>
  );
}

export default App;


