"use client";

import React from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number; 
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalPages, 
  currentPage,
  onPageChange,
}) => {
  if (totalPages <= 1) return null; 

  return (
    <ReactPaginate
      pageCount={totalPages} 
      forcePage={currentPage - 1} 
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={(data) => onPageChange(data.selected + 1)}
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.pageItem}
      nextClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextLinkClassName={css.pageLink}
      activeClassName={css.active}
    />
  );
};