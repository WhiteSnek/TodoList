import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import Loader from "../components/Loader";

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/users/current-user', { withCredentials: true })
            .then(response => {
                setUser(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Loader />; // You can replace this with a loading spinner or any other loading indicator
    }

    // if (error) {
    //     return <div>Error: {error.message}</div>; // You can replace this with an error component or message
    // }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;
