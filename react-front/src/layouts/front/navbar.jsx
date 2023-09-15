import React,{useState,useContext} from 'react';
import { Link,useNavigate} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/js/bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import OffCanvas from './sidebar';
import { Data } from '../../Component/front/pages/Game';
import Swal from 'sweetalert2';
import {FaGamepad} from 'react-icons/fa';   
import axios from 'axios';

function Navbar({callback,setcheckNumber_loading,paymentStatus,...props}) {
  const navigate=useNavigate();
   
  // sidebar 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  var user_name=localStorage.getItem("user_name");
  var auth_token=localStorage.getItem("auth_token");

  
  var authentication='';
  if(auth_token)
  {
    authentication=(
    <>
        <li className="nav-item active">
          <Link className="nav-link   text-white" to="/game">Game</Link>
        </li>
    
        <li className="nav-item">
            <Link className="nav-link  text-white" to="#"  onClick={handleShow}>wallet</Link>            
        </li>

        {/* <li className="nav-item">
            <Link className="nav-link  text-white" to="/mynumbers">My numbers</Link>
        </li>  */}

        <li className="nav-item">
            <Link className="nav-link  text-white " to="#" onClick={logout}>Logout</Link>
        </li>       
       
        <li className="nav-item">
            <Link className="nav-link  text-white" to="/setting"><img src={process.env.PUBLIC_URL + '/image/undraw_profile.svg'} className="rounded-circle" width="45px" height="30"/>{auth_token?user_name:'guest'}</Link>
        </li>               
    </>
    );    
  }
  else{
    authentication=(
            <>
                <li className="nav-item">
                    <Link className="nav-link  text-white " to="/login">Login</Link>
                 </li>

                <li className="nav-item">
                    <Link className="nav-link  text-white " to="/register">Register</Link>
                </li>
            </>
         )
    
  }
  function logout()
  {
    
    axios.post(`/api/logout`).then(res=>{
         //console.log(res);
         if(localStorage.getItem("auth_token"))
         {  
           
            Swal.fire({
                position:'center',
                icon: 'success',
                title:res.data.message,
                showConfirmButton: false,
                timer: 1500
              }); 

            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_name");
            localStorage.removeItem("_grecaptcha");
            navigate('/login');
         }                
    });
  } 
 
  return (
       <>
            <nav className="navbar navbar-expand-lg navbar-light bg-primary text-light shadow sticky-top" >
            <Link className="navbar-brand text-white" to="#"><b> <FaGamepad size={35} style={{'marginLeft':'5px','marginRight':'5px'}}/>Gaming Point</b></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>            
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto ms-auto  mb-lg-0">
                <li className="nav-item active">
                    <Link className="nav-link active  text-white" to="/">Home</Link>
                </li>
                   {authentication}
                </ul>          
                </div>
                </nav>        
                <OffCanvas show={show} setcheckNumber_loading={setcheckNumber_loading} paymentStatus={paymentStatus} handleClose={handleClose} handleShow={handleShow} callback={callback} name='wallet' placement="end"></OffCanvas>
       </>
    );
}





export default Navbar;
