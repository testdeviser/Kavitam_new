import React,{useState} from 'react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function CreateEvent(props) {
    const [value, onChange] = useState(new Date());
     
    const [inputs,setinputs]=useState({
        status:0,
        eventName:'',
        error:[],
     });

    const navigate=useNavigate();

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

    const handleSubmit=async(e)=>{
        var month=value.getMonth()+1;
        e.preventDefault();
        let date=value.getFullYear()+'-'+month+'-'+value.getDay();
        let time=value.getHours()+':'+value.getMinutes();

        const data={
            time:time,
            date:value,
            status:inputs.status,
            name:inputs.eventName,
        }
        console.log(data);

        try{
               
                await axios.post('/api/admin/events/create',data).then(res=>{
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
                          console.log(res.data.err.name);
                        }
                    }
                });
        }
        catch(err){
           console.log(err);
        }
        e.preventDefault();        
  
      }
    
    return (
       <div className="container">
        <div className="row justify-content-center" style={{'marginTop':'20vh'}}>
            <div className="col-md-8">
                <div className="card">
                    <h3 className='card-title text-center' style={{'textDecorationLine':'underline','textDecorationStyle':'double'}} >Create Event</h3>
                    <div className="card-body">
                        <form action="" onSubmit={handleSubmit}>

                        <div className="mb-3">
                           <label htmlFor="login">Event Name</label>
                           <input type="text" name="" id="login" className='form-control' value={inputs.eventName||''} onChange={(e)=>{setinputs({...inputs,eventName:e.target.value})}} />    
                           <span className='text-danger'>{inputs.error.name?inputs.error.name:''}</span>                       
                        </div>

                        <div className='mb-3' style={{'fontFamily': 'sans-serif'}}>
                           <DateTimePicker  className='form-control' onChange={onChange} value={value}  format={"y-MM-dd h:mm:ss a"}/>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={handleStatus}/>
                            <label htmlFor="">Active</label>                 
                        </div>                    

                           <div className="mb-3">
                              <button type="submit" className="btn btn-primary w-100">Create</button>
                           </div>
                        </form>
                    </div>
                </div>
               
            </div>
        </div>
       </div>
    );
}
export default CreateEvent;