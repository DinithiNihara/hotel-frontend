import React, { useEffect } from "react";
import { useRoomReservationsContext } from "../hooks/useRoomReservationsContext.js";

const Dashboard = () => {
  const role = window.localStorage.getItem("role");
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
      <div className="grid grid-cols-3">
        <div>
          <p>Room Bookings</p>
          <p>{roomReservations && roomReservations.length}</p>
        </div>
        <div>
          <p>Venue Bookings</p>
          <p>0</p>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Dashboard;
