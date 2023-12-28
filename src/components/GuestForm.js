import React, { useState } from "react";
import { useGuestsContext } from "../hooks/useGuestsContext.js";

const GuestForm = () => {
  const { dispatch } = useGuestsContext();

  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

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

    const response = await fetch("/api/guests", {
      method: "POST",
      body: JSON.stringify(guest),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setTitle("");
      setFirstName("");
      setLastName("");
      setAddress("");
      setPhone("");
      setEmail("");
      setError(null);
      console.log("new guest added", json);
      dispatch({ type: "ADD_GUEST", payload: json });
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
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
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
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
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
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
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
            className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
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
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
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
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
            />
          </div>
        </div>
        <button>Add Guest</button>
        {error && <div className="text-red">{error}</div>}
      </form>
    </div>
  );
};

export default GuestForm;
