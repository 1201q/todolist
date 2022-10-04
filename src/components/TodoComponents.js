import Todo from "./Todo";
import React, { useState, useEffect } from "react";
import styles from "components/TodoStyle.css";
import { dbService } from "fbase";

const TodoComponents = ({ todoText, userObj, todoId }) => {
  const [done, setDone] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState(todoText);

  const onChange = (event) => {
    setEditingTodo(event.target.value);
  };

  const onEditSubmit = async (event) => {
    await dbService.doc(`${userObj.uid}/${todoId}`).update({
      text: editingTodo,
    });
    setEditing(!editing);
  };

  const onEditBtnClick = () => {
    setEditing(!editing);
    setEditingTodo(todoText);
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
      <li>{todoText}</li>
      <button onClick={onEditBtnClick}>수정</button>
      {editing ? (
        <form onSubmit={onEditSubmit}>
          <input type="text" defaultValue={editingTodo} onChange={onChange} />
          <input type="submit" value="수정" />
        </form>
      ) : null}
      <button onClick={onDeleteBtnClick}>삭제</button>
      <input type="checkbox" value={done} onChange={onCheck} />
      {done ? "했음" : "안했음"}
    </div>
  );
};

export default TodoComponents;
