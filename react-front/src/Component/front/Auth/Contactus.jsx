import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

function Contactus(props) {
    const navigate = useNavigate();
    const phone = useRef();

    const phonehandler = (e) => {
        phone.current = e.target.value;
        if (phone.current.length == 10) {

            setinputs({ ...inputs, verifyBtn: true });
        }
        else {
            setinputs({ ...inputs, verifyBtn: false });
        }
    }

    const [inputs, setinputs] = useState({
        email: '',
        phone: '',
        message: '',
    });
    const [erros, setError] = useState({});

    const handleAmountKeyPress = (e) => {
        const allowedCharacters = /^[0-9\b]+$/; // Regular expression to allow only digits (0-9) and backspace (\b)
        if (!allowedCharacters.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleInputValidation = (e) => {
        const minValue = 0; // Define your desired minimum value
        const maxValue = Number.MAX_SAFE_INTEGER; // Define your desired maximum value
        const currentValue = parseFloat(e.target.value);

        //if (currentValue < minValue || currentValue > maxValue) {
        if (currentValue < minValue) {
            e.target.value = ''; // Reset the value to an empty string or you can set it to a valid default value
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email: inputs.email,
            //phone: inputs.phone,
            phone: phone.current,
            message: inputs.message,
        };

        try {
            await axios.post(`/api/contactus`, data).then(res => {
                if (res.data.status == 200) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: res.data.message,
                        timer: 1500,
                    });

                    navigate('/');

                    // localStorage.setItem('auth_token', res.data.token);
                    // localStorage.setItem('user_name', res.data.username);
                    // localStorage.setItem('user_id', res.data.userid);
                    // //window.location.reload();

                    // // r2Admin
                    // if (res.data.token) {
                    //     navigate('/game');
                    // }
                    // else {
                    //     navigate('/');
                    // }

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
                                    <label htmlFor="email" className='login-label'>Email</label>
                                    <input type="text" className="register-input" name="email" onChange={(e) => { setinputs({ ...inputs, email: e.target.value }) }} />
                                    <span className='text-danger'>{erros.email ? erros.email : ''}</span>
                                </div>

                                <div className="input-container login_input">
                                    <label htmlFor="phone" className='login-label'>Phone number</label>
                                    <input type="number" className="register-input" name="phone" maxLength={15} minLength={10} onChange={phonehandler} onKeyPress={(e) => handleAmountKeyPress(e)}
                                        onInput={(e) => handleInputValidation(e)} />
                                    <span className='text-danger'>{erros.phone ? erros.phone : ''}</span>
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
