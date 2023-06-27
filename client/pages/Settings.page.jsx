import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import NavBar from "../components/NavBar";

const Settings = () => {
  useEffect(() => {
    window.open("http://localhost:1337");
  }, []);
  return (
    <Container fluid className="px-2">
      <NavBar />
      <iframe
        style={{ height: "100vh", width: "100vw" }}
        title="settings"
        src="http://localhost:1337"
      ></iframe>
    </Container>
  );
};

export default Settings;
