import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import './ContactPage.css';

const ContactPage = () => {
    const center = [50.202664892265766, 30.274876895590857];

    return (
        <>
            <section className="contact-hero">
                <div className="contact-hero-overlay">
                    <h1>Контакти</h1>
                    <p>Зв'яжіться з нами для отримання додаткової інформації або консультації</p>
                </div>
            </section>

            <section className="contact-content">
                <div className="contact-info-section">
                    <h2>Наші контакти</h2>
                    <div className="contact-info-grid">
                        <div className="contact-info-item">
                            <FaPhone className="contact-icon" />
                            <h3>Телефон</h3>
                            <p>+380 44 123 4567</p>
                            <p>+380 67 987 6543</p>
                        </div>
                        <div className="contact-info-item">
                            <FaEnvelope className="contact-icon" />
                            <h3>Email</h3>
                            <p>info@housesales.com</p>
                            <p>support@housesales.com</p>
                        </div>
                        <div className="contact-info-item">
                            <FaMapMarkerAlt className="contact-icon" />
                            <h3>Адреса</h3>
                            <p>вул. Хрещатик, 22</p>
                            <p>Київ, 01001, Україна</p>
                        </div>
                        <div className="contact-info-item">
                            <FaClock className="contact-icon" />
                            <h3>Години роботи</h3>
                            <p>Пн-Пт: 9:00 - 18:00</p>
                            <p>Сб: 10:00 - 15:00</p>
                        </div>
                    </div>
                </div>

                <div className="contact-form-section">
                    <h2>Напишіть нам</h2>
                    <form className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Ім'я</label>
                            <input type="text" id="name" name="name" placeholder="Ваше ім'я" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="Ваш email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Телефон</label>
                            <input type="tel" id="phone" name="phone" placeholder="Ваш телефон" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Тема</label>
                            <input type="text" id="subject" name="subject" placeholder="Тема повідомлення" required />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="message">Повідомлення</label>
                            <textarea id="message" name="message" rows="5" placeholder="Ваше повідомлення" required></textarea>
                        </div>
                        <button type="submit" className="submit-button">Надіслати</button>
                    </form>
                </div>

                <div className="contact-map-section">
                    <h2>Наше розташування</h2>
                    <div className="map-container">
                        <MapContainer
                            center={center}
                            zoom={13}
                            scrollWheelZoom={false}
                            style={{ height: '500px', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; OpenStreetMap contributors"
                            />
                            <Marker
                                position={center}
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
                                    House Sales Portal<br />
                                    вул. Хрещатик, 22<br />
                                    Київ, 01001, Україна
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ContactPage;