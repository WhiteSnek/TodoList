import React, { useEffect, useState } from "react";
import axios from "axios";
import Task from "./Task";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";
import { ImCross } from "react-icons/im";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const List = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    getLists();
  }, []);

  const getLists = async () => {
    try {
      const lists = await axios.get("/lists/", {
        withCredentials: true,
      });
      setList(lists.data.data);
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
      )[1];
      console.log(errorMessage);
    }
  };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const addList = async () => {
    try {
      const add = await axios.post(
        "/lists/",
        {
          title,
          description
        },
        {
          withCredentials: true,
        }
      );
      console.log(add);
      getLists();
      setTitle('');
      setDescription('');
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
      )[1];
      console.log(errorMessage);
    }
  };

  const deleteList = async (listId) => {
    try{
      console.log(listId)
      const deletedList = await axios.delete(`/lists/${listId}`,{
          withCredentials: true
      })
      console.log(deletedList)
      getLists()
  } catch (error) {
      const errorMessage = error.response.data.match(
          /<pre>Error: (.*?)<br>/
      )[1];
      console.log(errorMessage);
  }
  }

  const updateList = async (listId) => {
    try {
      await axios.patch(`/lists/${listId}`,{title,description},{withCredentials:true})
      setTitle('');
      setDescription('');
      getLists();
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
    )[1];
    console.log(errorMessage);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 min-h-max">
      {list.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="bg-red-500 flex justify-between px-4 py-2 ">
            <div >
            <div className="text-white font-bold">{item.title}</div>
            <div className="py-2 font-light text-sm">
              <p className="text-gray-200">{item.description}</p>
            </div>
            </div>
            <div className="flex justify-center gap-4 items-center">
            {/* */}
            <Popup contentStyle={{width: "30%",borderRadius: '10px'}} trigger=
                { <button className="rounded-full hover:bg-red-800 w-8 h-8 flex justify-center items-center"><IconContext.Provider value={{ color: "white", size: "20px" }}>
                <FaPencil />
              </IconContext.Provider></button>} 
                modal nested>
                {
                    close => (
                      <div class="m-4 rounded-lg">
                      <h1 class="text-3xl font-bold pb-4">Update list:</h1>
                      <form class="space-y-4">
                        <div>
                          <label htmlFor="title" class="block mb-1">
                            Title:
                          </label>
                          <input
                            id="title"
                            class="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-gray-500"
                            type="text"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor="description" class="block mb-1">
                            Description:
                          </label>
                          <input
                            id="description"
                            class="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-gray-500"
                            type="text"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                        <div className="flex justify-between">
                        <button
                          className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300"
                          type="button" // Change type to button
                          onClick={() => {
                            updateList(item._id);
                            close();
                        }} // Call addList function on click
                        >
                          Submit
                        </button>
                        <button
                          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
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
                    )
                }
            </Popup>
              <Popup contentStyle={{width: "30%",borderRadius: '10px'}} trigger=
                { <button className="rounded-full hover:bg-red-800 w-8 h-8 flex justify-center items-center"><IconContext.Provider value={{ color: "white", size: "20px" }}>
                <ImCross />
              </IconContext.Provider></button>} 
                modal nested>
                {
                    close => (
                        <div className='m-4 rounded-lg px-4'>
                            <div className='text-lg pb-4'>
                                Are you sure you want to delete the list?
                            </div>
                            <div className="flex justify-between mt-3">
                                <button className="bg-red-500 w-28 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
                  type="button" onClick={() => {
                    deleteList(item._id);
                    close();
                }}>
                                        Yes
                                </button>
                                <button className="bg-green-500 w-28 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
                  type="button" onClick=
                                    {() => close()}>
                                        No
                                </button>
                            </div>
                        </div>
                    )
                }
            </Popup>
            </div>
          </div>

          <Task listId={item._id} />
        </div>
      ))}
      <div className="border-gray-400 border-dashed border-2 rounded-lg flex justify-center items-center">
        <Popup contentStyle={{width: "30%",borderRadius: '10px'}}
          trigger={
            <button className="rounded-full hover:bg-gray-200 w-20 h-20 flex justify-center items-center">
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
              <h1 class="text-3xl font-bold pb-4">Add a list:</h1>
              <form class="space-y-4">
                <div>
                  <label for="title" class="block mb-1">
                    Title:
                  </label>
                  <input
                    id="title"
                    class="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-gray-500"
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label for="description" class="block mb-1">
                    Description:
                  </label>
                  <input
                    id="description"
                    class="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-gray-500"
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="flex justify-between">
                <button
                  className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300"
                  type="button" // Change type to button
                  onClick={() => {
                    addList();
                    close();
                }} // Call addList function on click
                >
                  Submit
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
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
  );
};

export default List;
