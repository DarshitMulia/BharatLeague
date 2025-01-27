import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/signup/Signup';
import Login from "./components/login/Login";
import PrivateRoute from "./components/privateroute/PrivateRoute";
import Admindashboard from './components/admindashboard/Admindashboard';
import Home from "./components/home/Home";
import CreateLeague from "./components/createleague/CreateLeague";
import ManageLeague from "./components/manageleague/ManageLeague";
import ManageTeam from "./components/manageteam/ManageTeam";
import ManagePlayer from "./components/manageplayer/ManagePlayer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admindashboard"
          element={<PrivateRoute element={Admindashboard} allowedRoles={["Admin"]} />}
        />
        <Route
          path="/"
          element={<PrivateRoute element={Home} allowedRoles={["User", "Admin"]} />}
        />
        <Route
          path="/createleague"
          element={<PrivateRoute element={CreateLeague} allowedRoles={["User", "Admin"]} />}
        />
        <Route
          path="/manageleague"
          element={<PrivateRoute element={ManageLeague} allowedRoles={["User", "Admin"]} />}
        />
        <Route
          path="/viewteams/:leagueId"
          element={<PrivateRoute element={ManageTeam} allowedRoles={["User", "Admin"]} />}
        />
        <Route
          path="/viewplayers/:teamId"
          element={<PrivateRoute element={ManagePlayer} allowedRoles={["User", "Admin"]} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
