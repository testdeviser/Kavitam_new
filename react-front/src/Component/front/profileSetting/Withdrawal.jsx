import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import '../../../assets/front/css/login.css';
import firebaseApp from '../../../firebase';
// import firebase from 'firebase';
// import 'firebase/database';

// const firebaseConfig = {
//     apiKey: "AIzaSyB24PCT-aOcD4sWvdqhHprnaRW-UnUNeWI",
//     authDomain: "kavitam-f583c.firebaseapp.com",
//     databaseURL: "https://kavitam-f583c-default-rtdb.firebaseio.com",
//     projectId: "kavitam-f583c",
//     storageBucket: "kavitam-f583c.appspot.com",
//     messagingSenderId: "41954438926",
//     appId: "1:41954438926:web:f010162141b77ce975b1   5f",
//     measurementId: "G-WRRBLXSV06"
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

function Withdrawal(props) {

    const navigate = useNavigate();
    const database = firebaseApp.database(); // Define 'database' using the imported Firebase app
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
            bank_name: inputs.bank_name,
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

    var auth_token = localStorage.getItem("auth_token");

    // const handleEdit = () => {
    //     setSubmittedData(null);
    // };

    const [events, setEvents] = useState();
    useEffect(() => {
        if (auth_token) {
            axios.get('api/fetchWalletBalance').then((res) => {
                if (res.data.status === 200) {
                    setEvents(res.data.amount);
                } else {
                    console.log('Events not found');
                }
            });
        }
    }, [auth_token]);

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

    // const database = firebase.database(); // Define 'database' at the component level

    const [walletAmount, setWalletAmount] = useState(0); // Initialize with the initial wallet amount
    const [withdrawalAmount, setWithdrawalAmount] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);

    useEffect(() => {
        // Reference to the Firebase database node
        const firebase_node = localStorage.getItem('firebase_node');

        const uniqueValue = firebase_node; // Replace with your actual unique value
        const withdrawalAmountRef = database.ref(`ammount/${uniqueValue}/walletBalance`);

        // Set up a listener for changes in the database
        withdrawalAmountRef.on('value', (snapshot) => {
            const data = snapshot.val();
            setWalletBalance(data);
            if (data !== null) {
                setWithdrawalAmount(data); // Update the state with the value from the database
            }
        });

        // Clean up the listener when the component unmounts
        return () => {
            withdrawalAmountRef.off('value');
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const withdrawalAmount = parseFloat(inputs.withdrawal_amount);
        // const totalBalance = parseFloat(events);
        const totalBalance = walletBalance;

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

                //update data in firebase
                const updatedAmount = parseFloat(res.data.ammount);
                setWalletAmount(updatedAmount); // Update the wallet amount in React state

                // Optionally, update wallet amount in Firebase (if needed)
                const firebase_node = localStorage.getItem('firebase_node');

                const uniqueValue = firebase_node; // Replace with your actual unique value
                const withdrawalAmountRef = database.ref(`ammount/${uniqueValue}/walletBalance`);
                withdrawalAmountRef.set(updatedAmount.toString());
                //end update data in firebase


                // add data in firebas real time database   
                // const withdrawalData = {
                //     withdrawalAmount: inputs.withdrawal_amount,
                // };

                // // Replace 'withdrawals' with the name of the Firebase Realtime Database node where you want to store the data
                // const newWithdrawalRef = database.ref('ammount').push();
                // newWithdrawalRef.set(withdrawalData);

                //end


                // axios.get('api/fetchWalletBalance').then((res) => {
                //     if (res.data.status === 200) {
                //         setEvents(res.data.amount);
                //     } else {
                //         console.log('Events not found');
                //     }
                // });

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
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Clear the error for this field
        }));
        //setErrors({});
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

    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        bank_holder_name: '',
        bank_name: '',
        account_no: '',
        confirm_account_no: '',
        ifsc_code: '',
    });

    // ... (Other states and useEffects)

    const handleEdit = async () => {
        setEditMode(true);
        // Clear errors when switching to edit mode
        setErrors({});

        try {
            const res = await axios.get('api/fetchBankData'); // Modify the API endpoint accordingly
            if (res.data.status === 200 && res.data.bankDetails.length > 0) {
                const bankDetails = res.data.bankDetails[0]; // Assuming you're fetching a single bank detail
                setEditData({
                    bank_holder_name: bankDetails.bank_holder_name,
                    bank_name: bankDetails.bank_name,
                    account_no: bankDetails.account_no,
                    confirm_account_no: bankDetails.account_no,
                    ifsc_code: bankDetails.ifsc_code,
                });
            } else {
                console.log('Bank details not found');
            }
        } catch (err) {
            console.log(err);
        }

        // setEditData({
        //     bank_holder_name: bankDetails[0].bank_holder_name,
        //     account_no: bankDetails[0].account_no,
        //     confirm_account_no: bankDetails[0].account_no,
        //     ifsc_code: bankDetails[0].ifsc_code,
        // });
    };

    // const handleEditInputChange = (e) => {
    //     const { name, value } = e.target;
    //     if (name == 'confirm_account_no') {
    //         setEditData((prevState) => ({
    //             ...prevState,
    //             confirm_account_no: value,
    //         }));
    //     } else {
    //         setEditData((prevState) => ({
    //             ...prevState,
    //             [name]: value,
    //         }));
    //     }
    // };

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

    // const handleEditInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setEditData((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    // };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "ifsc_code") {
            // Use a regular expression to allow only alphabets and numbers
            const alphanumericRegex = /^[a-zA-Z0-9]*$/;

            if (!alphanumericRegex.test(value)) {
                return; // Don't update the state if input is invalid
            }
        }

        setEditData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };



    const handleEditSubmit = async (e) => {
        e.preventDefault();

        // Adjust the data structure for editing
        const data = {
            user_id: localStorage.getItem('user_id'),
            bank_holder_name: editData.bank_holder_name,
            bank_name: editData.bank_name,
            account_no: editData.account_no,
            confirm_account_no: editData.confirm_account_no,
            ifsc_code: editData.ifsc_code,
        };

        try {
            const res = await axios.post(`/api/user/editBankAccount`, data); // Modify the API endpoint for editing
            if (res.data.status === 200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: res.data.message,
                    timer: 1500,
                });
                setSubmittedData(data);
                // Handle success
                setEditMode(false); // Exit edit mode after successful edit
                // ... (Perform necessary actions after successful edit)
            } else if (res.data.status === 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops',
                    text: res.data.message,
                });
                // Handle error
            } else {
                setErrors(res.data.error);
                // Handle other errors
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {submittedData || (bankDetails && bankDetails.length > 0) ? (
                <>
                    {editMode ? (
                        <div className='col-lg-8 col-md-12 col-sm-12'>
                            <div className="register-wrapper change_pass-tabs define_float">
                                <div className="left-side">
                                    <div className="login-heading">
                                        <span>Edit Bank Account</span>
                                    </div>
                                    <div className="login-form">
                                        {/* <form onSubmit={handleEditSubmit} className="row"> */}
                                        <form onSubmit={handleEditSubmit} className="row">


                                            <div className="login_input col-lg-6 col-md-6 col-sm-12">
                                                <label htmlFor="account_no" className='login-label'>
                                                    Account No.
                                                </label>
                                                <input
                                                    type="tel"
                                                    maxLength={14}
                                                    className="register-input form-control"
                                                    name="account_no"
                                                    value={editData.account_no}
                                                    onChange={handleEditInputChange}
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
                                                    maxLength={14}
                                                    className="register-input form-control"
                                                    name="confirm_account_no"
                                                    value={editData.confirm_account_no}
                                                    onChange={handleEditInputChange}
                                                    onKeyPress={(e) => handleAmountKeyPress(e)}
                                                    onInput={(e) => handleInputValidation(e)}
                                                />
                                                <span className='text-danger'>{errors.confirm_account_no ? errors.confirm_account_no : ''}</span>
                                            </div>

                                            <div className='login_input col-lg-6 col-md-6 col-sm-12'>
                                                <label htmlFor="bank_name" className='login-label'>
                                                    Bank Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="bank_name"
                                                    autoComplete='off'
                                                    id="bank_name"
                                                    className='form-control'
                                                    value={editData.bank_name}
                                                    onChange={handleEditInputChange}
                                                />
                                                <span className='text-danger'>{errors.bank_name ? errors.bank_name : ''}</span>
                                            </div>

                                            <div className='login_input col-lg-6 col-md-6 col-sm-12'>
                                                <label htmlFor="bank_holder_name" className='login-label'>
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="bank_holder_name"
                                                    autoComplete='off'
                                                    className='form-control'
                                                    value={editData.bank_holder_name}
                                                    onChange={handleEditInputChange}
                                                />
                                                <span className='text-danger'>
                                                    {errors.bank_holder_name ? errors.bank_holder_name : ''}
                                                </span>
                                            </div>

                                            <div className="login_input col-lg-6 col-md-6 col-sm-12">
                                                <label htmlFor="ifsc_code" className='login-label'>IFSC Code</label>
                                                <input
                                                    type="text"
                                                    className="register-input form-control"
                                                    name="ifsc_code"
                                                    value={editData.ifsc_code}
                                                    onChange={handleEditInputChange}
                                                />
                                                <span className='text-danger'>{errors.ifsc_code ? errors.ifsc_code : ''}</span>
                                            </div>

                                            {/* Rest of the form fields for editing */}
                                            <div className="login_btn-global confirm_pass-btn col-lg-12 col-md-12 col-sm-12">
                                                <div className="Update_and-cancel">
                                                    <button type="submit" className='SubmitBtn update_cancel' value='Submit'>
                                                        Update
                                                    </button>
                                                    <button type="button" className="update_cancel1" onClick={() => setEditMode(false)}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            <div className="submitted-details">
                                <h2>Bank Details</h2>
                                {submittedData ? (
                                    <>
                                        <p>Account No.: {submittedData.account_no}</p>
                                        <p>Bank Name: {submittedData.bank_name}</p>
                                        <p>Name: {submittedData.bank_holder_name}</p>
                                        <p>IFSC Code: {submittedData.ifsc_code}</p>
                                        <button className='account_edit' onClick={handleEdit}>Edit</button>
                                    </>
                                ) : bankDetails && bankDetails.length > 0 ? (
                                    <>
                                        <p>Account No.: {bankDetails[0].account_no}</p>
                                        <p>Bank Name: {bankDetails[0].bank_name}</p>
                                        <p>Name: {bankDetails[0].bank_holder_name}</p>
                                        <p>IFSC Code: {bankDetails[0].ifsc_code}</p>
                                        <button className='account_edit' onClick={handleEdit}>Edit</button> {/* Add Edit Button */}
                                    </>
                                ) : (
                                    <p>No bank details found.</p>
                                )}
                            </div>
                            <div className="register-wrapper change_pass-tabs define_float">
                                <div className="left-side">

                                    <div className="login-form wallet_balance-aftersub">
                                        <div className="totalWalletBal define_float">
                                            {/* <p>Total Wallet Balance: <span>Rs. {events}</span></p> */}
                                            <p>Total Wallet Balance: <span>Rs. {withdrawalAmount}</span></p>
                                            {/* <p>Firebase Balance: <span>Rs. {withdrawalAmount}</span></p> */}
                                        </div>
                                        <form action="" onSubmit={handleSubmit} className="row">
                                            <div className="login_input col-lg-12 col-md-12 col-sm-12">
                                                <label htmlFor="withdrawal_amount" className="login-label">
                                                    Withdrawal Amount
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="withdrawal_amount"
                                                    autoComplete="off"
                                                    id="withdrawal_amount"
                                                    className="form-control"
                                                    onChange={handleInputChange}
                                                    value={inputs.withdrawal_amount}
                                                    onKeyPress={(e) => handleAmountKeyPress(e)}
                                                    onInput={(e) => handleInputValidation(e)}
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
                    )}
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
                                    <div className="login_input col-lg-6 col-md-6 col-sm-12">
                                        <label htmlFor="account_no" className='login-label'>
                                            Account No.
                                        </label>
                                        <input
                                            type="tel"
                                            maxLength={14}
                                            className="register-input form-control"
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
                                            maxLength={14}
                                            className="register-input form-control"
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

                                    <div className='login_input col-lg-6 col-md-6 col-sm-12'>
                                        <label htmlFor="bank_name" className='login-label'>
                                            Bank Name
                                        </label>
                                        <input
                                            type="text"
                                            name="bank_name"
                                            autoComplete='off'
                                            id="bank_name"
                                            className='form-control'
                                            value={inputs.bank_name}
                                            onChange={(e) =>
                                                setInputs({ ...inputs, bank_name: e.target.value })
                                            }
                                        />
                                        <span className='text-danger'>{errors.bank_name ? errors.bank_name : ''}</span>
                                    </div>

                                    <div className='login_input col-lg-6 col-md-6 col-sm-12'>
                                        <label htmlFor="bank_holder_name" className='login-label'>
                                            Name
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
                                        <label htmlFor="ifsc_code" className='login-label'>IFSC Code</label>
                                        <input
                                            type="text"
                                            className="register-input form-control"
                                            name="ifsc_code"
                                            value={inputs.ifsc_code}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric characters
                                                setInputs({ ...inputs, ifsc_code: value });
                                            }}
                                        />
                                        {/* <input
                                            type="text"
                                            className="register-input form-control"
                                            name="ifsc_code"
                                            value={inputs.ifsc_code}
                                            onChange={(e) =>
                                                setInputs({ ...inputs, ifsc_code: e.target.value })
                                            }
                                        /> */}
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


