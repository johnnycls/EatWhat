import { Button } from "primereact/button";
import React from "react";
import { useNavigate } from "react-router-dom";

const AppBar: React.FC<{}> = ({}) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full p-3 flex items-center"
      style={{
        backgroundColor: "var(--primary-color)",
        color: "var(--primary-color-text)",
      }}
    >
      <Button
        label="食乜"
        onClick={() => {
          navigate("/");
        }}
      />
      <Button
        label="有乜食"
        onClick={() => {
          navigate("/eatwhat");
        }}
      />
      <Button
        label="食過乜"
        onClick={() => {
          navigate("/eatenwhat");
        }}
      />
    </div>
  );
};

export default AppBar;
