import React, { useState, useEffect } from 'react';
import { houseService } from '../../services/houseService';
import './HouseList.css';

const HouseList = ({ onEdit }) => {
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, houseId: null });

    // Fetch houses on component mount
    useEffect(() => {
        fetchHouses();
    }, []);

    const fetchHouses = async () => {
        try {
            setLoading(true);
            const data = await houseService.getAllHouses();
            setHouses(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching houses:', err);
            setError('Failed to load houses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (houseId) => {
        setDeleteConfirmation({ show: true, houseId });
    };

    const confirmDelete = async () => {
        try {
            await houseService.deleteHouse(deleteConfirmation.houseId);
            // Remove the deleted house from the state
            setHouses(houses.filter(house => house._id !== deleteConfirmation.houseId));
            // Hide the confirmation dialog
            setDeleteConfirmation({ show: false, houseId: null });
        } catch (err) {
            console.error('Error deleting house:', err);
            setError('Failed to delete house. Please try again later.');
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmation({ show: false, houseId: null });
    };

    if (loading) {
        return <div className="house-list-loading">Loading houses...</div>;
    }

    if (error) {
        return <div className="house-list-error">{error}</div>;
    }

    if (houses.length === 0) {
        return <div className="house-list-empty">No houses found. Add your first house using the form below.</div>;
    }

    return (
        <div className="house-list-container">
            <h3>Existing Houses</h3>
            <div className="house-list">
                {houses.map(house => (
                    <div key={house._id} className="house-card">
                        <div className="house-card-image">
                            {house.images && house.images.length > 0 ? (
                                <img src={house.images[0]} alt={house.title} />
                            ) : (
                                <div className="no-image">No Image</div>
                            )}
                        </div>
                        <div className="house-card-content">
                            <h4>{house.title}</h4>
                            <p className="house-price">${house.price.toLocaleString()}</p>
                            <p className="house-address">{house.address}</p>
                            <p className="house-details">
                                {house.bedrooms} bed • {house.bathrooms} bath • {house.area} m²
                            </p>
                            <div className="house-card-actions">
                                <button 
                                    className="edit-button"
                                    onClick={() => onEdit(house)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="delete-button"
                                    onClick={() => handleDeleteClick(house._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteConfirmation.show && (
                <div className="delete-confirmation-overlay">
                    <div className="delete-confirmation-dialog">
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete this house? This action cannot be undone.</p>
                        <div className="delete-confirmation-actions">
                            <button 
                                className="cancel-button"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button 
                                className="confirm-delete-button"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HouseList;