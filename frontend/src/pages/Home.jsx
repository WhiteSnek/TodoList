import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
// import Logo from '../assets/logo';
import UserContext from '../context/UserContext';
import List from '../components/List';
import Loader from '../components/Loader';

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <div className=" ml-4 px-4 mt-10">
      <div className='text-6xl my-4 font-extrabold text-red-600'> TODO LIST</div>
      {user ? (
        <div>
          <h1 className="text-3xl font-bold mb-4">Hello, {user.fullname}</h1>
          <p className="text-lg mb-6">Your lists are shown here:</p>
          <div className="bg-white overflow-hidden">
            <List />
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg mb-4">Please log in to view your lists.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
