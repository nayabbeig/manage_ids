import React, { useState, useEffect, useRef } from "react";
import { Button as BsButton, Form } from "react-bootstrap";

import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faCamera,
  faFileUpload,
  faFolder,
  faImages,
  faRedo,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./HybridInput.css";
import { Gallery } from "./GalleryPage";
import { selectGalleryUploadStatus, uploadToGallery } from "./GallerySlice";
import { useDispatch, useSelector } from "react-redux";
import { Modalify, Thumbnail, TooltipButton } from "./MicroComponents";
import {
  Col,
  Container,
  Row,
  Button as BootstrapButton,
  ButtonGroup,
  Spinner,
  Modal,
} from "react-bootstrap";
import path from "../features/router/paths";
import CropImage from "./CropImage";

export const InputField = ({ id, label, type, smallContent, ...restProps }) => (
  <div className="form-group">
    <label for={id}>{label}</label>
    <input type={type} className="form-control" id={id} {...restProps} />
    <small id="emailHelp" className="form-text text-muted">
      {smallContent}
    </small>
  </div>
);

const Button = ({ children, ...otherProps }) => (
  <button className="duallist_button" {...otherProps}>
    {children}
  </button>
);

export const SelectFromGallery = (props) => {
  const [selectedImage, setSelectedImage] = useState({
    imageUr: "",
    image: null,
  });
  const { selectImage } = props;
  const cancel = () => {
    selectImage("", null);
    props.close();
  };

  const select = () => {
    if (!selectedImage.imageUrl || !selectedImage.image) {
      return;
    }
    selectImage(selectedImage.image.preview, selectedImage.image);
    props.close();
  };

  return (
    <Modalify
      close={props.close}
      ok
      cancel
      onCancel={cancel}
      onOk={select}
      title="Select From Gallery"
      className="pt-8"
      bottomChildren={
        selectedImage.image && (
          <div className="d-flex">
            <div className="box-0-5 w-1">
              <Thumbnail src={selectedImage.image.thumbnail} />
            </div>
            <div className="d-none d-md-flex">
              <ul>
                <div>{selectedImage.image && selectedImage.image.name}</div>
                <div className="text-muted">
                  Size: {selectedImage.image && selectedImage.image.size} B
                </div>
                <div className="text-muted">
                  Created At:{" "}
                  {selectedImage.image &&
                    new Date(selectedImage.image.createdAt).toLocaleString()}
                </div>
              </ul>
            </div>
          </div>
        )
      }
    >
      <Gallery
        className="h-100 w-100 d-flex flex-wrap overflow-auto"
        noPreview
        onSelect={(imageUrl, image) => {
          setSelectedImage({ imageUrl, image });
        }}
      />
    </Modalify>
  );
};

export const CaptureImage = ({ selectImage, handleClose }) => {
  var imageCapture;
  const initial = { url: null, blob: null };
  const [showOptions, setShowOptions] = useState(initial);
  const [errors, setErrors] = useState("");
  function startStream() {
    if (!window?.navigator?.allMediaStreams) {
      (window.navigator || {}).allMediaStreams = [];
    }
    window?.navigator?.mediaDevices
      ?.getUserMedia({
        video: true,
      })
      ?.then(function (mediaStream) {
        window?.navigator?.allMediaStreams?.push(mediaStream);
        var player = document.getElementById("player");
        if (player) {
          player.srcObject = mediaStream;
          player.play();
        }
        let mediaStreamTrack = mediaStream?.getVideoTracks?.()?.[0];
        imageCapture = new window.ImageCapture(mediaStreamTrack);
        console.log("imageCapture", imageCapture, ImageCapture);
      })
      ?.catch(error);
  }

  function error(error) {
    setErrors(true);
    console.error("error:", error);
  }

  function stopCamera() {
    var video = document.getElementById("player");

    for (const track of video.srcObject.getTracks()) {
      track.stop();
    }
    video.srcObject = null;
  }

  const close = () => {
    window.navigator.allMediaStreams.forEach((stream, i) => {
      stream.getTracks().forEach(async (track, j) => {
        await track.stop();
      });
    });

    stopCamera();

    handleClose();
  };

  const ok = (image) => {
    selectImage?.(image);
    close();
  };

  function takePhoto() {
    imageCapture &&
      imageCapture
        .takePhoto()
        .then((blob) => {
          let url = window.URL.createObjectURL(blob);
          // setImage({ url: url, blob: blob });
          ok({ url: url });
        })
        .catch(error);
  }

  function takePhotoCanvas() {
    imageCapture &&
      imageCapture
        .takePhoto()
        .then((blob) => createImageBitmap(blob))
        .then((imageBitmap) => {
          const canvas = document.querySelector("#takePhotoCanvas");
          drawCanvas(canvas, imageBitmap);
        })
        .catch((error) => console.error(error));
  }

  function drawCanvas(canvas, img) {
    canvas.width = getComputedStyle(canvas).width.split("px")[0];
    canvas.height = getComputedStyle(canvas).height.split("px")[0];
    let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
    let x = (canvas.width - 426 * ratio) / 2;
    let y = (canvas.height - img.height * ratio) / 2;
    console.log("imageHeight", img.height, "imageWidth", img.width);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    canvas
      .getContext("2d")
      .drawImage(
        img,
        426,
        0,
        426,
        img.height,
        x,
        y,
        426 * ratio,
        img.height * ratio
      );
  }

  // function retakePhoto() {
  //     setImage(initial);
  // }

  const Options = () => (
    <div id="options">
      <button className="capture_button" onClick={takePhoto}>
        <FontAwesomeIcon icon={faCamera} /> Capture
      </button>
    </div>
  );

  useEffect(() => {
    startStream();
  }, []);

  return (
    <Modal show size="sm" onHide={close}>
      <Modal.Header className="py-0" closeButton>
        <Modal.Title>
          <Options />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <Row>
          <Col xs={12}>
            {/* } close={close}> */}
            {/* <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}> */}

            {errors ? (
              <p className="p-3 fs-5 text-danger">
                Unable to capture photo. Something went wrong!
              </p>
            ) : (
              <div className="d-flex justify-content-center align-items-center">
                <video
                  // className="mh-100 mw-100 h-auto w-auto"
                  id="player"
                  width="300"
                  controls
                ></video>
              </div>
            )}
            {/* <div>
              <canvas height={640} width={360} id="takePhotoCanvas" />
            </div> */}
            {/* </div> */}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export const ImageUpload = ({
  defaultImage,
  close,
  disableGallery,
  onComplete,
  ImageContainer,
  hide,
  formInput,
  meta,
  ...props
}) => {
  const dispatch = useDispatch();
  const imageUploadRef = useRef();
  const uploading = useSelector((state) => selectGalleryUploadStatus(state));
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showImageCapture, setShowImageCapture] = useState(false);
  const [isUploadDisabled, setIsUploadDisabled] = useState(true);
  const [uploadMethod, setUploadMethod] = useState("");
  const initial = defaultImage
    ? {
        url: path.hostOnly + defaultImage.url,
        id: defaultImage.id,
        blob: null,
      }
    : { url: null, blob: null, id: null };

  const [image, setImage] = useState(initial);

  const handleUpload = async () => {
    const data = await dispatch(uploadToGallery(image.blob));
    console.log("data", data);
    const id = (data.payload[0] || {}).id;
    setImage({ ...image, id: id });
    setIsUploadDisabled(true);
    formInput.onChange(id);
    if (onComplete) {
      onComplete(data.payload);
    }
  };

  const renderSelectFromGallery = () =>
    showImageGallery && (
      <SelectFromGallery
        selectImage={(imageUrl, image) => {
          imageUrl &&
            image &&
            setImage({
              blob: null,
              url: imageUrl,
              id: image && image.id,
              image,
            });
        }}
        close={() => setShowImageGallery(false)}
      />
    );

  const renderCaptureImage = () => {
    const optionsContainer = document.getElementById("headerOptions");
    return (
      showImageCapture && (
        <CaptureImage
          optionsContainer={optionsContainer}
          selectImage={(image) => {
            setImage(image);
          }}
          handleClose={() => setShowImageCapture(false)}
        />
      )
    );
  };

  const bottomChildren = (
    <Row>
      <Col xs={9}>
        <ButtonGroup aria-label="Basic example">
          <BsButton
            variant="secondary"
            // tooltipText="Select from your device"
            onClick={() => {
              setUploadMethod("fileUpload");
              imageUploadRef.current.querySelector("#fileInput").click();
            }}
            disabled={showImageGallery}
          >
            <FontAwesomeIcon icon={faFolder} />
          </BsButton>
          <BsButton
            variant="secondary"
            // tooltipText="Capture from camera"
            onClick={() => {
              setUploadMethod("camera");
              setShowImageCapture(true);
            }}
            disabled={showImageCapture}
          >
            <FontAwesomeIcon icon={faCamera} />
          </BsButton>
          <BsButton onClick={handleUpload} disabled={isUploadDisabled}>
            <FontAwesomeIcon icon={faFileUpload} />
          </BsButton>
          {disableGallery || (
            <BsButton
              variant="secondary"
              // tooltipText="Select from gallery"
              onClick={() => setShowImageGallery(true)}
            >
              <FontAwesomeIcon icon={faImages} />
            </BsButton>
          )}
        </ButtonGroup>
      </Col>
      {/* </div> */}
    </Row>
  );

  console.log("image");
  console.log("formInput", formInput, meta);

  return (
    <Row ref={imageUploadRef}>
      <Col xs={12}>
        <div className="border" style={{ width: "120px" }}>
          <Form.Control
            type="text"
            style={{ display: "none" }}
            {...formInput}
            {...props}
          />
          <input
            type="file"
            id="fileInput"
            onChange={(e) => {
              setImage({
                url: URL.createObjectURL(e.target.files[0]),
                blob: e.target.files[0],
              });
              setIsUploadDisabled(false);
            }}
            style={{ display: "none" }}
          />
          {/* {previewImage()} */}
          {renderSelectFromGallery()}
          {renderCaptureImage()}
          {!showImageCapture && !showImageGallery && image.url ? (
            (ImageContainer && <ImageContainer src={image.url} />) || (
              <div
                style={{
                  height: "150px",
                  width: "120px",
                }}
                className="d-flex justify-content-center align-items-center"
              >
                {(uploadMethod === "fileUpload" ||
                  (defaultImage?.url && uploadMethod !== "camera")) && (
                  <>
                    {uploading && (
                      <Spinner
                        variant="primary"
                        style={{ position: "absolute" }}
                      />
                    )}
                    <img
                      src={image.url}
                      alt="Unable to preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        height: "auto",
                        width: "auto",
                      }}
                    />
                  </>
                )}

                {uploadMethod === "camera" && (
                  <CropImage
                    showOnly={image?.blob}
                    image={image.url}
                    callback={(blob) => {
                      console.log("callback called");
                      setImage({ ...image, blob });
                      setIsUploadDisabled(false);
                    }}
                  />
                )}
              </div>
            )
          ) : (
            <div
              style={{
                height: "150px",
                width: "120px",
              }}
              className="d-flex justify-content-center align-items-center"
            >
              <h5 className="text-center">No Image Selected</h5>
            </div>
          )}
          {bottomChildren}
        </div>
      </Col>
    </Row>
  );
};
