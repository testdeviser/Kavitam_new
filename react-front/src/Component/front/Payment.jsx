import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, createSearchParams, Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import UtrPop from './UtrPop';
import Modal from 'react-modal'; // Import the Modal component

Modal.setAppElement('#root'); // Set the app root element for accessibility

function Payment(props) {

    const navigate = useNavigate();
    const [err, seterr] = useState({ error: '' });
    const [isCopied, setIsCopied] = useState(false); // Add state for tracking copied text

    const [upiId, setUpiId] = useState();
    const [qrCode, setQrCode] = useState();
    const [qrImage, setQrImage] = useState();

    //const imageUrl = `${process.env.PUBLIC_URL}/images/1691412263.png`;

    //console.log(imageUrl);

    const baseUrl = process.env.REACT_APP_LARAVEL_BASE_URL;

    const showUPIQRcode = () => {
        try {
            axios.get(`/api/showUPIQRcode`).then((res) => {
                if (res.data.status === 200) {
                    setUpiId(res.data.upi.upiId);
                    setQrCode(res.data.upi.qrCode);
                    //setQrImage(`http://localhost:8000/${res.data.upi.image}`);
                    setQrImage(`https://kavitam.com/lara_beckend/public/${res.data.upi.image}`);
                    //setQrImage(`${baseUrl}/${res.data.upi.image}`);
                    // setInputs({
                    //     ...inputs,
                    //     upiId: res.data.upi.upiId,
                    //     qrCode: res.data.upi.qrCode,
                    // });
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        showUPIQRcode();
    }, []);


    const [inputs, setinputs] = useState({
        amount: '',
        refNo: '',
    });

    const handleCopyUPI = () => {
        navigator.clipboard.writeText(upiId);
        setIsCopied(true); // Update state when text is copied
    };

    useEffect(() => {
        if (isCopied) {
            const timeout = setTimeout(() => {
                setIsCopied(false); // Reset isCopied after a certain duration (e.g., 3 seconds)
            }, 5000); // Adjust the duration as needed (in milliseconds)

            return () => clearTimeout(timeout); // Clear the timeout if component unmounts or is updated
        }
    }, [isCopied]);

    const [time, setTime] = useState(10 * 60);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleAmountKeyPress = (e) => {
        const allowedCharacters = /^[0-9\b]+$/; // Regular expression to allow only digits (0-9) and backspace (\b)
        if (!allowedCharacters.test(e.key)) {
            e.preventDefault();
        }
    };

    const SubmitHandler = (e) => {
        e.preventDefault();
        var target = e.currentTarget;

        const data = {
            userId: localStorage.getItem('user_id'),
            username: localStorage.getItem('user_name'),
            amount: inputs.amount,
            refNo: inputs.refNo,
        };

        axios.post(`api/user/payment`, data).then(res => {
            // console.log(res);
            if (res.data.status == 200) {

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                // localStorage.setItem('auth_token', res.data.token);
                // localStorage.setItem('user_name', res.data.username);
                // localStorage.setItem('user_id', res.data.userid);

                navigate('/game');
            }
            else {
                seterr({ error: res.data.error });
            }
        });

    }

    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <section className='payment-section define_float'>
            <div className='container'>
                <div className='payment-wrapper define_float'>
                    <div className='payment_full-div'>
                        <div className='payment-form'>
                            <form onSubmit={SubmitHandler}>
                                <div className='upiLogo define_float'>
                                    <img src={process.env.PUBLIC_URL + '/image/upilogo.webp'} alt="circle_dot-left" />
                                    {/* <div className='payment-timer'>{formatTime(time)}</div> */}
                                </div>
                                <div className="steps_main-wrapper define_float">
                                    <div className='step1 payment-step-unique define_float'>
                                        <div className='step_title'><h5>Step 1.Copy UPI Information</h5></div>
                                        <div className='steps_border-inner define_float'>
                                            <div className='amount_require'>
                                                <div className='amount_inner-left'>
                                                    <label>Amount:</label>
                                                    <div className="amount-input">
                                                        <input type='number' name='amount' value={inputs.amount || ''} onChange={(e) => { setinputs({ ...inputs, amount: e.target.value }) }} onKeyPress={(e) => handleAmountKeyPress(e)} />
                                                        <span className='text-danger'>{err.error.amount ? err.error.amount : ''}</span>
                                                    </div>
                                                </div>
                                                {/* <div className='copy_btn'>
                                                    <button type="button" onClick={handleCopyUPI}>Copy</button>
                                                </div> */}
                                            </div>
                                            <div className='VPA_upi-ct'>
                                                <div className='VPA_inner-left'>
                                                    <label>VPA/UPI:{' '}</label>
                                                    {/* <div className='value-VPA'>{upiValue}</div> */}
                                                    <div className='value-VPA'>{upiId}</div>
                                                </div>

                                                <div className='qr-code-container copy_btn'>
                                                    {isCopied && <span className="copy-success-message">Copied!</span>}
                                                    <img src={qrImage} width={60} height={60} />
                                                    <button type="button" onClick={handleCopyUPI}>Copy</button>
                                                </div>
                                            </div>

                                            <div className='googlePhonePay'>
                                                <Link to="upi://pay?pa=kamalmaurya9646@okaxis&amp;pn=FNAME SNAME K&amp;cu=INR" class="upi-pay1">
                                                    <img src={process.env.PUBLIC_URL + '/image/googlePay.jpg'} alt="circle_dot-left" />
                                                </Link>
                                                <Link to="phonepe://pay?pa=8699755546@ybl&amp;pn=FNAME SNAME K&amp;cu=INR" class="upi-pay1">
                                                    <img src={process.env.PUBLIC_URL + '/image/phonePay.jpg'} alt="circle_dot-left" />
                                                </Link>
                                                <Link to="paytm://pay?pa=8699755546@paytm&amp;pn=FNAME SNAME K&amp;cu=INR" class="upi-pay1">
                                                    <img src={process.env.PUBLIC_URL + '/image/paytm.png'} alt="circle_dot-left" />
                                                </Link>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='step2 payment-step-unique define_float'>
                                        <div className='step_title'><h5>Step 2.Transfer and don't modify this amount to us by UPI transfer</h5></div>
                                        <div className='steps_border-inner define_float'>
                                            <div className='warning_text-payment'>
                                                <div className='warning_inner-ct'>
                                                    <img src={process.env.PUBLIC_URL + '/image/warningIcon.png'} alt="circle_dot-left" />
                                                    <p>Please record your reference No. (Ref No.) after payment</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='step3 payment-step-unique define_float'>
                                        <div className='step_title'><h5>Step 3.Please enter Ref No. to complete the recharge</h5></div>
                                        <div className='steps_border-inner define_float'>
                                            <div className='warning_text-payment'>
                                                <div className='warning_inner-ct'>
                                                    <img src={process.env.PUBLIC_URL + '/image/warningIcon.png'} alt="circle_dot-left" />
                                                    <p>Be sure to return this page to fill in the UTR numbers after you have completed your payment</p>
                                                </div>
                                                <div className='UTR-field'>
                                                    <input type='text' className='register-input' name='refNo' placeholder='UTR (UPI Ref.ID) must be 12 digits' value={inputs.refNo || ''} onChange={(e) => { setinputs({ ...inputs, refNo: e.target.value }) }} />
                                                    <span className='text-danger'>{err.error.refNo ? err.error.refNo : ''}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='tip_links define_float'>
                                    <span>TIPS:</span>
                                    <Link className='clickHere' onClick={openModal}>Click here to know "UTR/Ref No.">> </Link>
                                    {/* <Link className='clickHere'>Click here to know "UTR/Ref No.">> </Link> */}
                                </div>
                                <Modal
                                    isOpen={isModalOpen}
                                    onRequestClose={closeModal}
                                    contentLabel="UTR/Ref No."
                                >
                                    <UtrPop onClose={closeModal} />
                                </Modal>

                                <div className='login_btn-global payment-submt-UTR  define_float'>
                                    <button type="submit" className='SubmitBtn mt-3 mb-2' value='Submit' >Submit UTR</button>
                                </div>
                                <div className='payment-copyright define_float text-center'>
                                    <p>2023 Technical Support All Rights Reserved</p>
                                    <p>In case of any issues or queries, Please contact us or try again</p>
                                </div>

                                <div className='payment_bottom-logo define_float'>
                                    <img className='upi' src={process.env.PUBLIC_URL + '/image/upilogo.webp'} alt="upilogo" />
                                    <img src={process.env.PUBLIC_URL + '/image/icici-bank.webp'} alt="icici-bank" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* <div className="whatsapp-floating-icon">
                    <Link to={`https://wa.me/9915970179`} target="_blank" rel="noopener noreferrer">
                        <img
                            src={process.env.PUBLIC_URL + '/image/whatsapp.png'} // Replace with your WhatsApp icon image path
                            alt="WhatsApp Icon"
                            className="floating-pendulum" // Apply the floating animation class
                        />
                    </Link>
                </div> */}
            </div>
        </section>
    );
}

export default Payment;
