import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import style from "./MicroComponents.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  FormControl,
  InputGroup,
  ListGroup,
  Modal,
  OverlayTrigger,
  Pagination,
  Row,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import {
  faPencilAlt,
  faSearch,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

export const utilizeClasses = (style) => {
  return (...classes) => {
    return {
      className: classes
        .map((className) => style[className] || className)
        .join(" "),
    };
  };
};

export const getUrlFromThnumbnail = (thumbnail, format) => {
  if (!thumbnail) {
    return "";
  }

  let url;

  if (thumbnail.formats) {
    const fr = thumbnail.formats;
    url = (fr.thumbnail || fr.medium || fr.medium || fr.large || fr.small).url;
    if (format && fr[format]) {
      url = fr[format];
    }
  }

  return url || thumbnail.url;
};

const c = utilizeClasses(style);

export const Brand = () => (
  <div {...c("brand_container")}>
    <Link to="/">Logo</Link>
  </div>
);

export const MenuItem = ({ icon, onClick }) => (
  <div {...c("menu_item_container")} onClick={onClick}>
    <FontAwesomeIcon icon={icon} />
  </div>
);

export const TooltipMenuItem = ({
  icon,
  onClick,
  placement = "bottom",
  tooltipText,
  ...otherProps
}) => (
  <OverlayTrigger
    key={placement}
    placement={placement}
    overlay={
      <Tooltip id={`tooltip-${placement}`} style={{ zIndex: 6500 }}>
        {tooltipText}
      </Tooltip>
    }
  >
    <div
      {...c("menu_item_container", "d-inline")}
      onClick={onClick}
      {...otherProps}
    >
      <FontAwesomeIcon icon={icon} />
    </div>
  </OverlayTrigger>
);

export const ContentOption = ({ deleteContent, editContent }) => (
  <div {...c("content_option_container")}>
    <TooltipMenuItem
      icon={faPencilAlt}
      onClick={editContent}
      tooltipText="Edit"
      style={{ color: "#00bcd4" }}
    />
    <TooltipMenuItem
      icon={faTrash}
      onClick={deleteContent}
      tooltipText="Delete"
      style={{ color: "crimson" }}
    />
  </div>
);

export const Thumbnail = ({ src, ...rest }) => {
  return (
    <div {...c("thumbnail")} {...rest}>
      <img
        src={src}
        onError={(e) => {
          e.target.src = src;
        }}
      />
    </div>
  );
};

export const TooltipButton = ({
  placement,
  tooltipText,
  children,
  containerClass = "",
  ...otherProps
} = {}) => (
  <OverlayTrigger
    key={placement}
    placement={placement}
    overlay={<Tooltip id={`tooltip-${placement}`}>{tooltipText}</Tooltip>}
    className={containerClass}
  >
    <Button {...otherProps}>{children}</Button>
  </OverlayTrigger>
);

export const PaginateCustom = ({ currentPage, pageCount, goTo }) => {
  const onFirstPage = currentPage === 1;
  const onLastPage = currentPage === pageCount;
  const goNext = () => {
    goTo(currentPage === pageCount ? 1 : currentPage + 1);
  };

  const goPrevious = () => {
    goTo(currentPage === 1 ? pageCount : currentPage - 1);
  };

  return (
    <footer className="footer position-fixed bottom-0 text-center m-auto w-100">
      <Container>
        <Row className="d-flex justify-content-center">
          <Col md={8} className="d-flex justify-content-center">
            <Pagination
              className=" align-items-stretch"
              style={{ background: "white" }}
            >
              <Pagination.First
                disabled={onFirstPage}
                onClick={() => !onFirstPage && goTo(1)}
              />
              <Pagination.Prev
                disabled={onFirstPage}
                onClick={() => !onFirstPage && goPrevious()}
              />
              {/* <InputGroup style={{ width: "160px" }} className="py-0 mx-2">
                                <InputGroup.Text
                                    style={{ borderRadius: 0 }}
                                    className="py-0"
                                    id="basic-addon1"
                                >
                                    Go To
                                </InputGroup.Text>
                                <FormControl
                                    placeholder="Page No"
                                    className="py-0"
                                    type="number"
                                    style={{ borderRadius: 0 }}
                                    onBlur={(e) => {
                                        if (parseInt(e.target.value) === 0) {
                                            e.target.value = 1;
                                        }
                                        else if (!e.target.value) return;
                                        e.target.value = Math.abs(parseInt(e.target.value));
                                        Number(e.target.value) && goTo(Number(e.target.value));
                                    }}
                                />
                            </InputGroup> */}

              <Pagination.Item>Go To</Pagination.Item>
              <Pagination.Item
                className="border bg-light"
                contentEditable
                onBlur={(e) => {
                  if (parseInt(e.target.innerText) === 0) {
                    e.target.innerText = 1;
                  } else if (!e.target.innerText) return;
                  e.target.innerText = Math.abs(parseInt(e.target.innerText));
                  Number(e.target.innerText) &&
                    goTo(Number(e.target.innerText));
                }}
              ></Pagination.Item>
              <Pagination.Item>
                {currentPage} / {pageCount}
              </Pagination.Item>
              <Pagination.Next
                disabled={onLastPage}
                onClick={() => !onLastPage && goNext()}
              />
              <Pagination.Last
                disabled={onLastPage}
                onClick={() => !onLastPage && goTo(pageCount)}
              />
            </Pagination>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export function CurrentUserAvatar({ size, style }) {
  return (
    <div style={style}>
      <Avatar src={""} size={size} />
    </div>
  );
}

export function CoverImage({ size, src, onError, style = {} }) {
  return (
    <div style={{ height: "100px", ...style }}>
      <img
        className="w-100 h-100 object-fit-cover"
        src={src}
        alt="Cover"
        onError={onError}
      />
    </div>
  );
}

export function CurrentUserCover({ size }) {
  return <CoverImage src={""} size={size} />;
}

//==============================================================================================================================
export const CardWithClose = ({
  heading,
  close,
  title,
  body,
  buttonLabel,
  buttonOnClick,
  children,
  ...restProps
}) => (
  <Card {...restProps}>
    <Card.Header className="d-flex justify-content-between align-items-center">
      {heading}
      <Button onClick={close}>
        <FontAwesomeIcon icon={faTimes} />
      </Button>
    </Card.Header>
    <Card.Body>
      {children || (
        <>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{body}</Card.Text>
          <Button onClick={buttonOnClick} variant="primary">
            {buttonLabel}
          </Button>
        </>
      )}
    </Card.Body>
  </Card>
);

export const Loader = ({ message, children, otherProps }) => (
  <Card
    style={{ width: "300px", minHeight: "300px", height: "fit-content" }}
    {...otherProps}
  >
    <Card.Body className="d-flex flex-column justify-content-center align-items-center">
      <Spinner
        className="mb-4"
        animation="border"
        variant="primary"
        size="lg"
      />
      <h6>{message}</h6>
      <div>{children}</div>
    </Card.Body>
  </Card>
);

export const FullLoader = ({ message, children, otherProps }) => (
  <div
    style={{
      zIndex: "8000",
      position: "fixed",
      width: "100vw",
      height: "100vh",
      top: "0",
      left: "0",
      backgroundColor: "rgba(0,0,0,0.3)",
    }}
    className="d-flex justify-content-center align-items-center"
  >
    <Loader {...{ message, children, otherProps }} />
  </div>
);

export const SearchBar = ({ searchMethod, placeholder = "search..." }) => {
  const inputRef = useRef(null);
  return (
    <div className="input-group">
      <div class="form-outline" style={{ width: "70%" }}>
        <input
          ref={inputRef}
          type="search"
          id="form1"
          className="form-control"
          placeholder={placeholder}
          style={{ paddingRight: "15px", outline: "none", boxShadow: "none" }}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") searchMethod(value);
          }}
        />
      </div>
      <button
        onClick={() => {
          const value = inputRef.current.value;
          searchMethod(value);
        }}
        type="button"
        className="btn btn-primary"
        style={{ marginLeft: "-10px" }}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
};

export const Tooltipify = ({
  placement = "bottom",
  tooltipText,
  children,
  ...otherProps
}) => (
  <>
    {tooltipText ? (
      <OverlayTrigger
        key={placement}
        placement={placement}
        overlay={<Tooltip id={`tooltip-${placement}`}>{tooltipText}</Tooltip>}
      >
        <div {...otherProps}>{children}</div>
      </OverlayTrigger>
    ) : (
      children
    )}
  </>
);

export const TRow = ({ children, tooltipText, ...others }) => (
  <Row {...others} className="text-truncate">
    <Tooltipify tooltipText={tooltipText} className="text-truncate">
      {children}
    </Tooltipify>
  </Row>
);

export const TCol = ({ children, tooltipText, ...others }) => (
  <Col {...others} className="text-truncate">
    <Tooltipify tooltipText={tooltipText} className="text-truncate">
      {children}
    </Tooltipify>
  </Col>
);

export const Modalify = ({
  zIndex,
  type,
  close,
  ok,
  cancel,
  onOk,
  onCancel,
  bottomChildren,
  title,
  body,
  buttonLabel,
  buttonOnClick,
  children,
  headerChildren,
  className,
  bodyClasses,
  ...restProps
}) => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const dialogWidth = {
    square: "w-25",
    small: "w-50",
    rectangle: "w-75",
    full: "w-100",
  }[type || "rectangle"];
  return (
    <>
      <Modal
        show={show}
        onHide={close || handleClose}
        className={`pt-8 d-flex justify-content-center ${className}`}
        dialogClassName={dialogWidth + " mw-100 minWidth300px"}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
          {headerChildren}
        </Modal.Header>
        <Modal.Body className={`h-50-vh overflow-auto ${bodyClasses}`}>
          {children}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div style={ok || cancel ? {} : { width: "100%" }}>
            {bottomChildren}
          </div>
          {(ok || cancel) && (
            <div>
              {ok && (
                <Button
                  variant="secondary m-1"
                  onClick={onCancel || handleClose}
                >
                  Cancel
                </Button>
              )}
              {cancel && (
                <Button variant="primary m-1" onClick={onOk || handleClose}>
                  Ok
                </Button>
              )}
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const Avatar = ({ src, size, onClick, ...rest }) => {
  const [visible, show, hide] = useShowHide(false);
  return (
    <>
      {visible && (
        <Modalify
          title="Profile Picture"
          type="square"
          close={hide}
          zIndex={6000}
        >
          <img src={src} className="w-100 h-100 object-fit-cover" />
        </Modalify>
      )}
      <div
        className={`d-flex align-items-center box-${
          size || 1
        } circle border m-2 hover-primary-border overflow-hidden`}
        onClick={onClick || show}
      >
        <img src={src} {...rest} className="w-100 h-100 object-fit-cover" />
      </div>
    </>
  );
};

export const Listify = ({ list, onClick }) => {
  return (
    <ListGroup as="ol" numbered>
      {list.map(({ listItem, badgeCount }, index) => (
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start text-truncate"
          onClick={() => onClick({ listItem, badgeCount }, index)}
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">{listItem}</div>
          </div>
          <Badge variant="primary" pill>
            {badgeCount}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

// HOOKS==================================================================================================
export const useModal = (initialValue, childRenderer) => {
  const [visibility, setVisibility] = useState(initialValue);
  const show = () => setVisibility(true);
  const hide = () => setVisibility(false);
  const Component = ({ zIndex, ...restProps }) =>
    !!visibility && (
      <>
        <div
          style={{
            zIndex: zIndex || 8000,
            position: "fixed",
            width: "100vw",
            height: "100vh",
            top: "0",
            left: "0",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
          {...restProps}
        >
          {childRenderer && childRenderer({ show, hide })}
        </div>
      </>
    );

  return [Component, show, hide];
};

export const useAsk = ({ question, type = "yesNo", onAnswer }) => {
  const [argData, setArgData] = useState(null);
  const getData = () => argData;
  const handleAnswer = (answer) => {
    if (onAnswer) {
      onAnswer(answer, getData);
    }
  };
  const askCard = ({ hide }) => (
    <CardWithClose
      heading="Add Image"
      close={hide}
      style={{ width: "400px", height: "400px" }}
    >
      <h5 className="mb-5 mt-3">{question}</h5>
      {
        {
          yesNo: (
            <div>
              <Button
                className="m-2"
                variant="primary"
                onClick={() => {
                  handleAnswer(true);
                  hide();
                }}
              >
                Yes
              </Button>
              <Button
                className="m-2"
                variant="danger"
                onClick={() => {
                  handleAnswer(false);
                  hide();
                }}
              >
                No
              </Button>
            </div>
          ),
          answer: (
            <>
              <input className=".input" />
              <Button variant="success">Ok</Button>
            </>
          ),
        }[type]
      }
    </CardWithClose>
  );
  const [AskModal, showModal, hideModal] = useModal(null, askCard);
  const show = (data) => {
    setArgData(data);
    showModal();
  };

  return [AskModal, show, hideModal];
};

export function useShowHide(initialState) {
  const [state, setState] = useState(initialState);
  const show = () => setState(true);
  const hide = () => setState(false);
  return [state, show, hide];
}

export function usePreviousNext(index = 0, length, type = 0) {
  const [currentIndex, setCurrentIndex] = useState(index);
  let initialState = {
    nextIndex: null,
    previousIndex: null,
  };

  if (Number.isNaN(type) || (type !== 0 && type !== 1)) {
    type = 0;
  }

  if (currentIndex > length + type - 1 || currentIndex < type) {
    return {
      goNext: null,
      goPrevious: null,
      getNextIndex: null,
      getPreviousIndex: null,
      currentIndex: null,
      goTo: null,
    };
  }

  if (length === 1) {
    initialState = {
      nextIndex: currentIndex,
      previousIndex: currentIndex,
    };
  } else if (currentIndex === length + type - 1) {
    if (length === 2) {
      initialState = {
        nextIndex: type,
        previousIndex: type,
      };
    } else {
      initialState = {
        nextIndex: type,
        previousIndex: currentIndex - 1,
      };
    }
  } else if (currentIndex === type) {
    if (length === 2) {
      initialState = {
        nextIndex: type + 1,
        previousIndex: type + 1,
      };
    } else {
      initialState = {
        nextIndex: currentIndex + 1,
        previousIndex: length + type - 1,
        currentIndex,
      };
    }
  } else {
    initialState = {
      nextIndex: currentIndex + 1,
      previousIndex: currentIndex - 1,
    };
  }

  const goNext = () => {
    setCurrentIndex(initialState.nextIndex);
  };

  const goPrevious = () => {
    setCurrentIndex(initialState.previousIndex);
  };

  const getNextIndex = () => {
    return initialState.nextIndex;
  };

  const getPreviousIndex = () => {
    return initialState.previousIndex;
  };

  const goTo = (newIndex) => {
    setCurrentIndex(newIndex);
  };

  return {
    ...initialState,
    currentIndex,
    goNext,
    goPrevious,
    getNextIndex,
    getPreviousIndex,
    goTo,
  };
}
