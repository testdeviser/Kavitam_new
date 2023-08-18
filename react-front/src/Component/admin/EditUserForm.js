import React, { useState } from 'react';

function EditUserForm({ user, onClose, onSave }) {
    const [erros, setError] = useState({});
    const [editedUser, setEditedUser] = useState(user);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSave = () => {
        onSave(editedUser);
    };

    const handleAmountKeyPress = (e) => {
        const allowedCharacters = /^[0-9\b]+$/; // Regular expression to allow only digits (0-9) and backspace (\b)
        if (!allowedCharacters.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleInputValidation = (e) => {
        const minValue = 0; // Define your desired minimum value
        const maxValue = Number.MAX_SAFE_INTEGER; // Define your desired maximum value
        const currentValue = parseFloat(e.target.value);

        //if (currentValue < minValue || currentValue > maxValue) {
        if (currentValue < minValue) {
            e.target.value = ''; // Reset the value to an empty string or you can set it to a valid default value
        }
    };

    return (
        <div className="edit-user-form">
            <h2>Edit User</h2>
            <div className='login_input col-lg-6 col-md-6 col-sm-12'>
                <label htmlFor="name" className='login-label'>Name</label>
                <input type="text" name="name" autoComplete='off' id="name" className='form-control' value={editedUser.name} onChange={handleInputChange} />
                <span className='text-danger'>{erros.name ? erros.name : ''}</span>
            </div>
            <div className='login_input col-lg-6 col-md-6 col-sm-12'>
                <label htmlFor="username" className='login-label'>Username</label>
                <input type="text" name="username" autoComplete='off' id="username" className='form-control' value={editedUser.username} onChange={handleInputChange} />
                <span className='text-danger'>{erros.username ? erros.username : ''}</span>
            </div>

            {/* <div className='login_input col-lg-6 col-md-6 col-sm-12'>
                <label htmlFor="number" className='login-label'>Phone Number</label>
                <input type="number" name="phone" autoComplete='off' id="phone" className='form-control' maxLength={15} minLength={10} onKeyPress={(e) => handleAmountKeyPress(e)}
                    onInput={(e) => handleInputValidation(e)} value={editedUser.phone} onChange={handleInputChange} />
                <span className='text-danger'>{erros.phone ? erros.phone : ''}</span>
            </div> */}

            <button className='account_edit update_user' onClick={handleSave}>Save Changes</button>
            <button type='button' className='user_update_cancel' onClick={onClose}>Cancel</button>
        </div>
    );
}

export default EditUserForm;
