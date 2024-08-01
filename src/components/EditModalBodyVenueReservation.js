import React, { useState } from "react";
import { useRoomReservationsContext } from "../hooks/useRoomReservationsContext";
import { useModalContext } from "../context/ModalContext";

const EditModalBodyVenueReservation = () => {
  const { onClose, data } = useModalContext();
  const { setRoomReservations } = useRoomReservationsContext();
  console.log(data);
  const [description, setDescription] = useState(data && data.description);
  const [status, setStatus] = useState(data && data.status);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomReservation = {
      bookingNo: data.bookingNo,
      type: data.type,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guest: data.guest._id,
      eventVenues: data.eventVenues,
      rooms: data.rooms,
      extras: data.extras,
      paymentDetails: data.paymentDetails,
      status: status,
      total: data.total,
    };

    const response = await fetch("/api/eventVenueReservations/" + data._id, {
      method: "PATCH",
      body: JSON.stringify(roomReservation),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setError(null);
      setEmptyFields([]);
      // console.log("Room Reservation details updated", json);
      setRoomReservations({ type: "UPDATE_ROOMRESERVATIONS", payload: json });
      onClose();
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row col-span-1">
            <label>Booking No:</label>
            <input
              type="text"
              disabled
              value={data && data.bookingNo}
              className={
                emptyFields.includes("bookingNo")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>

          <div className="grid grid-flow-row col-span-1">
            <label>Type:</label>
            <input
              type="text"
              disabled
              value={data && data.type}
              className={
                emptyFields.includes("type")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row col-span-1">
            <label>Check In:</label>
            <input
              type="text"
              disabled
              value={data && data.checkIn}
              className={
                emptyFields.includes("checkIn")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>

          <div className="grid grid-flow-row col-span-1">
            <label>Check Out:</label>
            <input
              type="text"
              disabled
              value={data && data.checkOut}
              className={
                emptyFields.includes("checkOut")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row col-span-1">
            <label>Guest:</label>
            <input
              type="text"
              disabled
              value={
                data &&
                data.guest.title +
                  " " +
                  data.guest.firstName +
                  " " +
                  data.guest.lastName
              }
              className={
                emptyFields.includes("guest")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-1 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row col-span-1">
            <label>Venues:</label>
            <input
              type="textarea"
              disabled
              value={
                data
                  ? data.eventVenues
                      .map((venue) => `${venue.venueNo} - ${venue.type}`)
                      .join(", ")
                  : ""
              }
              className={
                emptyFields.includes("eventVenues")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row col-span-1">
            <label>Rooms:</label>
            <input
              type="textarea"
              disabled
              value={
                data
                  ? data.rooms
                      .map((room) => `${room.roomNo} - ${room.type}`)
                      .join(", ")
                  : ""
              }
              className={
                emptyFields.includes("rooms")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
          <div className="grid grid-flow-row col-span-1">
            <label>Extras:</label>
            <input
              type="textarea"
              disabled
              value={
                data
                  ? data.extras.map((extra) => `${extra.name}`).join(", ")
                  : ""
              }
              className={
                emptyFields.includes("extras")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row col-span-1">
            <label>Payment Details:</label>
            <input
              type="textarea"
              disabled
              value={
                data
                  ? data.paymentDetails
                      .map(
                        (payment) =>
                          `${payment.payment} Payment - ${payment.type}`
                      )
                      .join(", ")
                  : ""
              }
              className={
                emptyFields.includes("paymentDetails")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
          <div className="grid grid-flow-row col-span-1">
            <label>Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="CheckedIn">Checked In</option>
              <option value="CheckedOut">Checked Out</option>
              <option value="NoShow">No-Show</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <p>Total: {data && data.total}</p>
        <button className="bg-gray-700 text-white rounded-lg w-full p-2 my-4">
          Edit Room Reservation
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default EditModalBodyVenueReservation;
