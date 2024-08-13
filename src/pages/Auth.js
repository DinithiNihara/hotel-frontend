import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

const Auth = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [userNameEmpty, setUserNameEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);

  const [_, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userName === "" && password === "") {
      setUserNameEmpty(true);
      setPasswordEmpty(true);
      setError(null);
    } else if (userName === "") {
      setUserNameEmpty(true);
      setPasswordEmpty(false);
      setError(null);
    } else if (password === "") {
      setPasswordEmpty(true);
      setUserNameEmpty(false);
      setError(null);
    } else {
      setUserNameEmpty(false);
      setPasswordEmpty(false);

      const user = {
        userName,
        password,
      };

      const response = await fetch("/api/users/login", {
        method: "POST",
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
        setUserName("");
        setPassword("");
        setError("");
        setEmptyFields([]);

        setCookies("access_token", json.token);
        setCookies("username", json.username);
        window.localStorage.setItem("userID", json.userID);
        window.localStorage.setItem("role", json.role);
        if (json.userID) navigate("/");
      }
    }
  };
  return (
    <div className="w-96 mx-auto my-16 place-content-center border-2 rounded-lg py-8 px-6">
      <form onSubmit={handleSubmit}>
        <div className="my-2">
          <img src={Logo} className="h-56 mx-auto" />
        </div>
        {error && (
          <div className="p-2 bg-red-200 rounded-lg border-red-600 border-2">
            <p className="text-base text-red-600">{error}</p>
          </div>
        )}
        <div className="grid grid-flow-row my-4">
          <label className="text-base">Username:</label>
          <input
            type="text"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            value={userName}
            className={
              emptyFields.includes("userName") || userNameEmpty
                ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
            }
          />
          {userNameEmpty && (
            <p className="text-sm text-red-600">Username is required</p>
          )}
        </div>

        <div className="grid grid-flow-row my-4">
          <label className="test-base">Password:</label>
          <input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            className={
              emptyFields.includes("password") || passwordEmpty
                ? "border-red-600 border-b-2 text-gray-900 text-sm rounded-lg w-full p-2"
                : "bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
            }
          />
          {passwordEmpty && (
            <p className="text-sm text-red-600">Password is required</p>
          )}
        </div>

        <button className="bg-gray-700 text-white test-base rounded-lg w-full p-2 my-4">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Auth;
