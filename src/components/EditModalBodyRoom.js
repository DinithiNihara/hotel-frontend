import React, { useEffect, useState } from "react";
import { useRoomsContext } from "../hooks/useRoomsContext";
import { useModalContext } from "../context/ModalContext";

const EditModalBodyRoom = () => {
  const { onClose, data } = useModalContext();
  const { rooms, dispatch } = useRoomsContext();

  const [type, setType] = useState(data && data.type);
  const [roomNo, setRoomNo] = useState(data && data.roomNo);
  const [beds, setBeds] = useState(data && data.beds);
  const [extraBed, setExtraBed] = useState(data && data.extraBed);
  const [occupancy, setOccupancy] = useState(data && data.occupancy);
  const [bathrooms, setBathrooms] = useState(data && data.bathrooms);
  const [groundSpace, setGroundSpace] = useState(data && data.groundSpace);
  const [description, setDescription] = useState(data && data.description);
  const [cost, setCost] = useState(data && data.cost);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [roomNoExist, setRoomNoExist] = useState(false);
  const [newRoomNo, setNewRoomNo] = useState();
  const [roomNoInvalid, setRoomNoInvalid] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRoomNo) {
      setNewRoomNo(roomNo);
    }
    const room = {
      type,
      newRoomNo,
      beds,
      extraBed,
      occupancy,
      bathrooms,
      groundSpace,
      cost,
      description,
    };

    const response = await fetch("/api/rooms/" + data._id, {
      method: "PATCH",
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
      setError(null);
      setEmptyFields([]);
      // console.log("room details updated", json);
      dispatch({ type: "UPDATE_ROOM", payload: json });
      onClose();
    }
  };

  // fetch all rooms
  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch("/api/rooms");
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_ROOMS", payload: json });
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    // Regular expression to check if it contains any special character
    const specialCharRegex = /[^a-zA-Z0-9]/;

    if (specialCharRegex.test(roomNo)) {
      setRoomNoInvalid(true);
    } else {
      setRoomNoInvalid(false);
    }

    if (Array.isArray(rooms)) {
      const savedRoom = rooms.find((room) => room.roomNo === roomNo);
      if (savedRoom && data.roomNo !== roomNo) {
        setRoomNoExist(true);
      } else {
        setRoomNoExist(false);
        setNewRoomNo(roomNo);
      }
    }
  }, [roomNo]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row col-span-3">
            <label>Type:</label>
            <select
              onChange={(e) => {
                setType(e.target.value);
              }}
              value={type}
              className={
                emptyFields.includes("type")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            >
              <option value="">--</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Superior Lagoon">Superior Lagoon</option>
              <option value="Executive">Executive</option>
            </select>
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
        {newRoomNo && roomNoExist && (
          <p className="text-sm text-red-600">
            Sorry, that room number already exists
          </p>
        )}
        {roomNoInvalid && (
          <p className="text-sm text-red-600">Invalid room number</p>
        )}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row">
            <label>Extra Bed:</label>
            <select
              onChange={(e) => {
                setExtraBed(e.target.value);
              }}
              value={extraBed}
              className={
                emptyFields.includes("extraBed")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            >
              <option value="">--</option>
              <option value="No">No</option>
              <option value="On Request">On Request</option>
            </select>
          </div>
          <div className="grid grid-flow-row">
            <label>Beds:</label>
            <select
              onChange={(e) => {
                setBeds(e.target.value);
              }}
              value={beds}
              className={
                emptyFields.includes("beds")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            >
              <option value="">--</option>
              <option value="King-sized">King-sized</option>
              <option value="King-sized or Twin">King-sized or Twin</option>
            </select>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row">
            <label>Occupancy:</label>
            <select
              onChange={(e) => {
                setOccupancy(e.target.value);
              }}
              value={occupancy}
              className={
                emptyFields.includes("occupancy")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            >
              <option value="">--</option>
              <option value="Single/Double">Single/Double</option>
              <option value="Single/Double/triple">Single/Double/triple</option>
            </select>
          </div>

          <div className="grid grid-flow-row">
            <label>Bathrooms:</label>
            <select
              onChange={(e) => {
                setBathrooms(e.target.value);
              }}
              value={bathrooms}
              className={
                emptyFields.includes("bathrooms")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            >
              <option value="">--</option>
              <option value="Luxury">Luxury</option>
              <option value="Deluxe">Deluxe</option>
            </select>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row">
            <label>groundSpace:</label>
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
          <label>description:</label>
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

        <button
          disabled={roomNoExist}
          className="bg-gray-700 text-white rounded-lg w-full p-2 my-4"
        >
          Edit Room
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default EditModalBodyRoom;
