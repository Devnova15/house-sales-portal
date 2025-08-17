import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constans/rotes';
import './AdminDashboardPage.css';
import AddHouseForm from './AddHouseForm';
import HouseList from './HouseList';

const AdminDashboardPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [activeTab, setActiveTab] = useState('upload');
    const [houseToEdit, setHouseToEdit] = useState(null);
    const [refreshHouseList, setRefreshHouseList] = useState(0);

    const handleLogout = () => {
        logout();
        navigate(ROUTES.ADMIN.LOGIN);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Create a preview URL for the selected image
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(file);
            setUploadStatus('');
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setUploadStatus('Please select a file first');
            return;
        }

        // In a real application, you would upload the file to a server
        // For this example, we'll just simulate a successful upload
        setTimeout(() => {
            setUploadStatus('File uploaded successfully!');
            // Reset the form
            setSelectedFile(null);
            setPreviewUrl('');
        }, 1500);
    };

    // Handle editing a house
    const handleEditHouse = (house) => {
        setHouseToEdit(house);
        setActiveTab('houses');
        // Scroll to the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle form submission (add or update)
    const handleFormSubmit = (result) => {
        if (result) {
            // If we got a result, the form was submitted successfully
            // Increment the refresh counter to trigger a refresh of the house list
            setRefreshHouseList(prev => prev + 1);
        }

        // Reset the house being edited
        setHouseToEdit(null);
    };

    return (
        <div className="admin-dashboard-container">
            <div className="admin-sidebar">
                <h2>Admin Panel</h2>
                <nav className="admin-nav">
                    <button 
                        className={`admin-nav-item ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        Image Upload
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'houses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('houses')}
                    >
                        Manage Houses
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Settings
                    </button>
                </nav>
                <button onClick={handleLogout} className="admin-logout-button">
                    Logout
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'upload' && (
                    <div className="admin-panel">
                        <h3>Upload Images</h3>
                        <form onSubmit={handleUpload} className="upload-form">
                            <div className="form-group">
                                <label htmlFor="image-upload">Select Image</label>
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {previewUrl && (
                                <div className="image-preview">
                                    <h4>Preview</h4>
                                    <img src={previewUrl} alt="Preview" />
                                </div>
                            )}

                            {uploadStatus && (
                                <div className={`upload-status ${uploadStatus.includes('success') ? 'success' : 'error'}`}>
                                    {uploadStatus}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="upload-button"
                                disabled={!selectedFile}
                            >
                                Upload Image
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'houses' && (
                    <div className="admin-panel">
                        <h3>Manage Houses</h3>
                        <p>Here you can add, edit, or delete house listings.</p>

                        {/* Form for adding or editing houses */}
                        <AddHouseForm 
                            houseToEdit={houseToEdit} 
                            onFormSubmit={handleFormSubmit} 
                        />

                        {/* List of existing houses */}
                        <HouseList 
                            onEdit={handleEditHouse} 
                            key={refreshHouseList} // Force re-render when refreshHouseList changes
                        />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="admin-panel">
                        <h3>Settings</h3>
                        <p>Configure your admin dashboard settings.</p>
                        <div className="placeholder-content">
                            <p>This feature is under development.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
