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
import UpdateLeague from "./components/updateleague/UpdateLeague";
import AddTeam from "./components/addteam/AddTeam";
import UpdateTeam from "./components/updateteam/UpdateTeam";
import AddPlayer from "./components/addplayer/AddPlayer";
import UpdatePlayer from "./components/updateplayer/UpdatePlayer";
import Leagues from "./components/leagues/Leagues";
import LeagueDetails from "./components/leaguedetails/LeagueDetails";
import AddMatch from "./components/addmatch/AddMatch";
import UpdateMatch from "./components/updatematch/UpdateMatch";
import OngoingMatches from "./components/ongoingmatches/OngoingMatches";
import GetMatchesByLeague from "./components/getmatchesbyleague/GetMatchesByLeague";
import ScheduledMatchesByLeague from "./components/schedulematchesbyleague/ScheduleMatchesByLeague";
import CompletedMatchesByLeague from "./components/completedmatchesbyleague/CompletedMatchesByLeague";
import LeagueStandings from "./components/leaguestandings/LeagueStandings";
import OngoingMatchesByLeague from "./components/ongoingmatchesbyleague/OngoingMatchesByLeague";
import ViewMatchDetails from "./components/viewmatchdetails/ViewMatchDetails";
import ManageMatch from "./components/managematch/ManageMatch";
import ViewPlayerProfile from "./components/viewplayerprofile/ViewPlayerProfile";

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
          element={<PrivateRoute element={Home} allowedRoles={["User"]} />}
        />
        <Route
          path="/ongoingmatches"
          element={<PrivateRoute element={OngoingMatches} allowedRoles={["User"]} />}
        />
        <Route
          path="/createleague"
          element={<PrivateRoute element={CreateLeague} allowedRoles={["User"]} />}
        />
        <Route
          path="/addteam/:leagueId"
          element={<PrivateRoute element={AddTeam} allowedRoles={["User"]} />}
        />
        <Route
          path="/addplayer/:teamId"
          element={<PrivateRoute element={AddPlayer} allowedRoles={["User"]} />}
        />
        <Route
          path="/addmatch/:leagueId"
          element={<PrivateRoute element={AddMatch} allowedRoles={["User"]} />}
        />
        <Route
          path="/manageleague"
          element={<PrivateRoute element={ManageLeague} allowedRoles={["User"]} />}
        />
        <Route
          path="/matches/:leagueId"
          element={<PrivateRoute element={GetMatchesByLeague} allowedRoles={["User"]} />}
        />
        <Route
          path="/scheduledmatches/:leagueId"
          element={<PrivateRoute element={ScheduledMatchesByLeague} allowedRoles={["User"]} />}
        />
        <Route
          path="/ongoingmatches/:leagueId"
          element={<PrivateRoute element={OngoingMatchesByLeague} allowedRoles={["User"]} />}
        />
        <Route
          path="/ongoingmatches/:leagueId/addmatchevents/:matchId"
          element={<PrivateRoute element={ManageMatch} allowedRoles={["User"]} />}
        />
        <Route
          path="/completedmatches/:leagueId"
          element={<PrivateRoute element={CompletedMatchesByLeague} allowedRoles={["User"]} />}
        />
        <Route
          path="/viewmatchdetails/:leagueId/:matchId"
          element={<PrivateRoute element={ViewMatchDetails} allowedRoles={["User"]} />}
        />
        <Route
          path="/viewmatchdetails/:leagueId/:matchId/viewplayerprofile/:playerId"
          element={<PrivateRoute element={ViewPlayerProfile} allowedRoles={["User"]} />}
        />
        <Route
          path="/viewplayers/:teamId/viewplayerprofile/:playerId"
          element={<PrivateRoute element={ViewPlayerProfile} allowedRoles={["User"]} />}
        />
        <Route
          path="/leaguedetails/:leagueId/viewplayerprofile/:playerId"
          element={<PrivateRoute element={ViewPlayerProfile} allowedRoles={["User"]} />}
        />
        <Route
          path="/viewteams/:leagueId"
          element={<PrivateRoute element={ManageTeam} allowedRoles={["User"]} />}
        />
        <Route
          path="/viewplayers/:teamId"
          element={<PrivateRoute element={ManagePlayer} allowedRoles={["User"]} />}
        />
        <Route
          path="/updateleague/:leagueId"
          element={<PrivateRoute element={UpdateLeague} allowedRoles={["User"]} />}
        />
        <Route
          path="/updateteam/:leagueId/:teamId"
          element={<PrivateRoute element={UpdateTeam} allowedRoles={["User"]} />}
        />
        <Route
          path="/updateplayer/:teamId/:playerId"
          element={<PrivateRoute element={UpdatePlayer} allowedRoles={["User"]} />}
        />
        <Route
          path="/updatematch/:leagueId/:matchId"
          element={<PrivateRoute element={UpdateMatch} allowedRoles={["User"]} />}
        />
        <Route
          path="/leagues"
          element={<PrivateRoute element={Leagues} allowedRoles={["User"]} />}
        />
        <Route
          path="/leaguedetails/:leagueId"
          element={<PrivateRoute element={LeagueDetails} allowedRoles={["User"]} />}
        />
        <Route
          path="/leaguestandings"
          element={<PrivateRoute element={LeagueStandings} allowedRoles={["User"]} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
