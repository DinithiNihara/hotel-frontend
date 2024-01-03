import React from "react";
import { useEventVenuesContext } from "../hooks/useEventVenuesContext.js";
import { FiEdit3, FiTrash } from "react-icons/fi";
import { useModalContext } from "../context/ModalContext.js";

const EventVenueDetails = ({ eventVenue }) => {
  const { dispatch } = useEventVenuesContext();
  const { onOpen } = useModalContext();

  const handleEdit = async () => {
    onOpen("EventVenue", eventVenue);
  };

  const handleDelete = async () => {
    const response = await fetch("/api/eventVenues/" + eventVenue._id, {
      method: "DELETE",
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_EVENTVENUE", payload: json });
    }
  };

  return (
    <tr className="bg-white border-b  font-medium text-gray-600 whitespace-nowrap">
      <td className="px-6 py-4">{eventVenue.type}</td>
      <td className="px-6 py-4">{eventVenue.venueNo}</td>
      <td className="px-6 py-4">{eventVenue.capacity}</td>
      <td className="px-6 py-4">{eventVenue.description}</td>
      <td className="px-6 py-4">{eventVenue.cost}</td>
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

export default EventVenueDetails;
