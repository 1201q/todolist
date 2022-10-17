import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = ({ toastMsg }) => {
  const showToastMessage = () => {
    toast.info("수정은 확인버튼을 꼭 눌러주세요!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };
  return (
    <div>
      <button onClick={showToastMessage}>Notify</button>
      <ToastContainer />
    </div>
  );
};

export default Toast;
