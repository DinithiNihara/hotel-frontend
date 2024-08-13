import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useCookies } from "react-cookie";
import {
  FaChartBar,
  FaUserFriends,
  FaHouseUser,
  FaHotel,
  FaAddressBook,
  FaBook,
  FaUser,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { Image } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import Logo from "../assets/logo.png";

const SideNavbar = () => {
  const { theme } = useThemeContext();
  const [selected, setSelected] = useState(0);
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    // Clear cookies
    setCookies("access_token", "");

    // Clear session storage
    window.localStorage.removeItem("userID");
    window.localStorage.removeItem("role");

    // Redirect to login page
    navigate("/auth");
  };

  return (
    <nav
      className={` h-fit w-64 p-4 flex flex-col items-center place-content-center gap-2 rounded-r-lg ${
        theme === "light" ? "bg-slate-300" : "bg-slate-950"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Image src={Logo} height={"120"} mx={"auto"} pb={1} />
      </div>

      <div className="flex items-center my-2">
        <FaUserCircle className="my-auto" />
        <span className="text-base underline pl-2">{cookies.username}</span>
      </div>

      <Link to="/" className="w-full">
        <NavItem selected={selected === 0} id={0} setSelected={setSelected}>
          <div className="flex flex-col items-center justify-center">
            <FaChartBar />
            <span className="text-sm">Dashboard</span>
          </div>
        </NavItem>
      </Link>

      <Link to="/guests" className="w-full">
        <NavItem selected={selected === 1} id={1} setSelected={setSelected}>
          <div className="flex flex-col items-center justify-center">
            <FaUserFriends />
            <span className="text-sm">Guests</span>
          </div>
        </NavItem>
      </Link>

      <Link to="/rooms" className="w-full">
        <NavItem selected={selected === 2} id={2} setSelected={setSelected}>
          <div className="flex flex-col items-center justify-center">
            <FaHouseUser />
            <span className="text-sm">Rooms</span>
          </div>
        </NavItem>
      </Link>

      <Link to="/eventVenues" className="w-full">
        <NavItem selected={selected === 3} id={3} setSelected={setSelected}>
          <div className="flex flex-col items-center justify-center">
            <FaHotel />
            <span className="text-sm">Event Venues</span>
          </div>
        </NavItem>
      </Link>

      <Link to="/roomReservation" className="w-full">
        <NavItem selected={selected === 4} id={4} setSelected={setSelected}>
          <div className="flex flex-col items-center justify-center">
            <FaAddressBook />
            <span className="text-sm">Room Reservation</span>
          </div>
        </NavItem>
      </Link>

      <Link to="/eventReservation" className="w-full">
        <NavItem selected={selected === 5} id={5} setSelected={setSelected}>
          <div className="flex flex-col items-center justify-center">
            <FaBook />
            <span className="text-sm">Venue Reservation</span>
          </div>
        </NavItem>
      </Link>

      <Link to="/users" className="w-full">
        <NavItem selected={selected === 6} id={6} setSelected={setSelected}>
          <div className="flex flex-col items-center justify-center">
            <FaUser />
            <span className="text-sm">Users</span>
          </div>
        </NavItem>
      </Link>

      <button
        className={`rounded-lg border-2 w-full mb-4 py-2 ${
          theme === "light" ? "border-slate-950" : "border-slate-300"
        }`}
        onClick={logout}
      >
        <div className="flex flex-col items-center justify-center">
          <FaSignOutAlt />
          <p className="text-sm font-bold">Logout</p>
        </div>
      </button>
    </nav>
  );
};

const NavItem = ({ children, selected, id, setSelected }) => {
  const { theme } = useThemeContext();
  return (
    <motion.button
      className={`p-3 text-xl rounded-md transition-colors relative w-full ${
        theme === "light"
          ? " bg-slate-200 hover:bg-slate-100"
          : " bg-slate-800 "
      }`}
      onClick={() => setSelected(id)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="block relative z-10">{children}</span>
      <AnimatePresence>
        {selected && (
          <motion.span
            className={`absolute inset-0 rounded-md  z-0 ${
              theme === "light" ? "bg-white" : "bg-slate-600"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          ></motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default SideNavbar;
