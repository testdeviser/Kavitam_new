import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

function PriceMultiplyBy() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        main: '',
        ander: '',
        bahar: '',
        error: {
            main: '',
            ander: '',
            bahar: '',
        },
    });

    const fetchPriceMultiplyBy = () => {
        try {
            axios.get(`/api/admin/fetchPriceMultiplyBy`).then((res) => {
                if (res.data.status === 200) {
                    setInputs({
                        ...inputs,
                        main: res.data.price.main,
                        ander: res.data.price.ander,
                        bahar: res.data.price.bahar,
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPriceMultiplyBy();
    }, []);

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


    const handleSubmit = (e) => {
        e.preventDefault();

        var data = {
            main: inputs.main,
            ander: inputs.ander,
            bahar: inputs.bahar,
        };

        try {
            axios.post(`/api/admin/PriceMultiplyByUpdate/1`, data).then((res) => {
                if (res.data.status === 200) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    navigate('/admin/PriceMultiplyBy');
                } else {
                    if (res.data.status === 401) {
                        setInputs({ ...inputs, error: res.data.error });
                    }
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="col-md-12 price_backend-title">
            <h2>Price Calculator</h2>
            <div className="card backend_price-form">

                <div className="card-body">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="input-container login_input">
                            <label htmlFor="main_no" className="login-label">
                                Main
                            </label>
                            <input
                                type="tel"
                                name="main"
                                className="form-control"
                                value={inputs.main || ''}
                                onChange={(e) => {
                                    setInputs({ ...inputs, main: e.target.value });
                                }}
                                onKeyPress={(e) => handleAmountKeyPress(e)}
                                onInput={(e) => handleInputValidation(e)}
                            />
                            <span className="text-danger">{inputs.error.main}</span>
                        </div>

                        <div className="input-container login_input">
                            <label htmlFor="ander_no" className="login-label">
                                Andar
                            </label>
                            <input
                                type="tel"
                                name="ander"
                                className="form-control"
                                value={inputs.ander || ''}
                                onChange={(e) => {
                                    setInputs({ ...inputs, ander: e.target.value });
                                }}
                                onKeyPress={(e) => handleAmountKeyPress(e)}
                                onInput={(e) => handleInputValidation(e)}
                            />
                            <span className="text-danger">{inputs.error.ander}</span>
                        </div>

                        <div className="input-container login_input">
                            <label htmlFor="bahar_no" className="login-label">
                                Bahar
                            </label>
                            <input
                                type="tel"
                                name="bahar"
                                className="form-control"
                                value={inputs.bahar || ''}
                                onChange={(e) => {
                                    setInputs({ ...inputs, bahar: e.target.value });
                                }}
                                onKeyPress={(e) => handleAmountKeyPress(e)}
                                onInput={(e) => handleInputValidation(e)}
                            />
                            <span className="text-danger">{inputs.error.bahar}</span>
                        </div>

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

export default PriceMultiplyBy;
