import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDeleteVoterMutation, useGetVotersQuery } from "../api/votersApi";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import { useGetPanchayatNamesQuery } from "../api/panchayatsApi";

function DeleteVoterForm({ closeForm, voter, refetch }) {
  const { data, isLoading: isPanchayatLoading } = useGetPanchayatNamesQuery();
  const panchayats = data?.data;
  const [deleteVoter, result] = useDeleteVoterMutation();
  const handleDeleteVoter = async () => {
    await deleteVoter(voter);
    await refetch();
  };

  return (
    <>
      <Modal show={true} onHide={closeForm}>
        <Modal.Header closeButton>
          <Modal.Title>Do you really want to delete?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col className="border rounded-2 py-2">
                <Row>
                  <Col>
                    <h6>Preview</h6>
                  </Col>
                </Row>
                <Row>
                  <Col md={5}>Name: </Col>
                  <Col>{voter.name}</Col>
                </Row>
                <Row>
                  <Col md={5}>Father's Name: </Col>
                  <Col>{voter.father}</Col>
                </Row>
                <Row>
                  <Col md={5}>Age: </Col>
                  <Col>{voter.age}</Col>
                </Row>
                <Row>
                  <Col md={5}>Panchayat: </Col>
                  <Col>
                    {isPanchayatLoading && <Spinner variant="primary" />}
                    {voter.panchayat ? `[${voter.panchayat}]` : ""}{" "}
                    {panchayats?.find((p) => p.id === voter.panchayat)?.name}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {result.isUninitialized ? (
            <>
              <Button variant="secondary" onClick={closeForm}>
                Close
              </Button>
              <Button variant="danger" onClick={handleDeleteVoter}>
                Delete
              </Button>
            </>
          ) : result.isSuccess ? (
            <Alert variant="success">Voter has been deleted!</Alert>
          ) : (
            <Alert variant="danger">Something went wrong!</Alert>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteVoterForm;
