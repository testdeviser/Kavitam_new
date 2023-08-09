import React,{useState,useEffect,useRef} from 'react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate,useParams } from 'react-router-dom';

function EditEvent(props) {
    const {id}=useParams();
    const navigate=useNavigate();
    const [value, onChange] = useState(new Date());
    const [inputs,setinputs]=useState({
        status:0,
        name:'',
        error:[],
    });
   
    const prefilldata=useRef();
    const preStatus=useRef(0);

     const fetchEditData=()=>{
        try{
           axios.get(`/api/admin/events/editdata/${id}`).then(res=>{
            if(res.data.status==200)
            {        console.log(res);     
                prefilldata.current=res.data.event.event_date;                  
                setinputs({...inputs,status:res.data.event.status}); 
                setinputs({...inputs,name:res.data.event.name});            
            }
           
           
        
           }, []);           
        }
        catch(err)
        {
          console.log(err);
        }
     }

     const handleStatus=(e)=>{
        var isChecked=e.target.checked;
        if(isChecked)
        {
           setinputs({...inputs,status:1});
        }
        else
        {
          setinputs({...inputs,status:0});
        }     
    }


     useEffect(()=>{
        fetchEditData();
     },[]);

  const handleSubmit=(e)=>{    
    e.preventDefault();
    let month=value.getMonth()+1;

    let date=value.getFullYear()+'-'+month+'-'+value.getUTCDate();
    let time=value.getHours()+':'+value.getMinutes();

    var data={
        time:time,
        date:value,
        status:inputs.status,
        name:inputs.name,
    }

    console.log(data);
    try{
        axios.post(`/api/admin/events/update_events/${id}`,data).then(res=>{
           if(res.data.status===200)
           {
            Swal.fire({
                position:'center',
                icon: 'success',
                title:res.data.message,
                showConfirmButton: false,
                timer: 2000
              }); 
              navigate('/admin/events'); 
           }
           else
           {
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Oops...',
            //     text: res.data.message,     
            //   })
            if(res.data.status==401)
            {
             setinputs({...inputs,error:res.data.err});
            }
           }
        })
    }
    catch(err)
    {
        console.log(err);
    }

  }
 
    
    return (

       <div className="container">
        <div className="row justify-content-center" style={{'marginTop':'20vh'}}>
            <div className="col-md-8">
                <div className="card">
                    <h3 className='card-title text-center' style={{'textDecorationLine':'underline','textDecorationStyle':'double'}} >Edit Event</h3>
                    <div className="card-body">
                        <form action="" onSubmit={handleSubmit}>

                        <div className="mb-3">
                           <label htmlFor="login">Event Name</label>
                           <input type="text" name="" id="" className='form-control' value={inputs.name||''} onChange={(e)=>{setinputs({...inputs,name:e.target.value})}} />    
                           <span className='text-danger'>{inputs.error.name?inputs.error.name:''}</span>
                        </div>
                        
                        <div className='mb-3' style={{'fontFamily': 'sans-serif'}}>
                           <DateTimePicker  className='form-control' onChange={onChange} value={value}  format={"y-MM-dd h:mm:ss a"}/>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" checked={inputs.status?'checked':''}  id="flexCheckDefault"  onChange={handleStatus}/>
                            <label htmlFor="">Active</label>                 
                        </div>

                           <div className="mb-3">
                           <button type="submit" className="btn btn-primary w-100">Update</button>
                           </div>
                        </form>
                    </div>
                </div>               
            </div>
        </div>
       </div>

    );
}
export default EditEvent;