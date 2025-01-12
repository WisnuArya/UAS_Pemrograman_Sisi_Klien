import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Auth/Login.jsx";
import Register from "../Pages/Auth/Register.jsx";
import Dashboard from "../Pages/Admin/Dashboard.jsx";
import Mahasiswa from "../Pages/Admin/Mahasiswa.jsx";
import AdminLayout from "../Layouts/AdminLayout.jsx";
import ProtectedRoute from "../Redux/ProtectedRoute.jsx";

const RouteList = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "mahasiswa",
        element: <Mahasiswa />,
      },
    ],
  },
]);

export default RouteList;
