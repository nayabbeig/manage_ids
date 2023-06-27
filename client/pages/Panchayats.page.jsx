import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import NavBar from "../components/NavBar";
import { useGetPanchayatsQuery } from "../api/panchayatsApi";
import Loader from "../components/Loader";
import TablePagination from "../components/Pagination";
import { useGetVotersByPanchayatQuery } from "../api/votersApi";
import VoterId from "../components/VoterId";
import SearchBar from "../components/SearchBar";
import { useLayoutEffect } from "react";
import VotersTable from "../components/VotersTable";
import VotersForm from "../components/VotersForm";
import { QRScanner, closeCamera } from "../components/ScanAdhar";
import onScanSuccess from "../assets/audio/onScanSuccess.mp3";
import onScanError from "../assets/audio/onScanError.mp3";

const PanchayatsPage = () => {
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showVotersForm, setShowVotersForm] = useState(false);
  const { data, isLoading } = useGetPanchayatsQuery();
  const { data: panchayatsData } = data || {};

  const panchayats = panchayatsData?.map?.((panchayat, index) => ({
    id: panchayat.id,
    name: panchayat.attributes.name,
    pid: panchayat.attributes.pid,
    members: panchayat.attributes?.voters?.data?.length,
  }));

  const [selectedPanchayat, setSelectedPanchayat] = useState(null);

  useLayoutEffect(() => {
    setSelectedPanchayat(panchayats?.[0]?.id);
  }, [panchayats?.length]);

  const votersResponse = useGetVotersByPanchayatQuery({
    panchayat: selectedPanchayat,
    name: keyword,
    uid: keyword,
    page: currentPage,
  });

  const useWrappedQuery = ({ panchayat, keyword }) => {
    const {
      data: votersData,
      isLoading: isVotersLoading,
      refetch,
    } = useGetVotersByPanchayatQuery({
      panchayat,
      name: keyword,
      uid: keyword,
    });
  };

  const {
    data: votersData,
    isLoading: isVotersLoading,
    refetch,
    isFetching: isVotersFetching,
    status: votersLoadingStatus,
    ...rest
  } = votersResponse;

  const isVotersPending = votersLoadingStatus === "pending";

  const { data: votersList, meta } = votersData || {};

  const votersListFormatted = votersList?.map?.((voter, index) => ({
    id: voter.id,
    name: voter.attributes.name,
    father: voter.attributes.father,
    uid: voter.attributes.uid,
    age: voter.attributes.age,
    updatedAt: voter.attributes.updatedAt,
    panchayatName: voter.attributes?.panchayat?.data?.attributes?.name,
    panchayatId: voter.attributes?.panchayat?.data?.id,
    pid: voter?.attributes?.panchayat?.data?.attributes?.pid,
    address: voter.attributes.address,
  }));

  // const voters = [];
  // const PER_PAGE = 9;
  // for (let i = 0; i < votersList?.length; i = i + PER_PAGE) {
  //   const page = [];
  //   for (let j = 0; j < PER_PAGE; j++) {
  //     page.push(votersListFormatted[i + j]);
  //   }
  //   voters.push(page);
  // }

  const pagination = meta?.pagination;

  const shouldLoaderDisplay = isLoading || isVotersLoading || isVotersFetching;

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
      <Row className="no-print">
        <Col>
          <NavBar />
        </Col>
      </Row>

      {panchayats && (
        <div className="no-print">
          <Row className="my-2">
            <Col md={6}>
              {pagination && (
                <TablePagination
                  totalPages={pagination.pageCount}
                  currentPage={pagination.page}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </Col>
            <Col md={3}>
              <SearchBar
                setKeyword={setKeyword}
                keyword={keyword}
                panchayat={selectedPanchayat}
                setCurrentPage={setCurrentPage}
                useWrappedQuery={useWrappedQuery}
              />
            </Col>
            <Col className="d-flex justify-content-end">
              <Button onClick={() => setShowVotersForm(true)}>Add Voter</Button>
            </Col>
            <Col md={1} className="d-flex justify-content-end">
              {votersListFormatted && (
                <Button
                  onClick={() => window.print()}
                  variant="success"
                  className="px-3"
                >
                  Print
                </Button>
              )}
            </Col>
          </Row>
          <Row className="my-2">
            <Col>
              <div className="d-flex justify-content-center">
                {/* <PanchayatsTable panchayats={panchayats} />8
                 */}
                {panchayats?.map(({ id, name, members }) => (
                  <Button
                    size="sm"
                    className="m-1"
                    variant={selectedPanchayat === id ? "primary" : "secondary"}
                    onClick={() => setSelectedPanchayat(id)}
                  >
                    {name} <Badge bg="danger">{members}</Badge>
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      )}

      {isLoading && <Loader />}
      {votersListFormatted && (
        <VotersTable
          voters={votersListFormatted}
          refetch={refetch}
          isFetching={isVotersFetching}
          currentPage={currentPage}
          pageSize={meta?.pagination?.pageSize}
          panchayat={selectedPanchayat}
          panchayatName={
            panchayats?.find((p) => p?.id === selectedPanchayat)?.name
          }
          type="panchayat"
          zoom="80%"
        />
      )}

      {showVotersForm && (
        <VotersForm
          refetch={refetch}
          initialValuesJson={adharData}
          isFetching={isVotersFetching}
          closeForm={() => setShowVotersForm(false)}
          openScanner={openScanner}
          closeScanner={closeScanner}
          isScannerOpen={showScanner}
          panchayat={selectedPanchayat}
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

export default PanchayatsPage;
