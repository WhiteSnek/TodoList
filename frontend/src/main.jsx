import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Home,Register,Login, ProfilePage} from './pages'
import UserContextProvider from './context/UserContextProvider.jsx'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import axios from 'axios'

axios.defaults.baseURL= 'http://localhost:8000/api/v1'

const Layout = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<App />} >
        <Route path='' element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='profile' element={<ProfilePage />} />
      </Route>
    )
  )

  return (
    <UserContextProvider> 
      <RouterProvider router={router} />
    </UserContextProvider>
  )
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>,
)
