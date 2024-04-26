import React, { useContext } from "react";
import UserContext from "../context/UserContext";

const Profile = () => {
  const { user } = useContext(UserContext);
  const originalDate = new Date(user.createdAt);
  const options = { year: "numeric", month: "long", day: "2-digit" };
  const formattedDate = originalDate.toLocaleDateString("en-US", options);

  // Function to add ordinal suffix to the day
  function addOrdinalSuffix(day) {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  }

  // Extract day and year from the formatted date
  const [, month, day, year] = formattedDate.match(/(\w+)\s(\d+),\s(\d+)/);

  // Add ordinal suffix to the day
  const formattedDay = addOrdinalSuffix(parseInt(day));

  // Final formatted date
  const finalFormattedDate = `${formattedDay} ${month}, ${year}`;

  return (
    <div className="grid grid-cols-12 justify-center items-center h-full">
      <h1 className="text-4xl font-bold min-w-max mx-auto col-span-12 mb-12">
        Profile
      </h1>
        <div className="col-span-5 mx-auto">
        <img
        src={user.avatar}
        className="aspect-square object-cover h-40 rounded-full"
        alt="User Avatar"
      />
      <div className="text-center pt-8">
        <h1 className="text-lg">{user.fullname}</h1>
        <h3 className="text-sm text-gray-400">{user.email}</h3>
        <h3 className="text-sm text-gray-400">{user.username}</h3>
      </div>
        </div>
      
      <table className="w-4/5 h-3/5 text-xl col-span-7 overflow-hidden text-gray-800 bg-gray-300 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 mt-5">
        <tr className=" border-gray-300 border-b-2">
          <td className="px-4 py-2 font-bold border-r-2 border-gray-300">
            Full name:
          </td>
          <td className="px-4 py-2">{user.fullname}</td>
        </tr>
        <tr className=" border-gray-300 border-b-2">
          <td className="px-4 py-2 font-bold border-r-2 border-gray-300">
            Account handle:
          </td>
          <td className="px-4 py-2">{user.username}</td>
        </tr>
        <tr className=" border-gray-300 border-b-2">
          <td className="px-4 py-2 font-bold border-r-2 border-gray-300">
            Email id:
          </td>
          <td className="px-4 py-2">{user.email}</td>
        </tr>
        <tr>
          <td className="px-4 py-2 font-bold border-r-2 border-gray-300">
            Joined at:
          </td>
          <td className="px-4 py-2">{finalFormattedDate}</td>
        </tr>
      </table>
    </div>
  );
}

export default Profile;
