import Todo from "./Todo";
import React, { useState, useEffect } from "react";
import styles from "components/styles/TodoStyle.css";
import { dbService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
  faXbox,
} from "@fortawesome/free-brands-svg-icons";
import {
  faCheck,
  faFileEdit,
  faPen,
  faPenSquare,
  faRemove,
  faRightToBracket,
  faUserCircle,
  faUserEdit,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

const TodoComponents = ({ todoText, userObj, todoId, tododone }) => {
  const [done, setDone] = useState(tododone);
  const [editing, setEditing] = useState(true);
  const [editingTodo, setEditingTodo] = useState(todoText);

  const onChange = (event) => {
    setEditingTodo(event.target.value);
  };

  const onEditSubmit = async (event) => {
    await dbService.doc(`${userObj.uid}/${todoId}`).update({
      text: editingTodo,
    });
  };

  const onEditBtnClick = () => {
    setEditing(!editing);
  };

  const onDeleteBtnClick = async () => {
    const ok = window.confirm("삭제할까요?");
    if (ok) {
      await dbService.doc(`${userObj.uid}/${todoId}`).delete();
    }
  };
  const onDelete = () => {};
  const onEdit = () => {};
  const onCheck = async (event) => {
    setDone(!done);
    await dbService.doc(`${userObj.uid}/${todoId}`).update({
      done: !done,
    });
  };
  return (
    <div className="todo">
      <input
        type="checkbox"
        value={done}
        onChange={onCheck}
        className="doneCheckbox"
        checked={done}
      />
      {/* <li className="todoText">{todoText}</li> */}
      <div className="submitContainer">
        <form onSubmit={onEditSubmit} className="formContainer">
          <input
            type="text"
            defaultValue={editingTodo}
            onChange={onChange}
            className={editing ? "editInputdisabled" : "editInputabled"}
            disabled={editing}
          />

          <div class="editRemoveBtnContainer">
            <button type="submit" className="editBtn" onClick={onEditBtnClick}>
              {editing ? (
                <FontAwesomeIcon
                  icon={faPen}
                  size="2x"
                  style={{ color: "#393939" }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCheck}
                  size="2x"
                  style={{ color: "rgb(41, 177, 0)" }}
                />
              )}
            </button>
            <button onClick={onDeleteBtnClick} className="removeBtn">
              <FontAwesomeIcon
                icon={faRemove}
                size="2x"
                style={{ color: "red" }}
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoComponents;
