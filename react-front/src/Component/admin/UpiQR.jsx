import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

function UpiQR() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [qrImage, setQrImage] = useState();
    const [inputs, setInputs] = useState({
        upiId: '',
        error: {
            upiId: '',
        },
    });

    const fetchUPIQRcode = () => {
        try {
            axios.get(`/api/admin/fetchUPIQRcode`).then((res) => {
                if (res.data.status === 200) {
                    setInputs({
                        ...inputs,
                        upiId: res.data.upi.upiId,
                    });
                    //setQrImage(`http://localhost:8000/${res.data.upi.image}`);
                    setQrImage(`https://kavitam.com/lara_beckend/public/${res.data.upi.image}`);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUPIQRcode();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('upiId', inputs.upiId);
        formData.append('imageFile', imageFile);

        try {
            const response = await axios.post(`/api/admin/UpiIdQRUpdate/1`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status === 200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 2000,
                });
                navigate('/admin/UpiQR');
            } else {
                if (response.data.status === 401) {
                    setInputs({ ...inputs, error: response.data.error });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };



    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     var data = {
    //         upiId: inputs.upiId,
    //         qrCode: inputs.qrCode,
    //     };

    //     try {
    //         axios.post(`/api/admin/UpiIdQRUpdate/1`, data).then((res) => {
    //             if (res.data.status === 200) {
    //                 Swal.fire({
    //                     position: 'center',
    //                     icon: 'success',
    //                     title: res.data.message,
    //                     showConfirmButton: false,
    //                     timer: 2000,
    //                 });
    //                 navigate('/admin/UpiQR');
    //             } else {
    //                 if (res.data.status === 401) {
    //                     setInputs({ ...inputs, error: res.data.error });
    //                 }
    //             }
    //         });
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    return (
        <div className="col-md-12 price_backend-title">
            <h2>UPI & QR</h2>
            <div className="card backend_price-form">

                <div className="card-body">
                    <form action="" onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* <form action="" onSubmit={handleSubmit}> */}
                        <div className="input-container login_input">
                            <label htmlFor="main_no" className="login-label">
                                UPI Id
                            </label>
                            <input
                                type="text"
                                name="upiId"
                                className="form-control"
                                value={inputs.upiId || ''}
                                onChange={(e) => {
                                    setInputs({ ...inputs, upiId: e.target.value });
                                }}
                            />
                            <span className="text-danger">{inputs.error.upiId}</span>
                        </div>

                        <div className="input-container login_input">
                            <label htmlFor="imageFile" className="login-label">
                                Image File
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                name="imageFile"
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                        </div>

                        <img src={qrImage} width={100} height={100} />

                        <div className="price_form-btn">
                            <button type="submit" className="btn btn-primary">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpiQR;
