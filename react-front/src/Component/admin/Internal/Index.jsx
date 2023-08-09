import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, } from "react-icons/fa";
import Swal from 'sweetalert2';
import Pagination from '../pagination/pagination';

function Internal(props) {
  const [data, setdata] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  // const DataPerPage=useRef(10)
  const DataPerPage = useRef(3);

  const fetchInternal = async () => {
    try {
      const data = await axios.get(`api/admin/internal/fetch`).then(res => {
        //console.log("fdjfgdh");
        // console.log(res.data)
        setdata(res.data.inner);
      });

    } catch (err) {
      console.log(err);
    }
  }

  // const fetchInternal=async()=>{
  //   try{
  //        const getdata=axios.get(`/api/admin/internal/fetch`);
  //        setdata((await getdata).data.inner);

  //   }catch(err)
  //   {      
  //       console.log(err);
  //   }

  // }

  const DeleteInner = async (e, id) => {

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
        axios.delete(`/api/admin/internal/delete/${id}`).then(res => {
          console.log(res);
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

  const lastIndex = currentPage * DataPerPage.current;
  const firstIndex = lastIndex - DataPerPage.current;
  const data1 = data ? data.slice(firstIndex, lastIndex) : [];

  useEffect(() => {
    fetchInternal();
  }, []);

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
        Internal Numbers
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
          {data1?.map((Inner, i) => {
            var event_date = new Date(Inner.event.event_date);
            return (
              <tr key={i}>
                <td>{Inner.id}</td>
                <td>{Inner.user && Inner.user.name}</td>
                <td>{event_date.toLocaleString()}</td>
                <td>{Inner.number}</td>
                <td>{Inner.price}</td>
                <td>
                  <Link to="#" className='btn btn-danger' style={{ marginLeft: '4px' }} onClick={(e) => DeleteInner(e, Inner.id)}>{<FaTrashAlt />}</Link>
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

export default Internal;