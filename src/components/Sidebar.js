import React, { useState, useEffect } from "react";
import styles from "./styles/SidebarStyle.css";
// import SidebarComponents from "./SidebarComponents";
import { dbService } from "fbase";
import SidebarComponents from "./SidebarComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ userObj }) => {
  const [categorys, setCategorys] = useState([]);
  const [newCategory, setNewCategory] = useState("");

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

  return (
    <div className="sidebar">
      <form onSubmit={onCategorySubmit} className="categoryInputContainer">
        <input
          type="text"
          value={newCategory}
          onChange={onCategoryChange}
          className="categoryInput"
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
      {categorys.map((category) => (
        <SidebarComponents key={category.id} text={category.ca} />
      ))}
    </div>
  );
};

export default Sidebar;
