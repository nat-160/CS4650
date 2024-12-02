import React from "react";
import api from "../api/api";
import { useNavigate } from "react-router";

export default function Delete({ messageID }) {
  const navigate = useNavigate();
  function handleSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    api
      .post(`/delete`, null, { params: { token, messageID } })
      .catch((error) => {
        console.log(error);
      })
      .then((value) => {
        console.log(value);
        navigate(`/home`);
      });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="submit" value="delete" />
      </form>
    </div>
  );
}
