import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import { FaRegPlusSquare } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const [details, setDetails] = useState({
    name: "",
    email: "",
    avatar: null,
    avatarUrl: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    updateAccount();
    setDetails({ name: "", email: "",avatar: null,avatarUrl: '' });
    setError("")
    navigate('/')
  };
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setDetails({
        ...details,
        avatar: e.target.files[0],
        avatarUrl: URL.createObjectURL(e.target.files[0]), 
      });
    }
  };

  const updateAccount = async () => {
    try {
      const update = await axios.patch(
        "/users/update-account",
        {
          fullname: details.name,
          email: details.email,
        },
        {
          withCredentials: true,
        }
      );
      console.log(update.data.data)
      setUser(update.data.data);
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
      )[1];
      setError(errorMessage)
    }
  };

  const updateAvatar = async () => {
    const {avatar} = details
    const formData = new FormData();
    formData.append("avatar",avatar)
    try {
      const updated = await axios.patch("/users/avatar",formData,{withCredentials: true})
      console.log(updated.data.data)
      setUser(updated.data.data)
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
      )[1];
      console.log(errorMessage);
    }
  }

  if(user) return (
    <div className="grid grid-cols-12 justify-center">
      <h1 className="text-4xl font-bold min-w-max mx-auto col-span-12">
        Update Account
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-12 justify-center items-center h-full col-span-12 mt-12"
      >
        <div className="col-span-5 mx-auto relative group">
          <img
            src={user.avatar}
            className="aspect-square object-cover h-40 w-40 rounded-full mx-auto"
            alt="User Avatar"
          />
          <div className="absolute h-full w-full top-0  justify-center items-center rounded-full group-hover:flex hidden bg-gray-200 opacity-50">
            <Popup
              trigger={
                <button type="button">
                  <IconContext.Provider value={{ color: "gray", size: "50px" }}>
                    <FaRegPlusSquare />
                  </IconContext.Provider>
                </button>
              }
              modal
              nested
            >
              {(close) => (
                <div class="m-4 rounded-lg">
                  <h1 class="text-3xl font-bold pb-4">
                    Choose an image from the gallary
                  </h1>
                  <form class="space-y-4 border-dashed">
                    <div>
                      <input
                        className="border border-blue-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                        type="file"
                        placeholder="Enter your avatar"
                        onChange={handleChange}
                      />
                      {details.avatarUrl && (
                        <img
                          src={details.avatarUrl}
                          alt="Avatar Preview"
                          className="w-20 h-20"
                        />
                      )}
                    </div>
                    <div className="flex justify-between">
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
                        type="submit" // Change type to button
                        onClick={(e) => {
                          e.preventDefault();
                          updateAvatar();
                          close();
                        }} // Call addList function on click
                      >
                        Submit
                      </button>
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
                        type="button" // Change type to button
                        onClick={() => {
                          close();
                        }} // Call addList function on click
                      >
                        Close
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </Popup>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-5 border border-gray-300 p-10 bg-gray-300 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50">
          <label className="block mb-2" htmlFor="fullname">
            Fullname:
          </label>
          <input
            id="fullname"
            className="border border-gray-300 rounded-md py-2 px-3 w-full mb-3 sm:mb-0 focus:outline-none focus:border-gray-500"
            type="text"
            placeholder="Enter fullname"
            value={details.name}
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
          />
          <label className="block mb-2" htmlFor="email">
            Email:
          </label>
          <input
            id="email"
            className="border border-gray-300 rounded-md py-2 px-3 w-full mb-3 sm:mb-0 focus:outline-none focus:border-gray-500"
            type="text"
            placeholder="Enter email"
            value={details.email}
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
          />
          <button
            className="bg-gray-800 mt-5 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300"
            type="submit"
          >
            Confirm
          </button>
          {error && <p className="text-red-500 pt-4">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
