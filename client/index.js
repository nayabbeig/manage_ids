import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import axios from "axios";

const container = document.getElementById("root");
const root = createRoot(container);

const IpAddressPage = () => {
  const localIp = sessionStorage.getItem("ipAddress");
  const [ip, setIp] = useState(localIp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  console.log("ip: ", ip);
  const inputRef = useRef();
  const setIpAddress = async () => {
    try {
      setLoading(true);
      const input = inputRef?.current?.value;
      const response = await axios.get(`http://${input}:1337`);
      setLoading(false);
      if (Number(response?.status) === 200) {
        sessionStorage.setItem("ipAddress", input);
        console.log(input);
        return setIp(input);
      }

      return setError(true);
    } catch (e) {
      setLoading(false);
      console.log(e);
      return setError(true);
    }
  };

  return ip ? (
    <App />
  ) : (
    <Container>
      <Row className="d-flex justify-content-center">
        <Col
          xs={8}
          className="d-flex flex-column justify-content-center"
          style={{ height: "300px" }}
        >
          <h1 className="mb-5">Enter IP Address below</h1>
          <Form.Control
            type="text"
            ref={inputRef}
            placeholder="Enter IP Address"
            className="mb-2"
            id="ipInput"
            defaultValue="192.168"
          />
          <Button disabled={loading} onClick={setIpAddress}>
            {loading ? <Spinner size="sm" /> : "Start"}
          </Button>
        </Col>
      </Row>
      {error && (
        <Row className="d-flex justify-content-center">
          <Col
            xs={8}
            className="d-flex flex-column justify-content-center"
            style={{ height: "300px" }}
          >
            <Alert variant="danger" onClose={() => setError(false)} dismissible>
              <Alert.Heading>
                Unable to connect with this IP address !
              </Alert.Heading>
              <p>
                We were unable to make calls to this IP address. Please check
                the IP address once.
              </p>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <IpAddressPage />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
