import { Col, Row } from "react-bootstrap";
import QRGenerator from "./QRGenerator";
import { getIdNumber } from "../utils/utls";
import moment from "moment";
import { useGetPanchayatNamesQuery } from "../api/panchayatsApi";

import electionInchargeSignature from "../assets/images/signature.png";
import AECLogo from "../assets/images/aecLogo.png";
import path from "../features/router/paths";

const VoterId = ({ voter }) => {
  console.log("voter", voter);
  const { data, isLoading } = useGetPanchayatNamesQuery();
  const panchayats = data?.data;
  const photoUrl = voter?.photo?.data?.attributes?.url;
  const { photo, ...qrData } = voter;
  const getFormattedDate = (dateString) =>
    moment(new Date(dateString)).format("DD-MMM-YYYY");
  return (
    <Col
      xs={4}
      className="border rounded-2 p-0 d-flex justify-content-center m-2 voterId"
      style={{ width: "360px", height: "500px", zoom: "70%" }}
    >
      <div>
        <Row className="my-3">
          <Col className="text-center d-flex justify-content-center align-items-center p-0">
            <img src={AECLogo} width="30px" height="30px" alt="logo" />
            <p
              className="m-0 mx-2"
              style={{ fontSize: "14px", fontWeight: "700" }}
            >
              Anjuman Islamia Election Committee Gumla
            </p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <div
              style={{ width: "120px", height: "150px", overflow: "hidden" }}
              className="border d-flex justify-content-center align-items-center"
            >
              {photoUrl ? (
                <img
                  height="100%"
                  width="auto"
                  src={path.hostOnly + photoUrl}
                  alt="Photo"
                />
              ) : (
                "Photo"
              )}
            </div>
          </Col>
          <Col>
            <QRGenerator
              value={JSON.stringify({
                ...qrData,
                IDN: getIdNumber(voter),
              })}
            />
            <h6 className="my-2">{getIdNumber(voter)}</h6>
          </Col>
        </Row>
        <Row className="voterIdRow">
          <Col xs={5}>Name: </Col>
          <Col>{voter.name}</Col>
        </Row>
        <Row className="voterIdRow">
          <Col xs={5}>UID: </Col>
          <Col>{voter.uid}</Col>
        </Row>
        <Row className="voterIdRow">
          <Col xs={5}>Father's Name: </Col>
          <Col>{voter.father}</Col>
        </Row>
        <Row className="voterIdRow">
          <Col xs={5}>Age: </Col>
          <Col>{voter.age}</Col>
        </Row>
        <Row className="voterIdRow">
          <Col xs={5}>Panchayat: </Col>
          <Col>
            {voter.panchayatName ||
              panchayats?.find((p) => String(p.id) === String(voter.panchayat))
                ?.name}
          </Col>
        </Row>
        <Row className="voterIdRow">
          <Col xs={5}>Address: </Col>
          <Col>{voter.address || "N/A"}</Col>
        </Row>

        <Row className="voterIdRow">
          <Col xs={5}>Issued On: </Col>
          <Col>{voter?.updatedAt && getFormattedDate(voter.updatedAt)}</Col>
        </Row>

        <Row className="my-3 voterIdRow">
          <Col className="">Election Incharge:</Col>
          <Col>
            <img src={electionInchargeSignature} width="80px" alt="sign" />
            <div>Md. Irfan Ali</div>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default VoterId;
