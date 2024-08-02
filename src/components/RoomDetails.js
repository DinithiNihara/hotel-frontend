import React from "react";
import { useRoomsContext } from "../hooks/useRoomsContext.js";
import { FiEdit3, FiTrash } from "react-icons/fi";
import { useModalContext } from "../context/ModalContext.js";
import { useDeleteModalContext } from "../context/DeleteModalContext.js";

const RoomDetails = ({ room }) => {
  const { dispatch } = useRoomsContext();
  const { onOpen } = useModalContext();
  const { onDeleteOpen } = useDeleteModalContext();

  const handleEdit = async () => {
    onOpen("Room", room);
  };

  const handleDelete = async () => {
    // Open the delete modal with dynamic details
    onDeleteOpen(
      "Delete Room", // Title of the modal
      `/api/rooms/${room._id}`, // Endpoint
      "DELETE", // HTTP method
      room, // Data (if needed for the callback)
      async (json) => {
        // Callback function to handle state update after deletion
        dispatch({ type: "DELETE_ROOM", payload: json });
      }
    );
  };

  return (
    <tr className="bg-white border-b  font-medium text-gray-600 whitespace-nowrap">
      <td className="px-6 py-4">{room.type}</td>
      <td className="px-6 py-4">{room.roomNo}</td>
      <td className="px-6 py-4">{room.beds}</td>
      <td className="px-6 py-4">{room.extraBed}</td>
      <td className="px-6 py-4">{room.occupancy}</td>
      <td className="px-6 py-4">{room.bathrooms}</td>
      <td className="px-6 py-4">{room.groundSpace}</td>
      <td className="px-6 py-4">{room.cost}</td>
      <td className="px-6 py-4">{room.description}</td>
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
  );
};

export default RoomDetails;
