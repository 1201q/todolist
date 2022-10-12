import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "fbase";
import { Link } from "react-router-dom";
import styles from "./styles/HeaderStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";

function Header({ userObj }) {
  const onLogOutClick = () => {
    authService.signOut();
  };

  return (
    <div className="header">
      <div className="mainLogoContainer">
        <Link to="/" className="mainLogo">
          {/* <FontAwesomeIcon
            icon={faStickyNote}
            color={"white"}
            className="logo"
          /> */}
          TodoList!
        </Link>
      </div>
      {authService.currentUser ? (
        <div className="userHi">
          <h3 className="userHi__text">
            {userObj.displayName
              ? `${userObj.displayName}님. 안녕하세요.`
              : "방문객님. 안녕하세요."}
          </h3>
          <button onClick={onLogOutClick}>로그아웃</button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Header;
