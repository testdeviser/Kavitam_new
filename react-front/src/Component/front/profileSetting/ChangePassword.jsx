import React, { useState, useReff, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import '../../../assets/front/css/login.css';

function Login(props) {

    const navigate = useNavigate();
    const [inputs, setinputs] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',

    });
    const [erros, setError] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            oldPassword: inputs.oldPassword,
            newPassword: inputs.newPassword,
            confirmPassword: inputs.confirmPassword,
        };

        try {
            await axios.post(`/api/user/changePassword`, data).then(res => {
                //console.log(res.data);
                if (res.data.status == 200) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: res.data.message,
                        timer: 1500,
                    });
                    // localStorage.setItem('auth_token', res.data.token);
                    // localStorage.setItem('user_name', res.data.username);
                    // localStorage.setItem('user_id', res.data.userid);

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
        <>
            {/* <section className='register-section define_float'>
                <div className="container"> */}
            <div className='col-lg-8 col-md-12 col-sm-12'>
                <div className="register-wrapper change_pass-tabs define_float">
                    <div className="left-side">
                        {/* <div className="login-heading"><span >Change Password</span></div> */}
                        <div className="login-form">
                            <form action="" onSubmit={handleSubmit} className="row">
                                <div className='login_input col-lg-6 col-md-6 col-sm-12'>
                                    <label htmlFor="oldPassword" className='login-label'>Old Password</label>
                                    <input type="password" name="oldPassword" autoComplete='off' id="oldPassword" className='form-control' onChange={(e) => { setinputs({ ...inputs, oldPassword: e.target.value }); }} />
                                    <span className='text-danger'>{erros.oldPassword ? erros.oldPassword : ''}</span>
                                </div>

                                <div className="login_input col-lg-6 col-md-6 col-sm-12">
                                    <label htmlFor="newPassword" className='login-label'>New Password</label>
                                    <input type="Password" className="register-input" name="newPassword" onChange={(e) => { setinputs({ ...inputs, newPassword: e.target.value }) }} />
                                    <span className='text-danger'>{erros.newPassword ? erros.newPassword : ''}</span>
                                </div>
                                <div className="login_input col-lg-6 col-md-6 col-sm-12">
                                    <label htmlFor="confirmPassword" className='login-label'>Confirm Password</label>
                                    <input type="Password" className="register-input" name="confirmPassword" onChange={(e) => { setinputs({ ...inputs, confirmPassword: e.target.value }) }} />
                                    <span className='text-danger'>{erros.confirmPassword ? erros.confirmPassword : ''}</span>
                                </div>

                                <div className="login_btn-global confirm_pass-btn col-lg-6 col-md-6 col-sm-12">
                                    <label htmlFor="confirmPassword" className='login-label'>Confirm Password</label>
                                    <button type="submit" className='SubmitBtn' value='Submit'>Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* </div >
            </section> */}

        </>
    );
}
export default Login;