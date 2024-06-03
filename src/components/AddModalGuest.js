import React, { useState } from "react";
import { useGuestsContext } from "../hooks/useGuestsContext";
import { useModalContext } from "../context/ModalContext";

const AddModalGuest = () => {
  const { onClose, data } = useModalContext();
  const { dispatch } = useGuestsContext();

  const [title, setTitle] = useState(data && data.title);
  const [firstName, setFirstName] = useState(data && data.firstName);
  const [lastName, setLastName] = useState(data && data.lastName);
  const [address, setAddress] = useState(data && data.address);
  const [phone, setPhone] = useState(data && data.phone);
  const [email, setEmail] = useState(data && data.email);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const guest = {
      title,
      firstName,
      lastName,
      address,
      phone,
      email,
    };

    const response = await fetch("/api/guests/" + data._id, {
      method: "PATCH",
      body: JSON.stringify(guest),
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
      // console.log("guest details updated", json);
      dispatch({ type: "UPDATE_GUEST", payload: json });
      onClose();
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row col-span-1">
            <label>Title:</label>
            <input
              type="text"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              value={title}
              className={
                emptyFields.includes("title")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>

          <div className="grid grid-flow-row col-span-2">
            <label>First Name:</label>
            <input
              type="text"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              value={firstName}
              className={
                emptyFields.includes("firstName")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>

          <div className="grid grid-flow-row col-span-2">
            <label>Last Name:</label>
            <input
              type="text"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              value={lastName}
              className={
                emptyFields.includes("lastName")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
        </div>
        <div className="grid grid-flow-row  my-4">
          <label>Address:</label>
          <input
            type="textarea"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            value={address}
            className={
              emptyFields.includes("address")
                ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
            }
          />
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row">
            <label>Phone:</label>
            <input
              type="number"
              maxLength={10}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              value={phone}
              className={
                emptyFields.includes("phone")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>

          <div className="grid grid-flow-row">
            <label>Email:</label>
            <input
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              className={
                emptyFields.includes("email")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>
        </div>
        <button className="bg-gray-700 text-white rounded-lg w-full p-2 my-4">
          Add Guest
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default AddModalGuest;
