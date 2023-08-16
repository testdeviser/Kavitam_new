import React, { useState, useReff, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

function Contactus(props) {
    const navigate = useNavigate();
    const [inputs, setinputs] = useState({
        emailPhone: '',
        message: '',

    });
    const [erros, setError] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            emailPhone: inputs.emailPhone,
            message: inputs.message,
        };

        console.log("rav");
        console.log(data);

        try {
            await axios.post(`/api/contactus`, data).then(res => {
                if (res.data.status == 200) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: res.data.message,
                        timer: 1500,
                    });
                    localStorage.setItem('auth_token', res.data.token);
                    localStorage.setItem('user_name', res.data.username);
                    localStorage.setItem('user_id', res.data.userid);
                    //window.location.reload();

                    // r2Admin
                    if (res.data.user == 'admin') {
                        navigate('/admin');
                    }
                    else {
                        navigate('/game');
                    }

                }
                else if (res.data.status == 404) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops',
                        text: res.data.message,
                    });
                }
                else {
                    setError(res.data.error);
                }
            });
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <section className="register-section define_float">
            <div className="container">
                <div className="register-wrapper define_float">
                    <div className="left-side">
                        <div className="login-heading"><span >Contact Form</span></div>
                        <div className="refister-form">
                            <form action="" onSubmit={handleSubmit}>
                                <div className="input-container login_input">
                                    <label htmlFor="emailPhone" className='login-label'>Email/Phone No.</label>
                                    <input type="text" className="register-input" name="emailPhone" onChange={(e) => { setinputs({ ...inputs, emailPhone: e.target.value }) }} />
                                    <span className='text-danger'>{erros.emailPhone ? erros.emailPhone : ''}</span>
                                </div>
                                <div className="input-container login_input">
                                    <label htmlFor="message" className='login-label'>Message</label>
                                    <textarea name="message" rows={10} cols={61} onChange={(e) => { setinputs({ ...inputs, message: e.target.value }) }} />
                                    <span className='text-danger'>{erros.message ? erros.message : ''}</span>
                                </div>
                                <div className="login_btn-global">
                                    <button type="submit" className='SubmitBtn mt-3 mb-2' value='Submit'>Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="contact_info define_float">
                        <div className="whatsapp contact_inner-info"><Link className='' to={`https://wa.me/9915970179`} target="_blank"> <img src={process.env.PUBLIC_URL + '/image/whatsapp.png'} alt="" /></Link></div>
                        <div className="tel contact_inner-info">
                            <FaPhone size={30} /><Link to="tel:+91-82839-55440">+91-82839-55440</Link>
                        </div>
                        <div className="email contact_inner-info">
                            <FaEnvelope size={30} /><Link to="mailto:testdeveloper@gmail.com">testdeveloper@gmail.com</Link>
                        </div>
                        <div className="contactUsInfo">
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Contactus;
