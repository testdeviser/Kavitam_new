import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../../../assets/front/css/login.css';

function Login(props) {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        bank_holder_name: '',
        account_no: '',
        confirm_account_no: '',
        ifsc_code: '',
    });
    const [errors, setErrors] = useState({});
    const [submittedData, setSubmittedData] = useState(null);

    useEffect(() => {
        // Fetch user's previously added bank details here and set them to the inputs state
        // Replace the API endpoint and user ID with your actual implementation
        const fetchBankDetails = async () => {
            try {
                const res = await axios.get(`/api/user/bankDetails/14}`);
                console.log(res.data);
                // const bankDetails = res.data.bankDetails;
                // setInputs(bankDetails);
            } catch (err) {
                console.log(err);
            }
        };

        fetchBankDetails();

        if (submittedData) {
            fetchBankDetails();
        }
    }, [submittedData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            bank_holder_name: inputs.bank_holder_name,
            account_no: inputs.account_no,
            confirm_account_no: inputs.confirm_account_no,
            ifsc_code: inputs.ifsc_code,
        };

        try {
            const res = await axios.post(`/api/user/addBankAccount`, data);
            if (res.data.status === 200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: res.data.message,
                    timer: 1500,
                });
                setSubmittedData(data);
                navigate('/Setting/addBankAccount');
            } else if (res.data.status === 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops',
                    text: res.data.message,
                });
            } else {
                setErrors(res.data.error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleEdit = () => {
        setSubmittedData(null);
    };

    const handleAmountKeyPress = (e) => {
        const allowedCharacters = /^[0-9\b]+$/; // Regular expression to allow only digits (0-9) and backspace (\b)
        if (!allowedCharacters.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleInputValidation = (e) => {
        const sanitizedValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
        e.target.value = sanitizedValue;

        const minValue = 0; // Define your desired minimum value
        const maxValue = Number.MAX_SAFE_INTEGER; // Define your desired maximum value
        const currentValue = parseFloat(sanitizedValue);

        if (currentValue < minValue || currentValue > maxValue) {
            e.target.value = ''; // Reset the value to an empty string or you can set it to a valid default value
        }
    };

    return (
        <>
            {!submittedData && (
                <div className='col-lg-8 col-md-12 col-sm-12'>
                    <div className="register-wrapper change_pass-tabs define_float">
                        <div className="left-side">
                            <div className="login-heading">
                                <span>Add Bank Account</span>
                            </div>
                            <div className="login-form">
                                <form onSubmit={handleSubmit} className="row">
                                    <div className='login_input col-lg-6 col-md-6 col-sm-12'>
                                        <label htmlFor="bank_holder_name" className='login-label'>
                                            Bank Name
                                        </label>
                                        <input
                                            type="text"
                                            name="bank_holder_name"
                                            autoComplete='off'
                                            id="bank_holder_name"
                                            className='form-control'
                                            value={inputs.bank_holder_name}
                                            onChange={(e) =>
                                                setInputs({ ...inputs, bank_holder_name: e.target.value })
                                            }
                                        />
                                        <span className='text-danger'>{errors.bank_holder_name ? errors.bank_holder_name : ''}</span>
                                    </div>

                                    <div className="login_input col-lg-6 col-md-6 col-sm-12">
                                        <label htmlFor="account_no" className='login-label'>
                                            Account No.
                                        </label>
                                        <input
                                            type="tel"
                                            className="register-input"
                                            name="account_no"
                                            value={inputs.account_no}
                                            onChange={(e) =>
                                                setInputs({ ...inputs, account_no: e.target.value })
                                            }
                                            onKeyPress={(e) => handleAmountKeyPress(e)}
                                            onInput={(e) => handleInputValidation(e)}
                                        />
                                        <span className='text-danger'>{errors.account_no ? errors.account_no : ''}</span>
                                    </div>

                                    <div className="login_input col-lg-6 col-md-6 col-sm-12">
                                        <label htmlFor="confirm_account_no" className='login-label'>
                                            Confirm Account No.
                                        </label>
                                        <input
                                            type="tel"
                                            className="register-input"
                                            name="confirm_account_no"
                                            value={inputs.confirm_account_no}
                                            onChange={(e) =>
                                                setInputs({ ...inputs, confirm_account_no: e.target.value })
                                            }
                                            onKeyPress={(e) => handleAmountKeyPress(e)}
                                            onInput={(e) => handleInputValidation(e)}
                                        />
                                        <span className='text-danger'>{errors.confirm_account_no ? errors.confirm_account_no : ''}</span>
                                    </div>

                                    <div className="login_input col-lg-6 col-md-6 col-sm-12">
                                        <label htmlFor="ifsc_code" className='login-label'>IFSC Code</label>
                                        <input
                                            type="text"
                                            className="register-input"
                                            name="ifsc_code"
                                            value={inputs.ifsc_code}
                                            onChange={(e) =>
                                                setInputs({ ...inputs, ifsc_code: e.target.value })
                                            }
                                        />
                                        <span className='text-danger'>{errors.ifsc_code ? errors.ifsc_code : ''}</span>
                                    </div>

                                    <div className="login_btn-global confirm_pass-btn col-lg-6 col-md-6 col-sm-12">
                                        <label htmlFor="confirmPassword" className='login-label'>
                                            Confirm Password
                                        </label>
                                        <button type="submit" className='SubmitBtn' value='Submit'>
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {submittedData && (
                <div className="submitted-details">
                    <h2>Submitted Bank Details</h2>
                    <p>Bank Name: {submittedData.bank_holder_name}</p>
                    <p>Account No.: {submittedData.account_no}</p>
                    <p>IFSC Code: {submittedData.ifsc_code}</p>
                    <button onClick={handleEdit}>Edit</button>
                </div>
            )}
        </>
    );
}

export default Login;
