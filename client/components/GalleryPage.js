import React, { useEffect } from "react";
import { Button, Card, Container, Modal } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";

import {
  loadGallery,
  selectGallery,
  setCurrent,
  selectCurrent,
  setNext,
  setPrevious,
  deleteImages,
  selectIsLoading,
} from "./GallerySlice";

import style from "./GalleryPage.module.css";
import {
  CardWithClose,
  FullLoader,
  Loader,
  Modalify,
  Thumbnail,
  TooltipButton,
  useAsk,
  useModal,
  useShowHide,
} from "./MicroComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ImageUpload } from "./HybridInput";
import path from "../features/router/paths";

const utilizeClasses = (style) => {
  return (...classes) => {
    return {
      className: classes
        .map((className) => style[className] || className)
        .join(" "),
    };
  };
};
const c = utilizeClasses(style);

export const getUrlFromThnumbnail = (thumbnail, format) => {
  if (!thumbnail) {
    return "";
  }

  let url;

  if (thumbnail.formats) {
    const fr = thumbnail.formats;
    url = (fr.thumbnail || fr.medium || fr.medium || fr.large || fr.small).url;
    if (format && fr[format]) {
      url = fr[format].url;
    }
  }

  return url || thumbnail.url;
};

// function getIndices(arrLength, currentIndex,offset){
//     const arr = [ ...Array(arrLength).keys() ].map( i => i+1);
//     let start = currentIndex - offset;
//     let end = currentIndex + offset;
//     let firstPart = [];
//     let secondPart = [];
//     if(start<0){
//         const negativePart = [...arr].slice(start);
//         const positivePart = [...arr].slice(0, currentIndex);
//         firstPart = [...negativePart, ...positivePart];
//     }
//     else firstPart = [...arr].slice(start, currentIndex);

//     if(end>arr.length - 1){
//         const negativePart = [...arr].slice(end - arr.length - 1);
//         const positivePart = [...arr].slice(currentIndex+1, arr.length);
//         secondPart = [...negativePart, ...positivePart];
//     }
//     else secondPart = [...arr].slice(currentIndex+1, end+1);

//     return [...firstPart, arr[currentIndex], ...secondPart]
// }

function getIndices(arrLength, currentIndex, offset) {
  const arr = [...Array(arrLength).keys()].map((i) => i);
  const indices = [...arr, ...arr, ...arr];
  const center = arrLength + currentIndex;
  const previous = center - offset;
  const next = center + offset + 1;
  const result = indices.slice(previous, next);
  return result;
}

const ImageViewer = () => {
  // const [show, setShow] = useState(useSelector(state=>selectCurrent(state)));

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  const dispatch = useDispatch();
  const gallery = useSelector((state) => selectGallery(state));
  const current = useSelector((state) => selectCurrent(state));
  const close = () => dispatch(setCurrent(null));
  const next = () => dispatch(setNext());
  const previous = () => dispatch(setPrevious());
  const noOfBottomImageEachSide = 5;

  const currentIndex = (gallery || []).findIndex(
    (image) => image.id === current.id
  );
  const bottomImages = getIndices(
    gallery.length,
    currentIndex,
    noOfBottomImageEachSide
  ).map((i) => gallery[i]);

  return (
    current && (
      <div {...c("image_viewer")}>
        <div {...c("image_viwer_header")}>
          <Modal.Header closeButton onHide={close}>
            <Modal.Title>{current.name}</Modal.Title>
          </Modal.Header>
        </div>
        <div {...c("image_viwer_body")}>
          <div {...c("image_container")}>
            <Button
              onClick={previous}
              variant="outline-primary"
              {...c("image_viewer_button_left")}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <Button
              onClick={next}
              variant="outline-primary"
              {...c("image_viewer_button_right")}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
            <img src={current.preview} />
          </div>
          <div {...c("bottom_images", "d-none d-md-flex")}>
            {bottomImages.map((image) => (
              <div
                onClick={() => dispatch(setCurrent(image))}
                className={
                  style.bottom_image_container +
                  " " +
                  (image.id === current.id && style.selected_bottom_image)
                }
              >
                <Thumbnail src={image.thumbnail} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export const Gallery = ({
  noPreview,
  onSelect,
  markImage,
  deleteEnabled,
  ...restProps
}) => {
  const dispatch = useDispatch();
  const gallery = useSelector((state) => selectGallery(state));
  const current = useSelector((state) => selectCurrent(state));

  useEffect(() => {
    dispatch(loadGallery());
  }, []);

  const handleClick = (image) => {
    if (onSelect) {
      onSelect(getUrlFromThnumbnail(image), image);
    }
    !noPreview && dispatch(setCurrent(image));
  };

  const handleCheckboxClick = (e, image) => {
    if (!markImage) return;
    e.stopPropagation();
    markImage(image);
  };

  return (
    <Container fluid {...c("gallery_container", "pt-8")} {...restProps}>
      {!current && !gallery.length && (
        <>
          <div className="d-flex justify-content-center align-items-center w-100">
            <h3 className="m-3" style={{ color: "#B6B6BF" }}>
              Sorry, No Image To Display
            </h3>
          </div>
        </>
      )}
      {!current && gallery.length
        ? gallery.map((image) => (
            <div
              onClick={() => handleClick(image)}
              {...c("thumbnail_container", "shadow-sm")}
            >
              {console.log(image)}
              {deleteEnabled && (
                <input
                  type="checkbox"
                  onClick={(e) => handleCheckboxClick(e, image)}
                  style={{ transform: "scale(1.5)" }}
                />
              )}
              <div {...c("thumbnail_cover")}>{image.name}</div>
              {/* <Thumbnail src={getUrlFromThnumbnail(image)} /> */}
              <Card.Img
                variant="top"
                src={
                  path.hostOnly +
                  (image?.thumbnail || image?.formats?.thumbnail?.url)
                }
              />
              {/* <Card src={image.url} /> */}
            </div>
          ))
        : null}
      {current && <ImageViewer />}
    </Container>
  );
};

const GalleryPage = () => {
  const dispatch = useDispatch();
  const markedImages = [];

  const [LoadModal, showDeleteModal] = useModal(null, () => (
    <Loader message="Deleting Images" />
  ));
  const [DeleteAsk, showDeleteAsk] = useAsk({
    question: "Do you really want to delete these images?",
    onAnswer: async (answer, getId) => {
      if (answer) {
        showDeleteModal();
        const response = await dispatch(deleteImages(getId()));
        if (response) {
          window.location.reload();
        }
      }
    },
  });

  const removeImages = async () => {
    showDeleteAsk(markedImages);
  };

  const markImage = (image) => {
    markedImages.push(image.id);
  };

  const [visible, show, hide] = useShowHide(false);
  const loading = useSelector((state) => selectIsLoading(state));

  return (
    <div {...c("gallery")}>
      {loading && <FullLoader message="Loading Gallery..." />}
      <LoadModal className="d-flex justify-content-center align-items-center" />
      <DeleteAsk className="d-flex justify-content-center align-items-center" />
      {visible && (
        <ImageUpload
          hide={hide}
          disableGallery
          onComplete={() => window.location.reload()}
        />
      )}
      <Gallery markImage={markImage} deleteEnabled />
    </div>
  );
};

export default GalleryPage;
