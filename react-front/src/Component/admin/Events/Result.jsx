import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Pagination from '../pagination/pagination';

function Result(props) {
  const { id } = useParams();
  const [date, setdate] = useState(new Date());
  const [data, setdata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const DataPerPage = useRef(10);
  const [result, setresult] = useState({
    number: 0,
    forceUpdate: '',
  });

  const dbEvent_date = useRef(new Date());

  useEffect(() => {

    const event_id = id;
    axios.get('api/test/' + event_id).then((res) => {
      if (res.data.status === 200) {

      } else {

      }
    });
  }, []);


  const fetchTotoalOf_all = async () => {
    const data = {
      event_id: id,
    }

    try {
      await axios.post('/api/result', data).then(res => {
        console.log(res);
        setdata(res.data.total);
        setresult({ ...result, number: res.data.randomNumber });
      });
    }
    catch (error) {
      console.log(error);
    }

  }

  const adminTime = async () => {
    try {
      var increaseTime50 = '';
      var dbtime = '';
      var TimeOut = '';
      var dbResult = 0;

      await axios.get(`api/admin/events/editdata/${id}`).then(res => {
        dbResult = res.data.event.result;
        TimeOut = new Date(res.data.event.event_date);
        increaseTime50 = new Date(res.data.event.event_date);
        dbtime = new Date(res.data.event.event_date);
        increaseTime50.setTime(increaseTime50.getTime() + (50 * 60 * 1000));
        TimeOut.setTime(TimeOut.getTime() + (60 * 60 * 1000));
      });
      if (date.toTimeString() >= increaseTime50.toLocaleTimeString('it-IT') && date.toTimeString() <= TimeOut.toLocaleTimeString('it-IT') && increaseTime50.toDateString() == date.toDateString()) {

      }
      else {
        if (TimeOut.toLocaleTimeString('it-IT') == date.toLocaleTimeString('it-IT')) {

          if (dbResult == '' || dbResult == null) {
            Result_Annoucement();
          }

        }

        var element = document.getElementsByClassName('result1');
        console.log(element);
        element[0].classList.add('disableded');
      }
    }
    catch (err) {
      console.log(err);
    }

  }

  useEffect(() => {
    fetchTotoalOf_all();
  }, []);

  useEffect(() => {
    adminTime();
    var timer = setInterval(() => setdate(new Date()), 1000)
    return function cleanup() {
      clearInterval(timer)
    }
  });

  const lastIndex = currentPage * DataPerPage.current;
  const firstIndex = lastIndex - DataPerPage.current;
  const data1 = data ? data.slice(firstIndex, lastIndex) : [];

  const Result_Annoucement = () => {
    // e.preventDefault();
    const data = {
      id: id,
      number: result.number,
    }
    axios.post(`/api/annouce_result`, data).then(res => {
      if (res.data.status == 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: res.data.message,
          showConfirmButton: false,
          timer: 1500
        });
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.data.message,
        })
      }

    });
  }

  return (
    <React.Fragment>
      <div style={{ marginLeft: "40px", width: "70vw", margin: "10px auto" }}>
        <h3
          style={{
            textDecoration: "underline",
            textDecorationStyle: "double",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Total
        </h3>

        {/* <div className='btn result'>*/}
        <div className='btn result1'>
          <form className="row g-3 mt-3">
            <div className="col-auto">
              <input type="number" className="form-control" id="inputPassword2" value={result.number || ''} onChange={(e) => { setresult({ ...result, number: e.target.value }) }} required placeholder="Enter your Number" />
            </div>

            <div className="col-auto">
              <button type='button' className='btn mb-3 btn-primary' onClick={(e) => { Result_Annoucement(e) }}>Annouce result</button>
            </div>

          </form>

        </div>


        <table className="table bordered table-striped  table-hover mt-4">
          <thead className="thead-dark text-center">
            <tr>
              <th scope="col">Number</th>
              <th scope="col">Prize</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle text-center">
            {data1?.map((total, i) =>
              <tr key={i}>
                <td>{total.id}</td>
                <td>{total.price}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        totalPosts={data ? data.length : 0}
        DataPerPage={DataPerPage.current}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </React.Fragment>
  );
}

export default Result;
