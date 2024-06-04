import React, { useContext, useState } from "react";
import { useRoomsContext } from "../hooks/useRoomsContext.js";
import SoftButton from "./SoftButton.js";
import { RoomReservationDataContext } from "../context/RoomReservationDataContext";

const RoomReservationGuest = ({ guest }) => {
  const { reservationData, updateReservationData, resetReservationData } =
    useContext(RoomReservationDataContext);
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected(!isSelected);
    console.log(reservationData);
    // Function to handle adding data to reservationData
    const newData = { ...reservationData };
    newData.guest = guest._id;

    updateReservationData(newData);
    console.log(reservationData);
  };
  // const [isOpen, setIsOpen] = useState(false);
  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };
  return (
    <tr
      className={` border-b  font-medium text-gray-600 whitespace-nowrap ${
        isSelected ? "bg-gray-200" : "bg-white"
      }`}
      onClick={handleSelect}
    >
      <td scope="row" className="px-6 py-4">
        {guest.title} {guest.firstName} {guest.lastName}
      </td>
      <td className="px-6 py-4">{guest.address}</td>
      <td className="px-6 py-4">0{guest.phone}</td>
      <td className="px-6 py-4">{guest.email}</td>
      <td className="px-2 py-4"></td>
      <td className="px-2 py-4"></td>
      {/* <div>
          <button
            className="text-black w-full bg-gray-100 justify-between font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            type="button"
            onClick={toggleDropdown}
          >
            - - -
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-2 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-1/2">
              <ul className="py-2 text-sm text-gray-700">
                <li>Dashboard</li>
              </ul>
            </div>
          )}
        </div> */}
    </tr>
  );
};

export default RoomReservationGuest;
