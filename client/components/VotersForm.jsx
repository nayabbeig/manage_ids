import React, { useState, memo, useEffect, useRef } from "react";
import { Alert, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useGetPanchayatNamesQuery } from "../api/panchayatsApi";
import { Form as FinalForm, Field } from "react-final-form";
import { QrReader } from "react-qr-reader";
import {
  useCreateVoterMutation,
  useUpdateVoterMutation,
} from "../api/votersApi";
import QRGenerator from "./QRGenerator";
import moment from "moment";
import { getIdNumber } from "../utils/utls";
import VoterId from "./VoterId";
import { BsQrCodeScan } from "react-icons/bs";
import ScanAdhar from "./ScanAdhar";
import { ImageUpload } from "./HybridInput";

const VotersForm = ({
  closeForm,
  initialValuesJson,
  deleteForm,
  refetch,
  isFetching,
  openScanner,
  closeScanner,
  isScannerOpen,
  renderCameraSelector,
  panchayat,
}) => {
  const { data, isLoading } = useGetPanchayatNamesQuery();
  const initialValues = initialValuesJson && JSON.parse(initialValuesJson);
  const panchayats = data?.data;
  const [createVoter, createResults, ...rest] = useCreateVoterMutation();
  const [updateVoter, updateResults] = useUpdateVoterMutation();
  const [showForm, setShowForm] = useState(true);
  const [lastSubmittedData, setLastSubmittedData] = useState(null);

  console.log("intialValues", initialValues);

  useEffect(() => {
    if (createResults.isSuccess || updateResults.isSuccess) {
      setShowForm(false);
      refetch();
    }
  }, [createResults.isSuccess, updateResults.isSuccess]);

  const handleClose = () => {
    closeForm();
    closeScanner?.();
  };

  const modalTitle = "Add New Voter";

  const onSubmit = async (values) => {
    console.log("values", values);
    const res =
      initialValues && !openScanner
        ? await updateVoter({ data: { ...values }, id: initialValues.id })
        : await createVoter({ data: values });

    if (res?.error) {
      const errors = res.error?.response?.data?.error?.details?.errors;
      if (errors?.length) {
        const errorObject = {};
        errors.map((err) => {
          errorObject[err.path[0]] = err.message;
        });
        return errorObject;
      }
    }
    if (res.data.data) {
      console.log("result", res.data.data);
      setLastSubmittedData({
        panchayat: values.panchayat,
        photo: values.photo,
        pid: panchayats.find((p) => String(p.id) === String(values.panchayat))
          ?.pid,
        id: res.data.data.id,
        ...res.data.data.attributes,
      });
    }
  };
  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Required";
    }
    if (!values.uid) {
      errors.uid = "Required";
    }
    if (!values.father) {
      errors.father = "Required";
    }
    if (!values.age) {
      errors.age = "Required";
    } else if (values.age < 18) {
      errors.age = "Age must be 18 or above";
    }

    if (!values.panchayat) {
      errors.panchayat = "Required";
    }

    if (!values.address) {
      errors.address = "Required";
    }
    return errors;
  };

  const capitalize = (value) => {
    return value
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const [showImageUpload, setShowImageUpload] = useState(false);
  const imageInputRef = useRef(null);

  console.log("imageinputref", imageInputRef);

  return (
    <>
      <Modal show={true} onHide={handleClose} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
          {openScanner && (
            <>
              <Button
                className="mx-3"
                onClick={() => {
                  if (isScannerOpen) {
                    return closeScanner();
                  }
                  return openScanner();
                }}
              >
                <BsQrCodeScan size={30} />
              </Button>
            </>
          )}
          {createResults.isSuccess && (
            <Alert className="m-0 mx-2 p-1 px-2" variant="success">
              Voter has been created!
            </Alert>
          )}
        </Modal.Header>
        {showForm && (
          <FinalForm
            onSubmit={onSubmit}
            validate={validate}
            initialValues={initialValues || (panchayat && { panchayat })}
            render={({
              handleSubmit,
              reset,
              form,
              submitting,
              pristine,
              dirty,
              values,
              errors,
              submitErrors,
              submitFailed,
              ...others
            }) => {
              if (createResults.isSuccess) form.reset();
              return (
                <>
                  <Modal.Body>
                    <Row>
                      <Col>
                        <Form onSubmit={handleSubmit}>
                          <Row>
                            <Col>
                              <Field
                                name="name"
                                validate={(value) => !value && "Required"}
                                parse={capitalize}
                                format={capitalize}
                              >
                                {({ input, meta }) => (
                                  <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                      {...input}
                                      autoFocus={true}
                                      type="text"
                                      placeholder="Enter name"
                                      isInvalid={
                                        (meta.dirty || submitFailed) &&
                                        meta.error
                                      }
                                      isValid={meta.dirty && !meta.error}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {meta.error}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                )}
                              </Field>
                            </Col>
                            <Col>
                              <Field
                                name="uid"
                                validate={(value) => !value && "Required"}
                              >
                                {({ input, meta }) => (
                                  <Form.Group className="mb-3" controlId="uid">
                                    <Form.Label>UID</Form.Label>
                                    <Form.Control
                                      {...input}
                                      type="text"
                                      placeholder="Enter Aadhaar No."
                                      isInvalid={
                                        ((meta.dirty || submitFailed) &&
                                          meta.error) ||
                                        submitErrors?.uid
                                      }
                                      isValid={
                                        meta.dirty &&
                                        !meta.error &&
                                        !submitErrors?.uid
                                      }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {meta.error ||
                                        submitErrors?.uid +
                                          ". This UID is already in use"}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                )}
                              </Field>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Field
                                name="father"
                                parse={capitalize}
                                format={capitalize}
                              >
                                {({ input, meta }) => (
                                  <Form.Group
                                    className="mb-3"
                                    controlId="father"
                                    parse={capitalize}
                                    format={capitalize}
                                  >
                                    <Form.Label>Father's Name</Form.Label>
                                    <Form.Control
                                      {...input}
                                      type="text"
                                      placeholder="Enter Father's Name"
                                      isInvalid={
                                        (meta.dirty || submitFailed) &&
                                        meta.error
                                      }
                                      isValid={meta.dirty && !meta.error}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {meta.error}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                )}
                              </Field>
                            </Col>
                            <Col>
                              <Field name="age">
                                {({ input, meta }) => (
                                  <Form.Group className="mb-3" controlId="age">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control
                                      {...input}
                                      type="number"
                                      placeholder="Enter Age"
                                      isInvalid={
                                        (meta.dirty || submitFailed) &&
                                        meta.error
                                      }
                                      isValid={meta.dirty && !meta.error}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {meta.error}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                )}
                              </Field>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Field name="panchayat">
                                {({ input, meta }) => (
                                  <Form.Group
                                    className="mb-3"
                                    controlId="panchayat"
                                  >
                                    <Form.Label>Panchayat</Form.Label>
                                    <div key="inline-radio" className="mb-3">
                                      {panchayats?.map?.(({ name, id }) => (
                                        <Form.Check
                                          {...input}
                                          type="radio"
                                          label={name}
                                          id={id}
                                          value={id}
                                          name="panchayat"
                                          isInvalid={
                                            (meta.dirty || submitFailed) &&
                                            meta.error
                                          }
                                          isValid={
                                            meta.dirty &&
                                            !meta.error &&
                                            input.value === String(id)
                                          }
                                          checked={
                                            String(input.value) === String(id)
                                          }
                                          disabled={panchayat}
                                        />
                                      ))}
                                      {isLoading && (
                                        <Spinner variant="primary" />
                                      )}
                                    </div>
                                    <Form.Control.Feedback type="invalid">
                                      {meta.error}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                )}
                              </Field>
                            </Col>
                            <Col>
                              <Field
                                name="photo"
                                // parse={capitalize}
                                // format={capitalize}
                              >
                                {({ input, meta }) => (
                                  <Form.Group
                                    className="mb-3"
                                    controlId="address"
                                  >
                                    <Form.Label>Photo</Form.Label>

                                    <ImageUpload
                                      disableGallery
                                      close={setShowImageUpload}
                                      formInput={input}
                                      meta={meta}
                                      defaultImage={initialValues?.defaultImage}
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                            </Col>
                          </Row>

                          <Field
                            name="address"
                            parse={capitalize}
                            format={capitalize}
                          >
                            {({ input, meta }) => (
                              <Form.Group className="mb-3" controlId="address">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                  {...input}
                                  type="text"
                                  placeholder="Enter Address"
                                  isInvalid={
                                    (meta.dirty || submitFailed) && meta.error
                                  }
                                  isValid={meta.dirty && !meta.error}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {meta.error}
                                </Form.Control.Feedback>
                              </Form.Group>
                            )}
                          </Field>
                        </Form>
                      </Col>
                    </Row>
                  </Modal.Body>
                  {
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isLoading || submitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => form.submit()}
                        disabled={isLoading || submitting}
                      >
                        Save
                      </Button>
                      {/* {createResults.isSuccess && (
                    <Button variant="success" onClick={() => reset()}>
                      Add One More
                    </Button>
                  )} */}
                    </Modal.Footer>
                  }
                </>
              );
            }}
          />
        )}

        {!showForm && (
          <>
            <Modal.Body>
              <Container>
                <Row>
                  <Col>
                    <h6>Preview</h6>
                  </Col>
                </Row>
                <Row>
                  <VoterId voter={lastSubmittedData} />
                </Row>
              </Container>
            </Modal.Body>
            {/* <Modal.Footer>
              <Button variant="secondary" onClick={() => {}}>
                Print
              </Button>
              <Button variant="primary" onClick={() => setShowForm(true)}>
                Add New
              </Button>
            </Modal.Footer> */}
          </>
        )}
      </Modal>
    </>
  );
};

export default VotersForm;
