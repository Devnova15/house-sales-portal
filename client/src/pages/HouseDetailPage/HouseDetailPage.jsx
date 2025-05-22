// src/pages/HouseDetailPage/HouseDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaBed, FaBath, FaRulerCombined, FaTree, FaHome } from 'react-icons/fa';
import { houseService } from '../../services/houseService';
import { processImagePath, processImages } from '../../utils/imageUtils';
import './HouseDetailPage.css';

const HouseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // Состояния для отслеживания ошибок изображений
    const [mainImageError, setMainImageError] = useState(false);
    const [thumbnailErrors, setThumbnailErrors] = useState({});
    const [processedImages, setProcessedImages] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Получаем данные о доме с помощью React Query
    const { data: house, isLoading, error } = useQuery({
        queryKey: ['house', id],
        queryFn: () => houseService.getHouseById(id)
    });

    // Обработка путей к изображениям когда получены данные о доме
    useEffect(() => {
        if (house && house.images && Array.isArray(house.images)) {
            const processed = processImages(house.images);
            setProcessedImages(processed);
            console.log('Обработанные пути к изображениям:', processed);
        }
    }, [house]);

    // Функция форматирования цены
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
        setMainImageError(false); // Сбрасываем ошибку при смене изображения
    };

    const handleDeleteHouse = async () => {
        if (window.confirm('Ви впевнені, що хочете видалити цей будинок?')) {
            try {
                await houseService.deleteHouse(id);
                navigate('/houses');
            } catch (err) {
                console.error('Помилка при видаленні будинку:', err);
                alert('Не вдалося видалити будинок. Спробуйте пізніше.');
            }
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

    // Определяем основное изображение с учетом ошибки
    const mainImage = !mainImageError && processedImages.length > 0
        ? processedImages[selectedImageIndex]
        : '/images/placeholder-house.jpg';

    return (
        <div className="house-detail-page">
            <div className="house-detail-header">
                <h1>{title}</h1>
                <div className="house-price">${formatPrice(price)}</div>
                <div className="house-address">{address}</div>
            </div>

            <div className="house-gallery">
                <div className="gallery-main">
                    <img
                        src={mainImage}
                        alt={title}
                        onError={handleMainImageError}
                    />
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
            </div>

            <div className="house-actions">
                <Link to="/houses" className="btn-secondary">Назад до списку</Link>
                <Link to={`/admin/houses/edit/${id}`} className="btn-primary">Редагувати</Link>
                <button onClick={handleDeleteHouse} className="btn-danger">Видалити</button>
            </div>
        </div>
    );
};

export default HouseDetailPage;