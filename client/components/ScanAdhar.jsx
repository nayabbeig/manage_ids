import { useEffect, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { QrReader } from "react-qr-reader";
import { FaTimes } from "react-icons/fa";

export const closeCamera = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  stream.getTracks().forEach(function (track) {
    track.stop();
    track.enabled = false;
  });
  const videoElement = document.getElementById("adharScanner");
  videoElement?.current?.stopCamera?.();
};

const CameraSelector = ({ setSelectedCamera, selectedCamera }) => {
  const [cameraList, setCameraList] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoInputDevices = devices?.filter?.(
        (device) => device.kind === "videoinput" && device.deviceId
      );
      // const droidCam =
      //   devices.find((device) => device.label === "DroidCam Source 3") ||
      //   devices.find((device) => device.label === "DroidCam Source 2");
      // setSelectedDevice(droidCam.deviceId || "");
      const lastUsedCameraJson = localStorage.getItem("lastUsedCamera");
      const lastUsedCamera =
        lastUsedCameraJson && JSON.parse(lastUsedCameraJson);
      setCameraList([...videoInputDevices] || []);
      setSelectedCamera(lastUsedCamera || videoInputDevices[0]);
    });
  }, []);

  const selectCamera = (camera) => {
    setSelectedCamera(camera);
    localStorage.setItem("lastUsedCamera", JSON.stringify(camera));
  };

  return (
    <Dropdown>
      <Dropdown.Toggle size="sm" variant="success" id="dropdown-basic">
        {selectedCamera?.label || "Camera Devices"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {cameraList?.map((camera, index) => (
          <Dropdown.Item
            key={camera?.deviceId || index}
            onClick={() => selectCamera(camera)}
          >
            {camera.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export const QRScanner = ({ setData, closeScanner }) => {
  const [selectedCamera, setSelectedCamera] = useState(null);
  function xmlToJson(xml) {
    const parser = new DOMParser();
    const xmlElement = parser.parseFromString(xml, "text/xml");
    const xmlNode = xmlElement.all[0];
    const properties = xmlNode.getAttributeNames();
    const object = {};
    properties.forEach((property) => {
      object[property] = xmlNode.getAttribute(property);
    });
    return object;
  }
  return (
    <>
      <div className="d-flex justify-content-between">
        <CameraSelector
          setSelectedCamera={setSelectedCamera}
          selectedCamera={selectedCamera}
        />

        <Button
          size="sm"
          variant="danger"
          className="d-flex justify-content-center align-items-center"
          onClick={closeScanner}
        >
          <FaTimes />
        </Button>
      </div>
      {selectedCamera?.deviceId && (
        <QrReader
          key={selectedCamera.deviceId}
          onResult={(result, error) => {
            if (!!result) {
              // alert(result?.text);
              setData(JSON.stringify(xmlToJson(result?.text)));
            }

            if (!!error) {
              console.info("error scanning");
            }
          }}
          scanDelay={100}
          style={{ width: "100%", border: "5px solid black" }}
          videoId="adharScanner"
          constraints={
            (selectedCamera?.deviceId || undefined) && {
              deviceId: selectedCamera.deviceId,
            }
          }
        />
      )}
    </>
  );
};

export const ScanAdhar = ({ setData }) => {
  const [deviceId, setDeviceId] = useState(null);
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const droidCam =
        devices.find((device) => device.label === "DroidCam Source 3") ||
        devices.find((device) => device.label === "DroidCam Source 2");
      setDeviceId(droidCam.deviceId || "");
    });
  }, []);

  function xmlToJson(xml) {
    const parser = new DOMParser();
    const xmlElement = parser.parseFromString(xml, "text/xml");
    const xmlNode = xmlElement.all[0];
    const properties = xmlNode.getAttributeNames();
    const object = {};
    properties.forEach((property) => {
      object[property] = xmlNode.getAttribute(property);
    });
    return object;
  }
  return (
    <>
      {typeof deviceId === "string" && (
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              alert(result?.text);
              setData(JSON.stringify(xmlToJson(result?.text)));
            }

            if (!!error) {
              console.info(error);
            }
          }}
          scanDelay={100}
          style={{ width: "100%", border: "5px solid black" }}
          videoId="adharScanner"
          //   constraints={
          //     (deviceId || undefined) && {
          //       deviceId,
          //     }
          //   }
        />
      )}
    </>
  );
};

export default ScanAdhar;
