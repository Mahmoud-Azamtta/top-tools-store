import React from "react";
import "./loading.css";

function Loading() {
  return (
    <div className=" d-flex justify-content-center align-items-center vh-100">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loading;

