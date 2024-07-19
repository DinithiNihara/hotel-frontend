import React, { useEffect } from "react";
import { useRoomReservationsContext } from "../hooks/useRoomReservationsContext.js";
import { Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext.js";
import { FaChevronRight } from "react-icons/fa";

const Dashboard = () => {
  const role = window.localStorage.getItem("role");
  const { theme } = useThemeContext();
  const { roomReservations, setRoomReservations } =
    useRoomReservationsContext();

  useEffect(() => {
    const fetchRoomReservations = async () => {
      const response = await fetch("/api/roomReservations");
      const json = await response.json();

      if (response.ok) {
        setRoomReservations({ type: "SET_ROOMRESERVATIONS", payload: json });
      }
    };
    fetchRoomReservations();
  }, []);
  return (
    <div className="mx-24">
      <p className="py-4 text-2xl font-bold">{role} Dashboard</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="border-2 justify-center text-center p-5 rounded-lg">
          <p>Room Bookings</p>
          <p>{roomReservations && roomReservations.length}</p>
        </div>
        <div className="border-2 justify-center text-center p-5 rounded-lg">
          <p>Venue Bookings</p>
          <p>0</p>
        </div>
        <div></div>
      </div>
      {/* Reports Links */}
      <div
        className={`my-5 rounded-lg p-5 w-1/2 ${
          theme === "light"
            ? "bg-gray-200 text-slate-900"
            : "bg-gray-100 text-slate-900"
        }`}
      >
        <Link
          to="/reportRoomReservationsCount"
          className="w-full flex flex-row justify-between items-center"
        >
          <p>Room Reservations Count Report</p>
          <FaChevronRight />
        </Link>
      </div>
      <div
        className={`my-5 rounded-lg p-5 w-1/2 ${
          theme === "light"
            ? "bg-gray-200 text-slate-900"
            : "bg-gray-100 text-slate-900"
        }`}
      >
        <Link
          to="/reportRoomReservationsRevenue"
          className="w-full flex flex-row justify-between items-center"
        >
          <p>Room Reservations Revenue Report</p>
          <FaChevronRight />
        </Link>
      </div>
      <div
        className={`my-5 rounded-lg p-5 w-1/2 ${
          theme === "light"
            ? "bg-gray-200 text-slate-900"
            : "bg-gray-100 text-slate-900"
        }`}
      >
        <Link
          to="/reportVenueReservationsCount"
          className="w-full flex flex-row justify-between items-center"
        >
          <p>Venue Reservations Count Report</p>
          <FaChevronRight />
        </Link>
      </div>
      <div
        className={`my-5 rounded-lg p-5 w-1/2 ${
          theme === "light"
            ? "bg-gray-200 text-slate-900"
            : "bg-gray-100 text-slate-900"
        }`}
      >
        <Link
          to="/reportVenueReservationsRevenue"
          className="w-full flex flex-row justify-between items-center"
        >
          <p>Venue Reservations Revenue Report</p>
          <FaChevronRight />
        </Link>
      </div>
      <div
        className={`my-5 rounded-lg p-5 w-1/2 ${
          theme === "light"
            ? "bg-gray-200 text-slate-900"
            : "bg-gray-100 text-slate-900"
        }`}
      >
        <Link
          to="/reportGuests"
          className="w-full flex flex-row justify-between items-center"
        >
          <p>Guests Report</p>
          <FaChevronRight />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
