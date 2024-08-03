import React, { useState } from "react";
import { useModalContext } from "../context/ModalContext";
import { useVenueReservationsContext } from "../hooks/useVenueReservationsContext";
import { format } from "date-fns";

const EditModalBodyVenueReservation = () => {
  const { onClose, data } = useModalContext();
  const { setEventVenueReservations } = useVenueReservationsContext();
  console.log(data);
  const [description, setDescription] = useState(data && data.description);
  const [status, setStatus] = useState(data && data.status);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [paymentType, setPaymentType] = useState(null);

  const handlePayment = () => {
    data.paymentDetails.push({
      payment: "Partial",
      cost: data.total / 2,
      type: paymentType,
      date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    });
    console.log(data.paymentDetails);
    
    handleSubmit();
    
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    const venueReservation = {
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
      body: JSON.stringify(venueReservation),
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
      // console.log("Venue Reservation details updated", json);
      setEventVenueReservations({
        type: "UPDATE_EVENTVENUERESERVATIONS",
        payload: json,
      });
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

        <div className="grid lg:grid-cols-1 grid-cols-1 gap-2 my-4">
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
        {data &&
          data.paymentDetails &&
          data.paymentDetails.length > 0 &&
          data.paymentDetails.length <= 1 &&
          data.paymentDetails[0].payment === "Partial" && (
            <div className="grid grid-cols-5 gap-2 border-2 rounded-lg p-2 bg-gray-200">
              <div className="grid grid-flow-row col-span-2">
                <label>Remaining:</label>
                <input
                  type="text"
                  disabled
                  value={data && data.total / 2}
                  className={
                    emptyFields.includes("type")
                      ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                      : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
                  }
                />
              </div>
              <div className="grid grid-flow-row col-span-2">
                <label>Payment Type:</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
                >
                  <option value="Card">Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              <div className="grid grid-flow-row place-items-end">
                <button
                  className="border-2 p-2 rounded-lg w-full"
                  onClick={handlePayment}
                >
                  Pay
                </button>
              </div>
            </div>
          )}

        <p>Total: {data && data.total}</p>
        <button className="bg-gray-700 text-white rounded-lg w-full p-2 my-4">
          Edit Venue Reservation
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default EditModalBodyVenueReservation;
