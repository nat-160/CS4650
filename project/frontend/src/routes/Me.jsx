import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Delete from "../components/Delete";

export default function Me() {
  const [data, setData] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    if (token) {
      const fetchData = async () => {
        const response = await api.post(`/me`, null, { params: { token } });
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
          <h3>At {value.timestamp} you messaged</h3>
          <p>{value.message}</p>
          <Delete messageID={value.messageid} />
        </div>
      ))}
      <Footer />
    </div>
  );
}
