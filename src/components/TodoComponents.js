import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faRemove } from "@fortawesome/free-solid-svg-icons";
import styles from "components/styles/TodoStyle.css";

const TodoComponents = ({
  todoText,
  userObj,
  todoId,
  tododone,
  todoUntil,
  todoCategory,
  allEditing,
  categorys,
}) => {
  const [done, setDone] = useState(tododone);
  const [editing, setEditing] = useState(allEditing);
  const [editingTodo, setEditingTodo] = useState(todoText);
  const [editingCategory, setEditingCategory] = useState(todoCategory);
  const [editingDate, setEditingDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [editingTime, setEditingTime] = useState(
    `${new Date(todoUntil).getHours()}:${new Date(todoUntil).getMinutes()}`
  );

  let today = new Date().getTime();

  const [hour, setHour] = useState(
    Math.floor((todoUntil - today) / 1000 / 3600)
  );
  const [day, setDay] = useState(Math.ceil(hour / 24));
  const [min, setMin] = useState(
    Math.ceil(((todoUntil - today) / 1000 / 3600) * 60) - hour * 60
  );
  const [msg, setMsg] = useState("");

  // 날짜 수정

  // console.log(categorys);

  // console.log(new Date(todoUntil).getMonth() + 1);
  // console.log(new Date(todoUntil).getDate());
  // console.log(
  //   `${new Date(todoUntil).getHours()}:${new Date(todoUntil).getMinutes()}`
  // );
  // console.log(new Date(todoUntil).getMinutes());
  // console.log(new Date().toISOString().substring(0, 10));

  useEffect(() => {
    setHour(Math.floor((todoUntil - today) / 1000 / 3600));
    setDay(Math.ceil(hour / 24));
    setMin(Math.ceil(((todoUntil - today) / 1000 / 3600) * 60) - hour * 60);
  }, [today]);

  useEffect(() => {
    msgControl();
  }, [today, day, min, hour]);

  useEffect(() => {
    setEditing(allEditing);
  }, [allEditing]);

  const onChange = (event) => {
    if (event.target.name === "text") {
      setEditingTodo(event.target.value);
    } else if (event.target.name === "category") {
      setEditingCategory(event.target.value);
    } else if (event.target.name === "date") {
      setEditingDate(event.target.value);
    } else if (event.target.name === "time") {
      setEditingTime(event.target.value);
    }
  };

  const onEditSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`${userObj.uid}/${todoId}`).update({
      text: editingTodo,
      category: editingCategory,
      until: new Date(`${editingDate} ${editingTime}`).getTime(),
    });
    onEditBtnClick();
    // console.log(editingDate, editingTime);
    // console.log(new Date(`${editingDate} ${editingTime}`).getTime());
  };

  const onEditBtnClick = () => {
    setEditing(!allEditing);
  };

  const onDeleteBtnClick = async (event) => {
    event.preventDefault();
    const ok = window.confirm("삭제할까요?");
    if (ok) {
      await dbService.doc(`${userObj.uid}/${todoId}`).delete();
    }
  };

  const onCheck = async (event) => {
    event.preventDefault();
    setDone(!done);
    await dbService.doc(`${userObj.uid}/${todoId}`).update({
      done: !done,
    });
  };

  const msgControl = async () => {
    if (hour < 0 || min < 0) {
      setMsg("만료");
    } else if (hour === 0 && min > 0) {
      setMsg(`${min}분 남음`);
    } else if (hour > 0 && min === 60) {
      setMsg(`${hour + 1}시간 남음`);
    } else {
      setMsg(`${hour}시간 ${min}분 남음`);
    }
  };

  return (
    <div className={tododone ? "donetodo" : "todo"}>
      <div className="checkboxContainer">
        <input
          type="checkbox"
          name="check"
          value={done}
          onChange={onCheck}
          id={todoId}
          checked={done}
        />
        <label
          htmlFor={todoId}
          className={done ? "checkboxCheckF" : "checkboxChecked"}
        ></label>
      </div>
      <div className="container">
        <div className="submitContainer">
          <form onSubmit={onEditSubmit} className="formContainer">
            <input
              type="text"
              defaultValue={editingTodo}
              name="text"
              onChange={onChange}
              className={editing ? "editInputdisabled" : "editInputabled"}
              disabled={editing}
              autoFocus
              style={
                done ? { textDecoration: "line-through", color: "gray" } : null
              }
            />

            {editing ? null : (
              <div className="editRemoveBtnContainer">
                <button
                  type="submit"
                  className="editBtn"
                  onClick={onEditSubmit}
                >
                  {editing ? (
                    <FontAwesomeIcon
                      icon={faPen}
                      size="2x"
                      style={{ color: "#393939" }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faCheck}
                      size="3x"
                      style={{ color: "rgb(41, 177, 0)" }}
                    />
                  )}
                </button>
                <button onClick={onDeleteBtnClick} className="removeBtn">
                  <FontAwesomeIcon
                    icon={faRemove}
                    size="3x"
                    style={{ color: "red" }}
                  />
                </button>
              </div>
            )}
          </form>
        </div>
        {!tododone && editing ? (
          <div className="msgContainer">
            <li className="remainingTime">{msg}</li>
          </div>
        ) : null}
        {editing ? null : (
          <div className="selectEditContainer">
            <input
              type="date"
              name="date"
              onChange={onChange}
              value={editingDate}
            />
            <input
              type="time"
              name="time"
              onChange={onChange}
              value={editingTime}
            />
            <select className="select" name="category" onChange={onChange}>
              <option value="">{editingCategory}</option>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoComponents;
