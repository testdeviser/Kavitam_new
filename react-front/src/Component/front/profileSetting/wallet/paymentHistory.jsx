import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Datatable from 'react-data-table-component';

function PaymentHistory(props) {

  const [data, setdata] = useState();
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const DataPerPage = useRef(5)

  const transactionHistory = async () => {
    try {
      const res = await axios.get('/api/transactionHistory');
      if (res.data.status === 200) {
        setdata(res.data.transaction);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "Payment Mode",
      selector: (row) => row.payment_mode,
    },
    {
      name: "Price",
      selector: (row) => row.price
    },
    {
      name: "Status",
      cell: (row) => {
        if (row.status === 'Cr') {
          return 'Credits';
        } else if (row.status === 'Dr') {
          return 'Debits';
        } else if (row.status === 'Dr-Pending') {
          return 'Debits-Pending';
        } else {
          return 'Unknown Status';
        }
      },
    },
    // {
    //   name: "Status",
    //   cell: (row) => {
    //     return row.status === 'Cr' ? 'Credits' : 'Debits';
    //   },
    // },
  ];

  useEffect(() => {
    transactionHistory();
  }, []);

  const lastIndex = currentPage * DataPerPage.current;
  const firstIndex = lastIndex - DataPerPage.current;
  const data1 = data ? data.slice(firstIndex, lastIndex) : [];

  return (
    <Datatable
      columns={columns}
      data={data}
      pagination
      fixedHeader
      fixedHeaderScrollHeight='400px'
      //selectableRows
      selectableRowsHighlight
      highlightOnHover
    />
    // <div className='Wallettable' style={{ 'width': '770px' }}>
    //   <table className="table bordered table-striped  table-hover mt-5">
    //     <thead className="thead-dark text-center">
    //       <tr>
    //         <th scope="col">Event </th>
    //         <th scope="col">Price</th>
    //         <th scope="col">Status</th>
    //       </tr>
    //     </thead>
    //     <tbody className="text-center align-middle text-center">
    //       {data.paymentHistory?.map((p, i) => {
    //         let statusText;
    //         if (p.status === "Cr") {
    //           statusText = "Credits";
    //         } else if (p.status === "Dr") {
    //           statusText = "Debits";
    //         } else {
    //           statusText = ""; // You can provide a default value here or handle other cases
    //         }
    //         return (
    //           <tr key={i}>
    //             <td>{p.eventId}</td>
    //             <td>{p.price}</td>
    //             <td>{statusText}</td>
    //           </tr>
    //         );
    //       })
    //       }
    //     </tbody>
    //   </table>
    // </div>
  );
}
export default PaymentHistory;