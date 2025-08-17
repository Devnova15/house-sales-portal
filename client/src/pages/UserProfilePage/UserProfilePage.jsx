import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaHeart, FaEdit, FaEnvelope, FaPhone, FaUserCircle } from 'react-icons/fa';
import { authService } from '../../services/authService';
import { houseWishlistService } from '../../services/houseWishlistService';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = authService.getCurrentUser();
    console.log('Current user data:', currentUser); // Добавляем отладочный вывод
    setUser(currentUser);

    // Load wishlist count
    try {
      const wishlist = await houseWishlistService.getWishlist();
      setWishlistCount(wishlist.length);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlistCount(0);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    
    // Show logout notification
    const toastDiv = document.createElement('div');
    toastDiv.textContent = 'Ви успішно вийшли з системи';
    toastDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #48bb78;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 9999;
      font-family: Arial, sans-serif;
    `;
    document.body.appendChild(toastDiv);
    setTimeout(() => {
      if (document.body.contains(toastDiv)) {
        document.body.removeChild(toastDiv);
      }
    }, 3000);
  };

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Завантаження профілю...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-page">
        <div className="error-container">
          <p>Помилка завантаження профілю користувача</p>
          <button onClick={() => navigate('/login')} className="login-button">
            Увійти в систему
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUserCircle className="avatar-icon" />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">
              {user.firstName} {user.lastName}
            </h1>
            <div className="profile-details">
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <span>{user.email || 'Email не вказано'}</span>
              </div>
              <div className="detail-item">
                <FaUser className="detail-icon" />
                <span>{user.login || 'Логін не вказано'}</span>
              </div>
              {user.telephone && (
                <div className="detail-item">
                  <FaPhone className="detail-icon" />
                  <span>{user.telephone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <div className="action-card" onClick={() => navigate('/wishlist')}>
            <FaHeart className="action-icon" />
            <div className="action-info">
              <h3>Обране</h3>
              <p>{wishlistCount} оголошень</p>
            </div>
          </div>

          <div className="action-card" onClick={handleLogout}>
            <FaSignOutAlt className="action-icon" />
            <div className="action-info">
              <h3>Вийти</h3>
              <p>Завершити сеанс</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;