import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Popup = ({ onClose }) => {
    return (
        <div className="popup">
            <div className="popup-content">
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                <button onClick={onClose}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
        </div>
    );
};

export default Popup;
