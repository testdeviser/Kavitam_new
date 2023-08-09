import React,{useState,useEffect,useRef} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {FaCalendarAlt,FaClock} from "react-icons/fa";

function Event(props) {    
    const events=useRef([]);
    const [date,setdate]=useState(new Date());    
    const fetchEvents=async()=>{
        try
        {
            await axios.get(`/api/events/fetch`).then(res=>{
                if(res.data.status==200)
                {                    
                    events.current=res.data.events;
                }               
            });
        }
        catch(err)
        {
           console.log(err);
        }
      
    }

useEffect(()=>{
    fetchEvents();
},[]);

useEffect(()=>{    
    var timer = setInterval(()=>setdate(new Date()), 1000 )
    return function cleanup(){
        clearInterval(timer)
    }
});

var EventActiveStatus=false;
const handleEvent=async(e,increaseTime50,dbtime,EVTime,event_id)=>
{   
   
await axios.get(`/api/events/AlreadyPlay/${event_id}`).then(res=>{
    if(res.data.status==200)
    {
        if(date.toTimeString() >=dbtime.toTimeString() && increaseTime50.toLocaleTimeString('it-IT')>date.toTimeString() && increaseTime50.toDateString()==date.toDateString() )
        {       
            EventActiveStatus=true;
            props.EventStatus(EventActiveStatus,increaseTime50,dbtime,EVTime,event_id);
        }
        else
        { 
            if( date.toDateString() > increaseTime50.toDateString() )
            {
                 Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Event Expired !!'              
                  });
            }
            else if(date.toDateString() < increaseTime50.toDateString())
            {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Event will Start on' + increaseTime50.toDateString()              
                  });
            }
            else if(date.toDateString() == increaseTime50.toDateString())
            {
                if(date.toTimeString() > increaseTime50.toTimeString())
                {                     
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Event Expired !!'              
                      });
                }
                else if(date.toTimeString() < dbtime.toTimeString())
                {               
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Event will start on '+ dbtime.toLocaleTimeString('it-IT')             
                    });      
                }    
            }
            else
            {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!!'             
                  });
            }
            props.EventStatus(false,increaseTime50,dbtime,0,0); 
        }  
    }
    else
    {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.data.message,             
          }); 
    }
});
           
}

    return (
      <React.Fragment>
        <div className="col-md-12">
            <div className="row">

          
           <h3 className='underline text-center m-3 '>Events</h3>           
                    {
                        events.current?.map((time,i)=>{                                                   

                                const increaseTime50 = new Date(time.event_date);
                                 const dbtime=new Date(time.event_date);
                                 
                                 let dbdate=dbtime.toDateString();
                                 let EVTime=dbtime.getHours()+':'+dbtime.getMinutes()+':'+dbtime.getSeconds();
                                  
                                increaseTime50.setTime(increaseTime50.getTime()+(50 * 60 * 1000));                               
                               
                                if(date.toTimeString() >=dbtime.toTimeString() && increaseTime50.toLocaleTimeString('it-IT')>date.toTimeString() && increaseTime50.toDateString()==date.toDateString() )
                                {
                                    EventActiveStatus=true;                                  
                                }                                                                                                
                                return(
                                        <div key={i} className="col-md-4 mt-1 zoom">
                                            {/* <div className={EventActiveStatus?"card m-1 pointer btn myEvents":"card m-1 pointer btn disabled myEvents"}  onClick={(e)=>handleEvent(e,increaseTime50,dbtime,EVTime,time.id)} style={{'textAlign':'center'}}>                                             */}
                                             <div className={"card m-1 pointer btn myEvents"}  onClick={(e)=>handleEvent(e,increaseTime50,dbtime,EVTime,time.id)} style={{'textAlign':'center'}}>                                             
                                                <h6 className='card-title bg-primary text-light' style={{'height':'25px'}}><FaCalendarAlt  size={15}/> {increaseTime50.toDateString(dbtime.toDateString(),dbtime.toTimeString())} </h6>                                      
                                                <h5 className="card-title"><FaClock size={20}/>{EVTime}</h5>    
                                            </div>                                            
                                        </div>                            
                                       );             
                            
                        })} 

                          </div>
        </div>    
        </React.Fragment>
    );
}
export default Event;
