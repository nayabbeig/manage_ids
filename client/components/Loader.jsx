import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center fixed">
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default Loader;
