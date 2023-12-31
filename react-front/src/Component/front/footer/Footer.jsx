import React from "react";
import { Link } from "react-router-dom";
import '../../../assets/front/css/footer.css';
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer(props) {

   return (
      <>
         <footer className="front-footer define_float">
            <div className="container">
               <div className="links">

                  <div className="link footer-logo">
                     <div className='logo-icon'>
                        <Link to="/">
                           <img src={process.env.PUBLIC_URL + '/image/logo-img.svg'} alt="" />
                        </Link>
                     </div>

                     <div className="website-Name">
                        <Link to="/" style={{ fontWeight: '800' }}>
                           Kavitam
                        </Link>
                     </div>
                  </div>

                  <div className="link copyright">
                     <p>Copyright © 2023. All right reserved</p>
                  </div>

                  <div className='link footer-Social'>
                     <ul>
                        <li>
                           <Link to="https://www.facebook.com" target="_blank">
                              <img src={process.env.PUBLIC_URL + '/image/facebook-f.svg'} alt="Facebook" />
                           </Link>
                        </li>
                        <li>
                           <Link to="https://www.linkedin.com" target="_blank">
                              <img src={process.env.PUBLIC_URL + '/image/linkedin-in(1).svg'} alt="linkedIn" />
                           </Link>
                        </li>
                        <li>
                           <Link to="https://twitter.com/" target="_blank">
                              <img src={process.env.PUBLIC_URL + '/image/twitter(1).svg'} alt="twitter" />
                           </Link>
                        </li>
                     </ul>
                  </div>

               </div>

               <div className="whatsapp-floating-icon">
                  <Link to={`https://wa.me/9915970179`} target="_blank" rel="noopener noreferrer">
                     <img
                        src={process.env.PUBLIC_URL + '/image/whatsapp.png'} // Replace with your WhatsApp icon image path
                        alt="WhatsApp Icon"
                        className="floating-pendulum" // Apply the floating animation class
                     />
                  </Link>
               </div>

            </div>
         </footer>
      </>
   );
}


