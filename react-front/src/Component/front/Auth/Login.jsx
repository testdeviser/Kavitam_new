import React, { useState, useReff, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import '../../../assets/front/css/login.css';

function Login(props) {

    const navigate = useNavigate();
    const [inputs, setinputs] = useState({
        username: '',
        password: '',

    });
    const [erros, setError] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            username: inputs.username,
            password: inputs.password,
        };

        try {
            await axios.post(`/api/user/login`, data).then(res => {
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
        // <div className='me-auto' style={{'display':'flex','justifyContent':'center','marginTop':'8vh'}}>
        //        <div className="card" style={{width:'30rem'}}> 
        //        <div className="card-body">
        //            <h5 className="card-title">Login</h5><hr/>
        //            <form action="" onSubmit={handleSubmit}>
        //                 <div className="mb-3">
        //                    <label htmlFor="login">Name</label>
        //                    <input type="text" name="" id="login" className='form-control'  onChange={(e)=>{setinputs({...inputs,name:e.target.value})}}/>
        //                     <span className='text-danger'>{erros.name?erros.name:''}</span>
        //                 </div>
        //                 <div className='mb-3'>
        //                     <label htmlFor="password">Password</label>
        //                     <input type="password" name="" autoComplete='off' id="password" className='form-control' onChange={(e)=>{setinputs({...inputs,password:e.target.value});}} />
        //                     <span className='text-danger'>{erros.password?erros.password:''}</span>
        //                 </div>
        //                 <div>
        //                    <button type="submit" className='btn btn-success button' value='Submit'>Submit</button>                   
        //                     <p className='signUP-here'>No account yet in Website?<Link to='/register' style={{'color':'#FC8019'}}>Register</Link> here to signup</p>                         
        //                 </div>
        //            </form>                 
        //         </div>
        //     </div>
        // </div>
        <>
            {/* <section className='login mt-5'> */}


            <section className='register-section define_float'>
                <div className="circle_dot-left">
                    <img src={process.env.PUBLIC_URL + '/image/circle_dot-left.png'} alt="circle_dot-left" />
                </div>
                <div className="circle_dot-right">
                    <img src={process.env.PUBLIC_URL + '/image/circle_dot-right.png'} alt="circle_dot-right" />
                </div>
                <div className="login-right-bttom">
                    <img src={process.env.PUBLIC_URL + '/image/login-right-bttom.png'} alt="login-right-bttom" />
                </div>
                <div className="container">
                    <div className="register-wrapper define_float">
                        <div className="left-side">
                            <div className="login-heading"><span >Fill the form as well</span></div>
                            <div className="login-form">
                                <form action="" onSubmit={handleSubmit}>

                                    <div className="login_input">
                                        <label htmlFor="login" className='login-label'>User name</label>
                                        <input type="text" name="" id="username" className='form-control' onChange={(e) => { setinputs({ ...inputs, username: e.target.value }) }} />
                                        <span className='text-danger'>{erros.username ? erros.username : ''}</span>
                                    </div>

                                    {/* <div className="mb-3">
                                    <label htmlFor="login" className='login-label'>Name</label>
                                    <input type="text" name="" id="login" className='form-control' onChange={(e) => { setinputs({ ...inputs, name: e.target.value }) }} />
                                    <span className='text-danger'>{erros.name ? erros.name : ''}</span>
                                </div> */}
                                    <div className='login_input'>
                                        <label htmlFor="password" className='login-label'>Password</label>
                                        <input type="password" name="" autoComplete='off' id="password" className='form-control' onChange={(e) => { setinputs({ ...inputs, password: e.target.value }); }} />
                                        <span className='text-danger'>{erros.password ? erros.password : ''}</span>
                                    </div>
                                    <div className="login_btn-global">
                                        <button type="submit" className='SubmitBtn' value='Submit'>Submit</button>
                                        <p className='signUP-here'>No account yet on Kavitam? <Link to='/register' style={{ 'color': '#FC8019' }}>Register</Link> here to win</p>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="right-side">
                            <div className="login-right-image">
                                <img src={process.env.PUBLIC_URL + '/image/login-rightSide-image.png'} alt="" />
                            </div>
                        </div>
                    </div>
                </div >
            </section>

            {/* </section> */}
        </>
    );
}
export default Login;