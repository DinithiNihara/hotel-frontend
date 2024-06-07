import React, { useEffect, useState } from "react";
import { useRoomReservationsContext } from "../hooks/useRoomReservationsContext.js";
import { FiEdit3, FiTrash, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useModalContext } from "../context/ModalContext.js";

const RoomReservationDetails = ({ roomReservation }) => {
  const [detailedView, setDetailedView] = useState(false);
  const { setRoomReservations } = useRoomReservationsContext();
  const { onOpen } = useModalContext();
  const [paidAmount, setPaidAmount] = useState(0);

  const handleDetailedView = (value) => {
    setDetailedView(value);
  };

  const handleEdit = async () => {
    onOpen("Room Reservation", roomReservation);
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
      setRoomReservations({ type: "DELETE_ROOMRESERVATION", payload: json });
    }
  };
  console.log(roomReservation);

  useEffect(() => {
    let amount = 0;
    roomReservation.paymentDetails.map((payment) => {
      amount += payment.cost;
    });
    setPaidAmount(amount);
  }, [roomReservation]);

  console.log(paidAmount);

  return (
    <>
      <tr
        className={`bg-white  font-medium text-gray-600 whitespace-nowrap ${
          !detailedView ? "border-b " : ""
        }`}
      >
        <td scope="row" className="px-6 py-4">
          {roomReservation.bookingNo}
        </td>
        <td scope="row" className="px-6 py-4">
          {roomReservation.type}
        </td>
        <td className="px-6 py-4">
          {roomReservation.guest.title} {roomReservation.guest.firstName}{" "}
          {roomReservation.guest.lastName}
        </td>
        <td className="px-6 py-4">{roomReservation.checkIn}</td>
        <td className="px-6 py-4">{roomReservation.checkOut}</td>
        <td className="pl-6 pr-1 py-4">{roomReservation.status}</td>
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
              <p className="font-bold">Room/s: </p>
            </td>
            <td className="pt-4 pb-2" colSpan="7">
              {roomReservation.rooms.map((room, index) => (
                <p key={index}>
                  {room.roomNo} - {room.type}
                </p>
              ))}
            </td>
          </tr>
          <tr className="bg-gray-50  font-medium text-gray-600 whitespace-nowrap w-full">
            <td className="px-6 py-2 text-right" colSpan="2">
              <p className="font-bold">Extras:</p>
            </td>
            <td className="py-2" colSpan="7">
              {roomReservation.extras.map((extra, index) => (
                <p key={index}>{extra.name}</p>
              ))}
            </td>
          </tr>
          <tr className="bg-gray-50  border-b font-medium text-gray-600 whitespace-nowrap">
            <td className="px-6 pt-2 pb-4 text-right" colSpan="2">
              <p className="font-bold">Balance: </p>
            </td>
            <td className="pt-2 pb-4" colSpan="7">
              <p>{roomReservation.total - paidAmount}</p>
            </td>
          </tr>
        </>
      )}
    </>
  );
};

export default RoomReservationDetails;
