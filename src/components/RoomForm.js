import React, { useState } from "react";
import { useRoomsContext } from "../hooks/useRoomsContext.js";

const RoomForm = () => {
  const { dispatch } = useRoomsContext();

  const [type, setType] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [beds, setBeds] = useState("");
  const [extraBed, setExtraBed] = useState("");
  const [occupancy, setOccupancy] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [groundSpace, setGroundSpace] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const room = {
      type,
      roomNo,
      beds,
      extraBed,
      occupancy,
      bathrooms,
      groundSpace,
      cost,
      description,
    };

    const response = await fetch("/api/rooms", {
      method: "POST",
      body: JSON.stringify(room),
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
      setType("");
      setRoomNo("");
      setBeds("");
      setExtraBed("");
      setOccupancy("");
      setBathrooms("");
      setGroundSpace("");
      setCost("");
      setDescription("");
      setError(null);
      setEmptyFields([]);
      // console.log("new room added", json);
      dispatch({ type: "ADD_ROOM", payload: json });
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row col-span-3">
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
            <label>Room No:</label>
            <input
              type="text"
              onChange={(e) => {
                setRoomNo(e.target.value);
              }}
              value={roomNo}
              className={
                emptyFields.includes("roomNo")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row">
            <label>Extra Bed:</label>
            <input
              type="textarea"
              onChange={(e) => {
                setExtraBed(e.target.value);
              }}
              value={extraBed}
              className={
                emptyFields.includes("extraBed")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
          <div className="grid grid-flow-row">
            <label>Beds:</label>
            <input
              type="text"
              onChange={(e) => {
                setBeds(e.target.value);
              }}
              value={beds}
              className={
                emptyFields.includes("beds")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row">
            <label>Occupancy:</label>
            <input
              type="text"
              onChange={(e) => {
                setOccupancy(e.target.value);
              }}
              value={occupancy}
              className={
                emptyFields.includes("occupancy")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>

          <div className="grid grid-flow-row">
            <label>Bathrooms:</label>
            <input
              type="bathrooms"
              onChange={(e) => {
                setBathrooms(e.target.value);
              }}
              value={bathrooms}
              className={
                emptyFields.includes("bathrooms")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row">
            <label>Ground Space:</label>
            <input
              type="number"
              maxLength={1000}
              onChange={(e) => {
                setGroundSpace(e.target.value);
              }}
              value={groundSpace}
              className={
                emptyFields.includes("groundSpace")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>

          <div className="grid grid-flow-row">
            <label>Cost:</label>
            <input
              type="number"
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

        <div className="grid ">
          <label>Description:</label>
          <input
            type="textArea"
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

        <button className="bg-gray-700 text-white rounded-lg w-full p-2 my-4">
          Add Room
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default RoomForm;
