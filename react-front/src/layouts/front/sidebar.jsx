import { useState,useEffect,useRef,useMemo} from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import axios from 'axios';
import { FaWallet } from "react-icons/fa";
import Swal from 'sweetalert2';

// sidebar
export default function OffCanvas({name,show,handleClose,handleShow,callback,setcheckNumber_loading,paymentStatus,...props })
{  
  const [wallet,setwallet]=useState(0);
  const [state, setState] =useState({value: 10});
  const main=useRef();
  const innerData=useRef();  
  const outerData=useRef();  
  
  function forceUpdate()
  {
      setState(prev => {
      return {...prev}
      })
  }

const payNow=async(e,grandtotal)=>{
     const data={ammount:grandtotal}
    // var addreffer_dis=grandtotal -(grandtotal * 2)/100; 
     try{  

         await axios.post(`/api/user/wallet/decrease`,data).then(res=>{
            console.log(res);
            if(res.data.status===200)
            {
                Swal.fire({
                position:'center',
                icon: 'success',
                title:res.data.message,
                showConfirmButton: false,
                timer:2000
                });
                forceUpdate(); 
                
               callback({...paymentStatus,status:true,price:grandtotal}) ;
                // return true; 
            }
            else
            {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: res.data.message,     
                })
            }
      
          });
     }catch(err){
      console.log(err);
     }
   
}

  // const fetch_main_data=async()=>{    
  //  try{     
  //       // MAIN
  //      await axios.get(`/api/Sidebar/mainNumber/fetch`).then(res=>{  
  //         if(res.data.status==200)
  //         {
  //           // console.log(res);
  //           main.current=res.data.main;   //setmaindata
  //         }   
  //       });

  //       // INNER
  //       await axios.get(`/api/Sidebar/innerNumber/fetch`).then(res=>{  
  //       if(res.data.status==200)
  //       {
  //         // console.log(res);
  //         innerData.current=res.data.inner;
  //       }   
  //       });

  //       // OUTER
  //       await axios.get(`/api/Sidebar/outerNumber/fetch`).then(res=>{  
  //         if(res.data.status==200)
  //         {
  //           // console.log(res);
  //         outerData.current=res.data.outer;
  //         }         
  //       });

  //       await axios.get(`/api/user/wallet/fetch`).then(res=>{
  //          setwallet(res.data.wallet.ammount);
  //       });

  //  }catch(err)
  //  {
  //     console.log(err);
  //  }
    
        
  // }

useEffect(()=>{
  // fetch_main_data();  
  callback(false);
},[setcheckNumber_loading,forceUpdate]);

var Mtotal=0;
var Itotal=0;
var Ototal=0;
var Grandtotal=0;
   return (
    <>   
      <Offcanvas show={show} onHide={handleClose} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title >Wallet</Offcanvas.Title><br/>         
        </Offcanvas.Header>
        <Offcanvas.Body>

        <h1 > < FaWallet className="text-primary" size={30}/> Rs.{wallet}</h1> <br/>

          <h4 className='text-secondary text-center'>Main</h4> <hr/>

          <table className="table">
          <thead>
            <tr>
              <th scope="col">Number</th>
              <th scope="col">Price</th>      
            </tr>
          </thead>
          <tbody>
           {main.current?.map((m,i)=>{           
            Mtotal+=m.prize;
            // maintt.current=Mtotal;           
            return(
              <tr key={i}>
              <td>{m.number}</td>
              <td>Rs.{m.prize} </td>
            </tr> 
            )}           
             )}
             <tr>
              <td className='text-secondary'> Total</td>
              <td className='text-secondary'> Rs.{Mtotal}</td>
             </tr>
             
  </tbody>
</table>   

{/* -----------------------------------------inner------------------------------------------------------ */}

<h4 className='text-secondary text-center'>Inner</h4> <hr/>

<table className="table">
          <thead>
            <tr>
              <th scope="col">Number</th>
              <th scope="col">Price</th>      
            </tr>
          </thead>
          <tbody>
           {innerData.current?.map((m,i)=>{           
            Itotal+=m.price;
            // innertt.current=Itotal;
            return(
              <tr key={i}>
              <td>{m.number}</td>
              <td>Rs.{m.price} </td>
            </tr> 
            )}           
             )}
            <tr>
              <td className='text-secondary'> Total</td>
              <td className='text-secondary'> Rs.{Itotal}</td>
            </tr>             
  </tbody>
</table> 

 {/*-------------------------------------inner end----------------------------------------------------------------  */}

 {/*-------------------------------------outer start----------------------------------------------------------------  */}


 <h4 className='text-secondary text-center'>Outer</h4> <hr/>
<table className="table">
          <thead>
            <tr>
              <th scope="col">Number</th>
              <th scope="col">Price</th>      
            </tr>
          </thead>
          <tbody>
           {outerData.current?.map((m,i)=>{           
            Ototal+=m.price;
            // outertt.current=Ototal;
            return(
              <tr key={i}>
              <td>{m.number}</td>
              <td>Rs.{m.price} </td>
            </tr> 
            )}           
             )}
             <tr>
              <td className='text-secondary'> Total</td>
              <td className='text-secondary'> Rs.{Ototal}</td>
             </tr>             
  </tbody>
</table> 
 {/*-------------------------------------outer end----------------------------------------------------------------  */}

 {/* ------------------------------------Grand total------------------------------------------------------------------ */}
 
 <span>
 {/* <h1>Grand Total :{Grandtt.current=outertt.current+innertt.current+maintt.current}</h1> */}
 <h1>Grand Total : {Grandtotal=Mtotal+Itotal+Ototal}</h1>
 </span>  
 {/* ------------------------------------Grand end------------------------------------------------------------------ */}

 <button className={Grandtotal!=0?'btn btn-success mb-5 mt-3 w-100':'btn btn-success mb-5 mt-3 w-100 disabled'} onClick={(e)=>{payNow(e,Grandtotal)}}>Pay now</button>
          
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}