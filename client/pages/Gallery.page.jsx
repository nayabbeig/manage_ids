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
import GalleryPage from "../components/GalleryPage";

const ImageGalleryPage = () => {
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
    pageSize: 9,
  });

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
    pid: voter?.attributes?.panchayat?.data?.attributes?.pid,
    id: voter?.id,
    uid: voter?.uid,
    ...voter.attributes,
    panchayat: voter?.attributes?.panchayat?.data?.id,
    panchayatName: voter?.attributes?.panchayat?.data?.attributes?.name,
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

  return (
    <Container fluid className="px-2">
      <Row className="no-print">
        <Col>
          <NavBar />
        </Col>
      </Row>

      <GalleryPage />
    </Container>
  );
};

export default ImageGalleryPage;
