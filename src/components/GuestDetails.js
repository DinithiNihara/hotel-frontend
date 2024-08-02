import React from "react";
import { useGuestsContext } from "../hooks/useGuestsContext.js";
import { FiEdit3, FiTrash } from "react-icons/fi";
import { useModalContext } from "../context/ModalContext.js";
import { useDeleteModalContext } from "../context/DeleteModalContext.js";

const GuestDetails = ({ guest }) => {
  const { setGuests } = useGuestsContext();
  const { onOpen } = useModalContext();
  const { onDeleteOpen } = useDeleteModalContext();

  const handleEdit = async () => {
    onOpen("Guest", guest);
  };

  const handleDelete = async () => {
    // Open the delete modal with the dynamic endpoint, method, data, and callback
    onDeleteOpen(
      "Delete Guest", // Title of the modal
      `/api/guests/${guest._id}`, // Endpoint
      "DELETE", // HTTP method
      guest, // Data (if needed for the callback)
      (json) => {
        // Callback function to handle state update after deletion
        setGuests({ type: "DELETE_GUEST", payload: json });
      }
    );
  };

  return (
    <tr className="bg-white border-b  font-medium text-gray-600 whitespace-nowrap">
      <td scope="row" className="px-6 py-4">
        {guest.title} {guest.firstName} {guest.lastName}
      </td>
      <td className="px-6 py-4">{guest.address}</td>
      <td className="px-6 py-4">{guest.nicPassport}</td>
      <td className="px-6 py-4">{guest.phone}</td>
      <td className="px-6 py-4">{guest.email}</td>
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

export default GuestDetails;
