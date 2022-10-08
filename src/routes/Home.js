import React, { useState, useEffect } from "react";
import Todo from "components/Todo";
import CalendarComponents from "components/Calendar";
import TodoComponents from "components/TodoComponents";
import { authService, dbService, storageService } from "fbase";
import styles from "components/styles/CalendarStyle.css";
import moment from "moment";
import Sidebar from "components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPen,
  faPlus,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";

const Home = ({ userObj }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  console.log();

  useEffect(() => {
    dbService
      .collection(`${userObj.uid}`)
      .orderBy("date")
      .onSnapshot((snapshot) => {
        const todosArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodos(todosArray);
        console.log(todosArray);
      });
  }, []);

  // 새로운 newtodo
  const onSubmit = async (event) => {
    event.preventDefault();

    const todo = {
      text: newTodo,
      date: moment()._d,
      userid: userObj.uid,
      category: "카테고리",
      done: false,
      until: "언제까지",
    };

    if (newTodo !== "") {
      await dbService.collection(`${userObj.uid}`).add(todo);
    }
    setNewTodo("");
  };

  // input 내용 변경
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTodo(value);
  };

  console.log(todos);

  return (
    <div className="main">
      <Sidebar />
      <div className="contentsContainer">
        <form onSubmit={onSubmit} className="newTodoContainer">
          <input
            type="text"
            onChange={onChange}
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
          {/* <input type="submit" value="TODO!" className="newTodoBtn" /> */}
        </form>
        <div className="todoContainer">
          {todos.map((todo) => (
            <TodoComponents
              key={todo.id}
              todoText={todo.text}
              userObj={userObj}
              todoId={todo.id}
              tododone={todo.done}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;