import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import Pagination from '../pagination/pagination';
import Datatable from 'react-data-table-component';


function Wallet(props) {

  // const [wallet,setwallet]=useState();
  // const wallet=useRef(null);
  const [wallet, setwallet] = useState();
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const DataPerPage = useRef(8)

  const fetchWallet = () => {
    try {
      axios.get('api/admin/wallet/list').then(res => {
        // console.log(res.data.user);
        // setwallet(res.data.user);

        const roundedData = res.data.user.map(item => ({
          ...item,
          ammount: Number(item.ammount).toFixed(2)
        }));
        setwallet(roundedData);
      });

    } catch (err) {
      console.log(err);
    }
  }

  const columns = [
    {
      name: "Username",
      selector: (row) => row.user.name,
    },
    {
      name: "Amount",
      selector: (row) => row.ammount
    },
    // {
    //   name: "Action",
    //   cell: (row) => <button className='btn btn-primary' onClick={() => alert(row.id) }>Edit</button>
    // }
  ];


  useEffect(() => {
    fetchWallet();
    console.log('rendering wallet component');
  }, []);

  // const lastIndex = currentPage * DataPerPage.current;
  // const firstIndex = lastIndex - DataPerPage.current;
  // const data1 = wallet ? wallet.slice(firstIndex, lastIndex) : [];


  return (
    <div className="backend_payments" style={{ marginLeft: "40px", margin: "0px auto" }}>


      <Datatable
        title="Wallet"
        columns={columns}
        data={wallet}
        pagination
        fixedHeader
        fixedHeaderScrollHeight='400px'
        //selectableRows
        selectableRowsHighlight
        highlightOnHover
      //actions={<button className='btn btn-sm btn-info'>Export</button>}
      />

      {/* <div style={{ marginLeft: "40px", width: "80vw", margin: "10px auto" }}>
        <h3
          style={{
            textDecoration: "underline",
            textDecorationStyle: "double",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Wallet
        </h3>
        <table className="table bordered table-striped  table-hover mt-4">
          <thead className="thead-dark text-center">
            <tr>
              <th scope="col">User Name</th>
              <th scope="col">Ammount</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle text-center">
            {data1?.map((wallet, i) =>
              <tr key={i}>
                <td>{wallet.user.name}</td>
                <td>Rs.{wallet.ammount}</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          totalPosts={wallet ? wallet.length : 0}
          DataPerPage={DataPerPage.current}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div> */}
    </div>


  );
}

export default Wallet;