import React, { useState } from "react";
import { useEventVenuesContext } from "../hooks/useEventVenuesContext";
import { useModalContext } from "../context/ModalContext";

const EditModalBodyEventVenue = () => {
  const { onClose, data } = useModalContext();
  const { dispatch } = useEventVenuesContext();

  const [type, setType] = useState(data && data.type);
  const [venueNo, setVenueNo] = useState(data && data.venueNo);
  const [capacity, setCapacity] = useState(data && data.capacity);
  const [description, setDescription] = useState(data && data.description);
  const [cost, setCost] = useState(data && data.cost);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventVenue = {
      type,
      venueNo,
      capacity,
      description,
      cost,
    };

    const response = await fetch("/api/eventVenues/" + data._id, {
      method: "PATCH",
      body: JSON.stringify(eventVenue),
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
      // console.log("eventVenue details updated", json);
      dispatch({ type: "UPDATE_EVENTVENUE", payload: json });
      onClose();
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row col-span-1">
            <label>Type:</label>
            <input
              type="text"
              onChange={(e) => {
                setType(e.target.value);
              }}
              value={type}
              className={
                emptyFields.includes("type")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>

          <div className="grid grid-flow-row col-span-2">
            <label>Venue No:</label>
            <input
              type="text"
              onChange={(e) => {
                setVenueNo(e.target.value);
              }}
              value={venueNo}
              className={
                emptyFields.includes("venueNo")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>

          <div className="grid grid-flow-row col-span-2">
            <label>Capacity:</label>
            <input
              type="number"
              onChange={(e) => {
                setCapacity(e.target.value);
              }}
              value={capacity}
              className={
                emptyFields.includes("capacity")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
        </div>
        <div className="grid grid-flow-row  my-4">
          <label>Description:</label>
          <input
            type="textarea"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            value={description}
            className={
              emptyFields.includes("description")
                ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
            }
          />
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row">
            <label>Cost:</label>
            <input
              type="number"
              maxLength={10}
              onChange={(e) => {
                setCost(e.target.value);
              }}
              value={cost}
              className={
                emptyFields.includes("cost")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
        </div>
        <button className="bg-gray-700 text-white rounded-lg w-full p-2 my-4">
          Add Event Venue
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default EditModalBodyEventVenue;
