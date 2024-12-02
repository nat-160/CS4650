import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const [data, setData] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    console.log("Home.jsx token", token);
    if (token) {
      const fetchData = async () => {
        const response = await api.post(`/home`, null, { params: { token } });
        setData(response.data);
      };
      fetchData();
    }
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
      {format().map((value) => (
        <div>
          <h3>
            <Link to={`/user/${value.username}`}> {value.username}</Link>
          </h3>
          <p>{value.message}</p>
          <sub>At {value.timestamp}</sub>
        </div>
      ))}
      <Footer />
    </div>
  );
}
