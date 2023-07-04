import React from "react";
import { Col, Row } from "react-bootstrap";

const PanchayatsTableRow = ({ index, PId, name, members }) => {
  return (
    <Row>
      <Col className="border py-1 tableRow" md={1}>
        {index + 1}
      </Col>
      <Col className="border py-1 tableRow" md={2}>
        {PId}
      </Col>
      <Col className="border py-1 tableRow" md={6}>
        {name}
      </Col>
      <Col className="border py-1 tableRow" md={3}>
        {members}
      </Col>
    </Row>
  );
};

const PanchayatsTable = ({ panchayats }) => {
  return (
    <div className="p-3">
      <Row>
        <Col className="border py-1 tableHeader" md={1}>
          Sn
        </Col>
        <Col className="border py-1 tableHeader" md={2}>
          PId
        </Col>
        <Col className="border py-1 tableHeader" md={6}>
          Name
        </Col>
        <Col className="border py-1 tableHeader" md={3}>
          Members
        </Col>
      </Row>
      {panchayats.map((voter, index) => (
        <PanchayatsTableRow {...voter} index={index} />
      ))}
    </div>
  );
};

export default PanchayatsTable;
