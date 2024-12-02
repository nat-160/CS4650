import React, { useState, useEffect } from "react";
import api from "../api/api";

export default function Follow({ followingName }) {
  const [state, setState] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      const response = await api.post(`/followstate`, null, {
        params: { token, followingName },
      });
      setState(response.data);
      setText(
        response.data.success
          ? "unfollow " + followingName + "."
          : "follow " + followingName + "!"
      );
      console.log(response.data);
    };
    fetchData();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    api
      .post(`/followtoggle`, null, {
        params: { token, followingName },
      })
      .catch((error) => {
        console.log(error);
      })
      .then((value) => {
        console.log(value);
        setText(
          text.startsWith("unfollow")
            ? "follow " + followingName + "!"
            : "unfollow " + followingName + "."
        );
      });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="submit" value={text} />
      </form>
    </div>
  );
}
