import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', text = 'Завантаження...' }) => {
    return (
        <div className={`loader-container ${size}`}>
            <div className="loader-spinner"></div>
            {text && <p className="loader-text">{text}</p>}
        </div>
    );
};

export default Loader;
