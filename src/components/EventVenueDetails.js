import React, { useState } from "react";
import { useEventVenuesContext } from "../hooks/useEventVenuesContext.js";
import { FiEdit3, FiTrash, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useModalContext } from "../context/ModalContext.js";

const EventVenueDetails = ({ eventVenue }) => {
  const { setEventVenues } = useEventVenuesContext();
  const [detailedView, setDetailedView] = useState(false);
  const { onOpen } = useModalContext();

  const handleDetailedView = (value) => {
    setDetailedView(value);
  };

  const handleEdit = async () => {
    onOpen("Venue", eventVenue);
  };

  const handleDelete = async () => {
    const response = await fetch("/api/eventVenues/" + eventVenue._id, {
      method: "DELETE",
    });
    const json = await response.json();

    if (response.ok) {
      setEventVenues({ type: "DELETE_EVENTVENUE", payload: json });
    }
  };

  return (
    <>
      <tr className="bg-white border-b font-medium text-gray-600 whitespace-nowrap">
        <td className="px-6 py-4">{eventVenue.type}</td>
        <td className="px-6 py-4">{eventVenue.venueNo}</td>
        <td className="px-6 py-4">{eventVenue.capacity}</td>
        <td className="px-6 py-4">{eventVenue.description}</td>
        <td className="px-6 py-4">{eventVenue.cost}</td>
        <td>
          {!detailedView ? (
            <button
              className="pr-8 py-4"
              onClick={(e) => {
                e.preventDefault();
                handleDetailedView(true);
              }}
            >
              <FiChevronDown />
            </button>
          ) : (
            <button
              className="pr-8 py-4"
              onClick={(e) => {
                e.preventDefault();
                handleDetailedView(false);
              }}
            >
              <FiChevronUp />
            </button>
          )}
        </td>
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
      {detailedView && (
        <tr className="bg-gray-50 font-medium text-gray-600 whitespace-nowrap">
          <td className="px-6 pt-4 pb-2 text-right" colSpan="2">
            <p className="font-bold">Image:</p>
          </td>
          <td className="pt-4 pb-2" colSpan="7">
            {eventVenue.image ? (
              <img
                src={`${eventVenue.image}`}
                alt="Event Venue"
                className="w-48 h-32 object-cover"
              />
            ) : (
              <p>No image available</p>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

export default EventVenueDetails;
