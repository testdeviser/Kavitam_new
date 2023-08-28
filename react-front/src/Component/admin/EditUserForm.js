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

    // const handleSave = () => {
    //     onSave(editedUser);
    // };

    // const handleSave = async () => {
    //     try {
    //         // Send editedUser data to the server
    //         await onSave(editedUser);
    //     } catch (error) {
    //         if (error.response && error.response.data && error.response.data.errors) {
    //             // Handle specific error messages from the server
    //             setError(error.response.data.errors);
    //         } else {
    //             // Handle general error
    //             console.error("Error saving user:", error);
    //         }
    //     }
    // };

    const handleSave = async () => {
        try {
            // Send editedUser data to the server
            await onSave(editedUser);
            // Clear any previous errors
            setError({});
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                // Handle specific error messages from the server
                setError(error.response.data.errors);
            } else {
                // Handle general error
                console.error("Error saving user:", error);
            }
        }
    };


    return (
        <div className="edit-user-form">
            <h2>Edit User</h2>
            <div className='login_input col-lg-6 col-md-6 col-sm-12'>
                <label htmlFor="name" className='login-label'>Name</label>
                <input type="text" name="name" autoComplete='off' id="name" className='form-control' value={editedUser.name} onChange={handleInputChange} required />
                {/* <span className='text-danger'>{erros.name ? erros.name : ''}</span> */}
                <span className="text-danger">
                    {erros.name ? erros.name : editedUser.name ? "" : "Name is required"}
                </span>
            </div>
            <div className='login_input col-lg-6 col-md-6 col-sm-12'>
                <label htmlFor="username" className='login-label'>Username</label>
                <input type="text" name="username" autoComplete='off' id="username" className='form-control' value={editedUser.username} onChange={handleInputChange} />
                <span className="text-danger">
                    {erros.username ? erros.username : editedUser.username ? "" : "Username is required"}
                </span>
            </div>

            <div className="login_input col-lg-6 col-md-6 col-sm-12">
                <label htmlFor="password" className='login-label'>Password</label>
                <input type="password" className="register-input" name="password" onChange={handleInputChange} />
                <span className='text-danger'>{erros.password ? erros.password : ''}</span>
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
