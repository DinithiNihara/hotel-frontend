import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages & components
import Navbar from "./components/Navbar";
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

function App() {
  const { theme } = useThemeContext();

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
          <SideNavbar />

          <div className="w-full">
            <div className="flex justify-end mx-5 my-1">
              <SliderToggle />
            </div>

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/guests" element={<Guests />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/eventVenues" element={<EventVenues />} />
              <Route path="/roomReservation" element={<RoomReservations />} />
              <Route path="/eventReservation" element={<EventReservations />} />
            </Routes>
            <EditModal />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
