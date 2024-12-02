import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cookies from "universal-cookie";

import Welcome from "./routes/Welcome";
import User from "./routes/User";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Home from "./routes/Home";
import New from "./routes/New";
import Me from "./routes/Me";
import Users from "./routes/Users";

export default function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("storedToken value", storedToken);
    if (storedToken) {
      setToken(storedToken);
      console.log("token should be the following: ", storedToken);
    }
  }, []);

  function handleLogin(newToken) {
    console.log("Token received from login");
    console.log(newToken);
    localStorage.setItem("token", newToken.token);
    setToken(newToken.token);
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Welcome />,
      errorElement: <p>404!</p>,
    },
    {
      path: "/user/:username",
      element: <User />,
    },
    {
      path: "/login",
      element: <Login onLogin={handleLogin} />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/new",
      element: <New />,
    },
    {
      path: "/me",
      element: <Me />,
    },
    {
      path: "/users",
      element: <Users />,
    },
  ]);

  return <RouterProvider router={router} />;
}
