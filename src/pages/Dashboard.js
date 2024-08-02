import React, { useEffect, useState } from "react";
import { useRoomReservationsContext } from "../hooks/useRoomReservationsContext.js";
import { useGuestsContext } from "../hooks/useGuestsContext.js";
import { Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext.js";
import { FaChevronRight } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { format } from "date-fns";
import { Pie } from "react-chartjs-2";
import { useVenueReservationsContext } from "../hooks/useVenueReservationsContext.js";

const Dashboard = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const role = window.localStorage.getItem("role");

  const { theme } = useThemeContext();
  const { roomReservations, setRoomReservations } =
    useRoomReservationsContext();
  const { eventVenueReservations, setEventVenueReservations } =
    useVenueReservationsContext();
  const { guests, setGuests } = useGuestsContext();

  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const [todayAvailableRoomsCount, setTodayAvailableRoomsCount] = useState(0);
  const [todayRoomReservationsCount, setTodayRoomReservationsCount] =
    useState(0);
  const [todayAvailableVenuesCount, setTodayAvailableVenuesCount] = useState(0);
  const [todayVenueReservationsCount, setTodayVenueReservationsCount] =
    useState(0);

  const pieRoomsData = {
    labels: ["Available Rooms", "Occupied Rooms"],
    datasets: [
      {
        data: [todayAvailableRoomsCount, todayRoomReservationsCount],
        backgroundColor: ["#8AB17D", "#E76F51"],
      },
    ],
  };

  const pieVenuesData = {
    labels: ["Available Venues", "Occupied Venues"],
    datasets: [
      {
        data: [todayAvailableVenuesCount, todayVenueReservationsCount],
        backgroundColor: ["#8AB17D", "#E76F51"],
      },
    ],
  };

  useEffect(() => {
    const fetchRoomReservations = async () => {
      const response = await fetch("/api/roomReservations");
      const json = await response.json();

      if (response.ok) {
        // Filter out reservations with status "Cancelled"
        const filteredJson = json.filter(
          (reservation) => reservation.status !== "Cancelled"
        );

        setRoomReservations({
          type: "SET_ROOMRESERVATIONS",
          payload: filteredJson,
        });
      }
    };
    const fetchVenueReservations = async () => {
      const response = await fetch("/api/eventVenueReservations");
      const json = await response.json();

      if (response.ok) {
        // Filter out reservations with status "Cancelled"
        const filteredJson = json.filter(
          (reservation) => reservation.status !== "Cancelled"
        );

        setEventVenueReservations({
          type: "SET_EVENTVENUERESERVATIONS",
          payload: filteredJson,
        });
      }
    };
    const fetchGuests = async () => {
      const response = await fetch("/api/guests");
      const json = await response.json();

      if (response.ok) {
        setGuests({ type: "SET_GUESTS", payload: json });
      }
    };
    const fetchRoomsStatus = async () => {
      const response = await fetch("/api/reports/roomsStatus");
      const data = await response.json();

      if (response.ok) {
        setTodayAvailableRoomsCount(data.todayAvailableRoomsCount);
        setTodayRoomReservationsCount(data.todayRoomReservationsCount);
      }
    };
    const fetchVenuesStatus = async () => {
      const response = await fetch("/api/reports/venuesStatus");
      const data = await response.json();

      if (response.ok) {
        setTodayAvailableVenuesCount(data.todayAvailableVenuesCount);
        setTodayVenueReservationsCount(data.todayVenueReservationsCount);
      }
    };

    fetchGuests();
    fetchRoomReservations();
    fetchVenueReservations();
    fetchRoomsStatus();
    fetchVenuesStatus();
  }, []);
  return (
    <div className="mx-24">
      <p className="py-2 text-2xl font-bold">Welcome {cookies.username} !</p>
      <div className="my-4 p-2 text-center bg-amber-600 w-full h-full rounded-lg">
        <p className="text-white text-2xl">{role} - Dashboard</p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-2 grid gap-2">
          {/* Reports Links */}
          <div className="h-full grid gap-2">
            <div className="border-2 justify-center p-4 rounded-lg">
              <p className="text-lg font-bold py-2">Room Reservations :</p>
              <div className="flex gap-2">
                <div
                  className={` rounded-lg p-3 w-1/2 ${
                    theme === "light"
                      ? "bg-gray-200 text-slate-900"
                      : "bg-gray-100 text-slate-900"
                  }`}
                >
                  <Link
                    to="/reportRoomReservationsCount"
                    className="w-full flex flex-row justify-between items-center"
                  >
                    <p>Count Report</p>
                    <FaChevronRight />
                  </Link>
                </div>
                <div
                  className={` rounded-lg p-3 w-1/2 ${
                    theme === "light"
                      ? "bg-gray-200 text-slate-900"
                      : "bg-gray-100 text-slate-900"
                  }`}
                >
                  <Link
                    to="/reportRoomReservationsRevenue"
                    className="w-full flex flex-row justify-between items-center"
                  >
                    <p>Revenue Report</p>
                    <FaChevronRight />
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-2 justify-center p-4 rounded-lg">
              <p className="text-lg font-bold py-2">Venue Reservations :</p>
              <div className="flex gap-2">
                <div
                  className={` rounded-lg p-3 w-1/2 ${
                    theme === "light"
                      ? "bg-gray-200 text-slate-900"
                      : "bg-gray-100 text-slate-900"
                  }`}
                >
                  <Link
                    to="/reportVenueReservationsCount"
                    className="w-full flex flex-row justify-between items-center"
                  >
                    <p>Count Report</p>
                    <FaChevronRight />
                  </Link>
                </div>
                <div
                  className={` rounded-lg p-3 w-1/2 ${
                    theme === "light"
                      ? "bg-gray-200 text-slate-900"
                      : "bg-gray-100 text-slate-900"
                  }`}
                >
                  <Link
                    to="/reportVenueReservationsRevenue"
                    className="w-full flex flex-row justify-between items-center"
                  >
                    <p>Revenue Report</p>
                    <FaChevronRight />
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-2 justify-center p-4 rounded-lg">
              <p className="text-lg font-bold py-2">Guests :</p>
              <div
                className={` rounded-lg p-3 w-full ${
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
          </div>
        </div>
        <div className="col-span-3 grid gap-2">
          <div className=" grid gap-2">
            <div className="grid grid-flow-col gap-2 h-3/4 w-full">
              <div className=" border-2 rounded-lg w-full h-full">
                <p
                  className={`text-center font-bold border-b-2 ${
                    theme === "light"
                      ? "bg-gray-200 text-slate-900"
                      : "bg-gray-100 text-slate-900"
                  }`}
                >
                  Today's Room Availability
                </p>
                <Pie data={pieRoomsData} />
              </div>
              <div className=" border-2 rounded-lg w-full  h-full">
                <p
                  className={`text-center font-bold border-b-2 ${
                    theme === "light"
                      ? "bg-gray-200 text-slate-900"
                      : "bg-gray-100 text-slate-900"
                  }`}
                >
                  Today's Venue Availability
                </p>
                <Pie data={pieVenuesData} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="border-2 justify-center text-center p-3 rounded-lg ">
                <p className="font-bold">Room Bookings</p>
                <p className="font-bold text-xl">
                  {roomReservations && roomReservations.length}
                </p>
              </div>
              <div className="border-2 justify-center text-center p-3 rounded-lg ">
                <p className="font-bold">Venue Bookings</p>
                <p className="font-bold text-xl">
                  {eventVenueReservations && eventVenueReservations.length}
                </p>
              </div>
              <div className="border-2 justify-center text-center p-3 rounded-lg ">
                <p className="font-bold">Guests</p>
                <p className="font-bold text-xl">{guests && guests.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
