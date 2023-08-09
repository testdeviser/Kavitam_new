import React, { useState, useEffect } from 'react';

function Pagination({
    totalPosts,
    DataPerPage,
    setCurrentPage,
    currentPage,
}) {

    function previous() {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    }
    function jumpTo(page) {
        setCurrentPage(page);
    }
    function nextpage() {
        if (currentPage !== pages.length) {
            setCurrentPage(currentPage + 1);
        }
    }

    let pages = [];

    for (let i = 1; i <= Math.ceil(totalPosts / DataPerPage); i++) {
        pages.push(i);
    }
    return (
        <div className='global_pagination define_float'>
            <nav aria-label="Page navigation example">
                <ul className="pagination">

                    <li className="page-item"><a className="page-link" href="#" onClick={previous}>Previous</a></li>
                    {pages.map((page, index) => {
                        return (
                            <li key={index} className={page == currentPage ? "page-item active" : "page-item"}><a className="page-link" href="#" onClick={() => jumpTo(page)}>{page}</a></li>
                        );
                    })}

                    <li className="page-item"><a className="page-link" href="#" onClick={nextpage}>Next</a></li>
                </ul>
            </nav>
        </div>
    );



}

export default Pagination;