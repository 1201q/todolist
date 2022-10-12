import Sidebar from "./Sidebar";
import styles from "./styles/SidebarStyle.css";

const SidebarComponents = ({ text }) => {
  return (
    <div className="categoryContainer">
      <button className="categoryBtn">{text}</button>
    </div>
  );
};

export default SidebarComponents;
