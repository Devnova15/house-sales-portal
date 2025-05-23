import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DefaultIcon } from './leafletIcon';

export const SimpleMap = () => {
    return (
        <MapContainer center={[50.4501, 30.5234]} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[50.4501, 30.5234]} icon={DefaultIcon}>
                <Popup>Це Київ!</Popup>
            </Marker>
        </MapContainer>
    );
}
