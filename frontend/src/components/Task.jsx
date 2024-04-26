import React, { useEffect, useState } from "react";
import axios from "axios";
import { ImCross } from "react-icons/im";
import { IconContext } from "react-icons/lib";
import { FaRegPlusSquare } from "react-icons/fa";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
const Task = ({ listId }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [add,setAdd] = useState(false)
  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const response = await axios.get(`/tasks/${listId}`, {
        withCredentials: true,
      });
      setTasks(response.data.data);
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
      )[1];
      console.log(errorMessage);
    }
  };
  const deleteTask = async (taskId) => {
    try {
      const deleteTask = await axios.delete(`/tasks/task/${taskId}`, {
        withCredentials: true,
      });
      console.log(deleteTask);
      getTasks();
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
      )[1];
      console.log(errorMessage);
    }
  };
  
  const addTask = async () => {
    try {
      const add = await axios.post(
        `/tasks/${listId}`,
        {
          title,
        },
        {
          withCredentials: true,
        }
      );
      console.log(add);
      getTasks();
      setTitle("");
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
      )[1];
      console.log(errorMessage);
    }
  };
  const toggleStatus = async (taskId) => {
    try {
      const toggle = await axios.patch(
        `/tasks/toggle/${taskId}`,
        {},
        { withCredentials: true }
      );
      getTasks();
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
      )[1];
      console.log(errorMessage);
    }
  };
  const updateTask = async (taskId) => {
    try {
      const updated = await axios.patch(
        `/tasks/task/${taskId}`,
        { title },
        { withCredentials: true }
      );
      console.log(updated.data.data.title);
      getTasks();
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
      )[1];
      console.log(errorMessage);
    }
  };
  const changeEditState = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, editMode: !task.editMode } : task
    );
    setTasks(updatedTasks);
  };
  return (
    <div className="mt-4">
      {tasks.map((item, index) => (
        <div
          key={index}
          className="bg-gray-100 p-2 flex justify-between border-b-2 border-gray-300"
        >
          <div onBlur={() => changeEditState(item._id)}>
            {item.editMode ? (
              <input
                type="text"
                className="text-lg min-w-max"
                defaultValue={item.title}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    changeEditState(item._id);
                    setTitle(e.target.value);
                    updateTask(item._id);
                  }
                }}
              />
            ) : (
              <h3
                className={`text-lg ${
                  !item.isActive ? "line-through text-gray-500" : "font-normal"
                }`}
                onDoubleClick={() => changeEditState(item._id)}
              >
                {item.title}
              </h3>
            )}
          </div>
          <div className="flex justify-center items-center">
            <input
              type="checkbox"
              className="mr-2 "
              onChange={(e) => toggleStatus(item._id)}
              checked={!item.isActive}
            />
            <Popup
            contentStyle={{width: "30%",borderRadius: '10px'}}
              trigger={
                <button className="rounded-full hover:bg-gray-200 w-6 h-6 flex justify-center items-center">
                  <IconContext.Provider
                    value={{ color: "black", size: "10px" }}
                  >
                    <ImCross />
                  </IconContext.Provider>
                </button>
              }
              modal
              nested
            >
              {(close) => (
                <div className="m-4 rounded-lg">
                  <div className="text-lg pb-4">
                    Are you sure you want to delete the task?
                  </div>
                  <div className="flex justify-between mt-3">
                    <button
                      className="bg-red-500 w-28 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
                      type="button"
                      onClick={() => {
                        deleteTask(item._id);
                        close();
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className="bg-green-500 w-28 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
                      type="button"
                      onClick={() => close()}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </Popup>
          </div>
        </div>
      ))}
      {!add && (
  <div className="border-gray-400 border-dashed border-2 rounded-lg flex justify-center items-center">
    <button className="rounded-full hover:bg-gray-200 w-8 h-8 flex justify-center items-center m-2" onClick={() => setAdd(true)}>
      <IconContext.Provider value={{ color: "gray", size: "20px" }}>
        <FaRegPlusSquare />
      </IconContext.Provider>
    </button>
  </div>
)}
{add && (
      <div className="p-3">
        <input
          type="text"
          className="text-lg min-w-max w-full border-b-2 border-gray-300 focus:outline-none focus:border-b focus:border-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          onBlur={() => setAdd(false)} // Set add state to false when input field loses focus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTask();
              setAdd(false);
              setTitle(""); // Reset the title after adding the task
            }
          }}
        />
      </div>
    )}

    </div>
  );
};

export default Task;
