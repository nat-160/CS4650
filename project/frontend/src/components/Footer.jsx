import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  function handleProfile(event) {
    event.preventDefault();
    navigate("/me");
  }
  function handleNew(event) {
    event.preventDefault();
    navigate("/new");
  }

  function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem("token");
    navigate("/");
  }

  function handleUsers(event) {
    event.preventDefault();
    navigate("/users");
  }
  return (
    <div>
      <sub>
        Rettiwt is made with ❤️ by Small Data & Ground Computing
        <br />
        {localStorage.getItem("token") ? (
          <div>
            <form onSubmit={handleProfile}>
              <input type="submit" value="Profile" />
            </form>

            <form onSubmit={handleNew}>
              <input type="submit" value="New Message" />
            </form>

            <form onSubmit={handleLogout}>
              <input type="submit" value="Logout" />
            </form>

            <form onSubmit={handleUsers}>
              <input type="submit" value="Users" />
            </form>
          </div>
        ) : (
          <div />
        )}
      </sub>
    </div>
  );
}
