import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/signup/Signup';
import Login from "./components/login/Login";
import PrivateRoute from "./components/privateroute/PrivateRoute";
import Admindashboard from './components/admindashboard/Admindashboard';
import Home from "./components/Home/Home";
import CreateLeague from "./components/createleague/CreateLeague";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes with role-based access */}
        <Route 
          path="/admindashboard" 
          element={<PrivateRoute element={Admindashboard} allowedRoles={["Admin"]} />} 
        />
        <Route 
          path="/" 
          element={<PrivateRoute element={Home} allowedRoles={["User", "Admin"]} />} 
        />
        <Route 
          path="/" 
          element={<PrivateRoute element={CreateLeague} allowedRoles={["User", "Admin"]} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
