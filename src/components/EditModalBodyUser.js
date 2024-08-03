import React, { useState } from "react";
import { useUserContext } from "../hooks/useUserContext";
import { useModalContext } from "../context/ModalContext";

const EditModalBodyUser = () => {
  const { onClose, data } = useModalContext();
  const { setUsers } = useUserContext();

  const [userName, setUserName] = useState(data && data.userName);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(data && data.email);
  const [role, setRole] = useState(data && data.role);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      userName,
      password,
      email,
      role,
    };

    const response = await fetch("/api/users/" + data._id, {
      method: "PATCH",
      body: JSON.stringify(user),
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
      // console.log("user details updated", json);
      setUsers({ type: "UPDATE_USER", payload: json });
      onClose();
    }
  };
  // const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-flow-row  my-4">
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
          <label>Password:</label>
          <input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="New password"
            className={
              emptyFields.includes("password")
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
          <label>Role:</label>
          <select
            onChange={(e) => {
              setRole(e.target.value);
            }}
            value={role}
            className={
              emptyFields.includes("role")
                ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
            }
          >
            <option value="">Select a role</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Reservation Manager">Reservation Manager</option>
            <option value="Banquet Manager">Banquet Manager</option>
            <option value="General Manager">General Manager</option>
          </select>
        </div>

        <button className="bg-gray-700 text-white rounded-lg w-full p-2 my-4">
          Edit User
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default EditModalBodyUser;
