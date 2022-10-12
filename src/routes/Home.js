import React, { useState, useEffect } from "react";
import { authService, dbService, storageService } from "fbase";
import moment, { min } from "moment";
import Sidebar from "components/Sidebar";
import TodoComponents from "components/TodoComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faPlus,
  faPen,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

const Home = ({ userObj }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [categorys, setCategorys] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [minDate, setminDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [time, setTime] = useState("");
  const [re, setRe] = useState(false);
  const [editing, setEditing] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // todo
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

    //카테고리
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
      text: newTodo,
      date: new Date().getTime(),
      userid: userObj.uid,
      category: newCategory,
      done: false,
      until: new Date(`${date} ${time}`).getTime(),
    };

    if (newTodo !== "") {
      await dbService.collection(`${userObj.uid}`).add(todo);
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
      <Sidebar userObj={userObj} />
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
              placeholder="오늘 할 일을 입력하세요."
            />
            <button type="submit" className="newTodoBtn">
              <FontAwesomeIcon
                icon={faPlus}
                size="2x"
                style={{ color: "#393939" }}
              />
            </button>
          </div>
          <div className="selectContainer">
            {/* <li className="selectTag">언제까지: </li> */}
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
              {categorys.map((category) => (
                <option className="selectOption" key={category.id}>
                  {category.ca}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div
          className="buttonContainer"
          style={open ? { marginTop: "0px" } : { marginTop: "30px" }}
        >
          <button onClick={onContainerOpen}>
            {open ? (
              <FontAwesomeIcon icon={faAngleUp} size="3x" />
            ) : (
              <FontAwesomeIcon icon={faPlus} size="3x" />
            )}
          </button>

          <div className="controlContainer">
            <div className="controlContainerCategory">카테고리</div>
            <div>
              <button onClick={onReload}>
                <FontAwesomeIcon icon={faRotateRight} size="2x" />
              </button>
              <button onClick={onEditRemove}>
                <FontAwesomeIcon icon={faPen} size="2x" />
              </button>
            </div>
          </div>
        </div>
        <div className="todoContainer">
          {todos.map((todo) => (
            <TodoComponents
              key={todo.id}
              todoText={todo.text}
              userObj={userObj}
              todoId={todo.id}
              tododone={todo.done}
              todoUntil={todo.until}
              allEditing={editing}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
