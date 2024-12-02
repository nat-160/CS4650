import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Users() {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/users`);
      setData(response.data);
    };
    fetchData();
  }, []);

  function format() {
    var arr = [];
    for (const [key, value] of Object.entries(data)) {
      arr.push(value);
    }
    return arr;
  }

  return (
    <div>
      <Header />
      <h3>All Rettwit users:</h3>
      {format().map((value) => (
        <div>
          <Link to={`/user/${value.username}`}> {value.username}</Link>
          <br />
        </div>
      ))}
      <Footer />
    </div>
  );
}
