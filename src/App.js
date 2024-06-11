import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages & components
import Dashboard from "./pages/Dashboard";
import Guests from "./pages/Guests";
import EditModal from "./components/EditModal";
import Rooms from "./pages/Rooms";
import EventVenues from "./pages/EventVenues";
import RoomReservations from "./pages/RoomReservations";
import SideNavbar from "./components/SideNavbar";
import SliderToggle from "./components/SliderToggle";
import { useThemeContext } from "./context/ThemeContext";
import EventReservations from "./pages/EventReservations";
import Auth from "./pages/Auth";
import Users from "./pages/Users";
import { useCookies } from "react-cookie";
import AuthRoute from "./middlewares/AuthRoute";
import Unauthorized from "./pages/Unauthorized";

function App() {
  const { theme } = useThemeContext();
  const [cookies, setCookies] = useCookies(["access_token"]);

  return (
    <div>
      <BrowserRouter>
        <div
          className={`flex transition-colors ${
            theme === "light"
              ? "bg-white text-slate-900"
              : "bg-slate-800 text-slate-100"
          }`}
        >
          {cookies.access_token && (
            <div className="flex h-screen overflow-y-auto">
              <SideNavbar />
            </div>
          )}

          <div className="w-full h-screen">
            <div className="flex justify-end mx-5 my-1">
              <SliderToggle />
            </div>

            <Routes>
              <Route path="/auth" element={<Auth />} />

              <Route
                path="/"
                element={
                  <AuthRoute
                    allowedRoles={[
                      "Receptionist",
                      "Reservation Manager",
                      "Banquet Manager",
                      "General Manager",
                    ]}
                  >
                    <Dashboard />
                  </AuthRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <AuthRoute allowedRoles={["General Manager"]}>
                    <Users />
                  </AuthRoute>
                }
              />
              <Route
                path="/guests"
                element={
                  <AuthRoute
                    allowedRoles={[
                      "Receptionist",
                      "Reservation Manager",
                      "Banquet Manager",
                      "General Manager",
                    ]}
                  >
                    <Guests />
                  </AuthRoute>
                }
              />
              <Route
                path="/rooms"
                element={
                  <AuthRoute
                    allowedRoles={["Reservation Manager", "General Manager"]}
                  >
                    <Rooms />
                  </AuthRoute>
                }
              />
              <Route
                path="/eventVenues"
                element={
                  <AuthRoute
                    allowedRoles={["Banquet Manager", "General Manager"]}
                  >
                    <EventVenues />
                  </AuthRoute>
                }
              />
              <Route
                path="/roomReservation"
                element={
                  <AuthRoute
                    allowedRoles={[
                      "Receptionist",
                      "Reservation Manager",
                      "Banquet Manager",
                      "General Manager",
                    ]}
                  >
                    <RoomReservations />
                  </AuthRoute>
                }
              />
              <Route
                path="/eventReservation"
                element={
                  <AuthRoute
                    allowedRoles={["Banquet Manager", "General Manager"]}
                  >
                    <EventReservations />
                  </AuthRoute>
                }
              />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
            <EditModal />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
