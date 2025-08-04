import React, { useState, useEffect } from 'react';
import { houseService } from '../../services/houseService';
import HouseCard from './HouseCard';
import FilterPanel from './FilterPanel/FilterPanel';
import './HouseList.css';

const HouseList = () => {
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const fetchHouses = async () => {
            try {
                setLoading(true);
                const data = await houseService.getAllHouses(filters);
                setHouses(data);
                setError(null);
            } catch (err) {
                console.error('Помилка при завантаженні будинків:', err);
                setError('Не вдалося завантажити будинки. Спробуйте пізніше.');
            } finally {
                setLoading(false);
            }
        };

        fetchHouses();
    }, [filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    if (loading) {
        return <div className="loading">Завантаження будинків...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="house-list-container">
            <div className="house-list-sidebar">
                <FilterPanel onFilterChange={handleFilterChange} />
            </div>

            <div className="house-list-content">
                {houses.length === 0 ? (
                    <div className="no-houses">
                        За вказаними критеріями будинків не знайдено.
                    </div>
                ) : (
                    <div className="house-list">
                        {houses.map((house) => (
                            <HouseCard key={house._id} house={house} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HouseList;
