import React,{useEffect,useState,useRef} from 'react';
import { FaPlusSquare,FaTrashAlt,FaPenSquare,FaTrophy } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Pagination from '../pagination/pagination';

function Events(props) {
   
    const [data,setdata]=useState();
       // pagination
  const [currentPage, setCurrentPage]=useState(1);
  const DataPerPage=useRef(5) 
    const fetchEvents=()=>
    {
        try{
            axios.get(`/api/admin/events/fetch`).then(res=>{
                setdata(res.data.events);
            });            
        }
        catch(err)
        {
            console.log(err);
        }
    }

    const Deleteevent=(e,id)=>{           
      
        const target=e.currentTarget;

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
                        axios.delete(`/api/admin/events/delete/${id}`).then(res=>{
                            if(res.data.status==200)
                            {
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
  const data1 = data?data.slice(firstIndex, lastIndex):[]; 

     useEffect(()=>{
        fetchEvents();
     },[]);

    return (
        <div style={{marginLeft: "40px", width: "80vw", margin: "10px auto" }}>
        <h3
          style={{
            textDecoration: "underline",
            textDecorationStyle: "double",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Events
        </h3>

        {/* <Link className='btn btn-success' to='/admin/events/create'><FaPlusSquare size={25}/></Link> */}
       
        <table className="table bordered table-striped  table-hover mt-4">
          <thead className="thead-dark text-center">
            <tr>
              {/* <th scope="col">Id</th> */}
              <th scope='col'>Event Date</th>          
              <th scope='col'>Status</th>                     
              <th scope="col">Action</th>                 
            </tr>
          </thead>
          <tbody className="text-center align-middle text-center">
           {data1?.map((event,i)=>{
            var dateTime=new Date(event.event_date);
            return(
                  <tr key={i}>
                    {/* <td>{event.id}</td>   */}
                    <td>{dateTime.toLocaleString()}</td>            
                    <td>{event.status?'Active':'Disabled'}</td>                          
                    <td> 
                      <Link to={`/admin/event/Edit/${event.id}`} className='btn btn-success' style={{'marginLeft':'4px'}} ><FaPenSquare/></Link>                  
                      <Link to="#" className='btn btn-danger' style={{'marginLeft':'4px'}} onClick={(e)=>Deleteevent(e,event.id)}>{<FaTrashAlt/>}</Link>               
                      <Link to={`/admin/result/${event.id}`} className='btn btn-success' style={{'marginLeft':'4px'}} ><FaTrophy/></Link>       
                    </td>
                  </tr>
                  )
           }
           
           )}
          </tbody>
        </table>   

        <Pagination
                totalPosts={data?data.length:0}
                DataPerPage={DataPerPage.current}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}               
            />       
      </div>
    );
}

export default Events;