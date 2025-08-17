import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constans/rotes';
import './AdminLoginPage.css';
import {QUERY} from "../../constans/query.js";
import {sendRequest} from "../../utils/sendRequest.js";
/

const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            loginOrEmail: username,
            password: password,
        };

        setError('');
        setLoading(true);

        try {
            const data = await sendRequest(QUERY.ADMIN.LOGIN, 'POST', userData);

            if (data.success && data.token && data.token.includes('Bearer ') && data.token.length > 7) {
                console.log("Login success, token:", data.token);
                await login(data.token); // Save token in AuthContext and fetch user data
                console.log("Navigating to dashboard...");
                navigate(ROUTES.ADMIN.DASHBOARD); // Redirect to admin dashboard
            } else {
                console.error('Invalid token format:', data);
                setError(data.message || 'Authentication failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('Authentication error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <h2>Admin Login</h2>
                {error && <div className="admin-login-error">{error}</div>}
                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="admin-login-button" 
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
