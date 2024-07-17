import React, { useEffect, useState } from "react";
import { useRoomsContext } from "../hooks/useRoomsContext.js";
import { FiArrowRight, FiSearch } from "react-icons/fi";
// components
import RoomDetails from "../components/RoomDetails.js";
import RoomForm from "../components/RoomForm.js";
import SoftButton from "../components/SoftButton.js";

const Rooms = () => {
  const { rooms, dispatch } = useRoomsContext();

  const [changeLayout, setChangeLayout] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("");

  // search room
  useEffect(() => {
    const searchRooms = async () => {
      const response = await fetch(
        `/api/rooms/search?term=${searchTerm}&type=${searchType}`
      );
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_ROOMS", payload: json });
      }
    };

    searchRooms();
  }, [searchTerm, searchType]);

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

  return (
    <div className="mx-24">
      <div className="grid grid-cols-2">
        <p className="py-4 text-2xl font-bold"> Room Management</p>
        <div className="flex justify-end py-4">
          {!changeLayout ? (
            <SoftButton className="align-bottom" text="Add New Room">
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setChangeLayout(true);
                }}
              >
                Add New Room
              </span>
            </SoftButton>
          ) : (
            ""
          )}
        </div>
      </div>
      {!changeLayout && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-row mb-4 items-center">
            <label className="text-base pr-2">Type:</label>
            <select
              onChange={(e) => {
                setSearchType(e.target.value);
              }}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
            >
              <option value="">--</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Superior Lagoon">Superior Lagoon</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-center items-center bg-gray-50 border rounded-lg mb-4">
            <FiSearch className="mx-2" />
            <input
              type="text"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="bg-gray-50  text-gray-900 text-sm rounded-r-lg w-full p-2"
              placeholder="Search by Room No / Occupancy / Cost"
            />
          </div>
        </div>
      )}

      <div className={`grid ${changeLayout ? " grid-cols-5" : "grid-cols-1"}`}>
        <div
          className={`relative overflow-x-auto rounded-lg h-96 ${
            changeLayout ? "col-span-3" : ""
          }`}
        >
          <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Room No.
                </th>
                <th scope="col" className="px-6 py-3">
                  Beds
                </th>
                <th scope="col" className="px-6 py-3">
                  Extra Bed
                </th>
                <th scope="col" className="px-6 py-3">
                  Occupancy
                </th>
                <th scope="col" className="px-6 py-3">
                  Bathrooms
                </th>
                <th scope="col" className="px-6 py-3">
                  Ground Space
                </th>
                <th scope="col" className="px-6 py-3">
                  Cost
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th> </th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {rooms &&
                rooms.map((room) => <RoomDetails key={room._id} room={room} />)}
            </tbody>
          </table>
        </div>
        {changeLayout ? (
          <div className="col-span-2 pl-20">
            <div className="grid grid-cols-2">
              <p className="py-1 text-2xl"> Add A Room</p>

              <div className="flex justify-end">
                <FiArrowRight
                  onClick={(e) => {
                    e.preventDefault();
                    setChangeLayout(false);
                  }}
                />
              </div>
            </div>
            <div>
              <RoomForm rooms={rooms} />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Rooms;
