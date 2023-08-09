import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlusSquare, FaPen, FaTrashAlt } from "react-icons/fa";
import axios from 'axios';
import Swal from 'sweetalert2';
import Pagination from '../pagination/pagination';

function Main(props) {
  const navigate = useNavigate();
  const [data, setdata] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const DataPerPage = useRef(10);

  const [events, setEvents] = useState();
  useEffect(() => {
    axios.get("api/todayActiveEvents").then((res) => {
      if (res.data.status === 200) {
        setEvents(res.data.event_id);
      } else {
        console.log("Events not found");
      }
    });
  }, []);

  useEffect(() => {
    axios.get("api/admin/mainNumber/fetch/" + events).then(res => {
      if (res.data.status === 200) {
        setdata(res.data.main);
      }
    })
      .catch((error) => {
        console.error(error);
      });
  }, [events]);


  // const fetchData = async () => {
  //   try {
  //     // const getdata = await axios.get(`/api/admin/main/fetch`).then(res => {
  //     const getdata = await axios.get("api/admin/mainNumber/fetch/" + events).then(res => {
  //       //console.log(res);
  //       setdata(res.data.main);
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  const deleteMain = async (e, id) => {
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
        axios.delete(`/api/admin/main/delete/${id}`).then(res => {
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

  // useEffect(() => {
  //   fetchData();
  // }, []);


  return (
    <div style={{ marginLeft: "40px", width: "80vw", margin: "10px auto" }}>
      <input type="hidden" name="active_event" value={events} />
      <h3
        style={{
          textDecoration: "underline",
          textDecorationStyle: "double",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Main Numbers
      </h3>

      <table className="table bordered table-striped  table-hover mt-4">
        <thead className="thead-dark text-center">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">User Name</th>
            {/* <th scope="col">Event</th> */}
            <th scope="col">Number</th>
            <th scope="col">Prize</th>
            {/* <th scope="col">Action</th> */}
          </tr>
        </thead>
        <tbody className="text-center align-middle text-center">
          {data1?.map((main, i) => {
            var event_date = new Date(main.event.event_date);
            return (
              <tr key={i}>
                <td>{main.id}</td>
                <td>{main.user && main.user.name}</td>
                {/* <td>{event_date.toLocaleString()}</td> */}
                <td>{main.number}</td>
                <td>{main.prize}</td>
                {/* <td>
                  <Link to="#" className='btn btn-danger' style={{ marginLeft: '4px' }} onClick={(e) => deleteMain(e, main.id)}>{<FaTrashAlt />}</Link>
                </td> */}
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

export default Main;