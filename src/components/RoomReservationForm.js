import React, { useContext, useEffect, useState } from "react";
import ProgressStepsBar from "./ProgressStepsBar";
import Datepicker from "react-tailwindcss-datepicker";
import { HStack } from "@chakra-ui/react";
import RoomDetailsForReservation from "./RoomDetailsForReservation";
import { useRoomsContext } from "../hooks/useRoomsContext.js";
import SoftButton from "./SoftButton.js";
import { differenceInDays, format, parseISO } from "date-fns";
import { RoomReservationDataContext } from "../context/RoomReservationDataContext";

const RoomReservationForm = () => {
  const [stepNo, setStepNo] = useState(0);
  const [value, setValue] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [dateCount, setDateCount] = useState(1);
  const [resetDates, setResetDates] = useState(false);
  const { reservationData, updateReservationData, resetReservationData } =
    useContext(RoomReservationDataContext);

  // Room Details
  const { rooms, dispatch } = useRoomsContext();

  const resetReservation = () => {
    resetReservationData();
    setResetDates(!resetDates);
    setStepNo(0);
  };

  // Fetch all available rooms
  const fetchRooms = async () => {
    let checkInDate = value.startDate;
    let checkOutDate = value.endDate;
    const response = await fetch(
      `/api/rooms/available?checkIn=${checkInDate}&checkOut=${checkOutDate}`
    );
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "SET_ROOMS", payload: json });
    }
  };

  const checkAvailableRooms = () => {
    fetchRooms();
    setResetDates(!resetDates);
    setStepNo(0);

    // Parse the dates
    const startDate = parseISO(value.startDate);
    const endDate = parseISO(value.endDate);

    // Calculate the difference in days
    const daysDifference = differenceInDays(endDate, startDate) + 1;

    // Set the date count
    setDateCount(daysDifference);
    console.log(daysDifference);
  };

  // Change Dates
  let handleValueChange = (newDates) => {
    setValue(newDates);
    console.log(newDates);
  };

  useEffect(() => {
    console.log(value);
    fetchRooms();
  }, []);

  // Change progress bar step number
  useEffect(() => {
    if (reservationData.roomIds.length > 0) {
      setStepNo(1);
    }
  }, [reservationData]);

  return (
    <div className="h-4/5">
      <ProgressStepsBar stepNo={stepNo} />
      {/* Step 1: Select Rooms */}
      <div>
        {/* Change dates to find available rooms */}
        <div className="h-18 my-4 p-1 rounded border-2 border-dashed border-slate-600 ">
          <HStack>
            <Datepicker
              value={value}
              onChange={handleValueChange}
              primaryColor={"amber"}
              minDate={new Date()}
              placeholder="Check In - Check Out"
              inputClassName={"bg-white w-full rounded-lg py-4 text-center"}
            />
            <SoftButton text="Check Availability">
              <p
                onClick={(e) => {
                  e.preventDefault();
                  checkAvailableRooms();
                }}
              >
                Check Availability
              </p>
            </SoftButton>
          </HStack>
        </div>
        {/* Available rooms list */}
        <div className="h-72 overflow-y-scroll">
          <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th>
                  <th scope="col" className="px-6 py-2 md:w-48 text-center">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-2 md:w-24 text-center">
                    Room No
                  </th>
                  <th scope="col" className="px-6 py-2 md:w-48 text-center">
                    Beds
                  </th>
                  <th scope="col" className="px-6 py-2 md:w-24 text-center">
                    Extra Bed
                  </th>
                  <th scope="col" className="px-6 py-2 md:w-48 text-center">
                    Occupancy
                  </th>
                  <th scope="col" className="px-6 py-2 md:w-32 text-center">
                    Cost
                  </th>
                  <th scope="col" className="px-6 py-2 md:w-48"></th>
                </th>
              </tr>
            </thead>
            <tbody>
              {rooms &&
                rooms.map((room) => (
                  <RoomDetailsForReservation
                    key={room._id}
                    room={room}
                    resetDates={resetDates}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Step 2: Select/ Add Guest */}
      <div></div>
      {/* Step 3: Select Extras */}
      <div></div>
      {/* Step 4: Payment */}
      <div></div>
      {/* Step 5: Confirmation */}
      <div></div>
      <div className="flex justify-between py-8">
        <p>
          Total:{" "}
          <span className="font-bold">
            LKR {reservationData.total * dateCount}
          </span>
        </p>
        <div className="flex gap-2">
          <button onClick={resetReservation}>Cancel</button>
          <button>Back</button>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
};

export default RoomReservationForm;
