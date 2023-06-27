import { useRef } from "react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useGetVotersByPanchayatQuery } from "../api/votersApi";

const SearchBar = ({
  setKeyword,
  keyword,
  panchayat,
  setCurrentPage,
  useWrappedQuery,
}) => {
  useWrappedQuery({ panchayat, keyword });
  const searchBarRef = useRef(null);
  const handleSearch = () => {
    const keyword = searchBarRef?.current?.value;
    setCurrentPage(1);
    setKeyword(keyword);
  };

  return (
    <div className="d-flex">
      <Form.Control
        type="search"
        placeholder="Search"
        className="me-2"
        aria-label="Search"
        ref={searchBarRef}
      />
      <Button onClick={handleSearch} variant="outline-success">
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
