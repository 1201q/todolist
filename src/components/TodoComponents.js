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
  allEditing,
}) => {
  const [done, setDone] = useState(tododone);
  const [editing, setEditing] = useState(allEditing);
  const [editingTodo, setEditingTodo] = useState(todoText);

  let today = new Date().getTime();

  const [hour, setHour] = useState(
    Math.floor((todoUntil - today) / 1000 / 3600)
  );
  const [day, setDay] = useState(Math.ceil(hour / 24));
  const [min, setMin] = useState(
    Math.ceil(((todoUntil - today) / 1000 / 3600) * 60) - hour * 60
  );
  const [msg, setMsg] = useState("");

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
    setEditingTodo(event.target.value);
  };

  const onEditSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`${userObj.uid}/${todoId}`).update({
      text: editingTodo,
    });
    onEditBtnClick();
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

  const onCheck = async () => {
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
    <div className="todo">
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
        {editing ? (
          <div className="msgContainer">
            <li className="remainingTime">{msg}</li>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TodoComponents;
