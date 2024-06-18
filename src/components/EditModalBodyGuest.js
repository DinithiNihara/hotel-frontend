import React, { useEffect, useState } from "react";
import { useGuestsContext } from "../hooks/useGuestsContext";
import { useModalContext } from "../context/ModalContext";

const EditModalBodyGuest = () => {
  const { onClose, data } = useModalContext();
  const { setGuests } = useGuestsContext();

  const [title, setTitle] = useState(data && data.title);
  const [firstName, setFirstName] = useState(data && data.firstName);
  const [lastName, setLastName] = useState(data && data.lastName);
  const [address, setAddress] = useState(data && data.address);
  const [nicPassport, setNicPassport] = useState(data && data.nicPassport);
  const [phone, setPhone] = useState(data && data.phone);
  const [email, setEmail] = useState(data && data.email);
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
      setGuests({ type: "UPDATE_GUEST", payload: json });
      onClose();
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
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-2 my-4">
          <div className="grid grid-flow-row col-span-1">
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
        {(firstNameInvalid || lastNameInvalid) && (
          <p className="text-sm text-red-600">Invalid Name</p>
        )}
        <div
          className={`grid lg:grid-cols-5 grid-cols-1 gap-2 ${
            nicPassportInvalid ? "my-0" : "my-4"
          } `}
        >
          <div className="grid grid-flow-row col-span-3 my-4">
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
          <div className="grid grid-flow-row col-span-2 my-4">
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
        </div>
        {nicPassportInvalid && (
          <div className="grid lg:grid-cols-5 grid-cols-1">
            <div className="grid col-span-3"></div>
            <div className="grid col-span-2">
              {nicPassportInvalid && (
                <span className="text-sm text-red-600 px-2">
                  Invalid NIC/Passport
                </span>
              )}
            </div>
          </div>
        )}
        <div
          className={`grid lg:grid-cols-2 grid-cols-1 gap-2 ${
            phoneInvalid || emailInvalid ? "my-0" : "my-4"
          } `}
        >
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
        {(phoneInvalid || emailInvalid) && (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
            <div>
              {phoneInvalid && (
                <p className="text-sm text-red-600">Invalid Phone No</p>
              )}
            </div>
            <div>
              {emailInvalid && (
                <p className="text-sm text-red-600 px-1">Invalid Email</p>
              )}
            </div>
          </div>
        )}
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
          Edit Guest
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default EditModalBodyGuest;
