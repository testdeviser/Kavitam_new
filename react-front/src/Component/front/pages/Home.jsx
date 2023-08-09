import React, { useState, useEffect } from 'react';
import Slider from '../Slider/Slider';
import LiveResultToday from '../Live_Result_Today/LiveResultToday';
import Upcoming_Draw from '../Upcoming_Draw/Upcoming_Draw';
import Picking_A_Number from '../Picking_a_Number/Picking_A_Number';
// import Header from '../../../layouts/front/header';
import PlayesFeedback from '../Testimonials/PlayesFeedback';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import Login from '../Auth/Login';

function Home(props) {

    const location = useLocation();
    const [isHomePage, setIsHomePage] = useState(false);

    useEffect(() => {
        setIsHomePage(location.pathname === '/');
    }, [location]);


    var currentPath = location.pathname;
    var pageName = currentPath.slice(1);

    return (
        <div>
            {pageName === 'login' ? <Login /> :
                <div>
                    {/* <Slider/> */}
                    {/* <Header/> */}
                    <Picking_A_Number />
                    <LiveResultToday />
                    <div className='querysection'>
                        <div className="container">
                            <section>
                                <div className="content">
                                    <p>In case of any Query!</p>
                                </div>
                                {/* <div className="contactBtn"><button className='querybtn'>Contact Us</button></div> */}
                                {/* <li><Link to={`https://wa.me/?text=${encodeURIComponent(show.refferralCode)}`}><FaWhatsapp /></Link></li> */}
                                <div className="contactBtn"><Link className='querybtn' to={`https://wa.me/9915970179`} target="_blank"> <img src={process.env.PUBLIC_URL + '/image/whatsapp.png'} alt="" width={30} height={30} /></Link></div>
                            </section>
                        </div>
                    </div >
                    {/* <Upcoming_Draw/> */}
                    < PlayesFeedback />
                </div >}
        </div>


    );
}

export default Home;