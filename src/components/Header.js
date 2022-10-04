import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "fbase";
import { useHistory } from "react-router-dom";
import styles from "./HeaderStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";

function Header({ userObj }) {
  console.log(userObj);
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  return (
    <div className="header">
      <div className="mainLogoContainer">
        <a className="mainLogo" href="/">
          <FontAwesomeIcon
            icon={faStickyNote}
            color={"black"}
            className="logo"
          />
          Todo!
        </a>
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
