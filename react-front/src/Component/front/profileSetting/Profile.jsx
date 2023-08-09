import React, { useState, useEffect, useRef } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import '../../../assets/front/css/profile.css';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { GrMail } from "react-icons/gr";

function Profile(props) {
    const [data, setdata] = useState({
        name: '',
        lname: '',
        email: '',
        phone: '',
        err: [],
    });

    const fetchUser_data = async () => {

        try {
            axios.get(`/api/profile`).then(res => {

                if (res.data.status == 200) {
                    setdata({ ...data, name: res.data.user.name, lname: res.data.user.last_name, email: res.data.user.email, phone: res.data.user.phone });
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'something went wrong!',
                    })
                }

            });
        }
        catch (err) {
            console.log(err);
        }

    }

    const HandleSubmit = (e) => {
        e.preventDefault();
        const mydata = {
            name: data.name,
            email: data.email,
            lname: data.lname,
            phone: data.phone,
        }

        console.log("profile update");
        console.log(mydata);


        try {
            axios.post(`/api/update/user`, mydata).then(res => {
                if (res.data.status == 200) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setdata({ ...data, err: '' });
                }
                else {
                    setdata({ ...data, err: res.data.error });
                }
            });

        } catch (err) {

        }
    }

    useEffect(() => {
        fetchUser_data();
    }, []);
    return (
        <div className="col-lg-8 col-md-12 col-sm-12">
            <div className='profile-img-section'>
                <div className="profile_bgimg">
                    <img src={process.env.PUBLIC_URL + '/image/Rectangle 185.png'} alt="" />
                </div>
                <div className="rofile_sec-part">
                    <div className='pr-img'>
                        <img src={process.env.PUBLIC_URL + '/image/undraw_profile.svg'} height={100} alt="" />
                        <div className='userName-profile'>
                            {data.name}
                        </div>
                    </div>
                    <div className='social-icon'>
                        <ul>
                            <li><Link to="/"><GrMail /></Link></li>
                            <li><Link to="/"><FaFacebook /></Link></li>
                            <li><Link to="/"><FaTwitter /></Link></li>
                            <li><Link to="/"><FaLinkedin /></Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="user-form profile_form-page define_float">
                <form action="" onSubmit={HandleSubmit}>
                    <div className="row userProfileForm" >
                        <div className="col-md-6">
                            <div className="login_input">
                                <label className='login-label' htmlFor="Name">Name</label>
                                <input type="text" className="form-control input-field" value={data.name || ''} onChange={(e) => { setdata({ ...data, name: e.target.value }) }} placeholder="First name" aria-label="First name" />
                                <span className='text-danger'>{data.err.name ? data.err.name : ''}</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="login_input">
                                <label className='login-label' htmlFor="lname">last name</label>
                                <input type="text" className="form-control input-field" value={data.lname || ''} onChange={(e) => { setdata({ ...data, lname: e.target.value }) }} placeholder="Last name" aria-label="Last name" />
                                <span className='text-danger'>{data.err.lname ? data.err.lname : ''}</span>
                            </div>
                        </div>
                        <div className="col-md-6 ">
                            <div className="login_input">
                                <label className='login-label' htmlFor="email">email</label>
                                <input type="text" className="form-control input-field" value={data.email || ''} onChange={(e) => { setdata({ ...data, email: e.target.value }) }} placeholder="Email" aria-label="Email" />
                                <span className='text-danger'>{data.err.email ? data.err.email : ''}</span>
                            </div>
                        </div>
                        <div className="col-md-6 ">
                            <div className="login_input">
                                <label className='login-label' htmlFor="phone">Phone</label>
                                <input type="text" className="form-control input-field" value={data.phone || ''} onChange={(e) => { setdata({ ...data, phone: e.target.value }) }} placeholder="Phone" aria-label="Phone" />
                            </div>
                        </div>
                        <div className="col-md-6 m-auto">
                            <div className="login_btn-global">
                                <button type="submit" className="SubmitBtn" value="Submit" onClick={HandleSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;