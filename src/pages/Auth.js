import React, { useState } from "react";
import { useGuestsContext } from "../hooks/useGuestsContext.js";

const Auth = () => {
  const { dispatch } = useGuestsContext();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const guest = {
      userName,
      email,
      password,
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
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setUserName("");
      setPassword("");
      setEmail("");
      setError(null);
      setEmptyFields([]);
      // console.log("new guest added", json);
      dispatch({ type: "ADD_GUEST", payload: json });
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-flow-row my-4">
          <label>Username:</label>
          <input
            type="text"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            value={userName}
            className={
              emptyFields.includes("userName")
                ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
            }
          />
        </div>

        <div className="grid grid-flow-row my-4">
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

        <div className="grid grid-flow-row my-4">
          <label>Password:</label>
          <input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            className={
              emptyFields.includes("password")
                ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
            }
          />
        </div>

        <button className="bg-gray-700 text-white rounded-lg w-full p-2 my-4">
          Sign In
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default Auth;
