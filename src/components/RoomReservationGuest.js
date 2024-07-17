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
      <td className="px-6 py-4">{guest.phone}</td>
      <td className="px-6 py-4">{guest.email}</td>
      <td className="px-2 py-4"></td>
      <td className="px-2 py-4"></td>
    </tr>
  );
};

export default RoomReservationGuest;
