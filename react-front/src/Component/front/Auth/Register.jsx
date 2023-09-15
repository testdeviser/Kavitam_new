import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import app from './firbase_config';
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import Navbar from '../../../layouts/front/navbar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, createSearchParams, Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';
import firebaseApp from '../../../firebase';

// const auth = getAuth(app);

function Register(props) {

  const navigate = useNavigate();
  const database = firebaseApp.database(); // Define 'database' using the imported Firebase app

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const referralCode = searchParams.get('referralCode');

  const phone = useRef();
  const [err, seterr] = useState({ error: '', otpVerifyErr: '' });
  const [inputs, setinputs] = useState({
    name: '',
    username: '',
    //lastName: '',
    referredby_user_link: '',
    email: '',
    user_password: '',
    user_confirmpassword: '',
    firebase_node: '',
    gmail_password: '',
    verify_phone: false,
    otp: '',
    otp_varification: false,
    verifyBtn: false,
    otpSentMsg: true,
    p_suggestion: '',
    //refferalCode: '',
  });

  // const oncaptchaVerifier = () => {
  //   if (!window.recaptchaVerifier) {
  //     window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
  //       'size': 'invisible',
  //       'callback': (response) => {
  //         onSingInSubmit();

  //       }
  //     }, auth);

  //   }
  // }


  // const onSingInSubmit = (e) => {
  //   e.preventDefault();
  //   oncaptchaVerifier();

  //   var data = {
  //     phone: phone.current,
  //   }

  //   axios.post('/api/checkPhone', data).then(res => {
  //     if (res.data.status == 200) {
  //       const phoneNumber = "+91" + phone.current;
  //       const appVerifier = window.recaptchaVerifier;

  //       signInWithPhoneNumber(auth, phoneNumber, appVerifier)
  //         .then((confirmationResult) => {
  //           window.confirmationResult = confirmationResult;

  //           setinputs({ ...inputs, otp_varification: true });
  //           seterr({ error: '' });
  //           // ...
  //         }).catch((error) => {
  //           console.log(error);
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Oops...',
  //             text: 'Verification failed, Please try again...',
  //           })
  //           // alert('verification failed');
  //         });

  //     }
  //     else {
  //       seterr({ error: res.data.error });
  //     }
  //   });
  // }


  const verifyOtp = (e) => {

    e.preventDefault();
    window.confirmationResult.confirm(inputs.otp).then((result) => {

      const user = result.user;
      console.log(user);

      setinputs({ ...inputs, verify_phone: true });

      seterr({ ...err, otpVerifyErr: '' })
    }).catch((error) => {

      seterr({ ...err, otpVerifyErr: 'please enter valid otp' });
    });
  }


  const phonehandler = (e) => {
    phone.current = e.target.value;
    if (phone.current.length == 10) {

      setinputs({ ...inputs, verifyBtn: true });
    }
    else {
      setinputs({ ...inputs, verifyBtn: false });
    }
  }



  // const CheckMail=(e)=>{ 
  //   e.preventDefault();
  //     const data={
  //       email:inputs.email,     
  //     };

  //   axios.post(`/api/send-mail`,data).then(res=>{
  //     console.log(res);
  //       if(res.data.status==200)
  //       {
  //         setinputs({...inputs,gmail_password:res.data.password});

  //         if(res.data.status==200)
  //         {
  //             Swal.fire({
  //               position:'center',
  //               icon: 'success',
  //               title:res.data.message,
  //               showConfirmButton: false,
  //               timer: 2000
  //             });   
  //         }
  //         else{
  //                 console.log(res);
  //                 Swal.fire({
  //                   icon: 'error',
  //                   title: 'Oops...',
  //                   text: res.data.message,     
  //                 })
  //         }

  //       }
  //       else{
  //           setinputs({...inputs,gmail_password:0});
  //       }
  //   });
  // }


  const SubmitHandler = (e) => {
    e.preventDefault();
    var target = e.currentTarget;

    // add data in firebas real time database   
    const withdrawalData = {
      walletBalance: 0,
    };

    // Replace 'withdrawals' with the name of the Firebase Realtime Database node where you want to store the data
    const newWithdrawalRef = database.ref('ammount').push();
    const newWithdrawalKey = newWithdrawalRef.key; // Get the unique key
    newWithdrawalRef.set(withdrawalData);

    // Set the value of a hidden input field
    const hiddenInput = document.getElementById('firebase_node'); // Replace 'hiddenInput' with the ID of your hidden input field
    hiddenInput.value = newWithdrawalKey;

    //end

    const data = {
      name: inputs.name,
      // email:inputs.email,
      // mail_pass:inputs.gmail_password,
      // referredby_user_link: referralCode,
      referredby_user_link: referralCode || inputs.referredby_user_link || null,
      user_password: inputs.user_password,
      user_confirmpassword: inputs.user_confirmpassword,
      phone: phone.current,
      verify_phone: inputs.verify_phone,
      username: inputs.username,
      firebase_node: newWithdrawalKey
      //lname: inputs.lastName,
      //refferalCode: inputs.refferalCode,
    };

    axios.post(`api/user/Register`, data).then(res => {
      // console.log(res);
      if (res.data.status == 200) {

        console.log(res);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: res.data.message,
          showConfirmButton: false,
          timer: 1500
        });
        localStorage.setItem('auth_token', res.data.token);
        localStorage.setItem('firebase_node', res.data.firebase_node);
        localStorage.setItem('user_name', res.data.username);
        localStorage.setItem('user_id', res.data.userid);

        localStorage.setItem("selectedMainNumbers", []);
        localStorage.setItem("selectedMainNumbersAmounts", []);
        localStorage.setItem("selectedInnerNumbers", []);
        localStorage.setItem("selectedInnerNumbersAmounts", []);
        localStorage.setItem("selectedOuterNumbers", []);
        localStorage.setItem("selectedOuterNumbersAmounts", []);


        //localStorage.setItem("user_name", res.data.name);
        //localStorage.setItem("auth_token", res.data.token);

        navigate('/game');
      }
      else if (res.data.status == 401) {
        console.log(res);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.data.message,
        })
      }
      else {
        console.log(res);
        seterr({ error: res.data.error });
        setinputs({ ...inputs, p_suggestion: res.data.p_suggestion });
      }
    });

  }


  var checkOtp = '';
  if (inputs.otp_varification) {
    if (!inputs.verify_phone) {
      checkOtp = (
        <>
          <label htmlFor="email">Otp </label>
          <input type="number" className="form-control" name="Otp" onChange={(e) => { setinputs({ ...inputs, otp: e.target.value }); }} /><button onClick={verifyOtp} className="btn btn-primary w-100">Verify Otp</button>
          <span className='text-danger'>{err.otpVerifyErr ? err.otpVerifyErr : ''}</span>
        </>
      );
    }
  }

  // var verifybtn = ''
  // if (inputs.verifyBtn) {

  //   if (!inputs.verify_phone) {
  //     verifybtn = (
  //       <>
  //         <button className='btn btn-primary w-100' onClick={onSingInSubmit}>Verify</button>
  //         {inputs.otp_varification ? <><span className="text-success">Otp sent successfully</span></> : <></>}
  //       </>
  //     )
  //   }

  // }

  const handleAmountKeyPress = (e) => {
    const currentValue = e.target.value;

    // Remove any non-digit and non-plus characters
    const sanitizedValue = currentValue.replace(/[^0-9+]/g, '');

    // Check if the input exceeds the maximum length (15 characters)
    if (sanitizedValue.length >= 15 && !['Backspace', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      return;
    }

    // Allow specific key events
    if (
      (e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'y', 'z'].includes(e.key) || // Ctrl key shortcuts
      ['ArrowLeft', 'ArrowRight', 'Backspace'].includes(e.key) // Arrow keys and Backspace
    ) {
      return;
    }

    // Check if the '+' sign is already present
    const plusIndex = sanitizedValue.indexOf('+');

    // Allow the '+' character only at the beginning or if it follows a non-digit character
    if (
      (e.key === '+' && (plusIndex !== -1 || e.target.selectionStart !== 0)) ||
      (e.target.selectionStart > 0 && sanitizedValue.charAt(e.target.selectionStart - 1) !== '+' && !/^[0-9]$/.test(e.key))
    ) {
      e.preventDefault();
      return;
    }

    // Update the input value with the sanitized value
    e.target.value = sanitizedValue;
  };


  // const handleAmountKeyPress = (e) => {
  //   // Allow the backspace key
  //   if (e.key === 'Backspace') {
  //     return;
  //   }

  //   // Check if the pressed key is not a digit or the '+' character
  //   if (!/^[0-9+]$/.test(e.key)) {
  //     e.preventDefault();
  //   }

  //   // Allow only one '+' character at the beginning
  //   if (e.target.value === '+' && e.key === '+') {
  //     e.preventDefault();
  //   }

  //   // Allow only digits after the '+' character
  //   if (e.target.value === '+' && /^[0-9]$/.test(e.key)) {
  //     return;
  //   }
  // };

  // const handleAmountKeyPress = (e) => {
  //   const allowedCharacters = /^[0-9\b+]+$/; // Regular expression to allow digits (0-9) and '+'
  //   if (!allowedCharacters.test(e.key)) {
  //     e.preventDefault();
  //   }
  // };

  // const handleAmountKeyPress = (e) => {
  //   const allowedCharacters = /^[0-9\b]+$/; // Regular expression to allow only digits (0-9) and backspace (\b)
  //   if (!allowedCharacters.test(e.key)) {
  //     e.preventDefault();
  //   }
  // };

  const handleInputValidation = (e) => {
    const sanitizedValue = e.target.value.replace(/[^0-9+]/g, ''); // Allow only numbers and '+'
    e.target.value = sanitizedValue;

    const minValue = 0; // Define your desired minimum value
    const maxValue = Number.MAX_SAFE_INTEGER; // Define your desired maximum value
    const currentValue = parseFloat(sanitizedValue);

    if (currentValue < minValue || currentValue > maxValue) {
      e.target.value = ''; // Reset the value to an empty string or you can set it to a valid default value
    }
  };


  // const handleInputValidation = (e) => {
  //   const minValue = 0; // Define your desired minimum value
  //   const maxValue = Number.MAX_SAFE_INTEGER; // Define your desired maximum value
  //   const currentValue = parseFloat(e.target.value);

  //   //if (currentValue < minValue || currentValue > maxValue) {
  //   if (currentValue < minValue) {
  //     e.target.value = ''; // Reset the value to an empty string or you can set it to a valid default value
  //   }
  // };


  var password_suggestion = '';
  // if(p_suggestion )
  // {
  //   password_suggestion=(
  //     <>
  //       <span className='text-success'>{err.error.p_suggestion?err.error.p_suggestion:''}</span>     
  //     </>
  //   )
  // }

  const myStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL + "/image/dot.png"})`,
    height: '347px',
    width: '350px',
    transform: 'rotate(180deg)',
    // marginTop:'-70px',
    // fontSize:'50px',
    // backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  };

  return (


    // <div>               
    //   <div style={{display:'flex',justifyContent:'center',marginTop:'8vh'}}>
    //     <div className="card" style={{width:'30rem'}}> 
    //   <div className="card-body">
    //     <h5 className="card-title">Registration</h5>  

    //    {inputs.p_suggestion?<> <span >Name Suggestion:<b className='text-success'> {inputs.p_suggestion}</b></span></>:''}

    //     <form action="/action_page.php" className='mt-4' onSubmit={SubmitHandler} >



    //       <div className="form-group">
    //       <label htmlFor="name">First Name </label>
    //       <input type="text" className="form-control" name="name" onChange={(e)=>{setinputs({...inputs,name:e.target.value})}}/>      
    //       <span className='text-danger'>{err.error.name?err.error.name:''}</span>            
    //       </div>

    //       <div className="form-group">
    //       <label htmlFor="name">Last Name </label>
    //       <input type="text" className="form-control" name="name" value={inputs.lastName||''} onChange={(e)=>{setinputs({...inputs,lastName:e.target.value})}}/>    
    //       </div>



    //         <div className="form-group">
    //         <label htmlFor="email">Enter your phone number</label>
    //         <input type="number" className="form-control" name="phone" maxLength={10} minLength={10} onChange={phonehandler} disabled={inputs.verify_phone?true:false}/> 
    //         {inputs.verify_phone?<><span className="text-success">Phone verify successfully!!</span></>:<></>}
    //         <span className='text-danger'>{err.error.phone?err.error.phone:''}</span>    
    //       {verifybtn}

    //       <span className='mt-2 text-success'>{inputs.otpSentMsg}</span>            
    //       </div>

    //       <div className="form-group">
    //          {checkOtp}               
    //       </div>  

    //      <div  id='recaptcha-container'></div>

    //      <div className="form-group">
    //         <label htmlFor="name">Enter your password</label><input type="Password" className="form-control" name="Password" onChange={(e)=>{setinputs({...inputs,user_password:e.target.value}) }}/>  
    //         <span className='text-danger'>{err.error.user_password?err.error.user_password:''}</span>      
    //       </div>

    //       <div className="form-group">
    //         <label htmlFor="name">Refferral code (optional)</label>
    //         <input type="text" className="form-control" name="Refferral-code" onChange={(e)=>{setinputs({...inputs,refferalCode:e.target.value}) }}/>                   
    //         <span className='text-danger'>{err.error.refferalCode?err.error.refferalCode:''}</span>      
    //       </div>

    //       <button type="submit" className="btn btn-success mt-2" >Submit</button> 
    //       <p>Already have an account in website?<Link to='/login' style={{'color':'#FC8019'}}>Login</Link> here to signin.</p>          
    //       {/* <button type="reset" className="btn btn-danger mt-2" style={{marginLeft:'10px'}}>Reset</button> */}
    //       </form>
    //   </div>
    // </div>
    // </div>
    // </div>


    <section className="register-section define_float">
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
            <div className="refister-form">
              <form onSubmit={SubmitHandler}>

                {/* <input type="hidden" name="referredby_user_link" value={referralCode} /> */}
                <input type="hidden" id='firebase_node' name="firebase_node" value="" />

                <div className="input-container login_input">
                  <label htmlFor="name" className='login-label'>Name </label>
                  <input type="text" className="register-input" name="name" onChange={(e) => { setinputs({ ...inputs, name: e.target.value }) }} />
                  <span className='text-danger'>{err.error.name ? err.error.name : ''}</span>
                </div>

                <div className="input-container login_input">
                  <label htmlFor="name" className='login-label'>User name </label>
                  <input type="text" className="register-input" name="username" value={inputs.username || ''} onChange={(e) => { setinputs({ ...inputs, username: e.target.value }) }} />
                  <span className='text-danger'>{err.error.username ? err.error.username : ''}</span>
                </div>

                <div className="input-container login_input">
                  <label htmlFor="email" className='login-label'>Phone number</label>
                  <input
                    // type="text"
                    type="tel"
                    className="register-input"
                    name="phone"
                    maxLength={15}
                    minLength={10}
                    onChange={phonehandler}
                    onKeyDown={handleAmountKeyPress} // Change from onKeyPress to onKeyDown
                    onInput={(e) => handleInputValidation(e)}
                    disabled={inputs.verify_phone ? true : false}
                  />

                  {/* <input type="number" className="register-input" name="phone" maxLength={15} minLength={10} onChange={phonehandler} onKeyPress={(e) => handleAmountKeyPress(e)}
                    onInput={(e) => handleInputValidation(e)} disabled={inputs.verify_phone ? true : false} /> */}
                  <span className='text-danger'>{err.error.phone ? err.error.phone : ''}</span>
                </div>

                {/* <div className="input-container">
                <label htmlFor="email" className='login-label'>Phone number</label>
                <input type="number" className="register-input" name="phone" maxLength={10} minLength={10} onChange={phonehandler} disabled={inputs.verify_phone ? true : false} /> */}
                {/* <input type="number" className="register-input" name="phone" maxLength={10} minLength={10} onChange={phonehandler} disabled={inputs.verify_phone ? true : false} /> */}
                {/* {inputs.verify_phone ? <><span className="text-success">Phone verify successfully!!</span></> : <></>} */}
                {/* <span className='text-danger'>{err.error.phone ? err.error.phone : ''}</span> */}
                {/* {verifybtn} */}
                {/* <span className='mt-2 text-success'>{inputs.otpSentMsg}</span> */}
                {/* </div> */}

                {/* <div className="input-container login_input">
                  {checkOtp}
                </div>

                <div id='recaptcha-container'></div> */}

                <div className="input-container login_input">
                  <label htmlFor="name" className='login-label'>Password</label><input type="Password" className="register-input" name="Password" onChange={(e) => { setinputs({ ...inputs, user_password: e.target.value }) }} />
                  <span className='text-danger'>{err.error.user_password ? err.error.user_password : ''}</span>
                </div>
                <div className="input-container login_input">
                  <label htmlFor="name" className='login-label'>Confirm Password</label><input type="Password" className="register-input" name="confirmPassword" onChange={(e) => { setinputs({ ...inputs, user_confirmpassword: e.target.value }) }} />
                  <span className='text-danger'>{err.error.user_confirmpassword ? err.error.user_confirmpassword : ''}</span>
                </div>

                <div className="input-container login_input">
                  <label htmlFor="name" className='login-label'>Referral Code</label>
                  {/* <input type="text" className='register-input' name="referredby_user_link" value={referralCode} /> */}
                  <input type="text" className='register-input' name="referredby_user_link" value={inputs.referredby_user_link || referralCode || ''}
                    onChange={(e) => setinputs({ ...inputs, referredby_user_link: e.target.value })} />
                  <span className='text-danger'>{err.error.referredby_user_link ? err.error.referredby_user_link : ''}</span>
                </div>

                {/* <div className="input-container">
                <label htmlFor="name" className='login-label'>Refferral code (optional)</label>
                <input type="text" className="register-input" name="Refferral-code" onChange={(e) => { setinputs({ ...inputs, refferalCode: e.target.value }) }} />
                <span className='text-danger'>{err.error.refferalCode ? err.error.refferalCode : ''}</span>
              </div> */}
                <div className="login_btn-global">
                  <button type="submit" className='SubmitBtn mt-3 mb-2' value='Submit' >Submit</button>
                  {/* <button type="submit" className='SubmitBtn' value='Submit'>Submit</button>      */}
                  <p>Already have an account on Kavitam? <Link to='/login' className='mt-3' style={{ 'color': '#FC8019' }}>Login</Link> here to signin.</p>
                  {/* <button type="reset" className="btn btn-danger mt-2" style={{marginLeft:'10px'}}>Reset</button> */}
                </div>
              </form>
            </div>
          </div>

          <div className='right-side'>
            <div className="register-right-image">
              <img src={process.env.PUBLIC_URL + '/image/login-rightSide-image.png'} alt="" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Register;