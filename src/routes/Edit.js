import React, { useState, useEffect } from "react";
import { authService, dbService, storageService } from "fbase";
import moment, { min } from "moment";
import Sidebar from "components/Sidebar";
import { Link } from "react-router-dom";
import SbEditComponents from "components/SbEditComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faPlus,
  faPen,
  faRotateRight,
  faBackward,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const Home = ({ userObj, onv, mode }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [categorys, setCategorys] = useState([]);
  const [newCategory, setNewCategory] = useState();

  // 시간
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [minDate, setminDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [time, setTime] = useState("");

  // 상태
  const [re, setRe] = useState(false);
  const [editing, setEditing] = useState(true);
  const [open, setOpen] = useState(false);

  // 모드

  console.log();

  useEffect(() => {
    dbService
      .collection(`${userObj.uid}`)
      .orderBy("until")
      .onSnapshot((snapshot) => {
        const todosArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodos(todosArray);
      });

    dbService
      .collection(`C--${userObj.uid}`)
      .orderBy("ca")
      .onSnapshot((snapshot) => {
        const categoryArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategorys(categoryArray);
      });
  }, []);

  // 새로운 newtodo
  const onSubmit = async (event) => {
    event.preventDefault();

    const todo = {
      ca: newTodo,
    };

    if (newTodo !== "") {
      await dbService.collection(`C--${userObj.uid}`).add(todo);
      setEditing(true);
      onContainerOpen(false);
    }
    setNewTodo("");
  };

  // input 내용 변경
  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    if (event.target.name === "input") {
      setNewTodo(value);
    } else if (event.target.name === "select") {
      setNewCategory(value);
    } else if (event.target.name === "date") {
      setDate(value);
    } else if (event.target.name === "time") {
      setTime(value);
    }
  };

  const onCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(onv);
  };

  const onReload = () => {
    setRe(!re);
  };

  const onEditRemove = () => {
    setEditing(!editing);
  };

  const onContainerOpen = () => {
    setOpen(!open);
  };

  // https://jsikim1.tistory.com/195

  return (
    <div className="main">
      <div className="contentsContainer">
        <form
          onSubmit={onSubmit}
          className={open ? "newTodoContainer" : "newTodoContainerClose"}
        >
          <div className="inputContainer">
            <input
              type="text"
              onChange={onChange}
              name="input"
              value={newTodo}
              className="newTodoInput"
              placeholder="카테고리를 추가해보세요."
            />
            <button type="submit" className="newTodoBtn">
              <FontAwesomeIcon
                icon={faPlus}
                size="2x"
                style={{ color: "#393939" }}
              />
            </button>
          </div>
          {/* <div className="selectContainer">
            <input
              type="date"
              name="date"
              onChange={onChange}
              value={date}
              min={minDate}
              required
            />
            <input
              type="time"
              name="time"
              onChange={onChange}
              value={time}
              required
            />

            <select
              className="select"
              name="select"
              onChange={onChange}
              required
            >
              <option value="">카테고리를 선택하세요.</option>
              <option value="기본">기본 카테고리</option>
              {categorys.map((category) => (
                <option
                  className="selectOption"
                  key={category.id}
                  value={category.ca}
                >
                  {category.ca}
                </option>
              ))}
            </select>
          </div> */}
        </form>

        <div
          className="buttonContainer"
          style={open ? { marginTop: "0px" } : null}
        >
          <button
            onClick={onContainerOpen}
            style={{
              backgroundColor: "white",
              border: "3px solid rgb(255, 68, 68)",
            }}
            className="backBtn"
          >
            {open ? (
              <FontAwesomeIcon
                icon={faAngleUp}
                size="2x"
                style={{ color: "rgb(255, 68, 68)" }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faPlus}
                size="2x"
                style={{ color: "rgb(255, 68, 68) " }}
              />
            )}
          </button>

          <div className="controlContainer">
            <div className="controlContainerCategory">카테고리 수정</div>
            <div>
              <button onClick={onReload}>
                <FontAwesomeIcon
                  icon={faRotateRight}
                  size="2x"
                  style={{ color: "rgb(45, 45, 45)" }}
                />
              </button>
              <button onClick={onEditRemove}>
                <FontAwesomeIcon
                  icon={faPen}
                  size="2x"
                  style={{ color: "rgb(45, 45, 45)" }}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="todoContainer">
          {categorys.map((category) => (
            <SbEditComponents
              key={category.id}
              todoId={category.id}
              todoText={category.ca}
              userObj={userObj}
              allEditing={editing}
            />
          ))}
        </div>
      </div>
      <Link to="/">
        <button
          className="realbackBtn"
          style={{
            backgroundColor: "white",
            border: "3px solid rgb(255, 68, 68)",
          }}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="2x"
            style={{ color: "rgb(255, 68, 68)" }}
          />
        </button>
      </Link>
    </div>
  );
};

export default Home;
