import React, { useContext } from 'react';
import UserContext from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { IoSettingsSharp } from "react-icons/io5";
import { IconContext } from "react-icons/lib";
import axios from 'axios';

const Dropdown = ({ setDropDown }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate()
  const logout = async () => {
    try {
      await axios.post('/users/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      setDropDown(false);
      navigate('/')
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
      )[1];
    }
  };

  return user ? (
    <div className=" absolute border-gray-200 border-2 right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 dropdown">
      <p className='p-4 border-b-2 border-gray-300'>Hello {user.username}</p>
      <ul className=''>
        <li className="py-1">
          <Link to="/profile" className="px-4 py-2 flex gap-2 text-gray-800 hover:bg-gray-200" onClick={() => {setDropDown(false)}}>
          <IconContext.Provider value={{  size: "27px" }}>
          <CgProfile /> 
              </IconContext.Provider> Profile
          </Link>
        </li>
        <li className="py-1">
          <Link to="" className="flex gap-2 px-4 py-2 text-gray-800 hover:bg-gray-200">
          <IconContext.Provider value={{  size: "27px" }}>
          <IoSettingsSharp />
              </IconContext.Provider> Settings
          </Link>
        </li>
      </ul>
      <button
            onClick={logout}
            className="block px-4 py-2 border-t-2 border-gray-300 text-gray-800 hover:bg-gray-200 w-full"
          >
            Logout
          </button>
    </div>
  ) : null;
};

export default Dropdown;
