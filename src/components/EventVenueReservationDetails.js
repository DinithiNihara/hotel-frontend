import React, { useEffect, useState } from "react";
import { FiEdit3, FiTrash, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useModalContext } from "../context/ModalContext.js";
import { useVenueReservationsContext } from "../hooks/useVenueReservationsContext.js";
import { useDeleteModalContext } from "../context/DeleteModalContext.js";

const EventVenueReservationDetails = ({ eventVenueReservation }) => {
  console.log(eventVenueReservation);
  const [detailedView, setDetailedView] = useState(false);
  const { setEventVenueReservations } = useVenueReservationsContext();
  const { onOpen } = useModalContext();
  const { onDeleteOpen } = useDeleteModalContext();
  const [paidAmount, setPaidAmount] = useState(0);

  const handleDetailedView = (value) => {
    setDetailedView(value);
  };

  const handleEdit = async () => {
    onOpen("Venue Reservation", eventVenueReservation);
  };

  const handleDelete = async () => {
    // Open the delete modal with dynamic details
    onDeleteOpen(
      "Delete Venue Reservation", // Title of the modal
      `/api/eventVenueReservations/${eventVenueReservation._id}`, // Endpoint
      "DELETE", // HTTP method
      eventVenueReservation, // Data (if needed for the callback)
      async (json) => {
        // Callback function to handle state update after deletion
        setEventVenueReservations({
          type: "DELETE_EVENTVENUERESERVATIONS",
          payload: json,
        });
      }
    );
  };

  console.log(eventVenueReservation);

  useEffect(() => {
    let amount = 0;
    {
      eventVenueReservation &&
        eventVenueReservation.paymentDetails.map((payment) => {
          amount += payment.cost;
        });
    }
    setPaidAmount(amount);
  }, [eventVenueReservation]);

  console.log(paidAmount);

  return (
    eventVenueReservation && (
      <>
        <tr
          className={`bg-white  font-medium text-gray-600 whitespace-nowrap ${
            !detailedView ? "border-b " : ""
          }`}
        >
          <td scope="row" className="px-6 py-4">
            {eventVenueReservation.bookingNo}
          </td>
          <td scope="row" className="px-6 py-4">
            {eventVenueReservation.type}
          </td>
          <td className="px-6 py-4">
            {eventVenueReservation.guest.title}{" "}
            {eventVenueReservation.guest.firstName}{" "}
            {eventVenueReservation.guest.lastName}
          </td>
          <td className="px-6 py-4">{eventVenueReservation.checkIn}</td>
          <td className="px-6 py-4">{eventVenueReservation.checkOut}</td>
          <td className="pl-6 pr-1 py-4">{eventVenueReservation.status}</td>
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
          <>
            <tr className=" bg-gray-50 font-medium text-gray-600 whitespace-nowrap ">
              <td className="px-6 pt-4 pb-2 text-right" colSpan="2">
                <p className="font-bold">EventVenue/s: </p>
              </td>
              <td className="pt-4 pb-2" colSpan="7">
                {eventVenueReservation &&
                  eventVenueReservation.eventVenues.map((eventVenue, index) => (
                    <p key={index}>
                      {eventVenue.venueNo} - {eventVenue.type}
                    </p>
                  ))}
              </td>
            </tr>
            <tr className="bg-gray-50  font-medium text-gray-600 whitespace-nowrap w-full">
              <td className="px-6 py-2 text-right" colSpan="2">
                <p className="font-bold">Extras:</p>
              </td>
              <td className="py-2" colSpan="7">
                {eventVenueReservation &&
                  eventVenueReservation.extras.map((extra, index) => (
                    <p key={index}>{extra.name}</p>
                  ))}
              </td>
            </tr>
            <tr className="bg-gray-50  border-b font-medium text-gray-600 whitespace-nowrap">
              <td className="px-6 pt-2 pb-4 text-right" colSpan="2">
                <p className="font-bold">Balance: </p>
              </td>
              <td className="pt-2 pb-4" colSpan="7">
                <p>{eventVenueReservation.total - paidAmount}</p>
              </td>
            </tr>
          </>
        )}
      </>
    )
  );
};

export default EventVenueReservationDetails;
