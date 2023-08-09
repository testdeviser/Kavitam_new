import React,{useState,useRef} from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../layouts/front/navbar';
import Footer from './footer/Footer';
import Header from '../../layouts/front/header';


function Main(props) {
    const [paymentStatus,setpaymentStatus]=useState({status:false,price:0});
    const [checkNumber_loading,setcheckNumber_loading]=useState(0);  //reload sidebar on everytime whenever numbers selected deselected
 
  
    return (
       <>
       <Header callback={setpaymentStatus} paymentStatus={paymentStatus} setcheckNumber_loading={checkNumber_loading}/>
        {/* <Navbar callback={setpaymentStatus} paymentStatus={paymentStatus} setcheckNumber_loading={checkNumber_loading}/>   */}
           <Outlet context={{paymentStatus:paymentStatus,paymentPrice:paymentStatus.price,setcheckNumber_loading}}/>
        <Footer/>
       </>
    );
}
export default Main;