import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LogoutForm from "./components/logout-form";
import Logout from "./pages/Logout";
import VerifyEmail from "./pages/Verify";
function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/logout' element={<Logout />} /> 
          <Route path='/verify-email' element={<VerifyEmail />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;