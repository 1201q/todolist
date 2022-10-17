import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faRightToBracket,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import styles from "styles.css";
import Toast from "components/Toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setPassword("");
    }
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onToggleLoggMode = () => {
    setNewAccount(!newAccount);
  };

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    const data = await authService.signInWithPopup(provider);
    console.log(data);
  };

  return (
    <div className="auth__main">
      <h2 className="title">
        <Link to="/" className="title__anchor">
          TodoList
        </Link>
      </h2>
      <div className="loginform">
        <form onSubmit={onSubmit} className="loginform__container">
          <input
            className="loginform__email"
            name="email"
            type="text"
            placeholder="이메일(아이디)"
            required
            value={email}
            onChange={onChange}
          />
          <input
            className="loginform__password"
            name="password"
            type="password"
            placeholder="비밀번호"
            required
            value={password}
            onChange={onChange}
          />
          <input
            className="loginform__submit"
            type="submit"
            value={newAccount ? "회원가입" : "로그인"}
          />
        </form>
        <div
          className="errorMsg__container"
          style={
            error
              ? { backgroundColor: "rgb(255, 81, 81)" }
              : { background: "none" }
          }
        >
          <span className="errorMsg">{error ? error : null}</span>
        </div>
        <div className="loginMode__container">
          <button onClick={onToggleLoggMode} className="loginMode__new">
            {newAccount ? (
              <FontAwesomeIcon
                icon={faRightToBracket}
                color={"black"}
                width="30px"
                height="30px"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUserPlus}
                color={"black"}
                width="30px"
                height="30px"
              />
            )}
            {newAccount ? "로그인" : "회원가입"}
          </button>
          <button
            onClick={onSocialClick}
            name="google"
            className="loginMode__google"
          >
            <FontAwesomeIcon
              icon={faGoogle}
              size="1x"
              color={"black"}
              className="loginicon"
            />
            Google로 로그인
          </button>
          <button
            onClick={onSocialClick}
            name="github"
            className="loginMode__github"
          >
            <FontAwesomeIcon
              icon={faGithub}
              size="1x"
              color={"black"}
              className="loginicon"
            />
            Github로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
