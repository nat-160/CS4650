import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Welcome() {
  return (
    <div>
      <Header />
      <h2>Welcome to Rettiwt!</h2>
      <Link to="/login">login</Link>
      <br />
      <Link to="/register">register</Link>
      <Footer />
    </div>
  );
}
