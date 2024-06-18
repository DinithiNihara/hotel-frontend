import React, { useEffect, useState } from "react";
import { useGuestsContext } from "../hooks/useGuestsContext.js";

const GuestForm = () => {
  const { setGuests } = useGuestsContext();

  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [nicPassport, setNicPassport] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [firstNameInvalid, setFirstNameInvalid] = useState(false);
  const [lastNameInvalid, setLastNameInvalid] = useState(false);
  const [nicPassportInvalid, setNicPassportInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const guest = {
      title,
      firstName,
      lastName,
      address,
      nicPassport,
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
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle("");
      setFirstName("");
      setLastName("");
      setAddress("");
      setPhone("");
      setEmail("");
      setError(null);
      setEmptyFields([]);
      // console.log("new guest added", json);
      setGuests({ type: "ADD_GUEST", payload: json });
    }
  };

  useEffect(() => {
    // Regular expression to check if it contains any special character or number
    const specialCharOrNumberRegex = /[^a-zA-Z]/;
    // Regular expression to check if it contains any special character
    const specialCharRegex = /[^a-zA-Z0-9]/;
    // Regular expression to check if it contains exactly 10 digits
    const numericRegex = /^\d{0,10}$/;
    // Regular expression to check if it's a valid email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (specialCharOrNumberRegex.test(firstName)) {
      setFirstNameInvalid(true);
    } else {
      setFirstNameInvalid(false);
    }
    if (specialCharOrNumberRegex.test(lastName)) {
      setLastNameInvalid(true);
    } else {
      setLastNameInvalid(false);
    }
    if (specialCharRegex.test(nicPassport)) {
      setNicPassportInvalid(true);
    } else {
      setNicPassportInvalid(false);
    }
    if (!numericRegex.test(phone)) {
      setPhoneInvalid(true);
    } else {
      setPhoneInvalid(false);
    }
    if (email.length !== 0) {
      if (!emailRegex.test(email)) {
        setEmailInvalid(true);
      } else {
        setEmailInvalid(false);
      }
    }
  }, [nicPassport, firstName, lastName, phone, email]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-8 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row col-span-2">
            <label>Title:</label>
            <select
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              value={title}
              className={
                emptyFields.includes("title")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            >
              <option value="">--</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
            </select>
          </div>

          <div className="grid grid-flow-row col-span-3">
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

          <div className="grid grid-flow-row col-span-3">
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
        {(firstNameInvalid || lastNameInvalid) && (
          <p className="text-sm text-red-600">Invalid Name</p>
        )}
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
            <label>NIC/Passport:</label>
            <input
              type="text"
              onChange={(e) => {
                setNicPassport(e.target.value);
              }}
              value={nicPassport}
              className={
                emptyFields.includes("nicPassport")
                  ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                  : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
              }
            />
          </div>

          <div className="grid grid-flow-row">
            <label>Phone:</label>
            <input
              type="text"
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
        </div>
        {(nicPassportInvalid || phoneInvalid) && (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
            {nicPassportInvalid && (
              <span className="text-sm text-red-600">Invalid NIC/Passport</span>
            )}
            {phoneInvalid && (
              <span className="text-sm text-red-600">Invalid Phone No</span>
            )}
          </div>
        )}
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
          {emailInvalid && (
            <p className="text-sm text-red-600">Invalid Email</p>
          )}
        </div>
        <button
          disabled={
            firstNameInvalid ||
            lastNameInvalid ||
            nicPassportInvalid ||
            phoneInvalid ||
            emailInvalid
          }
          className="bg-gray-700 text-white rounded-lg w-full p-2 my-4"
        >
          Add Guest
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default GuestForm;
