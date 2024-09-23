import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
const BtnSave = ({ onClick, className, title, to }) => {
  return (
    <Button className={className} onClick={onClick}>
      <Link className="text-decoration-none" to={to}>
        {title}
      </Link>
    </Button>
  );
};

export default BtnSave;
