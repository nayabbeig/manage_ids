import Pagination from "react-bootstrap/Pagination";

function TablePagination({ totalPages, currentPage, setCurrentPage }) {
  return (
    <>
      {currentPage > 6 && !(currentPage > totalPages - 6) && (
        <Pagination className="m-0">
          <Pagination.First onClick={() => setCurrentPage(1)} />
          <Pagination.Prev
            onClick={() =>
              currentPage - 1 > 0 && setCurrentPage(currentPage - 1)
            }
          />
          <Pagination.Ellipsis />

          <Pagination.Item onClick={() => setCurrentPage(currentPage - 2)}>
            {currentPage - 2}
          </Pagination.Item>
          <Pagination.Item onClick={() => setCurrentPage(currentPage - 1)}>
            {currentPage - 1}
          </Pagination.Item>
          <Pagination.Item active onClick={() => setCurrentPage(currentPage)}>
            {currentPage}
          </Pagination.Item>
          <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>
            {currentPage + 1}
          </Pagination.Item>
          <Pagination.Item onClick={() => setCurrentPage(currentPage + 2)}>
            {currentPage + 2}
          </Pagination.Item>

          <Pagination.Ellipsis />
          <Pagination.Next
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
          />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
        </Pagination>
      )}
      {currentPage < 7 && (
        <Pagination className="m-0">
          <Pagination.First onClick={() => setCurrentPage(1)} />
          <Pagination.Prev
            onClick={() =>
              currentPage - 1 > 0 && setCurrentPage(currentPage - 1)
            }
          />
          {new Array(Math.min(totalPages, 6)).fill("_").map((_, index) => (
            <Pagination.Item
              onClick={() => setCurrentPage(index + 1)}
              active={currentPage === index + 1}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          {totalPages > 8 && <Pagination.Ellipsis />}
          <Pagination.Next
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
          />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
        </Pagination>
      )}
      {currentPage > totalPages - 6 && currentPage > 8 && (
        <Pagination className="m-0">
          <Pagination.First onClick={() => setCurrentPage(1)} />
          <Pagination.Prev
            onClick={() =>
              currentPage - 1 > 0 && setCurrentPage(currentPage - 1)
            }
          />
          <Pagination.Ellipsis />
          {new Array(Math.min(6))
            .fill("_")
            .map((_, i) => i)
            .reverse()
            .map((i) => (
              <Pagination.Item
                onClick={() => setCurrentPage(totalPages - i)}
                active={currentPage === totalPages - i}
              >
                {totalPages - i}
              </Pagination.Item>
            ))}
          <Pagination.Next
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
          />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
        </Pagination>
      )}
    </>
  );
}

export default TablePagination;
