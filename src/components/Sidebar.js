import React, { useState, useEffect } from "react";
import styles from "./styles/SidebarStyle.css";
// import SidebarComponents from "./SidebarComponents";
import { dbService } from "fbase";
import SidebarComponents from "./SidebarComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPlus, faUserGear } from "@fortawesome/free-solid-svg-icons";
import Home from "../routes/Home";
import { Link } from "react-router-dom";

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
        <div className="categoryContainer">
          <div className="categoryHeaderContainer">
            <div className="listHeader">
              <li style={{ padding: "10px", fontWeight: "700" }}>카테고리</li>
            </div>

            <Link to="/edit">
              <button className="settingBtn">
                <FontAwesomeIcon icon={faGear} style={{ color: "white" }} />
              </button>
            </Link>
          </div>

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
