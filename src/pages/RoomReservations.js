import React, { useEffect, useState } from "react";
import SoftButton from "../components/SoftButton.js";
import RoomReservationForm from "../components/RoomReservationForm.js";
import RoomReservationDetails from "../components/RoomReservationDetails.js";
import { useRoomReservationsContext } from "../hooks/useRoomReservationsContext.js";
import { useGuestsContext } from "../hooks/useGuestsContext.js";
import { useRoomsContext } from "../hooks/useRoomsContext.js";
import { format } from "date-fns";
import { HStack } from "@chakra-ui/react";
import Datepicker from "react-tailwindcss-datepicker";

const RoomReservation = () => {
  const [section, setSection] = useState("main");
  const { roomReservations, setRoomReservations } =
    useRoomReservationsContext();
  const { guests, setGuests } = useGuestsContext();
  const { rooms, dispatch } = useRoomsContext();
  const [formattedRoomReservations, setFormattedRoomReservations] = useState(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  const getFirstDayOfMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getLastDayOfMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const [value, setValue] = useState({
    startDate: format(getFirstDayOfMonth(), "yyyy-MM-dd"),
    endDate: format(getLastDayOfMonth(), "yyyy-MM-dd"),
  });

  const formatReservationData = () => {
    // Format each reservation
    const formattedData = roomReservations.map((reservation) => {
      // Format dates
      const formattedCheckIn = format(
        new Date(reservation.checkIn),
        "yyyy-MM-dd"
      );
      const formattedCheckOut = format(
        new Date(reservation.checkOut),
        "yyyy-MM-dd"
      );

      // Find the guest object by guest ID
      const guest = guests.find((g) => g._id === reservation.guest);

      let mappedRooms = [];
      // Check if rooms is not null or undefined
      if (rooms) {
        // Map each room ID to its corresponding room object
        mappedRooms = reservation.rooms.map((roomId) => {
          return rooms.find((room) => room._id === roomId);
        });
      }

      // Return a new reservation object with formatted dates and guest object
      return {
        ...reservation,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        guest: guest || reservation.guest, // fallback to guest ID if guest not found
        rooms: mappedRooms,
      };
    });

    // Set the formatted data back to state
    setFormattedRoomReservations(formattedData);
    setIsLoading(false); // Data is now loaded
  };

  const fetchRoomReservations = async () => {
    const response = await fetch("/api/roomReservations");
    const json = await response.json();

    if (response.ok) {
      setRoomReservations({ type: "SET_ROOMRESERVATIONS", payload: json });
    }
  };

  // Reload function
  const reloadReservations = () => {
    setIsLoading(true);
    fetchRoomReservations().then(() => {
      setIsLoading(false);
    });
  };

  let handleValueChange = (newDates) => {
    setValue(newDates);
    console.log(newDates);
  };

  // Fetch all reservations details
  useEffect(() => {
    const fetchGuests = async () => {
      const response = await fetch("/api/guests");
      const json = await response.json();

      if (response.ok) {
        setGuests({ type: "SET_GUESTS", payload: json });
      }
    };

    const fetchRooms = async () => {
      const response = await fetch("/api/rooms");
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_ROOMS", payload: json });
      }
    };

    fetchGuests();
    fetchRooms();
    fetchRoomReservations();
  }, [setRoomReservations, setGuests]);

  // Format data once roomReservations and guests are loaded
  useEffect(() => {
    if (
      roomReservations &&
      roomReservations.length > 0 &&
      guests &&
      guests.length > 0
      // &&
      // rooms &&
      // rooms.length > 0
    ) {
      formatReservationData();
    }
  }, [roomReservations, guests]);

  // search room
  useEffect(() => {
    let checkInDate = value.startDate;
    let checkOutDate = value.endDate;
    const filterReservations = async () => {
      const response = await fetch(
        `/api/roomReservations/filterReservations?checkIn=${checkInDate}&checkOut=${checkOutDate}`
      );
      const json = await response.json();

      if (response.ok) {
        setRoomReservations({ type: "SET_ROOMRESERVATIONS", payload: json });
      }
    };

    filterReservations();
  }, [value.startDate, value.endDate]);

  return (
    <div className="mx-24">
      <div className="grid grid-cols-2">
        <p className="py-4 text-2xl font-bold">
          <span
            className={`${section === "form" ? "cursor-pointer" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setSection("main");
            }}
          >
            Room Reservation
          </span>{" "}
          {section === "form" ? "/ New Reservation" : ""}
        </p>
        <div className="flex justify-end py-4">
          {section === "main" ? (
            <SoftButton className="align-bottom" text="Add New Reservation">
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setSection("form");
                }}
              >
                Add New Reservation
              </span>
            </SoftButton>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="w-full grid">
        {section === "form" ? (
          <RoomReservationForm
            onCancel={() => setSection("main")}
            reloadReservations={reloadReservations}
          />
        ) : isLoading ? (
          <p>Loading...</p> // Display loading text or spinner while data is loading
        ) : (
          <div className={`relative overflow-x-auto rounded-lg h-96`}>
            <div className="h-18 my-4 p-1 rounded border-2 border-dashed border-slate-600 ">
              <HStack>
                <Datepicker
                  value={value}
                  onChange={handleValueChange}
                  primaryColor={"amber"}
                  placeholder="Check In - Check Out"
                  inputClassName={"bg-white w-full rounded-lg py-1 text-center"}
                />
              </HStack>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Guest
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Check In
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Check Out
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th> </th>
                  <th> </th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {formattedRoomReservations.map((roomReservation) => (
                  <RoomReservationDetails
                    key={roomReservation._id}
                    roomReservation={roomReservation}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomReservation;
