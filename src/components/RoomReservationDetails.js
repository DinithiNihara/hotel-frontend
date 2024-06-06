import React from "react";
import { useRoomReservationsContext } from "../hooks/useRoomReservationsContext.js";
import { FiEdit3, FiTrash } from "react-icons/fi";
import { useModalContext } from "../context/ModalContext.js";

const RoomReservationDetails = ({ roomReservation }) => {
  const { dispatch } = useRoomReservationsContext();
  const { onOpen } = useModalContext();

  const handleEdit = async () => {
    onOpen("RoomReservation", roomReservation);
  };

  const handleDelete = async () => {
    const response = await fetch(
      "/api/roomReservations/" + roomReservation._id,
      {
        method: "DELETE",
      }
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_ROOMRESERVATION", payload: json });
    }
  };
  console.log(roomReservation);
  return (
    <>
      <tr className="bg-white border-b  font-medium text-gray-600 whitespace-nowrap">
        <td scope="row" className="px-6 py-4">
          {roomReservation.type}
        </td>
        <td className="px-6 py-4">
          {roomReservation.guest.title} {roomReservation.guest.firstName}{" "}
          {roomReservation.guest.lastName}
        </td>
        <td className="px-6 py-4">{roomReservation.checkIn}</td>
        <td className="px-6 py-4">{roomReservation.checkOut}</td>
        <td className="px-6 py-4">{roomReservation.status}</td>
        <td className="px-2 py-4">
          <button onClick={handleEdit}>
            <FiEdit3 />
          </button>
        </td>
        <td className="px-2 py-4">
          <button onClick={handleDelete}>
            <FiTrash />
          </button>
        </td>
      </tr>
      <tr className="bg-white border-b  font-medium text-gray-600 whitespace-nowrap">
        <td className="px-6 py-4">
          <p className="font-bold py-2">Rooms:</p>
          {roomReservation.rooms.map((room) => (
            <p>{room.roomNo}</p>
          ))}
        </td>
      </tr>
    </>
  );
};

export default RoomReservationDetails;
