import React, { useEffect, useState } from "react";
import ProgressStepsBar from "./ProgressStepsBar";
import Datepicker from "react-tailwindcss-datepicker";
import { Button, HStack, Spacer } from "@chakra-ui/react";
import RoomDetailsForReservation from "./RoomDetailsForReservation";
import { useRoomsContext } from "../hooks/useRoomsContext.js";
import SoftButton from "./SoftButton.js";
import { format } from "date-fns";

const RoomReservationForm = () => {
  const [value, setValue] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  // fetch all available rooms
  const fetchRooms = async () => {
    let checkInDate = value.startDate;
    let checkOutDate = value.endDate;
    const response = await fetch(
      `/api/rooms/available?checkIn=${checkInDate}&checkOut=${checkOutDate}`
    );
    const json = await response.json();
    console.log(json);
    if (response.ok) {
      dispatch({ type: "SET_ROOMS", payload: json });
    }
  };

  const checkAvailableRooms = () => {
    fetchRooms();
  };

  let handleValueChange = (newDates) => {
    console.log("newDates:", newDates);
    setValue(newDates);
  };

  // Room Details
  const { rooms, dispatch } = useRoomsContext();

  useEffect(() => {
    console.log(value);
    fetchRooms();
  }, []);

  return (
    <div>
      <ProgressStepsBar />
      <div className="h-fit m-4 p-1 rounded border-2 border-dashed border-slate-600 ">
        <HStack>
          <Datepicker
            value={value}
            onChange={handleValueChange}
            primaryColor={"amber"}
            minDate={new Date()}
            placeholder="Check In - Check Out"
            inputClassName={"bg-white w-full rounded-lg py-5 text-center"}
          />
          <SoftButton text="Check Availability">
            <span
              onClick={(e) => {
                e.preventDefault();
                checkAvailableRooms();
              }}
            >
              Check Availability
            </span>
          </SoftButton>
        </HStack>
      </div>

      <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
            <tr>
              <th className="px-6 py-2 md:w-48 text-center">Type</th>
              <th className="px-6 py-2 md:w-24 text-center">Room No</th>
              <th className="px-6 py-2 md:w-48 text-center ">Beds</th>
              <th className="px-6 py-2 md:w-24 text-center">Extra Bed</th>
              <th className="px-6 py-2 md:w-48 text-center">Occupancy</th>
              <th className="px-6 py-2 md:w-32 text-center">Cost</th>
            </tr>
          </thead>
        </thead>
        <tbody>
          {rooms &&
            rooms.map((room) => (
              <RoomDetailsForReservation key={room._id} room={room} />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomReservationForm;
