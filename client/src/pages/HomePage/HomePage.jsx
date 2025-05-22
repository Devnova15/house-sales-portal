import { Link } from 'react-router-dom';
import { FaHome, FaSearchLocation, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './HomePage.css';

// Фікс іконок Leaflet в React (без цього маркери не відображаються)
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const HomePage = () => {
    const center = [50.4501, 30.5234]; // Київ

    return (
        <>
            <section className="hero-fullscreen">
                <div className="hero-overlay">
                    <h1>Знайдіть будинок своєї мрії</h1>
                    <p>Ми пропонуємо великий вибір будинків на будь-який смак і бюджет.</p>
                    <Link to="/houses" className="hero-button">Переглянути оголошення</Link>
                </div>
            </section>

            <section className="features-modern">
                <div className="feature-item">
                    <FaHome className="feature-icon" />
                    <div>
                        <h3>Різноманіття вибору</h3>
                        <p>Будинки для будь-якого стилю та бюджету.</p>
                    </div>
                </div>

                <div className="feature-item">
                    <FaSearchLocation className="feature-icon" />
                    <div>
                        <h3>Інтуїтивний пошук</h3>
                        <p>Фільтри за ціною, площею, кімнатами, локацією.</p>
                    </div>
                </div>

                <div className="feature-item">
                    <FaPhoneAlt className="feature-icon" />
                    <div>
                        <h3>Прямий контакт</h3>
                        <p>Спілкуйтеся напряму з продавцем без посередників.</p>
                    </div>
                </div>
            </section>

            <section className="map-section">
                <div className="map-container">
                    <div className="map-header">
                        <FaMapMarkerAlt className="map-icon" />
                        <h2>Місце розташування</h2>
                        <p>Наші будинки розташовані в найкращих районах Києва та області</p>
                    </div>

                    <MapContainer
                        center={center}
                        zoom={10}
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
                                Центр Києва
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </section>
        </>
    );
};

export default HomePage;
