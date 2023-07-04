import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import VotersForm from "./VotersForm";
import DeleteVoterForm from "./deleteVoterModal";
import { getIdNumber } from "../utils/utls";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import path from "../features/router/paths";

const VotersTableRow = ({
  index,
  id,
  name,
  father,
  age,
  panchayatName,
  uid,
  panchayatId,
  pid,
  photo,
  address,
  updatedAt,
  setVoterToBeUpdated,
  setVoterToBeDeleted,
  currentPage,
  pageSize,
  type,
}) => {
  return (
    <Row>
      <Col className="border py-1 tableRow text-end" xs={1}>
        {(currentPage - 1) * pageSize + index + 1}
      </Col>
      <Col className="border py-1 tableRow" xs={2}>
        {name}
      </Col>
      <Col className="border py-1 tableRow" xs={2}>
        {father}
      </Col>
      <Col className="border py-1 tableRow" xs={type !== "panchayat" ? 1 : 2}>
        {getIdNumber({ updatedAt, pid, id })}
      </Col>
      <Col className="border py-1 tableRow" xs={1}>
        {age}
      </Col>
      {type !== "panchayat" && (
        <Col className="border py-1 tableRow" xs={2}>
          {panchayatName}
        </Col>
      )}
      <Col className="border py-1 tableRow " xs={type !== "panchayat" ? 2 : 3}>
        {address}
      </Col>

      <Col
        className="border py-1 tableRow d-flex justify-content-between"
        xs={1}
      >
        <Button
          size="sm"
          className="p-0 px-1 no-print"
          variant="info"
          onClick={() =>
            setVoterToBeUpdated({
              id,
              name,
              father,
              age,
              uid,
              panchayat: panchayatId,
              address,
              photo: photo?.data?.id,
              defaultImage: {
                url: photo?.data?.attributes?.url,
                id: photo?.data?.id,
              },
            })
          }
        >
          <BsFillPencilFill />
        </Button>
        <Button
          size="sm"
          className="p-0 px-1 no-print"
          variant="danger"
          onClick={() =>
            setVoterToBeDeleted({
              id,
              name,
              father,
              age,
              panchayat: panchayatId,
            })
          }
        >
          <BsFillTrashFill />
        </Button>
      </Col>
    </Row>
  );
};

const VotersTable = ({
  voters,
  currentPage,
  pageSize,
  refetch,
  isFetching,
  panchayat,
  zoom,
  type,
  panchayatName,
}) => {
  const [voterToBeUpdated, setVoterToBeUpdated] = useState(null);
  const [voterToBeDeleted, setVoterToBeDeleted] = useState(null);

  return (
    <div className="p-3" style={{ zoom: zoom || "100%" }}>
      {type === "panchayat" && (
        <Row>
          <h2 className="px-0 mb-3 text-center">
            Anjuman Islamia Gumla, Election - {new Date().getFullYear()}{" "}
            {"(" + panchayatName + ")"}
          </h2>
        </Row>
      )}
      <Row>
        <Col className="border py-1 tableHeader text-end" xs={1}>
          Sn
        </Col>
        <Col className="border py-1 tableHeader" xs={2}>
          Name
        </Col>
        <Col className="border py-1 tableHeader" xs={2}>
          Father's Name
        </Col>
        <Col
          className="border py-1 tableHeader"
          xs={type !== "panchayat" ? 1 : 2}
        >
          Id
        </Col>
        <Col className="border py-1 tableHeader" xs={1}>
          Age
        </Col>
        {type !== "panchayat" && (
          <Col className="border py-1 tableHeader" xs={2}>
            Panchayat
          </Col>
        )}
        <Col
          className="border py-1 tableHeader"
          xs={type !== "panchayat" ? 2 : 3}
        >
          Address
        </Col>
        <Col className="border py-1 tableHeader" xs={1}></Col>
      </Row>
      {voters.map((voter, index) => (
        <VotersTableRow
          {...voter}
          index={index}
          setVoterToBeUpdated={setVoterToBeUpdated}
          setVoterToBeDeleted={setVoterToBeDeleted}
          currentPage={currentPage}
          pageSize={pageSize}
          type={type}
        />
      ))}

      {voterToBeUpdated && (
        <VotersForm
          initialValuesJson={JSON.stringify(voterToBeUpdated)}
          refetch={refetch}
          isFetching={isFetching}
          panchayat={panchayat}
          closeForm={() => setVoterToBeUpdated(null)}
        />
      )}

      {voterToBeDeleted && (
        <DeleteVoterForm
          voter={voterToBeDeleted}
          closeForm={() => setVoterToBeDeleted(null)}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default VotersTable;
