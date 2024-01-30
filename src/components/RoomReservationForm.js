import React, { useEffect, useState } from "react";
import ProgressStepsBar from "./ProgressStepsBar";
import Datepicker from "react-tailwindcss-datepicker";
import { Button, HStack } from "@chakra-ui/react";
import RoomDetailsForReservation from "./RoomDetailsForReservation";
import { useRoomsContext } from "../hooks/useRoomsContext.js";
import SoftButton from "./SoftButton.js";

const RoomReservationForm = () => {
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  // Room Details
  const { rooms, dispatch } = useRoomsContext();

  // fetch all rooms
  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch("/api/rooms");
      const json = await response.json();
      console.log(json);
      if (response.ok) {
        dispatch({ type: "SET_ROOMS", payload: json });
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <ProgressStepsBar />
      <div className="h-[60px] m-4 p-1 rounded border-2 border-dashed border-slate-600 ">
        <HStack>
          <Datepicker
            value={value}
            onChange={handleValueChange}
            primaryColor={"amber"}
            minDate={new Date()}
            placeholder="Check In - Check Out"
            inputClassName={"bg-white w-1/4 rounded-lg p-1 text-center"}
            className=" w-1/4"
          />
          <SoftButton text="Add New Reservation">
            <span>Check Availability</span>
          </SoftButton>
        </HStack>
      </div>
      <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Available Rooms:
            </th>
          </tr>
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
