import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../../assets/admin/js/scripts";
import "../../assets/admin/css/styles.css";
import { Outlet } from "react-router-dom";

function MasterLayout(props) {
  return (
    <div className="sb-nav-fixed">
      <Navbar/>
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <Sidebar />
        </div>
        <div id="layoutSidenav_content">
          <main><Outlet/></main>
          <Footer/>
        </div>
      </div>
    </div>
  );
}
export default MasterLayout;
