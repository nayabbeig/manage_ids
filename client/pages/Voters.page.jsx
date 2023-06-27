import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import NavBar from "../components/NavBar";
import { useGetVotersQuery } from "../api/votersApi";
import Loader from "../components/Loader";
import VotersTable from "../components/VotersTable";
import TablePagination from "../components/Pagination";
import VotersForm, { Test } from "../components/VotersForm";
import ScanAdhar, { QRScanner, closeCamera } from "../components/ScanAdhar";
import onScanSuccess from "../assets/audio/onScanSuccess.mp3";
import onScanError from "../assets/audio/onScanError.mp3";
import { useEffect } from "react";
import { ImageUpload } from "../components/HybridInput";

const VotersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, refetch, isFetching, ...rest } = useGetVotersQuery({
    page: currentPage,
  });
  const [showVotersForm, setShowVotersForm] = useState(false);

  const { data: votersData, meta } = data || {};
  const voters = votersData?.map?.((voter, index) => ({
    id: voter.id,
    name: voter.attributes.name,
    father: voter.attributes.father,
    uid: voter.attributes.uid,
    age: voter.attributes.age,
    updatedAt: voter.attributes.updatedAt,
    panchayatName: voter.attributes?.panchayat?.data?.attributes?.name,
    panchayatId: voter.attributes?.panchayat?.data?.id,
    pid: voter?.attributes?.panchayat?.data?.attributes?.pid,
    photo: voter?.attributes?.photo,
    address: voter.attributes.address,
  }));

  const pagination = meta?.pagination;

  const [showScanner, setShowScanner] = useState(false);
  const [adharData, setAdharData] = useState();

  const getAgeFromYob = (yob) =>
    new Date().getFullYear() - new Date(yob).getFullYear();

  const closeScanner = () => {
    closeCamera();
    setShowScanner(false);
  };

  const openScanner = () => {
    setShowScanner(true);
  };

  // useEffect(() => {
  //   const handleKeyPress = (e) => {
  //     if (e.key === "s") openScanner();
  //   };
  //   window.addEventListener("keypress", handleKeyPress);

  //   return () => window.addEventListener("keypress", handleKeyPress);
  // }, []);

  const handleAdharData = (data) => {
    if (!data) return;
    if (data === "{}") {
      const errorAudio = new Audio(onScanError);
      errorAudio.play();
    } else {
      const audioSuccess = new Audio(onScanSuccess);
      audioSuccess.play();
      closeScanner();
    }
    const adharObject = JSON.parse(data);
    const {
      uid,
      name,
      gender,
      yob,
      co: father,
      loc: address,
      vtc,
      po,
      dist,
      state,
      pc: pincode,
    } = adharObject;

    const voter = {
      name,
      uid,
      father,
      age: getAgeFromYob(yob),
      address,
    };

    setAdharData(JSON.stringify(voter));
  };

  return (
    <Container fluid className="px-2">
      <NavBar />
      {/* <Test /> */}
      <Row className="mt-2">
        <Col>
          <h2>Voters</h2>
        </Col>
        <Col>
          {/* <div
            style={{
              border: "2px solid black",
              height: "100px",
              width: "300px",
            }}
          >
            <ImageUpload />
          </div> */}
        </Col>
        <Col>
          {pagination && voters && (
            <TablePagination
              totalPages={pagination.pageCount}
              currentPage={pagination.page}
              setCurrentPage={setCurrentPage}
            />
          )}
        </Col>
        <Col className="d-flex justify-content-end">
          <Button onClick={() => setShowVotersForm(true)}>Add Voter</Button>
        </Col>
      </Row>
      {isLoading && <Loader />}
      {voters && (
        <VotersTable
          voters={voters}
          refetch={refetch}
          isFetching={isFetching}
          currentPage={currentPage}
          pageSize={meta?.pagination?.pageSize}
          zoom="80%"
        />
      )}

      {showVotersForm && (
        <VotersForm
          refetch={refetch}
          initialValuesJson={adharData}
          isFetching={isFetching}
          closeForm={() => setShowVotersForm(false)}
          openScanner={openScanner}
          closeScanner={closeScanner}
          isScannerOpen={showScanner}
        />
      )}

      {showScanner && (
        <div
          style={{
            position: "fixed",
            top: "100",
            right: "10px",
            bottom: "300px",
            zIndex: 10000,
            width: "280px",
            padding: "10px",
            background: "white",
          }}
        >
          {/* <ScanAdhar
            showScanner={showScanner}
            setShowScanner={setShowScanner}
            setData={handleAdharData}
          /> */}
          <QRScanner closeScanner={closeScanner} setData={handleAdharData} />
        </div>
      )}
    </Container>
  );
};

export default VotersPage;
