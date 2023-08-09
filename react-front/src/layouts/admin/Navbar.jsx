import React from 'react';
import { Link,useNavigate} from 'react-router-dom';
import { AiOutlineMenuFold } from "react-icons/ai";
import {FaUserCircle,FaSistrix,FaGamepad} from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';


function Navbar(props) {
  const navigate=useNavigate();
  
 //  sidebar toggle
 function toggle(e)
 {
   e.preventDefault();
   document.body.classList.toggle('sb-sidenav-toggled');
   localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
 } 
 
//  logout
 function logout()
 {
   axios.post(`/api/logout`).then(res=>{
        console.log(res);
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
        <React.Fragment>
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-primary">
      
        {/* <Link className="navbar-brand ps-3" to="/"><FaGamepad size={35} style={{'marginRight':'5px'}}/>Gaming Point</Link>        */}
        <Link className="navbar-brand" to="/"><img src={process.env.PUBLIC_URL + "/image/admin-logo.png"} alt="admin-logo"/></Link>       
        <button className="btn btn-link" id="sidebarToggle" to="#!" onClick={toggle} ><AiOutlineMenuFold size={25}/></button>
      
        {/* <form className="form-inline ms-auto">
            <div className="input-group">
                {/* <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                <button className="btn btn-primary" id="btnNavbarSearch" type="button"><FaSistrix/></button> }
            </div>
        </form>       */}
        <ul className="navbar-nav">
            <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" id="navbarDropdown" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><FaUserCircle  size={30}/></Link>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    {/* <li><Link className="dropdown-item" to="#!">Settings</Link></li>
                    <li><Link className="dropdown-item" to="#!">Activity Log</Link></li>
                    <li><hr className="dropdown-divider" /></li> */}
                    <li><Link className="dropdown-item" to="#!" onClick={logout}>Logout</Link></li>
                </ul>
            </li>
        </ul>
    </nav>
    </React.Fragment>
    );
}

export default Navbar;