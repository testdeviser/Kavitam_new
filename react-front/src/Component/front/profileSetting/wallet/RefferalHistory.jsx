
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaInstagram } from "react-icons/fa";
import axios from 'axios';
import Datatable from 'react-data-table-component';

function RefferalHistory(props) {

  const [data, setdata] = useState();
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const DataPerPage = useRef(5)

  const fetchReferral_data = () => {
    try {
      axios.get(`api/refferralCommission`).then(res => {
        setdata(res.data.payments);

      }).catch(err => {
        console.log(err);
      });

    } catch (err) {
      console.log();
    }
  }

  const columns = [
    {
      name: "Username",
      selector: (row) => row.referred_to_userid,
    },
    {
      name: "Amount",
      selector: (row) => row.total_amount
    },
    {
      name: "30% commission",
      selector: (row) => row.total_commision
    },
    // {
    //   name: "Action",
    //   cell: (row) => <button className='btn btn-primary' onClick={() => alert(row.id) }>Edit</button>
    // }
  ];

  useEffect(() => {
    fetchReferral_data();
  }, []);



  const lastIndex = currentPage * DataPerPage.current;
  const firstIndex = lastIndex - DataPerPage.current;
  const data1 = data ? data.slice(firstIndex, lastIndex) : [];

  return (
    <Datatable
      title="Referral"
      columns={columns}
      data={data}
      pagination
      fixedHeader
      fixedHeaderScrollHeight='400px'
      selectableRowsHighlight
      highlightOnHover
    />
  );
}
export default RefferalHistory;