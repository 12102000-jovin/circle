import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Verify from "./components/Verify/Verify";
import CheckEmailVerification from "./components/CheckEmailVerification/CheckEmailVerification";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ForgotPasswordSuccess from "./components/ForgotPassword/ForgotPasswordSuccess";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import CreateAccountModal from "./components/CreateAccount/CreateAccount";
import Profile from "./components/Profile/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/CreateAccount" element={<CreateAccountModal />} />
        <Route
          path="/Authentication/Verify/:username/:token"
          element={<Verify />}
        />
        <Route
          path="/CheckEmailVerification"
          element={<CheckEmailVerification />}
        />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route
          path="/ResetPasswordEmailSent"
          element={<ForgotPasswordSuccess />}
        />
        <Route path="/ResetPasswordForm" element={<ResetPassword />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;