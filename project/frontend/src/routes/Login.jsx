import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, []);
  function handleSubmit(event) {
    event.preventDefault();
    if (username && password) {
      api
        .post(`/login`, null, {
          params: {
            username,
            password,
          },
        })
        .catch((error) => {
          console.log(error);
        })
        .then((value) => {
          const token = value.data;
          console.log("Login.jsx token");
          console.log(value.data);
          localStorage.setItem("token", token);
          //onLogin({ token });
          navigate("/home");
        });
    }
  }

  return (
    <div>
      <Header />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>{" "}
        <br />
        <input type="submit" value="Submit" />
      </form>
      <Footer />
    </div>
  );
}
