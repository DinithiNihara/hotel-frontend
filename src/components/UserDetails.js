import React from "react";
import { useUserContext } from "../hooks/useUserContext.js";
import { FiEdit3, FiTrash } from "react-icons/fi";
import { useModalContext } from "../context/ModalContext.js";

const UserDetails = ({ user }) => {
  const { setUsers } = useUserContext();
  const { onOpen } = useModalContext();

  const handleEdit = async () => {
    onOpen("User", user);
  };

  const handleDelete = async () => {
    const response = await fetch("/api/users/" + user._id, {
      method: "DELETE",
    });
    const json = await response.json();

    if (response.ok) {
      setUsers({ type: "DELETE_USER", payload: json });
    }
  };

  return (
    <tr className="bg-white border-b  font-medium text-gray-600 whitespace-nowrap">
      <td className="px-6 py-4">{user.userName}</td>
      <td className="px-6 py-4">{user.email}</td>
      <td className="px-6 py-4">{user.role}</td>
      <td className="px-2 py-4">
        <button onClick={handleEdit}>
          <FiEdit3 />
        </button>
      </td>
      <td className="px-2 py-4">
        <button onClick={handleDelete}>
          <FiTrash />
        </button>
      </td>
    </tr>
  );
};

export default UserDetails;
