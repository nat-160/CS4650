import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
export default function New() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  function handleSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    api
      .post(`/new`, null, {
        params: {
          token,
          message,
        },
      })
      .catch((error) => {
        console.log(error);
      })
      .then((value) => {
        console.log(value);
        navigate("/home");
      });
  }
  return (
    <div>
      <Header />
      <h3>write a new message:</h3>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
      <Footer />
    </div>
  );
}
