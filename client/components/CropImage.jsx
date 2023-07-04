import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { Spinner } from "react-bootstrap";
// import Img from "./assets/mFace.jpg";
// import "./styles.css";

const PhotoFaceDetection = ({ image, callback, showOnly }) => {
  const [initializing, setInitializing] = useState(false);
  //   const [image, setImage] = useState(Img);
  //   const canvasRef = useRef();
  const canvas = document.createElement("canvas");

  const imageRef = useRef();

  // I want to store cropped image in this state
  const [pic, setPic] = useState();

  useEffect(() => {
    if (!showOnly) {
      const loadModels = async () => {
        setInitializing(true);
        Promise.all([
          // models getting from public/model directory
          faceapi.nets.tinyFaceDetector.load("/models"),
          faceapi.nets.faceLandmark68Net.load("/models"),
          faceapi.nets.faceRecognitionNet.load("/models"),
          faceapi.nets.faceExpressionNet.load("/models"),
        ])
          .then(console.log("success", "/models"))
          .then(handleImageClick)
          .catch((e) => console.error(e));
      };
      loadModels();
    }
  }, [showOnly]);

  const handleImageClick = async () => {
    if (initializing) {
      setInitializing(false);
    }

    canvas.innerHTML = faceapi.createCanvasFromMedia(imageRef.current);
    const displaySize = {
      width: 500,
      height: 400,
    };
    faceapi.matchDimensions(canvas, displaySize);
    const detections = await faceapi.detectSingleFace(
      imageRef.current,
      new faceapi.TinyFaceDetectorOptions()
    );
    console.log("detections", detections);
    if (!detections) {
      alert("unable to detect face");
      setInitializing(false);
      return;
    }
    // .withFaceLandmarks();
    const resizeDetections = faceapi.resizeResults(detections, displaySize);
    canvas
      .getContext("2d")
      .clearRect(0, 0, displaySize.width, displaySize.height);
    faceapi.draw.drawDetections(canvas, resizeDetections);
    // faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);
    console.log(
      `Width ${detections.box._width} and Height ${detections.box._height}`
    );
    extractFaceFromBox(imageRef.current, detections.box);
    console.log(detections);
  };

  async function extractFaceFromBox(imageRef, box) {
    const regionsToExtract = [
      new faceapi.Rect(
        box.x - 20,
        box.y - 80,
        box.width + 40,
        box.height + 160
      ),
    ];
    let faceImages = await faceapi.extractFaces(imageRef, regionsToExtract);

    if (faceImages.length === 0) {
      console.log("No face found");
    } else {
      faceImages.forEach((cnv) => {
        const outputImage = cnv.toDataURL();
        console.log(outputImage);
        cnv.toBlob(callback, "image/jpeg", 0.95);
        setPic(outputImage);
        setInitializing(false);
      });
      // setPic(faceImages.toDataUrl);
      console.log("face found ");
      console.log(pic);
    }
  }

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      className="d-flex justify-content-center align-items-center"
    >
      {/* <span>{initializing ? "Initializing" : "Ready"}</span> */}
      <div
        style={{ display: "none" }}
        className="display-flex justify-content-center"
      >
        <img ref={imageRef} src={image} alt="face" crossorigin="anonymous" />
        {/* <canvas ref={canvasRef} className="position-absolute" /> */}
      </div>
      {initializing && !showOnly ? (
        <div className="d-flex flex-column justify-content-space-between align-items-center">
          <Spinner variant="primary" style={{ position: "absolute" }} />
          <img height="auto" width="100%" src={image} alt="face" />
        </div>
      ) : (
        <img height="100%" width="auto" src={pic} alt="face" />
      )}
    </div>
  );
};

export default PhotoFaceDetection;
