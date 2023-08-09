import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
import Pagination from '../pagination/pagination';

function Outer(props) {
  const [data, setdata] = useState();
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const DataPerPage = useRef(3)
  const fetch = async () => {
    try {
      const data = await axios.get(`api/admin/outer/fetch`).then(res => {
        setdata(res.data.outer);
      });

    } catch (err) {
      console.log(err);
    }
  }

  const lastIndex = currentPage * DataPerPage.current;
  const firstIndex = lastIndex - DataPerPage.current;
  const data1 = data ? data.slice(firstIndex, lastIndex) : [];

  useEffect(() => {
    fetch();
  }, []);

  const Deleteouter = async (e, id) => {

    var target = e.currentTarget;
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/admin/outer/delete/${id}`).then(res => {
          if (res.data.status == 200) {
            Swal.fire(
              'Removed!',
              'Your Number has been Removed.',
              'success'
            )
            target.closest('tr').remove();
          }
        })
      }
    })
  }

  return (
    <div style={{ marginLeft: "40px", width: "80vw", margin: "10px auto" }}>
      <h3
        style={{
          textDecoration: "underline",
          textDecorationStyle: "double",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Outer Numbers
      </h3>
      <table className="table bordered table-striped  table-hover mt-4">
        <thead className="thead-dark text-center">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">User Name</th>
            <th>Event</th>
            <th scope="col">Number</th>
            <th scope="col">Prize</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle text-center">
          {data1?.map((outer, i) => {
            var event_date = new Date(outer.event.event_date);
            return (
              <tr key={i}>
                <td>{outer.id}</td>
                <td>{outer.user && outer.user.name}</td>
                <td>{event_date.toLocaleString()}</td>
                <td>{outer.number}</td>
                <td>{outer.price}</td>
                <td>
                  <Link to="#" className='btn btn-danger' style={{ marginLeft: '4px' }} onClick={(e) => Deleteouter(e, outer.id)}>{<FaTrashAlt />}</Link>
                </td>
              </tr>
            )
          }

          )}
        </tbody>
      </table>
      <Pagination
        totalPosts={data ? data.length : 0}
        DataPerPage={DataPerPage.current}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
}

export default Outer;