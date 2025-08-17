import React, { useState, useEffect } from 'react';
import { houseService } from '../../services/houseService';
import './AddHouseForm.css';

const AddHouseForm = ({ houseToEdit = null, onFormSubmit = null }) => {
    const isEditMode = !!houseToEdit;
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        address: '',
        description: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        plotArea: '',
        floors: '',
        characteristics: {
            wallType: '',
            wallInsulation: '',
            roofType: '',
            bathroom: '',
            heating: '',
            floorHeating: false
        },
        condition: {
            withRepair: false,
            repairType: '',
            withFurniture: false,
            yearBuilt: new Date().getFullYear()
        },
        features: {
            hasGarage: false,
            hasGarden: false,
            hasBasement: false,
            hasTerrace: false
        },
        location: {
            district: '',
            city: '',
            coordinates: {
                lat: 0,
                lng: 0
            }
        },
        infrastructure: {
            school: false,
            kindergarten: false,
            hospital: false,
            park: false,
            publicTransport: false,
            shopping: false,
            distance: {
                toCenter: '',
                toSchool: '',
                toTransport: ''
            }
        },
        communications: {
            sewerage: '',
            electricity: false,
            water: '',
            gas: false,
            internet: false
        },
        images: [],
        contactInfo: {
            name: '',
            phone: '',
            email: ''
        },
        status: 'available'
    });

    const [uploadedImages, setUploadedImages] = useState([]);
    const [formStatus, setFormStatus] = useState({ message: '', type: '' });
    const [activeSection, setActiveSection] = useState('basic');

    // Initialize form data with house data when in edit mode
    useEffect(() => {
        if (houseToEdit) {
            setFormData(houseToEdit);

            // If there are images, create preview URLs
            if (houseToEdit.images && houseToEdit.images.length > 0) {
                const images = houseToEdit.images.map(imagePath => ({
                    file: null, // We don't have the file object for existing images
                    preview: imagePath,
                    path: imagePath
                }));
                setUploadedImages(images);
            }
        }
    }, [houseToEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Process the value based on input type
        const processValue = (val) => {
            if (type === 'checkbox') return checked;
            if (type === 'number') return val === '' ? '' : Number(val);
            return val;
        };

        if (name.includes('.')) {
            if (name.includes('[')) {
                // Handle nested fields like infrastructure.distance[toCenter]
                const matches = name.match(/([^.]+)\.([^[]+)\[([^\]]+)\]/);
                if (matches && matches.length === 4) {
                    const [_, section, subsection, field] = matches;
                    const fieldValue = processValue(value);

                    setFormData(prev => ({
                        ...prev,
                        [section]: {
                            ...prev[section],
                            [subsection]: {
                                ...prev[section][subsection],
                                [field]: fieldValue
                            }
                        }
                    }));
                }
            } else {
                const [section, field] = name.split('.');
                const fieldValue = processValue(value);

                setFormData(prev => ({
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: fieldValue
                    }
                }));
            }
        } else {
            const fieldValue = processValue(value);

            setFormData(prev => ({
                ...prev,
                [name]: fieldValue
            }));
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Set loading state
        setFormStatus({ message: 'Uploading images...', type: 'info' });

        try {
            // Determine the house ID to use
            // If we're editing an existing house, use its _id
            // Otherwise, use the MongoDB ObjectId format (24 hex characters)
            const houseId = isEditMode && houseToEdit._id 
                ? houseToEdit._id 
                : 'default'; // Use 'default' for new houses until they're saved

            // Create preview URLs for display
            const newImages = files.map(file => ({
                file,
                preview: URL.createObjectURL(file),
                // Temporary path, will be updated after upload
                path: `/images/houses/${houseId}/${file.name}`
            }));

            // Update UI with previews
            setUploadedImages(prev => [...prev, ...newImages]);

            // Upload the files to the server
            const response = await houseService.uploadImages(files, houseId);

            // Update the paths with the actual paths returned from the server
            const updatedImages = newImages.map((img, index) => ({
                ...img,
                path: response.filePaths[index]
            }));

            // Update the state with the actual paths
            setUploadedImages(prev => {
                // Replace the temporary images with the updated ones
                const filtered = prev.filter(img => !newImages.includes(img));
                return [...filtered, ...updatedImages];
            });

            // Update the form data with the actual paths
            setFormData(prev => ({
                ...prev,
                images: [...prev.images.filter(path => !newImages.map(img => img.path).includes(path)), ...response.filePaths]
            }));

            // Show success message
            setFormStatus({ message: 'Images uploaded successfully!', type: 'success' });

            // Clear the message after 3 seconds
            setTimeout(() => {
                setFormStatus({ message: '', type: '' });
            }, 3000);
        } catch (error) {
            console.error('Error uploading images:', error);
            setFormStatus({ 
                message: `Error uploading images: ${error.response?.data?.message || error.message}`, 
                type: 'error' 
            });
        }
    };

    const removeImage = (index) => {
        const newUploadedImages = [...uploadedImages];
        const removedImage = newUploadedImages.splice(index, 1)[0];
        URL.revokeObjectURL(removedImage.preview);

        setUploadedImages(newUploadedImages);
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(img => img !== removedImage.path)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus({ message: '', type: '' });

        // Validate form data
        if (!formData.title || !formData.price || !formData.address || 
            !formData.description || !formData.bedrooms || !formData.bathrooms || !formData.area) {
            setFormStatus({
                message: 'Please fill in all required fields (title, price, address, description, bedrooms, bathrooms, area)',
                type: 'error'
            });
            return;
        }

        try {
            // Add or update timestamps
            const now = new Date().toISOString();
            const completeFormData = {
                ...formData,
                updatedAt: now
            };

            // If creating a new house, add createdAt timestamp
            if (!isEditMode) {
                completeFormData.createdAt = now;
            }

            let result;

            // Either update existing house or create a new one
            if (isEditMode) {
                result = await houseService.updateHouse(houseToEdit._id, completeFormData);
                console.log('House updated successfully:', result);

                setFormStatus({
                    message: 'House data updated successfully!',
                    type: 'success'
                });
            } else {
                result = await houseService.createHouse(completeFormData);
                console.log('House added successfully:', result);

                setFormStatus({
                    message: 'House data added successfully to the database!',
                    type: 'success'
                });
            }

            // Call the onFormSubmit callback if provided
            if (onFormSubmit) {
                onFormSubmit(result);
            }

            // Reset form
            setFormData({
                title: '',
                price: '',
                address: '',
                description: '',
                bedrooms: '',
                bathrooms: '',
                area: '',
                plotArea: '',
                floors: '',
                characteristics: {
                    wallType: '',
                    wallInsulation: '',
                    roofType: '',
                    bathroom: '',
                    heating: '',
                    floorHeating: false
                },
                condition: {
                    withRepair: false,
                    repairType: '',
                    withFurniture: false,
                    yearBuilt: new Date().getFullYear()
                },
                features: {
                    hasGarage: false,
                    hasGarden: false,
                    hasBasement: false,
                    hasTerrace: false
                },
                location: {
                    district: '',
                    city: '',
                    coordinates: {
                        lat: 0,
                        lng: 0
                    }
                },
                infrastructure: {
                    school: false,
                    kindergarten: false,
                    hospital: false,
                    park: false,
                    publicTransport: false,
                    shopping: false,
                    distance: {
                        toCenter: '',
                        toSchool: '',
                        toTransport: ''
                    }
                },
                communications: {
                    sewerage: '',
                    electricity: false,
                    water: '',
                    gas: false,
                    internet: false
                },
                images: [],
                contactInfo: {
                    name: '',
                    phone: '',
                    email: ''
                },
                status: 'available'
            });
            setUploadedImages([]);
        } catch (error) {
            console.error('Error adding house:', error);
            setFormStatus({
                message: `Error: ${error.message}`,
                type: 'error'
            });
        }
    };

    return (
        <div className="add-house-form-container">
            <h3>{isEditMode ? 'Edit House' : 'Add New House'}</h3>
            <div className="form-navigation">
                <button 
                    className={`nav-button ${activeSection === 'basic' ? 'active' : ''}`}
                    onClick={() => setActiveSection('basic')}
                >
                    Basic Info
                </button>
                <button 
                    className={`nav-button ${activeSection === 'details' ? 'active' : ''}`}
                    onClick={() => setActiveSection('details')}
                >
                    Property Details
                </button>
                <button 
                    className={`nav-button ${activeSection === 'features' ? 'active' : ''}`}
                    onClick={() => setActiveSection('features')}
                >
                    Features
                </button>
                <button 
                    className={`nav-button ${activeSection === 'location' ? 'active' : ''}`}
                    onClick={() => setActiveSection('location')}
                >
                    Location
                </button>
                <button 
                    className={`nav-button ${activeSection === 'images' ? 'active' : ''}`}
                    onClick={() => setActiveSection('images')}
                >
                    Images
                </button>
                <button 
                    className={`nav-button ${activeSection === 'contact' ? 'active' : ''}`}
                    onClick={() => setActiveSection('contact')}
                >
                    Contact
                </button>
            </div>

            <form onSubmit={handleSubmit} className="house-form">
                {/* Basic Information Section */}
                {activeSection === 'basic' && (
                    <div className="form-section">
                        <h4>Basic Information</h4>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="title">Title*</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price (€)*</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address*</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description*</label>
                            <textarea
                                id="description"
                                name="description"
                                rows="5"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="bedrooms">Bedrooms*</label>
                                <input
                                    type="number"
                                    id="bedrooms"
                                    name="bedrooms"
                                    value={formData.bedrooms}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bathrooms">Bathrooms*</label>
                                <input
                                    type="number"
                                    id="bathrooms"
                                    name="bathrooms"
                                    value={formData.bathrooms}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="floors">Floors</label>
                                <input
                                    type="number"
                                    id="floors"
                                    name="floors"
                                    value={formData.floors}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="area">Area (m²)*</label>
                                <input
                                    type="number"
                                    id="area"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="plotArea">Plot Area (acres)</label>
                                <input
                                    type="number"
                                    id="plotArea"
                                    name="plotArea"
                                    value={formData.plotArea}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Property Details Section */}
                {activeSection === 'details' && (
                    <div className="form-section">
                        <h4>Characteristics</h4>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="wallType">Wall Type</label>
                                <input
                                    type="text"
                                    id="wallType"
                                    name="characteristics.wallType"
                                    value={formData.characteristics.wallType}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wallInsulation">Wall Insulation</label>
                                <input
                                    type="text"
                                    id="wallInsulation"
                                    name="characteristics.wallInsulation"
                                    value={formData.characteristics.wallInsulation}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="roofType">Roof Type</label>
                                <input
                                    type="text"
                                    id="roofType"
                                    name="characteristics.roofType"
                                    value={formData.characteristics.roofType}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bathroom">Bathroom Type</label>
                                <input
                                    type="text"
                                    id="bathroom"
                                    name="characteristics.bathroom"
                                    value={formData.characteristics.bathroom}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="heating">Heating</label>
                                <input
                                    type="text"
                                    id="heating"
                                    name="characteristics.heating"
                                    value={formData.characteristics.heating}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="characteristics.floorHeating"
                                        checked={formData.characteristics.floorHeating}
                                        onChange={handleChange}
                                    />
                                    Floor Heating
                                </label>
                            </div>
                        </div>

                        <h4>Condition</h4>
                        <div className="form-row">
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="condition.withRepair"
                                        checked={formData.condition.withRepair}
                                        onChange={handleChange}
                                    />
                                    With Repair
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="repairType">Repair Type</label>
                                <input
                                    type="text"
                                    id="repairType"
                                    name="condition.repairType"
                                    value={formData.condition.repairType}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="condition.withFurniture"
                                        checked={formData.condition.withFurniture}
                                        onChange={handleChange}
                                    />
                                    With Furniture
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="yearBuilt">Year Built</label>
                                <input
                                    type="number"
                                    id="yearBuilt"
                                    name="condition.yearBuilt"
                                    value={formData.condition.yearBuilt}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <h4>Communications</h4>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="sewerage">Sewerage</label>
                                <input
                                    type="text"
                                    id="sewerage"
                                    name="communications.sewerage"
                                    value={formData.communications.sewerage}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="water">Water</label>
                                <input
                                    type="text"
                                    id="water"
                                    name="communications.water"
                                    value={formData.communications.water}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="communications.electricity"
                                        checked={formData.communications.electricity}
                                        onChange={handleChange}
                                    />
                                    Electricity
                                </label>
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="communications.gas"
                                        checked={formData.communications.gas}
                                        onChange={handleChange}
                                    />
                                    Gas
                                </label>
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="communications.internet"
                                        checked={formData.communications.internet}
                                        onChange={handleChange}
                                    />
                                    Internet
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Features Section */}
                {activeSection === 'features' && (
                    <div className="form-section">
                        <h4>Features</h4>
                        <div className="form-row">
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="features.hasGarage"
                                        checked={formData.features.hasGarage}
                                        onChange={handleChange}
                                    />
                                    Garage
                                </label>
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="features.hasGarden"
                                        checked={formData.features.hasGarden}
                                        onChange={handleChange}
                                    />
                                    Garden
                                </label>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="features.hasBasement"
                                        checked={formData.features.hasBasement}
                                        onChange={handleChange}
                                    />
                                    Basement
                                </label>
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="features.hasTerrace"
                                        checked={formData.features.hasTerrace}
                                        onChange={handleChange}
                                    />
                                    Terrace
                                </label>
                            </div>
                        </div>

                        <h4>Infrastructure</h4>
                        <div className="form-row">
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="infrastructure.school"
                                        checked={formData.infrastructure.school}
                                        onChange={handleChange}
                                    />
                                    School
                                </label>
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="infrastructure.kindergarten"
                                        checked={formData.infrastructure.kindergarten}
                                        onChange={handleChange}
                                    />
                                    Kindergarten
                                </label>
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="infrastructure.hospital"
                                        checked={formData.infrastructure.hospital}
                                        onChange={handleChange}
                                    />
                                    Hospital
                                </label>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="infrastructure.park"
                                        checked={formData.infrastructure.park}
                                        onChange={handleChange}
                                    />
                                    Park
                                </label>
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="infrastructure.publicTransport"
                                        checked={formData.infrastructure.publicTransport}
                                        onChange={handleChange}
                                    />
                                    Public Transport
                                </label>
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="infrastructure.shopping"
                                        checked={formData.infrastructure.shopping}
                                        onChange={handleChange}
                                    />
                                    Shopping
                                </label>
                            </div>
                        </div>
                        <h5>Distances (km)</h5>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="toCenter">To Center</label>
                                <input
                                    type="number"
                                    id="toCenter"
                                    name="infrastructure.distance[toCenter]"
                                    value={formData.infrastructure.distance.toCenter}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="toSchool">To School</label>
                                <input
                                    type="number"
                                    id="toSchool"
                                    name="infrastructure.distance[toSchool]"
                                    value={formData.infrastructure.distance.toSchool}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="toTransport">To Transport</label>
                                <input
                                    type="number"
                                    id="toTransport"
                                    name="infrastructure.distance[toTransport]"
                                    value={formData.infrastructure.distance.toTransport}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Location Section */}
                {activeSection === 'location' && (
                    <div className="form-section">
                        <h4>Location</h4>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="district">District</label>
                                <input
                                    type="text"
                                    id="district"
                                    name="location.district"
                                    value={formData.location.district}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="location.city"
                                    value={formData.location.city}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="lat">Latitude</label>
                                <input
                                    type="number"
                                    id="lat"
                                    name="location.coordinates.lat"
                                    value={formData.location.coordinates.lat}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            location: {
                                                ...prev.location,
                                                coordinates: {
                                                    ...prev.location.coordinates,
                                                    lat: parseFloat(e.target.value) || 0
                                                }
                                            }
                                        }));
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lng">Longitude</label>
                                <input
                                    type="number"
                                    id="lng"
                                    name="location.coordinates.lng"
                                    value={formData.location.coordinates.lng}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            location: {
                                                ...prev.location,
                                                coordinates: {
                                                    ...prev.location.coordinates,
                                                    lng: parseFloat(e.target.value) || 0
                                                }
                                            }
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Images Section */}
                {activeSection === 'images' && (
                    <div className="form-section">
                        <h4>Images</h4>
                        <div className="form-group">
                            <label htmlFor="images">Upload Images</label>
                            <input
                                type="file"
                                id="images"
                                name="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />
                        </div>
                        {uploadedImages.length > 0 && (
                            <div className="image-previews">
                                <h5>Uploaded Images</h5>
                                <div className="image-grid">
                                    {uploadedImages.map((image, index) => (
                                        <div key={index} className="image-item">
                                            <img src={image.preview} alt={`Preview ${index}`} />
                                            <button 
                                                type="button" 
                                                className="remove-image-button"
                                                onClick={() => removeImage(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Contact Section */}
                {activeSection === 'contact' && (
                    <div className="form-section">
                        <h4>Contact Information</h4>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="contactName">Name</label>
                                <input
                                    type="text"
                                    id="contactName"
                                    name="contactInfo.name"
                                    value={formData.contactInfo.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contactPhone">Phone</label>
                                <input
                                    type="tel"
                                    id="contactPhone"
                                    name="contactInfo.phone"
                                    value={formData.contactInfo.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactEmail">Email</label>
                            <input
                                type="email"
                                id="contactEmail"
                                name="contactInfo.email"
                                value={formData.contactInfo.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="available">Available</option>
                                <option value="sold">Sold</option>
                                <option value="reserved">Reserved</option>
                            </select>
                        </div>
                    </div>
                )}

                {formStatus.message && (
                    <div className={`form-status ${formStatus.type}`}>
                        {formStatus.message}
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" className="submit-button">
                        {isEditMode ? 'Update House' : 'Add House'}
                    </button>
                    {isEditMode && (
                        <button 
                            type="button" 
                            className="cancel-button"
                            onClick={() => onFormSubmit && onFormSubmit(null)}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddHouseForm;
