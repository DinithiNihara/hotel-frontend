import React, { useEffect, useState } from "react";
import { useGuestsContext } from "../hooks/useGuestsContext.js";
import { FiUser, FiArrowRight } from "react-icons/fi";
// components
import GuestDetails from "../components/GuestDetails.js";
import GuestForm from "../components/GuestForm.js";
import SoftButton from "../components/SoftButton.js";

const Guests = () => {
  const { guests, setGuests } = useGuestsContext();

  const [changeLayout, setChangeLayout] = useState(false);

  // fetch all guests
  useEffect(() => {
    const fetchGuests = async () => {
      const response = await fetch("/api/guests");
      const json = await response.json();

      if (response.ok) {
        setGuests({ type: "SET_GUESTS", payload: json });
      }
    };

    fetchGuests();
  }, []);

  return (
    <div className="mx-24">
      <div className="grid grid-cols-2">
        <p className="py-4  text-2xl font-bold"> Guest Management</p>
        <div className="flex justify-end py-4">
          {!changeLayout ? (
            <SoftButton className="align-bottom" text="Add New Guest">
              <div className="flex flex-col">
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setChangeLayout(true);
                  }}
                >
                  Add New Guest
                </span>
              </div>
            </SoftButton>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className={`grid ${changeLayout ? " grid-cols-5" : "grid-cols-1"}`}>
        <div
          className={`relative overflow-x-auto rounded-lg ${
            changeLayout ? "col-span-3" : ""
          }`}
        >
          <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Address
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th> </th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {guests &&
                guests.map((guest) => (
                  <GuestDetails key={guest._id} guest={guest} />
                ))}
            </tbody>
          </table>
        </div>
        {changeLayout ? (
          <div className="col-span-2 pl-20">
            <div className="grid grid-cols-2">
              <p className="py-1 text-2xl"> Add A Guest</p>

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
              <GuestForm />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Guests;
