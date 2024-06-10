import React, { useEffect, useState } from "react";
import { useUserContext } from "../hooks/useUserContext.js";
import SoftButton from "../components/SoftButton.js";
import { FiArrowRight } from "react-icons/fi";
import UserForm from "../components/UserForm.js";
import UserDetails from "../components/UserDetails.js";

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [changeLayout, setChangeLayout] = useState(false);
  const { users, setUsers } = useUserContext();

  // fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const json = await response.json();

      if (response.ok) {
        setUsers({ type: "SET_USERS", payload: json });
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="mx-24">
      <div className="grid grid-cols-2">
        <p className="py-4 text-2xl font-bold"> User Management</p>
        <div className="flex justify-end py-4">
          {!changeLayout ? (
            <SoftButton className="align-bottom" text="Add New Reservation">
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setChangeLayout(true);
                }}
              >
                Add New User
              </span>
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
                  Username
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Role
                </th>
                <th> </th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user) => <UserDetails key={user._id} user={user} />)}
            </tbody>
          </table>
        </div>
        {changeLayout ? (
          <div className="col-span-2 pl-20">
            <div className="grid grid-cols-2">
              <p className="py-1 text-2xl"> Add A User</p>
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
              <UserForm />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Users;
