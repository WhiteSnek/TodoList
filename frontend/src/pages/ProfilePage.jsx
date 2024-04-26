import React, { useContext, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Profile from "../components/Profile";
import UpdateProfile from "../components/UpdateProfile";
import UserContext from "../context/UserContext";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const ProfilePage = () => {
  const [value, setValue] = useState(0);
  const { user } = useContext(UserContext);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

return (
      <>
        <div className="flex justify-center bg-purple-400 items-center w-screen h-[30vh]"></div>
        <div className="flex justify-center bg-white items-center w-screen h-[70vh]"></div>
        <div className="absolute top-24 right-40 w-4/5 h-4/5 rounded-xl bg-gray-50 shadow-lg ">
          {user && <div><div>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="profile tabs"
            >
              <Tab label="Profile" />
              <Tab label="Update Profile" />
            </Tabs>
          </div>
          <CustomTabPanel value={value} index={0}>
            <Profile />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <UpdateProfile />
          </CustomTabPanel>
          </div>
        }
        {!user && <div className="flex justify-center items-center mt-10 font-bold text-3xl">Please log in to view your profile</div>}
        </div>
        
      </>
    );
};

export default ProfilePage;
