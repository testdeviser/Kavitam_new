import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import '../../../assets/front/css/login.css';

function Withdrawal(props) {

    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        bank_holder_name: '',
        account_no: '',
        confirm_account_no: '',
        ifsc_code: '',
        withdrawal_amount: '',
    });

    const [errors, setErrors] = useState({});
    const [submittedData, setSubmittedData] = useState(null);

    // useEffect(() => {
    //     const fetchBankDetails = async () => {
    //         try {
    //             const res = await axios.get(`/api/user/bankDetails/14}`);
    //             console.log(res.data);
    //             // const bankDetails = res.data.bankDetails;
    //             // setInputs(bankDetails);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };

    //     fetchBankDetails();

    //     if (submittedData) {
    //         fetchBankDetails();
    //     }
    // }, [submittedData]);

    const handleBankSubmit = async (e) => {
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
                //navigate('/Setting/addBankAccount');
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

    const [events, setEvents] = useState();
    useEffect(() => {
        axios.get('api/fetchWalletBalance').then((res) => {
            if (res.data.status === 200) {
                setEvents(res.data.amount);
            } else {
                console.log('Events not found');
            }
        });
    }, []);

    const [bankDetails, setBankDetails] = useState([]);
    useEffect(() => {
        axios.get('api/fetchBankData').then((res) => {
            if (res.data.status === 200) {
                setBankDetails(res.data.bankDetails); // Update state with the fetched bank details
            } else {
                console.log('Bank details not found');
            }
        });
    }, []);

    const [showReceivedAmount, setShowReceivedAmount] = useState(false); // State to control visibility of received amount div

    const handleSubmit = async (e) => {
        e.preventDefault();

        const withdrawalAmount = parseFloat(inputs.withdrawal_amount);
        const totalBalance = parseFloat(events);

        if (isNaN(withdrawalAmount)) {
            setErrors({ withdrawal_amount: 'Please enter withdrawal amount' });
            return;
        }

        if (withdrawalAmount <= 0) {
            setErrors({ withdrawal_amount: 'Withdrawal amount must be greater than zero' });
            return;
        }

        if (withdrawalAmount > totalBalance) {
            setErrors({ withdrawal_amount: 'Withdrawal amount exceeds total wallet balance' });
            return;
        }

        const data = {
            withdrawal_amount: inputs.withdrawal_amount,
        };

        try {
            const res = await axios.post(`/api/user/moneyWithdrawal`, data);
            //console.log(res.data);
            if (res.data.status === 200) {

                axios.get('api/fetchWalletBalance').then((res) => {
                    if (res.data.status === 200) {
                        setEvents(res.data.amount);
                    } else {
                        console.log('Events not found');
                    }
                });

                axios.get('api/fetchBankData').then((res) => {
                    if (res.data.status === 200) {
                        setBankDetails(res.data.bankDetails); // Update state with the fetched bank details
                    } else {
                        console.log('Bank details not found');
                    }
                });


                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: res.data.message,
                    timer: 1500,
                });
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setErrors({});
        setShowReceivedAmount(!!value); // Show received amount div if value is not empty
    };

    const calculateDeduction = () => {
        if (inputs.withdrawal_amount) {
            const withdrawalAmount = parseFloat(inputs.withdrawal_amount);
            //const deduction = withdrawalAmount * 0.06;
            const deduction = withdrawalAmount * 0.1;
            const receivedMoney = withdrawalAmount - deduction;
            return receivedMoney.toFixed(2);
        }
        return 0;
    };

    return (
        <>
            {submittedData || (bankDetails && bankDetails.length > 0) ? (
                <>
                    <div className="col-lg-8 col-md-12 col-sm-12">
                        <div className="submitted-details">
                            <h2>Bank Details</h2>
                            {submittedData ? (
                                <>
                                    <p>Bank Name: {submittedData.bank_holder_name}</p>
                                    <p>Account No.: {submittedData.account_no}</p>
                                    <p>IFSC Code: {submittedData.ifsc_code}</p>
                                </>
                            ) : bankDetails && bankDetails.length > 0 ? (
                                <>
                                    <p>Bank Name: {bankDetails[0].bank_holder_name}</p>
                                    <p>Account No.: {bankDetails[0].account_no}</p>
                                    <p>IFSC Code: {bankDetails[0].ifsc_code}</p>
                                </>
                            ) : (
                                <p>No bank details found.</p>
                            )}
                        </div>


                        <div className="register-wrapper change_pass-tabs define_float">
                            <div className="left-side">

                                <div className="login-form wallet_balance-aftersub">
                                    <div className="totalWalletBal define_float">
                                        <p>Total Wallet Balance: <span>Rs. {events}</span></p>
                                    </div>
                                    <form action="" onSubmit={handleSubmit} className="row">
                                        <div className="login_input col-lg-12 col-md-12 col-sm-12">
                                            <label htmlFor="withdrawal_amount" className="login-label">
                                                Withdrawal Amount
                                            </label>
                                            <input
                                                type="number"
                                                name="withdrawal_amount"
                                                autoComplete="off"
                                                id="withdrawal_amount"
                                                className="form-control"
                                                onChange={handleInputChange}
                                                value={inputs.withdrawal_amount}
                                            />
                                            <span className="text-danger">
                                                {errors.withdrawal_amount ? errors.withdrawal_amount : ''}
                                            </span>
                                        </div>
                                        {showReceivedAmount && ( // Show the received amount div conditionally
                                            <div className="login_input col-lg-12 col-md-12 col-sm-12">
                                                <label htmlFor="deduction_amount" className="login-label">
                                                    Received Amount
                                                </label>

                                                <input
                                                    type="text"
                                                    name="deduction_amount"
                                                    autoComplete="off"
                                                    id="deduction_amount"
                                                    className="form-control"
                                                    disabled
                                                    value={`Rs. ${calculateDeduction()}`}
                                                />
                                                <span className="text-dangers">Note: 10% DEDUCTION ON WITHDRAWAL</span>
                                            </div>
                                        )}

                                        <div className="login_btn-global confirm_pass-btn col-lg-6 col-md-6 col-sm-12">
                                            <button type="submit" className="SubmitBtn" value="Submit">
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className='col-lg-8 col-md-12 col-sm-12'>
                    <div className="register-wrapper change_pass-tabs define_float">
                        <div className="left-side">
                            <div className="login-heading">
                                <span>Add Bank Account</span>
                            </div>
                            <div className="login-form">
                                <form onSubmit={handleBankSubmit} className="row">
                                    <div className='login_input col-lg-6 col-md-6 col-sm-12'>
                                        <label htmlFor="bank_name" className='login-label'>
                                            Bank Holder Name
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
                                            type="number"
                                            className="register-input form-control"
                                            name="account_no"
                                            value={inputs.account_no}
                                            onChange={(e) =>
                                                setInputs({ ...inputs, account_no: e.target.value })
                                            }
                                        />
                                        <span className='text-danger'>{errors.account_no ? errors.account_no : ''}</span>
                                    </div>

                                    <div className="login_input col-lg-6 col-md-6 col-sm-12">
                                        <label htmlFor="confirm_account_no" className='login-label'>
                                            Confirm Account No.
                                        </label>
                                        <input
                                            type="number"
                                            className="register-input form-control"
                                            name="confirm_account_no"
                                            value={inputs.confirm_account_no}
                                            onChange={(e) =>
                                                setInputs({ ...inputs, confirm_account_no: e.target.value })
                                            }
                                        />
                                        <span className='text-danger'>{errors.confirm_account_no ? errors.confirm_account_no : ''}</span>
                                    </div>

                                    <div className="login_input col-lg-6 col-md-6 col-sm-12">
                                        <label htmlFor="ifsc_code" className='login-label'>IFSC Code</label>
                                        <input
                                            type="text"
                                            className="register-input form-control"
                                            name="ifsc_code"
                                            value={inputs.ifsc_code}
                                            onChange={(e) =>
                                                setInputs({ ...inputs, ifsc_code: e.target.value })
                                            }
                                        />
                                        <span className='text-danger'>{errors.ifsc_code ? errors.ifsc_code : ''}</span>
                                    </div>

                                    <div className="login_btn-global confirm_pass-btn col-lg-6 col-md-6 col-sm-12">
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
        </>
    );
}

export default Withdrawal;
