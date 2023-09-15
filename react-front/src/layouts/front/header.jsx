
import '../../assets/front/css/header.css';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/js/bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import OffCanvas from './sidebar';
import { Data } from '../../Component/front/pages/Game';
import Swal from 'sweetalert2';
import { FaGamepad } from 'react-icons/fa';
import axios from 'axios';
import { WalletContext } from '../../WalletContext';
import GoogleTranslator from '../../Component/front/GoogleTranslator';
import { handleSidebarStyle } from '../../utils';
import { setActiveSidebarLink } from '../../utils/utils';
import firebaseApp from '../../firebase';

// function Header({ callback, setcheckNumber_loading, paymentStatus, walletBalance, ...props }) {
function Header({ callback, setcheckNumber_loading, paymentStatus, ...props }) {
    const navigate = useNavigate();
    const database = firebaseApp.database(); // Define 'database' using the imported Firebase app 
    const { walletAmount } = useContext(WalletContext);

    //const walletBalance = localStorage.getItem('wallet');
    const location = useLocation();
    const [isHomePage, setIsHomePage] = useState(false);

    useEffect(() => {
        setIsHomePage(location.pathname === '/');
    }, [location]);

    const [showNavigationLinks, setShowNavigationLinks] = useState(false);
    const handleNavShow = () => {
        setShowNavigationLinks(!showNavigationLinks);
    };

    const handleLinkClick = (linkText) => {
        handleNavShow(); // Close the navigation links
        setActiveSidebarLink(linkText);
    };

    // const handleLinkClick = () => {
    //     setShowNavigationLinks(false);
    // };

    var currentPath = location.pathname;
    var pageName = currentPath.slice(1);
    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // sidebar 
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    var user_name = localStorage.getItem("user_name");
    var auth_token = localStorage.getItem("auth_token");

    const [events, setEvents] = useState();

    // useEffect(() => {
    //     if (auth_token) {
    //         fetchData();
    //         // const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    //         // return () => {
    //         //     clearInterval(interval); // Clean up the interval on component unmount
    //         // };
    //     }
    // }, [auth_token]);

    //listen firebase value
    const [withdrawalAmount, setWithdrawalAmount] = useState(0);
    useEffect(() => {
        if (auth_token) {
            const firebase_node = localStorage.getItem('firebase_node');
            // Reference to the Firebase database node
            const uniqueValue = firebase_node; // Replace with your actual unique value
            const withdrawalAmountRef = database.ref(`ammount/${uniqueValue}/walletBalance`);

            // Set up a listener for changes in the database
            withdrawalAmountRef.on('value', (snapshot) => {
                const data = snapshot.val();
                if (data !== null) {
                    setWithdrawalAmount(data); // Update the state with the value from the database
                }
            });

            // Clean up the listener when the component unmounts
            return () => {
                withdrawalAmountRef.off('value');
            };
        }
    }, [auth_token]);
    //end listen firebase value

    // const fetchData = () => {
    //     axios.get('api/fetchWalletBalance').then((res) => {
    //         if (res.data.status === 200) {
    //             setEvents(res.data.amount);
    //         } else {
    //             //console.log('Events not found');
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    // };

    const handleButtonClick = () => {
        // Redirect to the login page
        navigate('/payment');
    };

    const googleTranslatorId = "google_translate_element_header";

    var authentication = '';
    if (auth_token) {
        authentication = (
            <>
                <li >
                    <Link to="/game" onClick={handleLinkClick}>Play Here</Link>
                </li>
                <li>
                    <Link to="/aboutus" onClick={handleLinkClick}>About Us</Link>
                </li>
                <li>
                    <Link to="/privacypolicy" onClick={handleLinkClick}>Privacy Policy</Link>
                </li>
                <li>
                    <Link to="/contactus" onClick={handleLinkClick}>Contact Us</Link>
                </li>

                {/* <li>
                    <GoogleTranslator />
                </li> */}

                <li>
                    <GoogleTranslator id={googleTranslatorId} />
                </li>

                {/* <li >
                    <Link to="/mynumbers">My numbers</Link>
                </li> */}

                <li className="hover_dropdown">
                    <Link to="/Setting"><img src={process.env.PUBLIC_URL + '/image/undraw_profile.svg'} className="rounded-circle" width="45px" height="30" />{auth_token ? user_name : 'guest'}</Link>
                    <ul>

                        <li onClick={() => handleLinkClick("Profile")}>
                            <Link to="/Setting">Profile</Link>
                        </li>
                        <li onClick={() => handleLinkClick("Wallet")}>
                            <Link to="/Setting/wallet">Wallet</Link>
                        </li>
                        <li onClick={() => handleLinkClick("History")}>
                            <Link to="/Setting/history">History</Link>
                        </li>
                        <li onClick={() => handleLinkClick("referral")}>
                            <Link to="/Setting/Refferral">Refferal</Link>
                        </li>
                        <li onClick={() => handleLinkClick("Change Password")}>
                            <Link to="/Setting/changePassword">Change Password</Link>
                        </li>
                        <li onClick={() => handleLinkClick("Withdrawal")}>
                            <Link to="/Setting/withdrawal">Withdrawal</Link>
                        </li>

                        {/* <li >
                            <Link to="/Setting/Refferral" onClick={handleLinkClick}>Referral</Link>
                        </li>
                        <li >
                            <Link to="/Setting/changePassword" onClick={handleLinkClick}>Change Password</Link>
                        </li>
                        <li >
                            <Link to="/Setting/withdrawal" onClick={handleLinkClick}>Withdrawal</Link>
                        </li> */}

                        {/* <li>
                            <Link to="/Setting" onClick={() => handleLinkClick("/Setting")}>Profile</Link>
                        </li>
                        <li>
                            <Link to="/Setting/wallet" onClick={() => handleLinkClick("/Setting/wallet")}>Wallet</Link>
                        </li>
                        <li>
                            <Link to="/Setting/history" onClick={() => handleLinkClick("/Setting/history")}>History</Link>
                        </li> */}

                        {/* <li >
                            <Link to="/Setting" onClick={handleLinkClick}>Profile</Link>
                        </li>
                        <li >
                            <Link to="/Setting/wallet" onClick={handleLinkClick}>Wallet</Link>
                        </li>
                        <li >
                            <Link to="/Setting/history" onClick={handleLinkClick}>History</Link>
                        </li> */}
                        {/* <li >
                            <Link to="/Setting/Refferral" onClick={handleLinkClick}>Referral</Link>
                        </li>
                        <li >
                            <Link to="/Setting/changePassword" onClick={handleLinkClick}>Change Password</Link>
                        </li>
                        <li >
                            <Link to="/Setting/withdrawal" onClick={handleLinkClick}>Withdrawal</Link>
                        </li> */}

                        <li >
                            {/* <Link to="#" onClick={logout}>Logout</Link> */}
                            <Link to="#" onClick={(e) => { handleLinkClick(); logout(); }}>Logout</Link>
                        </li>
                    </ul>
                </li>

                {/* <li>
                    <GoogleTranslator />
                </li> */}

                {/* {events ? (
                    <button onClick={handleButtonClick} className='figmabtn wallet-btn'>
                        <img src={process.env.PUBLIC_URL + '/image/wallet-icon.svg'} alt="" />
                        Rs. {events}
                    </button>
                ) : (
                    <button onClick={handleButtonClick} className='figmabtn wallet-btn'>
                        <img src={process.env.PUBLIC_URL + '/image/wallet-icon.svg'} alt="" />
                        Rs. {walletAmount}
                    </button>
                )} */}

                {/* <div className="navigation-links">
                    <button onClick={handleButtonClick} className='figmabtn wallet-btn'><img src={process.env.PUBLIC_URL + '/image/wallet-icon.svg'} alt="" />Rs. {walletAmount}</button>
                </div> */}

                {/* <div className="navigation-links walletBalance" style={{ display: 'none' }}>
                    <button onClick={handleButtonClick} className='figmabtn wallet-btn'><img src={process.env.PUBLIC_URL + '/image/wallet-icon.svg'} alt="" />Rs. {walletBalance}</button>
                </div> */}
            </>
        );
    }
    else {
        authentication = (
            <>
                <li >
                    <Link to="/game" onClick={handleLinkClick}>Play Here</Link>
                </li>
                <li>
                    <Link to="/aboutus" onClick={handleLinkClick}>About Us</Link>
                </li>
                <li>
                    <Link to="/privacypolicy" onClick={handleLinkClick}>Privacy Policy</Link>
                </li>
                <li>
                    <Link to="/contactus" onClick={handleLinkClick}>Contact Us</Link>
                </li>
                {/* <li>
                    <GoogleTranslator />
                </li> */}

                <li>
                    <GoogleTranslator id={googleTranslatorId} />
                </li>


                {/* <li>
                    <Link to="/termsconditions">Terms&Conditions</Link>
                </li>
                <li>
                    <Link to="/faq">FAQ</Link>
                </li> */}
                <div className={`navigation-links oo0o0 ${showNavigationLinks ? 'showNav' : ''}`}>
                    <Link to='/login' className='figmabtn wallet-btn' onClick={handleLinkClick}>
                        <img src={process.env.PUBLIC_URL + '/image/user-icon.svg'} alt="" />
                        Login
                    </Link>
                </div>
                {/* <div className="navigation-links">
                    <button className='figmabtn wallet-btn'><img src={process.env.PUBLIC_URL + '/image/user-icon.svg'} alt="" /><Link to='/login'> Login</Link></button>
                </div> */}
                {/* <li><img src={process.env.PUBLIC_URL + '/image/user-icon.svg'} alt="" /><Link to='/login' style={{ 'marginTop': '62px' }}> Login</Link></li> */}
                {/*<li>
                    <Link to="/register">Register</Link>
                </li>*/}
            </>
        )

    }
    function logout() {


        axios.post(`/api/logout`).then(res => {
            //console.log(res);
            if (localStorage.getItem("auth_token")) {

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });

                localStorage.removeItem("auth_token");
                localStorage.removeItem("firebase_node");
                localStorage.removeItem("user_name");
                localStorage.removeItem("user_id");
                localStorage.removeItem("_grecaptcha");
                navigate('/login');
            }
        });
    }

    return (
        // <div className="header_with-bnnr define_float">
        <div className={`header_with-bnnr define_float ${isHomePage ? 'home-page' : ''}`}>

            {pageName !== 'payment' ? (
                <header className={`header_kavitam-main define_float ${auth_token ? '' : 'wallet_after_login'}`}>
                    <div className="container">
                        <div className="navbar">
                            <nav className="kaivtam_nav define_float">
                                <div className="logo">
                                    <div className='icon'>
                                        <Link to="/">
                                            <img src={process.env.PUBLIC_URL + '/image/logo-img.svg'} alt="" />
                                        </Link>
                                    </div>

                                    {/* <div className='icon'>
                                    <img src={process.env.PUBLIC_URL + '/image/logo-img.svg'} alt="" />
                                </div> */}

                                    {/* <div className="website-Name">
                                    <b style={{ 'fontWeight': '800' }}> Kavitam </b>
                                </div> */}

                                    <div className="website-Name">
                                        <Link to="/" style={{ fontWeight: '800' }}>
                                            Kavitam
                                        </Link>
                                    </div>
                                </div>

                                <div className='Wallert_outer-mobile'>
                                    <Link to="" className='menuicon' onClick={handleNavShow}>
                                        <img src="image/menu.svg" alt="" />
                                    </Link>
                                    <div className={`navigation-links ${showNavigationLinks ? 'showNav' : ''}`}>
                                        <ul>
                                            {authentication}
                                        </ul>
                                    </div>

                                    <button onClick={handleButtonClick} className='figmabtn wallet-btn'>
                                        <img src={process.env.PUBLIC_URL + '/image/wallet-icon.svg'} alt="" />
                                        {/* Rs. {walletAmount} */}
                                        Rs. {withdrawalAmount}
                                    </button>


                                    {/* {events ? (
                                        <button onClick={handleButtonClick} className='figmabtn wallet-btn'>
                                            <img src={process.env.PUBLIC_URL + '/image/wallet-icon.svg'} alt="" />
                                            Rs. {events}
                                        </button>
                                    ) : (
                                        <button onClick={handleButtonClick} className='figmabtn wallet-btn'>
                                            <img src={process.env.PUBLIC_URL + '/image/wallet-icon.svg'} alt="" />
                                            Rs. {walletAmount}
                                        </button>
                                    )} */}
                                </div>

                            </nav>


                        </div>
                    </div>
                    <OffCanvas show={show} setcheckNumber_loading={setcheckNumber_loading} paymentStatus={paymentStatus} handleClose={handleClose} handleShow={handleShow} callback={callback} name='wallet' placement="end"></OffCanvas>
                </header>
            ) : null}
            {/* <header className="header_kavitam-main define_float"> */}

            {pageName !== 'payment' ? (
                <section className='header-Section'>
                    <div className="container">

                        {pageName === 'login' || pageName === 'register' ? (
                            <div>
                                <div className="page-name">{capitalizeWords(pageName)}</div>
                                <div className="dice-icon">
                                    <img src={process.env.PUBLIC_URL + '/image/dice-lines.png'} alt="" />
                                </div>
                            </div>
                        ) : null}

                        {pageName === 'login' ? (
                            <div className="page-details"><p>Sign in to enter, if you've an account</p></div>
                        ) : pageName === 'register' ? (
                            <div className="page-details"><p>Sign-up to create an account</p></div>
                        ) : pageName === 'game' ? (
                            <div>
                                {/* <div className="page-name">Numbers</div> */}
                                {/* <div className="dice-icon">
                                <img src={process.env.PUBLIC_URL + '/image/dice-lines.png'} alt="" />
                            </div> */}
                                <div className="page-details"><p>Choose your lucky number</p></div>
                            </div>
                        ) : pageName === 'privacypolicy' ? (
                            <div>
                                <div className="page-name">Privacy Policy</div>
                                <div className="dice-icon">
                                    <img src={process.env.PUBLIC_URL + '/image/dice-lines.png'} alt="" />
                                </div>
                                {/* <div className="page-details"><p>Choose your lucky number</p></div> */}
                            </div>
                        ) : pageName === 'faq' ? (
                            <div>
                                <div className="page-name">FAQ Page</div>
                                <div className="dice-icon">
                                    <img src={process.env.PUBLIC_URL + '/image/dice-lines.png'} alt="" />
                                </div>
                                {/* <div className="page-details"><p>Choose your lucky number</p></div> */}
                            </div>
                        ) : pageName === 'contactus' ? (
                            <div>
                                <div className="page-name">Contact Us</div>
                                <div className="dice-icon">
                                    <img src={process.env.PUBLIC_URL + '/image/dice-lines.png'} alt="" />
                                </div>
                                {/* <div className="page-details"><p>Choose your lucky number</p></div> */}
                            </div>
                        ) : pageName === 'payment' ? (
                            <div>
                                {/* <div className="page-name">Contact Us Page</div>
                            <div className="dice-icon">
                                <img src={process.env.PUBLIC_URL + '/image/dice-lines.png'} alt="" />
                            </div>
                            <div className="page-details"><p>Choose your lucky number</p></div> */}
                            </div>
                        ) : pageName === 'termsconditions' ? (
                            <div>
                                <div className="page-name">Terms And Conditions</div>
                                <div className="dice-icon">
                                    <img src={process.env.PUBLIC_URL + '/image/dice-lines.png'} alt="" />
                                </div>
                                {/* <div className="page-details"><p>Choose your lucky number</p></div> */}
                            </div>
                        ) : pageName === 'aboutus' ? (
                            <div>
                                <div className="page-name">About Us</div>
                                <div className="dice-icon">
                                    <img src={process.env.PUBLIC_URL + '/image/dice-lines.png'} alt="" />
                                </div>
                                {/* <div className="page-details"><p>Choose your lucky number</p></div> */}
                            </div>
                        ) : pageName === 'allEventResults' ? (
                            <div>
                                <div className="page-name">All Event Results</div>
                                <div className="dice-icon">
                                    <img src={process.env.PUBLIC_URL + '/image/dice-lines.png'} alt="" />
                                </div>
                                {/* <div className="page-details"><p>Choose your lucky number</p></div> */}
                            </div>
                        ) : pageName === 'setting' || pageName === 'mynumbers' || pageName === 'Setting/wallet' || pageName === 'Setting' || pageName === 'Setting/changePassword' || pageName === 'Setting/Refferral' || pageName === 'Setting/history' || pageName === 'Setting/withdrawal' || pageName === 'Setting/wallet/refferal-history' ? (
                            <div>
                                {/* <div className="page-name">Numbers</div>
                            <div className="dice-icon">
                                <img src={process.env.PUBLIC_URL + '/image/dice-lines.png'} alt="" />
                            </div> */}
                                <div className="page-details"><p>Welcome to Kavitam</p></div>
                            </div>
                        ) : (
                            <div className="main-div">
                                {/* <div className={`main-div ${pageName !== undefined ? 'new-class' : ''}`}> */}
                                <div className='left-sec'>
                                    {/* <img src={process.env.PUBLIC_URL + '/image/banner-text.png'} alt="" /> */}
                                    {/* <div className='heaading'>Welcome to our site</div> */}
                                    <div className='heaading hindi_text'>सबसे भरोसेमंद वेबसाइट, अब हर रोज़ नहीं, हर घंटे जीते।</div>
                                    <div className="dice-icon1">
                                        <img src={process.env.PUBLIC_URL + '/image/dice-lines1.png'} alt="" />
                                    </div>
                                    {/* <div className='quickChoose'>Quick Pick or Choose <br /> Your Own  <span className='heding'>Numbers</span></div> */}
                                    <div className='quickChoose hindi_text'><span className='banner_ques'>कवितम क्या है?</span><br /><span className='heding hindi_text'>कवितम दुबई से संचालित रजिस्ट्रेड वेबसाइट है, इस वेबसाइट पर रिजल्ट कंपनी द्वारा हर घंटे खोले जाते है, कुछ लोग जो जल्दी अमीर बनना चाहते हैं, वे इस खेल को खेल रहे हैं। हमारी वेबसाइट पे हर रोज़ लाखो की संख्या में लोग आते है और जीतते है, आप और जगह नंबर लगा के 24 घंटे का इंतज़ार करते है, अब वो इंतज़ार ख़तम, अब आप हर घंटे नंबर लगा सकते है और हर घण्टे लाखो जीत सकते है।</span></div>
                                    <div className='play_explore'>
                                        {/* <Link onClick={handlePlayNowClick} className='figmabtn'>Play Now</Link> */}
                                        {/* <Link to="/login" className='figmabtn'>Play Now</Link> */}

                                        <Link
                                            className='figmabtn'
                                            to={auth_token ? '/game' : '/login'}
                                        // onClick={handleLinkClick}
                                        >
                                            Play Now
                                        </Link>

                                        {/* <Link className='explore-here'>Explore Here</Link> */}
                                    </div>
                                </div>
                                <div className='right-sec'>
                                    <img src={process.env.PUBLIC_URL + '/image/mainImg.png'} alt="" />
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            ) : null}
        </div>

    );
}

export default Header;