import React from "react";
import { Pagination } from "react-bootstrap";

function ProductsPagination({ numberOfPages, activePage, setActivePage }) {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= numberOfPages) {
      setActivePage(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const pageNeighbors = 2;

    const startPage = Math.max(2, activePage - pageNeighbors);
    const endPage = Math.min(numberOfPages - 1, activePage + pageNeighbors);

    items.push(
      <Pagination.Item
        key={1}
        active={1 === activePage}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>,
    );

    if (startPage > 2) {
      items.push(<Pagination.Ellipsis key="start-ellipsis" />);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === activePage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>,
      );
    }

    if (endPage < numberOfPages - 1) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" />);
    }

    items.push(
      <Pagination.Item
        key={numberOfPages}
        active={numberOfPages === activePage}
        onClick={() => handlePageChange(numberOfPages)}
      >
        {numberOfPages}
      </Pagination.Item>,
    );

    return items;
  };

  return (
    <Pagination dir="ltr" className="db-pagination justify-content-center my-4">
      <Pagination.First
        onClick={() => handlePageChange(1)}
        disabled={activePage === 1}
      />
      <Pagination.Prev
        onClick={() => handlePageChange(activePage - 1)}
        disabled={activePage === 1}
      />
      {renderPaginationItems()}
      <Pagination.Next
        onClick={() => handlePageChange(activePage + 1)}
        disabled={activePage === numberOfPages}
      />
      <Pagination.Last
        onClick={() => handlePageChange(numberOfPages)}
        disabled={activePage === numberOfPages}
      />
    </Pagination>
  );
}

export default ProductsPagination;
