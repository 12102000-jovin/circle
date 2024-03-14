import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Index/Index";
import Login from "./components/Login/Login";
import Verify from "./components/Verify/Verify";
import CheckEmailVerification from "./components/CheckEmailVerification/CheckEmailVerification";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route
          path="/Authentication/Verify/:username/:token"
          element={<Verify />}
        />
        <Route
          path="/CheckEmailVerification"
          element={<CheckEmailVerification />}
        />
      </Routes>
    </Router>
  );
}

export default App;
