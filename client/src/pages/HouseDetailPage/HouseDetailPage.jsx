import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaBed, FaBath, FaRulerCombined, FaTree, FaHome, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { houseService } from '../../services/houseService';
import { houseWishlistService } from '../../services/houseWishlistService';
import { authService } from '../../services/authService';
import { processImagePath, processImages } from '../../utils/imageUtils';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import './HouseDetailPage.css';

const HouseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mainImageError, setMainImageError] = useState(false);
    const [thumbnailErrors, setThumbnailErrors] = useState({});
    const [processedImages, setProcessedImages] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    
    // Wishlist states
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const [mapCenter, setMapCenter] = useState([50.202664892265766, 30.274876895590857]);

    const { data: house, isLoading, error } = useQuery({
        queryKey: ['house', id],
        queryFn: () => houseService.getHouseById(id)
    });

    useEffect(() => {
        if (house && house.images && Array.isArray(house.images)) {
            const processed = processImages(house.images);
            setProcessedImages(processed);
            console.log('Обработанные пути к изображениям:', processed);
        }

        if (house && house.coordinates) {
            setMapCenter(house.coordinates);
        }

        // Check wishlist status when house is loaded
        if (house && house._id) {
            checkWishlistStatus();
        }
    }, [house]);

    const checkWishlistStatus = async () => {
        try {
            const inWishlist = await houseWishlistService.isHouseInWishlist(house._id);
            setIsInWishlist(inWishlist);
        } catch (error) {
            // Silently fail - user might not be authenticated
            setIsInWishlist(false);
        }
    };

    const handleWishlistToggle = async () => {
        if (wishlistLoading) return;

        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
            // Create toast notification manually
            const toastDiv = document.createElement('div');
            toastDiv.textContent = 'Щоб додавати будинки до обраних, потрібно зареєструватися';
            toastDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f56565;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 9999;
                font-family: Arial, sans-serif;
            `;
            document.body.appendChild(toastDiv);
            setTimeout(() => {
                document.body.removeChild(toastDiv);
                navigate('/register');
            }, 3000);
            return;
        }

        try {
            setWishlistLoading(true);

            if (isInWishlist) {
                await houseWishlistService.removeFromWishlist(house._id);
                setIsInWishlist(false);
                showToast('Видалено з обраних', 'Будинок видалено зі списку обраних', 'success');
            } else {
                await houseWishlistService.addToWishlist(house._id);
                setIsInWishlist(true);
                showToast('Додано до обраних', 'Будинок додано до списку обраних', 'success');
            }
        } catch (error) {
            showToast('Помилка', error.message || 'Не вдалося оновити список обраних', 'error');
        } finally {
            setWishlistLoading(false);
        }
    };

    const showToast = (title, description, status) => {
        const toastDiv = document.createElement('div');
        toastDiv.innerHTML = `<strong>${title}</strong><br>${description}`;
        toastDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${status === 'success' ? '#48bb78' : '#f56565'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            max-width: 300px;
        `;
        document.body.appendChild(toastDiv);
        setTimeout(() => {
            if (document.body.contains(toastDiv)) {
                document.body.removeChild(toastDiv);
            }
        }, 3000);
    };

    const formatPrice = (price) => {
        return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const handleMainImageError = (e) => {
        console.error('Ошибка загрузки изображения:', e.target.src);
        setMainImageError(true);
        e.target.src = '/images/placeholder-house.jpg';
        e.target.onerror = null;
    };

    const handleThumbnailError = (index, e) => {
        setThumbnailErrors(prev => ({ ...prev, [index]: true }));
        e.target.src = '/images/placeholder-house.jpg';
        e.target.onerror = null;
    };

    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index);
        setMainImageError(false);
    };

    const handlePrevImage = () => {
        if (processedImages.length > 0) {
            setSelectedImageIndex((prevIndex) => 
                prevIndex > 0 ? prevIndex - 1 : processedImages.length - 1
            );
            setMainImageError(false);
        }
    };

    const handleNextImage = () => {
        if (processedImages.length > 0) {
            setSelectedImageIndex((prevIndex) => 
                prevIndex < processedImages.length - 1 ? prevIndex + 1 : 0
            );
            setMainImageError(false);
        }
    };


    if (isLoading) {
        return <div className="loading-container">Завантаження інформації про будинок...</div>;
    }

    if (error) {
        return <div className="error-container">Помилка завантаження: {error.message}</div>;
    }

    if (!house) {
        return <div className="not-found-container">Будинок не знайдено</div>;
    }

    const {
        title,
        price,
        address,
        description,
        bedrooms,
        bathrooms,
        area,
        plotArea,
        floors,
        characteristics,
        condition,
        communications,
        contactInfo
    } = house;

    const mainImage = !mainImageError && processedImages.length > 0
        ? processedImages[selectedImageIndex]
        : '/images/placeholder-house.jpg';

    return (
        <div className="house-detail-page">
            <div className="house-detail-header">
                <div className="header-top">
                    <h1>{title}</h1>
                    <button
                        className={`wishlist-button ${isInWishlist ? 'active' : ''} ${wishlistLoading ? 'loading' : ''}`}
                        onClick={handleWishlistToggle}
                        disabled={wishlistLoading}
                        title={isInWishlist ? "Видалити з обраного" : "Додати до обраного"}
                    >
                        <FaHeart className="heart-icon" />
                        {wishlistLoading ? 'Завантаження...' : (isInWishlist ? 'Видалити з обраного' : 'Додати до обраного')}
                    </button>
                </div>
                <div className="house-price">${formatPrice(price)}</div>
                <div className="house-address">{address}</div>
            </div>

            <div className="house-gallery">
                <div className="gallery-main">
                    <button 
                        className="gallery-nav-button prev-button" 
                        onClick={handlePrevImage}
                        aria-label="Попереднє зображення"
                    >
                        <FaChevronLeft />
                    </button>
                    <img
                        src={mainImage}
                        alt={title}
                        onError={handleMainImageError}
                    />
                    <button 
                        className="gallery-nav-button next-button" 
                        onClick={handleNextImage}
                        aria-label="Наступне зображення"
                    >
                        <FaChevronRight />
                    </button>
                </div>
                <div className="gallery-thumbnails">
                    {processedImages.map((image, index) => (
                        <div
                            key={index}
                            className={`gallery-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                            onClick={() => handleThumbnailClick(index)}
                        >
                            <img
                                src={!thumbnailErrors[index] ? image : '/images/placeholder-house.jpg'}
                                alt={`${title} - зображення ${index + 1}`}
                                onError={(e) => handleThumbnailError(index, e)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="house-content">
                <section className="house-overview">
                    <h2>Основна інформація</h2>
                    <div className="house-features">
                        <div className="feature">
                            <FaBed /> <span>{bedrooms} кімнат</span>
                        </div>
                        <div className="feature">
                            <FaBath /> <span>{bathrooms} ванна</span>
                        </div>
                        <div className="feature">
                            <FaRulerCombined /> <span>{area} м²</span>
                        </div>
                        <div className="feature">
                            <FaTree /> <span>{plotArea} соток</span>
                        </div>
                        <div className="feature">
                            <FaHome /> <span>{floors} поверх{floors > 1 ? 'и' : ''}</span>
                        </div>
                    </div>
                </section>

                <section className="house-description">
                    <h2>Опис</h2>
                    <p>{description}</p>
                </section>

                <section className="house-details">
                    <h2>Характеристики будинку</h2>
                    <div className="details-grid">
                        {characteristics?.wallType && (
                            <div className="detail-item">
                                <span className="detail-label">Тип стін</span>
                                <span className="detail-value">{characteristics.wallType}</span>
                            </div>
                        )}
                        {characteristics?.wallInsulation && (
                            <div className="detail-item">
                                <span className="detail-label">Утеплення</span>
                                <span className="detail-value">{characteristics.wallInsulation}</span>
                            </div>
                        )}
                        {characteristics?.roofType && (
                            <div className="detail-item">
                                <span className="detail-label">Тип даху</span>
                                <span className="detail-value">{characteristics.roofType}</span>
                            </div>
                        )}
                        {characteristics?.bathroom && (
                            <div className="detail-item">
                                <span className="detail-label">Санвузол</span>
                                <span className="detail-value">{characteristics.bathroom}</span>
                            </div>
                        )}
                        {characteristics?.heating && (
                            <div className="detail-item">
                                <span className="detail-label">Опалення</span>
                                <span className="detail-value">{characteristics.heating}</span>
                            </div>
                        )}
                        {characteristics?.floorHeating !== undefined && (
                            <div className="detail-item">
                                <span className="detail-label">Тепла підлога</span>
                                <span className="detail-value">{characteristics.floorHeating ? 'Так' : 'Ні'}</span>
                            </div>
                        )}
                    </div>
                </section>

                <section className="house-condition">
                    <h2>Стан будинку</h2>
                    <div className="details-grid">
                        {condition?.withRepair !== undefined && (
                            <div className="detail-item">
                                <span className="detail-label">З ремонтом</span>
                                <span className="detail-value">{condition.withRepair ? 'Так' : 'Ні'}</span>
                            </div>
                        )}
                        {condition?.repairType && (
                            <div className="detail-item">
                                <span className="detail-label">Тип ремонту</span>
                                <span className="detail-value">{condition.repairType}</span>
                            </div>
                        )}
                        {condition?.withFurniture !== undefined && (
                            <div className="detail-item">
                                <span className="detail-label">З меблями</span>
                                <span className="detail-value">{condition.withFurniture ? 'Так' : 'Ні'}</span>
                            </div>
                        )}
                        {condition?.yearBuilt && (
                            <div className="detail-item">
                                <span className="detail-label">Рік побудови</span>
                                <span className="detail-value">{condition.yearBuilt}</span>
                            </div>
                        )}
                    </div>
                </section>

                <section className="house-communications">
                    <h2>Комунікації</h2>
                    <div className="details-grid">
                        {communications?.sewerage && (
                            <div className="detail-item">
                                <span className="detail-label">Каналізація</span>
                                <span className="detail-value">{communications.sewerage}</span>
                            </div>
                        )}
                        {communications?.electricity !== undefined && (
                            <div className="detail-item">
                                <span className="detail-label">Електрика</span>
                                <span className="detail-value">{communications.electricity ? 'Так' : 'Ні'}</span>
                            </div>
                        )}
                        {communications?.water && (
                            <div className="detail-item">
                                <span className="detail-label">Вода</span>
                                <span className="detail-value">{communications.water}</span>
                            </div>
                        )}
                        {communications?.gas !== undefined && (
                            <div className="detail-item">
                                <span className="detail-label">Газ</span>
                                <span className="detail-value">{communications.gas ? 'Так' : 'Ні'}</span>
                            </div>
                        )}
                        {communications?.internet !== undefined && (
                            <div className="detail-item">
                                <span className="detail-label">Інтернет</span>
                                <span className="detail-value">{communications.internet ? 'Так' : 'Ні'}</span>
                            </div>
                        )}
                    </div>
                </section>

                {contactInfo && (
                    <section className="house-contact">
                        <h2>Контактна інформація</h2>
                        <div className="contact-info">
                            {contactInfo.name && <div className="contact-name">{contactInfo.name}</div>}
                            {contactInfo.phone && <div className="contact-phone">Телефон: {contactInfo.phone}</div>}
                            {contactInfo.email && <div className="contact-email">Email: {contactInfo.email}</div>}
                        </div>
                    </section>
                )}

                <section className="house-map-section">
                    <h2>Розташування будинка на карті</h2>
                    <div className="map-container">
                        <MapContainer
                            center={mapCenter}
                            zoom={13}
                            scrollWheelZoom={false}
                            style={{ height: '500px', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; OpenStreetMap contributors"
                            />
                            <Marker
                                position={mapCenter}
                                icon={new L.Icon({
                                    iconUrl: markerIconPng,
                                    shadowUrl: markerShadowPng,
                                    iconSize: [25, 41],
                                    iconAnchor: [12, 41],
                                    popupAnchor: [1, -34],
                                    shadowSize: [41, 41]
                                })}
                            >
                                <Popup>
                                    {title}<br />
                                    {address}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </section>
            </div>

            <div className="house-actions">
                <Link to="/houses" className="btn-secondary">Назад до списку</Link>

            </div>
        </div>
    );
};

export default HouseDetailPage;
