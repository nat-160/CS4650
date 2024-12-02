import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div>
      <h1 className="font-weight-light-display-1">
        <Link to="/home">Rettiwt</Link>
      </h1>
    </div>
  );
}
