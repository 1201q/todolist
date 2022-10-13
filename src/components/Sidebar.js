import React, { useState, useEffect } from "react";
import styles from "./styles/SidebarStyle.css";
// import SidebarComponents from "./SidebarComponents";
import { dbService } from "fbase";
import SidebarComponents from "./SidebarComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Home from "../routes/Home";

const Sidebar = ({ userObj }) => {
  const [categorys, setCategorys] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [ca, setCa] = useState("모든 Todo");
  const [mode, setMode] = useState("all");

  useEffect(() => {
    dbService
      .collection(`C--${userObj.uid}`)
      .orderBy("ca")
      .onSnapshot((snapshot) => {
        const categoryArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // console.log(categoryArray);
        setCategorys(categoryArray);
      });
  }, []);

  const onCategorySubmit = async (event) => {
    event.preventDefault();
    const category = {
      ca: newCategory,
    };
    await dbService.collection(`C--${userObj.uid}`).add(category);
    setNewCategory("");
  };

  const onCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewCategory(value);
  };

  const onCategorySet = (event) => {
    setCa(event.target.value);
    setMode("test");
  };

  const onModeSet = (event) => {
    if (event.target.name === "allMode") {
      setCa("모든 Todo");
      setMode("all");
    }
  };

  return (
    <div className="home">
      <Home userObj={userObj} onv={ca} mode={mode} />

      <div className="sidebar">
        <form onSubmit={onCategorySubmit} className="categoryInputContainer">
          <input
            type="text"
            value={newCategory}
            onChange={onCategoryChange}
            className="categoryInput"
            placeholder="카테고리를 입력하세요."
          />
          <button type="submit" className="categoryInputBtn">
            <FontAwesomeIcon
              icon={faPlus}
              size="1x"
              style={{ color: "#393939" }}
            />
          </button>
        </form>

        <div className="listHeader">
          <li style={{ padding: "10px", fontWeight: "700" }}>카테고리</li>
        </div>

        <div className="categoryContainer">
          <button className="categoryBtn" onClick={onModeSet} name="allMode">
            모든 Todo
          </button>
          {categorys.map((category) => (
            <input
              className="categoryBtn"
              type="submit"
              key={category.id}
              text={category.ca}
              value={category.ca}
              onClick={onCategorySet}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
