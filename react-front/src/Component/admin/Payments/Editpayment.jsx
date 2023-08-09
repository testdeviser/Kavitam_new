import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

function EditPayment(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [value, onChange] = useState(new Date());
    const [inputs, setinputs] = useState({
        status: 0,
        username: '',
        amount: '',
        refNo: '',
        error: [],
    });

    const prefilldata = useRef();
    const preStatus = useRef(0);

    const fetchEditData = () => {
        try {
            axios.get(`/api/admin/payments/editdata/${id}`).then(res => {
                if (res.data.status === 200) {
                    setinputs({
                        ...inputs,
                        status: res.data.payment.status,
                        username: res.data.payment.username,
                        amount: res.data.payment.amount,
                        refNo: res.data.payment.refNo,
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchEditData();
    }, []);

    const handleStatus = (e) => {
        var isChecked = e.target.checked;
        if (isChecked) {
            setinputs({ ...inputs, status: 1 });
        }
        else {
            setinputs({ ...inputs, status: 0 });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        var data = {
            status: inputs.status,
            username: inputs.username,
            amount: inputs.amount,
            refNo: inputs.refNo,
        }

        console.log(data);
        try {
            axios.post(`/api/admin/payments/update_payments/${id}`, data).then(res => {
                if (res.data.status === 200) {

                    //console.log("dfhgd");
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                    navigate('/admin/payments');
                }
                else {
                    // Swal.fire({
                    //     icon: 'error',
                    //     title: 'Oops...',
                    //     text: res.data.message,     
                    //   })
                    if (res.data.status == 401) {
                        setinputs({ ...inputs, error: res.data.err });
                    }
                }
            })
        }
        catch (err) {
            console.log(err);
        }

    }


    return (

        <div className="container">
            <div className="row justify-content-center" style={{ 'marginTop': '20vh' }}>
                <div className="col-md-8">
                    <div className="card">
                        <h3 className='card-title text-center' style={{ 'textDecorationLine': 'underline', 'textDecorationStyle': 'double' }} >Edit Event</h3>
                        <div className="card-body">
                            <form action="" onSubmit={handleSubmit}>

                                <div className="mb-3">
                                    <label htmlFor="login">Username</label>
                                    <input type="text" name="username" id="" className='form-control' value={inputs.username || ''} onChange={(e) => { setinputs({ ...inputs, username: e.target.value }) }} disabled />
                                    <span className='text-danger'>{inputs.error.username ? inputs.error.username : ''}</span>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="login">Amount</label>
                                    <input type="number" name="amount" id="" className='form-control' value={inputs.amount || ''} onChange={(e) => { setinputs({ ...inputs, amount: e.target.value }) }} disabled />
                                    <span className='text-danger'>{inputs.error.amount ? inputs.error.amount : ''}</span>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="login">Reference No.</label>
                                    <input type="text" name="refNo" id="" className='form-control' value={inputs.refNo || ''} onChange={(e) => { setinputs({ ...inputs, refNo: e.target.value }) }} disabled />
                                    <span className='text-danger'>{inputs.error.refNo ? inputs.error.refNo : ''}</span>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="status">Status</label>
                                    <select
                                        name="status"
                                        id="status"
                                        className='form-control'
                                        value={inputs.status}
                                        onChange={(e) => { setinputs({ ...inputs, status: e.target.value }) }}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="1" selected={inputs.status === "1"}>Approved</option>
                                        <option value="0" selected={inputs.status === "0"}>Rejected</option>
                                    </select>
                                    <span className='text-danger'>{inputs.error && inputs.error.status ? inputs.error.status : ''}</span>
                                </div>

                                {/* <div className="mb-3">
                                    <label htmlFor="status">Status</label>
                                    <select name="status" id="status" className='form-control' value={inputs.status}>
                                        <option value="">Select Status</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    <span className='text-danger'>{inputs.error && inputs.error.status ? inputs.error.status : ''}</span>
                                </div> */}

                                <div className="mb-3">
                                    <button type="submit" className="btn btn-primary w-100">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default EditPayment;