import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Checkbox,
    Select,
    Button,
    Alert,
    AlertIcon,
    Image,
    SimpleGrid,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useBreakpointValue,
    IconButton,
    Flex,
    Divider,
} from '@chakra-ui/react';
import { houseService } from '../../services/houseService';

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

    // Responsive values
    const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
    const tabOrientation = useBreakpointValue({ base: 'horizontal', md: 'horizontal' });
    const tabVariant = useBreakpointValue({ base: 'soft-rounded', md: 'enclosed' });

    // Initialize form data with house data when in edit mode
    useEffect(() => {
        if (houseToEdit) {
            setFormData(houseToEdit);

            if (houseToEdit.images && houseToEdit.images.length > 0) {
                const images = houseToEdit.images.map(imagePath => ({
                    file: null,
                    preview: imagePath,
                    path: imagePath
                }));
                setUploadedImages(images);
            }
        }
    }, [houseToEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const processValue = (val) => {
            if (type === 'checkbox') return checked;
            if (type === 'number') return val === '' ? '' : Number(val);
            return val;
        };

        if (name.includes('.')) {
            if (name.includes('[')) {
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

        setFormStatus({ message: 'Uploading images...', type: 'info' });

        try {
            const houseId = isEditMode && houseToEdit._id ? houseToEdit._id : 'default';

            const newImages = files.map(file => ({
                file,
                preview: URL.createObjectURL(file),
                path: `/images/houses/${houseId}/${file.name}`
            }));

            setUploadedImages(prev => [...prev, ...newImages]);

            const response = await houseService.uploadImages(files, houseId);

            const updatedImages = newImages.map((img, index) => ({
                ...img,
                path: response.filePaths[index]
            }));

            setUploadedImages(prev => {
                const filtered = prev.filter(img => !newImages.includes(img));
                return [...filtered, ...updatedImages];
            });

            setFormData(prev => ({
                ...prev,
                images: [...prev.images.filter(path => !newImages.map(img => img.path).includes(path)), ...response.filePaths]
            }));

            setFormStatus({ message: 'Images uploaded successfully!', type: 'success' });

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

        if (!formData.title || !formData.price || !formData.address ||
            !formData.description || !formData.bedrooms || !formData.bathrooms || !formData.area) {
            setFormStatus({
                message: 'Please fill in all required fields (title, price, address, description, bedrooms, bathrooms, area)',
                type: 'error'
            });
            return;
        }

        try {
            const now = new Date().toISOString();
            const completeFormData = {
                ...formData,
                updatedAt: now
            };

            if (!isEditMode) {
                completeFormData.createdAt = now;
            }

            let result;

            if (isEditMode) {
                result = await houseService.updateHouse(houseToEdit._id, completeFormData);
                setFormStatus({
                    message: 'House data updated successfully!',
                    type: 'success'
                });
            } else {
                result = await houseService.createHouse(completeFormData);
                setFormStatus({
                    message: 'House data added successfully to the database!',
                    type: 'success'
                });
            }

            if (onFormSubmit) {
                onFormSubmit(result);
            }

            // Reset form if not in edit mode
            if (!isEditMode) {
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
            }
        } catch (error) {
            console.error('Error adding house:', error);
            setFormStatus({
                message: `Error: ${error.message}`,
                type: 'error'
            });
        }
    };

    return (
        <Box
            bg="white"
            p={{ base: 6, md: 8 }}
            borderRadius="xl"
            boxShadow="lg"
            transition="all 0.3s ease"
            _hover={{ boxShadow: "xl" }}
        >
            <Heading size="lg" color="#111111" mb={6} fontWeight="600">
                {isEditMode ? 'Edit House' : 'Add New House'}
            </Heading>

            <Tabs variant={tabVariant} colorScheme="orange" orientation={tabOrientation}>
                <TabList
                    overflowX="auto"
                    overflowY="hidden"
                    sx={{
                        '&::-webkit-scrollbar': {
                            height: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'gray.100',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#F5A623',
                            borderRadius: '4px',
                        },
                    }}
                >
                    <Tab
                        _selected={{
                            color: 'white',
                            bg: '#F5A623',
                        }}
                        _hover={{
                            bg: '#F6AB5E',
                            color: 'white',
                        }}
                        borderRadius="lg"
                        transition="all 0.3s ease"
                        whiteSpace="nowrap"
                    >
                        Basic Info
                    </Tab>
                    <Tab
                        _selected={{
                            color: 'white',
                            bg: '#F5A623',
                        }}
                        _hover={{
                            bg: '#F6AB5E',
                            color: 'white',
                        }}
                        borderRadius="lg"
                        transition="all 0.3s ease"
                        whiteSpace="nowrap"
                    >
                        Property Details
                    </Tab>
                    <Tab
                        _selected={{
                            color: 'white',
                            bg: '#F5A623',
                        }}
                        _hover={{
                            bg: '#F6AB5E',
                            color: 'white',
                        }}
                        borderRadius="lg"
                        transition="all 0.3s ease"
                        whiteSpace="nowrap"
                    >
                        Features
                    </Tab>
                    <Tab
                        _selected={{
                            color: 'white',
                            bg: '#F5A623',
                        }}
                        _hover={{
                            bg: '#F6AB5E',
                            color: 'white',
                        }}
                        borderRadius="lg"
                        transition="all 0.3s ease"
                        whiteSpace="nowrap"
                    >
                        Location
                    </Tab>
                    <Tab
                        _selected={{
                            color: 'white',
                            bg: '#F5A623',
                        }}
                        _hover={{
                            bg: '#F6AB5E',
                            color: 'white',
                        }}
                        borderRadius="lg"
                        transition="all 0.3s ease"
                        whiteSpace="nowrap"
                    >
                        Images
                    </Tab>
                    <Tab
                        _selected={{
                            color: 'white',
                            bg: '#F5A623',
                        }}
                        _hover={{
                            bg: '#F6AB5E',
                            color: 'white',
                        }}
                        borderRadius="lg"
                        transition="all 0.3s ease"
                        whiteSpace="nowrap"
                    >
                        Contact
                    </Tab>
                </TabList>

                <form onSubmit={handleSubmit}>
                    <TabPanels>
                        {/* Basic Information Tab */}
                        <TabPanel px={0}>
                            <VStack spacing={6} align="stretch">
                                <Heading size="md" color="#111111" fontWeight="600">
                                    Basic Information
                                </Heading>

                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <FormControl isRequired>
                                        <FormLabel color="#222222" fontWeight="500">
                                            Title
                                        </FormLabel>
                                        <Input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Enter property title"
                                            borderRadius="xl"
                                            borderColor="gray.200"
                                            _hover={{ borderColor: "#F6AB5E" }}
                                            _focus={{
                                                borderColor: "#F5A623",
                                                boxShadow: "0 0 0 1px #F5A623",
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel color="#222222" fontWeight="500">
                                            Price (€)
                                        </FormLabel>
                                        <Input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="Enter price"
                                            borderRadius="xl"
                                            borderColor="gray.200"
                                            _hover={{ borderColor: "#F6AB5E" }}
                                            _focus={{
                                                borderColor: "#F5A623",
                                                boxShadow: "0 0 0 1px #F5A623",
                                            }}
                                        />
                                    </FormControl>
                                </SimpleGrid>

                                <FormControl isRequired>
                                    <FormLabel color="#222222" fontWeight="500">
                                        Address
                                    </FormLabel>
                                    <Input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter full address"
                                        borderRadius="xl"
                                        borderColor="gray.200"
                                        _hover={{ borderColor: "#F6AB5E" }}
                                        _focus={{
                                            borderColor: "#F5A623",
                                            boxShadow: "0 0 0 1px #F5A623",
                                        }}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel color="#222222" fontWeight="500">
                                        Description
                                    </FormLabel>
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter detailed description"
                                        rows={5}
                                        borderRadius="xl"
                                        borderColor="gray.200"
                                        _hover={{ borderColor: "#F6AB5E" }}
                                        _focus={{
                                            borderColor: "#F5A623",
                                            boxShadow: "0 0 0 1px #F5A623",
                                        }}
                                    />
                                </FormControl>

                                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                                    <FormControl isRequired>
                                        <FormLabel color="#222222" fontWeight="500">
                                            Bedrooms
                                        </FormLabel>
                                        <Input
                                            type="number"
                                            name="bedrooms"
                                            value={formData.bedrooms}
                                            onChange={handleChange}
                                            placeholder="Number of bedrooms"
                                            borderRadius="xl"
                                            borderColor="gray.200"
                                            _hover={{ borderColor: "#F6AB5E" }}
                                            _focus={{
                                                borderColor: "#F5A623",
                                                boxShadow: "0 0 0 1px #F5A623",
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel color="#222222" fontWeight="500">
                                            Bathrooms
                                        </FormLabel>
                                        <Input
                                            type="number"
                                            name="bathrooms"
                                            value={formData.bathrooms}
                                            onChange={handleChange}
                                            placeholder="Number of bathrooms"
                                            borderRadius="xl"
                                            borderColor="gray.200"
                                            _hover={{ borderColor: "#F6AB5E" }}
                                            _focus={{
                                                borderColor: "#F5A623",
                                                boxShadow: "0 0 0 1px #F5A623",
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel color="#222222" fontWeight="500">
                                            Floors
                                        </FormLabel>
                                        <Input
                                            type="number"
                                            name="floors"
                                            value={formData.floors}
                                            onChange={handleChange}
                                            placeholder="Number of floors"
                                            borderRadius="xl"
                                            borderColor="gray.200"
                                            _hover={{ borderColor: "#F6AB5E" }}
                                            _focus={{
                                                borderColor: "#F5A623",
                                                boxShadow: "0 0 0 1px #F5A623",
                                            }}
                                        />
                                    </FormControl>
                                </SimpleGrid>

                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <FormControl isRequired>
                                        <FormLabel color="#222222" fontWeight="500">
                                            Area (m²)
                                        </FormLabel>
                                        <Input
                                            type="number"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleChange}
                                            placeholder="Living area in m²"
                                            borderRadius="xl"
                                            borderColor="gray.200"
                                            _hover={{ borderColor: "#F6AB5E" }}
                                            _focus={{
                                                borderColor: "#F5A623",
                                                boxShadow: "0 0 0 1px #F5A623",
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel color="#222222" fontWeight="500">
                                            Plot Area (acres)
                                        </FormLabel>
                                        <Input
                                            type="number"
                                            name="plotArea"
                                            value={formData.plotArea}
                                            onChange={handleChange}
                                            placeholder="Plot area in acres"
                                            borderRadius="xl"
                                            borderColor="gray.200"
                                            _hover={{ borderColor: "#F6AB5E" }}
                                            _focus={{
                                                borderColor: "#F5A623",
                                                boxShadow: "0 0 0 1px #F5A623",
                                            }}
                                        />
                                    </FormControl>
                                </SimpleGrid>
                            </VStack>
                        </TabPanel>

                        {/* Property Details Tab */}
                        <TabPanel px={0}>
                            <VStack spacing={8} align="stretch">
                                {/* Characteristics Section */}
                                <Box>
                                    <Heading size="md" color="#111111" fontWeight="600" mb={4}>
                                        Characteristics
                                    </Heading>
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                        <FormControl>
                                            <FormLabel color="#222222" fontWeight="500">Wall Type</FormLabel>
                                            <Input
                                                name="characteristics.wallType"
                                                value={formData.characteristics.wallType}
                                                onChange={handleChange}
                                                placeholder="e.g., Brick, Concrete"
                                                borderRadius="xl"
                                                borderColor="gray.200"
                                                _hover={{ borderColor: "#F6AB5E" }}
                                                _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel color="#222222" fontWeight="500">Wall Insulation</FormLabel>
                                            <Input
                                                name="characteristics.wallInsulation"
                                                value={formData.characteristics.wallInsulation}
                                                onChange={handleChange}
                                                placeholder="e.g., Foam, Mineral wool"
                                                borderRadius="xl"
                                                borderColor="gray.200"
                                                _hover={{ borderColor: "#F6AB5E" }}
                                                _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel color="#222222" fontWeight="500">Roof Type</FormLabel>
                                            <Input
                                                name="characteristics.roofType"
                                                value={formData.characteristics.roofType}
                                                onChange={handleChange}
                                                placeholder="e.g., Metal, Tile"
                                                borderRadius="xl"
                                                borderColor="gray.200"
                                                _hover={{ borderColor: "#F6AB5E" }}
                                                _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel color="#222222" fontWeight="500">Bathroom Type</FormLabel>
                                            <Input
                                                name="characteristics.bathroom"
                                                value={formData.characteristics.bathroom}
                                                onChange={handleChange}
                                                placeholder="e.g., Combined, Separate"
                                                borderRadius="xl"
                                                borderColor="gray.200"
                                                _hover={{ borderColor: "#F6AB5E" }}
                                                _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel color="#222222" fontWeight="500">Heating</FormLabel>
                                            <Input
                                                name="characteristics.heating"
                                                value={formData.characteristics.heating}
                                                onChange={handleChange}
                                                placeholder="e.g., Gas, Electric"
                                                borderRadius="xl"
                                                borderColor="gray.200"
                                                _hover={{ borderColor: "#F6AB5E" }}
                                                _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <Checkbox
                                                name="characteristics.floorHeating"
                                                isChecked={formData.characteristics.floorHeating}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                Floor Heating
                                            </Checkbox>
                                        </FormControl>
                                    </SimpleGrid>
                                </Box>

                                <Divider />

                                {/* Condition Section */}
                                <Box>
                                    <Heading size="md" color="#111111" fontWeight="600" mb={4}>
                                        Condition
                                    </Heading>
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                        <FormControl>
                                            <Checkbox
                                                name="condition.withRepair"
                                                isChecked={formData.condition.withRepair}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                With Repair
                                            </Checkbox>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel color="#222222" fontWeight="500">Repair Type</FormLabel>
                                            <Input
                                                name="condition.repairType"
                                                value={formData.condition.repairType}
                                                onChange={handleChange}
                                                placeholder="e.g., Cosmetic, Major"
                                                borderRadius="xl"
                                                borderColor="gray.200"
                                                _hover={{ borderColor: "#F6AB5E" }}
                                                _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <Checkbox
                                                name="condition.withFurniture"
                                                isChecked={formData.condition.withFurniture}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                With Furniture
                                            </Checkbox>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel color="#222222" fontWeight="500">Year Built</FormLabel>
                                            <Input
                                                type="number"
                                                name="condition.yearBuilt"
                                                value={formData.condition.yearBuilt}
                                                onChange={handleChange}
                                                borderRadius="xl"
                                                borderColor="gray.200"
                                                _hover={{ borderColor: "#F6AB5E" }}
                                                _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                            />
                                        </FormControl>
                                    </SimpleGrid>
                                </Box>

                                <Divider />

                                {/* Communications Section */}
                                <Box>
                                    <Heading size="md" color="#111111" fontWeight="600" mb={4}>
                                        Communications
                                    </Heading>
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                        <FormControl>
                                            <FormLabel color="#222222" fontWeight="500">Sewerage</FormLabel>
                                            <Input
                                                name="communications.sewerage"
                                                value={formData.communications.sewerage}
                                                onChange={handleChange}
                                                placeholder="e.g., Central, Septic"
                                                borderRadius="xl"
                                                borderColor="gray.200"
                                                _hover={{ borderColor: "#F6AB5E" }}
                                                _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel color="#222222" fontWeight="500">Water</FormLabel>
                                            <Input
                                                name="communications.water"
                                                value={formData.communications.water}
                                                onChange={handleChange}
                                                placeholder="e.g., Central, Well"
                                                borderRadius="xl"
                                                borderColor="gray.200"
                                                _hover={{ borderColor: "#F6AB5E" }}
                                                _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                            />
                                        </FormControl>
                                    </SimpleGrid>

                                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={4}>
                                        <FormControl>
                                            <Checkbox
                                                name="communications.electricity"
                                                isChecked={formData.communications.electricity}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                Electricity
                                            </Checkbox>
                                        </FormControl>

                                        <FormControl>
                                            <Checkbox
                                                name="communications.gas"
                                                isChecked={formData.communications.gas}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                Gas
                                            </Checkbox>
                                        </FormControl>

                                        <FormControl>
                                            <Checkbox
                                                name="communications.internet"
                                                isChecked={formData.communications.internet}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                Internet
                                            </Checkbox>
                                        </FormControl>
                                    </SimpleGrid>
                                </Box>
                            </VStack>
                        </TabPanel>

                        {/* Features Tab */}
                        <TabPanel px={0}>
                            <VStack spacing={8} align="stretch">
                                {/* Property Features */}
                                <Box>
                                    <Heading size="md" color="#111111" fontWeight="600" mb={4}>
                                        Property Features
                                    </Heading>
                                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                                        <FormControl>
                                            <Checkbox
                                                name="features.hasGarage"
                                                isChecked={formData.features.hasGarage}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                Garage
                                            </Checkbox>
                                        </FormControl>

                                        <FormControl>
                                            <Checkbox
                                                name="features.hasGarden"
                                                isChecked={formData.features.hasGarden}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                Garden
                                            </Checkbox>
                                        </FormControl>

                                        <FormControl>
                                            <Checkbox
                                                name="features.hasBasement"
                                                isChecked={formData.features.hasBasement}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                Basement
                                            </Checkbox>
                                        </FormControl>

                                        <FormControl>
                                            <Checkbox
                                                name="features.hasTerrace"
                                                isChecked={formData.features.hasTerrace}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                Terrace
                                            </Checkbox>
                                        </FormControl>
                                    </SimpleGrid>
                                </Box>

                                <Divider />

                                {/* Infrastructure */}
                                <Box>
                                    <Heading size="md" color="#111111" fontWeight="600" mb={4}>
                                        Infrastructure
                                    </Heading>
                                    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                                        <FormControl>
                                            <Checkbox
                                                name="infrastructure.school"
                                                isChecked={formData.infrastructure.school}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                School
                                            </Checkbox>
                                        </FormControl>

                                        <FormControl>
                                            <Checkbox
                                                name="infrastructure.kindergarten"
                                                isChecked={formData.infrastructure.kindergarten}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                Kindergarten
                                            </Checkbox>
                                        </FormControl>

                                        <FormControl>
                                            <Checkbox
                                                name="infrastructure.hospital"
                                                isChecked={formData.infrastructure.hospital}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                Hospital
                                            </Checkbox>
                                        </FormControl>

                                        <FormControl>
                                            <Checkbox
                                                name="infrastructure.park"
                                                isChecked={formData.infrastructure.park}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                Park
                                            </Checkbox>
                                        </FormControl>

                                        <FormControl>
                                            <Checkbox
                                                name="infrastructure.publicTransport"
                                                isChecked={formData.infrastructure.publicTransport}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                Public Transport
                                            </Checkbox>
                                        </FormControl>

                                        <FormControl>
                                            <Checkbox
                                                name="infrastructure.shopping"
                                                isChecked={formData.infrastructure.shopping}
                                                onChange={handleChange}
                                                colorScheme="orange"
                                                size="lg"
                                                color="#222222"
                                                fontWeight="500"
                                                sx={{
                                                    '.chakra-checkbox__control': {
                                                        borderColor: 'gray.200',
                                                        _checked: {
                                                            bg: '#F5A623',
                                                            borderColor: '#F5A623',
                                                        },
                                                        _hover: {
                                                            borderColor: '#F6AB5E',
                                                        },
                                                    },
                                                }}
                                            >
                                                Shopping
                                            </Checkbox>
                                        </FormControl>
                                    </SimpleGrid>

                                    <Box mt={6}>
                                        <Heading size="sm" color="#111111" fontWeight="600" mb={3}>
                                            Distances (km)
                                        </Heading>
                                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                                            <FormControl>
                                                <FormLabel color="#222222" fontWeight="500">To Center</FormLabel>
                                                <Input
                                                    type="number"
                                                    name="infrastructure.distance[toCenter]"
                                                    value={formData.infrastructure.distance.toCenter}
                                                    onChange={handleChange}
                                                    placeholder="Distance in km"
                                                    borderRadius="xl"
                                                    borderColor="gray.200"
                                                    _hover={{ borderColor: "#F6AB5E" }}
                                                    _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel color="#222222" fontWeight="500">To School</FormLabel>
                                                <Input
                                                    type="number"
                                                    name="infrastructure.distance[toSchool]"
                                                    value={formData.infrastructure.distance.toSchool}
                                                    onChange={handleChange}
                                                    placeholder="Distance in km"
                                                    borderRadius="xl"
                                                    borderColor="gray.200"
                                                    _hover={{ borderColor: "#F6AB5E" }}
                                                    _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel color="#222222" fontWeight="500">To Transport</FormLabel>
                                                <Input
                                                    type="number"
                                                    name="infrastructure.distance[toTransport]"
                                                    value={formData.infrastructure.distance.toTransport}
                                                    onChange={handleChange}
                                                    placeholder="Distance in km"
                                                    borderRadius="xl"
                                                    borderColor="gray.200"
                                                    _hover={{ borderColor: "#F6AB5E" }}
                                                    _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                                />
                                            </FormControl>
                                        </SimpleGrid>
                                    </Box>
                                </Box>
                            </VStack>
                        </TabPanel>

                        {/* Location Tab */}
                        <TabPanel px={0}>
                            <VStack spacing={6} align="stretch">
                                <Heading size="md" color="#111111" fontWeight="600">
                                    Location Information
                                </Heading>

                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <FormControl>
                                        <FormLabel color="#222222" fontWeight="500">District</FormLabel>
                                        <Input
                                            name="location.district"
                                            value={formData.location.district}
                                            onChange={handleChange}
                                            placeholder="Enter district"
                                            borderRadius="xl"
                                            borderColor="gray.200"
                                            _hover={{ borderColor: "#F6AB5E" }}
                                            _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel color="#222222" fontWeight="500">City</FormLabel>
                                        <Input
                                            name="location.city"
                                            value={formData.location.city}
                                            onChange={handleChange}
                                            placeholder="Enter city"
                                            borderRadius="xl"
                                            borderColor="gray.200"
                                            _hover={{ borderColor: "#F6AB5E" }}
                                            _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                        />
                                    </FormControl>
                                </SimpleGrid>

                                <Box>
                                    <Heading size="sm" color="#111111" fontWeight="600" mb={3}>
                                        Coordinates
                                    </Heading>
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                        <FormControl>
                                            <FormLabel color="#222222" fontWeight="500">Latitude</FormLabel>
                                            <Input
                                                type="number"
                                                step="any"
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
                                                placeholder="e.g., 50.4501"
                                                borderRadius="xl"
                                                borderColor="gray.200"
                                                _hover={{ borderColor: "#F6AB5E" }}
                                                _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel color="#222222" fontWeight="500">Longitude</FormLabel>
                                            <Input
                                                type="number"
                                                step="any"
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
                                                placeholder="e.g., 30.5234"
                                                borderRadius="xl"
                                                borderColor="gray.200"
                                                _hover={{ borderColor: "#F6AB5E" }}
                                                _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                            />
                                        </FormControl>
                                    </SimpleGrid>
                                </Box>
                            </VStack>
                        </TabPanel>

                        {/* Images Tab */}
                        <TabPanel px={0}>
                            <VStack spacing={6} align="stretch">
                                <Heading size="md" color="#111111" fontWeight="600">
                                    Property Images
                                </Heading>

                                <FormControl>
                                    <FormLabel color="#222222" fontWeight="500">Upload Images</FormLabel>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        p={2}
                                        borderRadius="xl"
                                        borderColor="gray.200"
                                        _hover={{ borderColor: "#F6AB5E" }}
                                        _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                    />
                                </FormControl>

                                {uploadedImages.length > 0 && (
                                    <Box>
                                        <Heading size="sm" color="#111111" fontWeight="600" mb={4}>
                                            Uploaded Images
                                        </Heading>
                                        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                                            {uploadedImages.map((image, index) => (
                                                <Box
                                                    key={index}
                                                    position="relative"
                                                    borderRadius="xl"
                                                    overflow="hidden"
                                                    boxShadow="md"
                                                    transition="all 0.3s ease"
                                                    _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
                                                >
                                                    <Image
                                                        src={image.preview}
                                                        alt={`Preview ${index}`}
                                                        w="100%"
                                                        h="150px"
                                                        objectFit="cover"
                                                    />
                                                    <IconButton
                                                        icon={<Text fontSize="sm">×</Text>}
                                                        position="absolute"
                                                        top={2}
                                                        right={2}
                                                        size="sm"
                                                        colorScheme="red"
                                                        borderRadius="full"
                                                        onClick={() => removeImage(index)}
                                                        aria-label="Remove image"
                                                        _hover={{
                                                            transform: "scale(1.1)",
                                                        }}
                                                    />
                                                </Box>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                )}
                            </VStack>
                        </TabPanel>

                        {/* Contact Tab */}
                        <TabPanel px={0}>
                            <VStack spacing={6} align="stretch">
                                <Heading size="md" color="#111111" fontWeight="600">
                                    Contact Information
                                </Heading>

                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <FormControl>
                                        <FormLabel color="#222222" fontWeight="500">Name</FormLabel>
                                        <Input
                                            name="contactInfo.name"
                                            value={formData.contactInfo.name}
                                            onChange={handleChange}
                                            placeholder="Contact person name"
                                            borderRadius="xl"
                                            borderColor="gray.200"
                                            _hover={{ borderColor: "#F6AB5E" }}
                                            _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel color="#222222" fontWeight="500">Phone</FormLabel>
                                        <Input
                                            type="tel"
                                            name="contactInfo.phone"
                                            value={formData.contactInfo.phone}
                                            onChange={handleChange}
                                            placeholder="Phone number"
                                            borderRadius="xl"
                                            borderColor="gray.200"
                                            _hover={{ borderColor: "#F6AB5E" }}
                                            _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                        />
                                    </FormControl>
                                </SimpleGrid>

                                <FormControl>
                                    <FormLabel color="#222222" fontWeight="500">Email</FormLabel>
                                    <Input
                                        type="email"
                                        name="contactInfo.email"
                                        value={formData.contactInfo.email}
                                        onChange={handleChange}
                                        placeholder="Email address"
                                        borderRadius="xl"
                                        borderColor="gray.200"
                                        _hover={{ borderColor: "#F6AB5E" }}
                                        _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color="#222222" fontWeight="500">Status</FormLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        borderRadius="xl"
                                        borderColor="gray.200"
                                        _hover={{ borderColor: "#F6AB5E" }}
                                        _focus={{ borderColor: "#F5A623", boxShadow: "0 0 0 1px #F5A623" }}
                                    >
                                        <option value="available">Available</option>
                                        <option value="sold">Sold</option>
                                        <option value="reserved">Reserved</option>
                                    </Select>
                                </FormControl>
                            </VStack>
                        </TabPanel>
                    </TabPanels>

                    {/* Form Status and Actions */}
                    <Box mt={8}>
                        {formStatus.message && (
                            <Alert
                                status={formStatus.type === 'success' ? 'success' : formStatus.type === 'info' ? 'info' : 'error'}
                                borderRadius="xl"
                                mb={4}
                            >
                                <AlertIcon />
                                {formStatus.message}
                            </Alert>
                        )}

                        <Flex
                            direction={{ base: "column", md: "row" }}
                            gap={4}
                            justify={{ base: "center", md: "flex-end" }}
                        >
                            {isEditMode && (
                                <Button
                                    type="button"
                                    onClick={() => onFormSubmit && onFormSubmit(null)}
                                    variant="outline"
                                    borderColor="#111111"
                                    color="#111111"
                                    borderRadius="xl"
                                    size="lg"
                                    _hover={{
                                        bg: "gray.50",
                                        transform: "translateY(-1px)",
                                    }}
                                    transition="all 0.3s ease"
                                >
                                    Cancel
                                </Button>
                            )}

                            <Button
                                type="submit"
                                bg="linear-gradient(135deg, #F7C272 0%, #F4B94F 100%)"
                                color="white"
                                size="lg"
                                borderRadius="xl"
                                fontWeight="600"
                                _hover={{
                                    bg: "linear-gradient(135deg, #F6AB5E 0%, #F5A623 100%)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "lg",
                                }}
                                _active={{
                                    transform: "translateY(0)",
                                    boxShadow: "md",
                                }}
                                transition="all 0.3s ease"
                                minW="200px"
                            >
                                {isEditMode ? 'Update House' : 'Add House'}
                            </Button>
                        </Flex>
                    </Box>
                </form>
            </Tabs>
        </Box>
    );
};

export default AddHouseForm;