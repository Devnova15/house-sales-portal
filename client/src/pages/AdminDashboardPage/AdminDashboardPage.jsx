import React, { useState } from 'react';
import {
    Box,
    Flex,
    VStack,
    HStack,
    Button,
    Heading,
    Text,
    FormControl,
    FormLabel,
    Input,
    Image,
    Alert,
    AlertIcon,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    IconButton,
    useBreakpointValue,
    Icon,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constans/rotes';
import AddHouseForm from './AddHouseForm';
import HouseList from './HouseList';

// Простые SVG иконки как компоненты
const HamburgerIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
    </Icon>
);

const UploadIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </Icon>
);

const ViewIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
    </Icon>
);

const SettingsIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
    </Icon>
);

const AdminDashboardPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [activeTab, setActiveTab] = useState('upload');
    const [houseToEdit, setHouseToEdit] = useState(null);
    const [refreshHouseList, setRefreshHouseList] = useState(0);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const isMobile = useBreakpointValue({ base: true, lg: false });

    const handleLogout = () => {
        logout();
        navigate(ROUTES.ADMIN.LOGIN);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(file);
            setUploadStatus('');
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setUploadStatus('Please select a file first');
            return;
        }

        setTimeout(() => {
            setUploadStatus('File uploaded successfully!');
            setSelectedFile(null);
            setPreviewUrl('');
        }, 1500);
    };

    const handleEditHouse = (house) => {
        setHouseToEdit(house);
        setActiveTab('houses');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFormSubmit = (result) => {
        if (result) {
            setRefreshHouseList(prev => prev + 1);
        }
        setHouseToEdit(null);
    };

    const menuItems = [
        { id: 'upload', label: 'Image Upload', icon: UploadIcon },
        { id: 'houses', label: 'Manage Houses', icon: ViewIcon },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ];

    const NavMenu = ({ onItemClick }) => (
        <VStack spacing={2} align="stretch">
            {menuItems.map((item) => (
                <Button
                    key={item.id}
                    leftIcon={<item.icon />}
                    variant={activeTab === item.id ? "solid" : "ghost"}
                    bg={activeTab === item.id ? "#F5A623" : "transparent"}
                    color={activeTab === item.id ? "white" : "#111111"}
                    _hover={{
                        bg: activeTab === item.id ? "#F6AB5E" : "gray.50",
                        transform: "translateY(-1px)",
                    }}
                    _active={{
                        bg: activeTab === item.id ? "#F4B94F" : "gray.100",
                    }}
                    justifyContent="flex-start"
                    borderRadius="xl"
                    transition="all 0.3s ease"
                    onClick={() => {
                        setActiveTab(item.id);
                        if (onItemClick) onItemClick();
                    }}
                >
                    {item.label}
                </Button>
            ))}
        </VStack>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'upload':
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
                            Upload Images
                        </Heading>
                        <form onSubmit={handleUpload}>
                            <VStack spacing={6} align="stretch">
                                <FormControl>
                                    <FormLabel color="#222222" fontWeight="500">
                                        Select Image
                                    </FormLabel>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        p={2}
                                        borderRadius="xl"
                                        borderColor="gray.200"
                                        _focus={{
                                            borderColor: "#F5A623",
                                            boxShadow: "0 0 0 1px #F5A623",
                                        }}
                                        _hover={{
                                            borderColor: "#F6AB5E",
                                        }}
                                    />
                                </FormControl>

                                {previewUrl && (
                                    <Box>
                                        <Text fontSize="lg" fontWeight="500" mb={3} color="#111111">
                                            Preview
                                        </Text>
                                        <Image
                                            src={previewUrl}
                                            alt="Preview"
                                            maxH="300px"
                                            borderRadius="xl"
                                            objectFit="cover"
                                            border="1px solid"
                                            borderColor="gray.200"
                                        />
                                    </Box>
                                )}

                                {uploadStatus && (
                                    <Alert
                                        status={uploadStatus.includes('success') ? 'success' : 'error'}
                                        borderRadius="xl"
                                    >
                                        <AlertIcon />
                                        {uploadStatus}
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    isDisabled={!selectedFile}
                                    bg="linear-gradient(135deg, #F7C272 0%, #F4B94F 100%)"
                                    color="white"
                                    size="lg"
                                    borderRadius="xl"
                                    _hover={{
                                        bg: "linear-gradient(135deg, #F6AB5E 0%, #F5A623 100%)",
                                        transform: "translateY(-2px)",
                                    }}
                                    _active={{
                                        transform: "translateY(0)",
                                    }}
                                    transition="all 0.3s ease"
                                >
                                    Upload Image
                                </Button>
                            </VStack>
                        </form>
                    </Box>
                );

            case 'houses':
                return (
                    <Box
                        bg="white"
                        p={{ base: 6, md: 8 }}
                        borderRadius="xl"
                        boxShadow="lg"
                        transition="all 0.3s ease"
                        _hover={{ boxShadow: "xl" }}
                    >
                        <Heading size="lg" color="#111111" mb={2} fontWeight="600">
                            Manage Houses
                        </Heading>
                        <Text color="#222222" mb={6}>
                            Here you can add, edit, or delete house listings.
                        </Text>

                        <VStack spacing={8} align="stretch">
                            <AddHouseForm
                                houseToEdit={houseToEdit}
                                onFormSubmit={handleFormSubmit}
                            />
                            <HouseList
                                onEdit={handleEditHouse}
                                key={refreshHouseList}
                            />
                        </VStack>
                    </Box>
                );

            case 'settings':
                return (
                    <Box
                        bg="white"
                        p={{ base: 6, md: 8 }}
                        borderRadius="xl"
                        boxShadow="lg"
                        transition="all 0.3s ease"
                        _hover={{ boxShadow: "xl" }}
                    >
                        <Heading size="lg" color="#111111" mb={2} fontWeight="600">
                            Settings
                        </Heading>
                        <Text color="#222222" mb={6}>
                            Configure your admin dashboard settings.
                        </Text>
                        <Box
                            p={8}
                            bg="#f9f9f9"
                            borderRadius="xl"
                            textAlign="center"
                        >
                            <Text color="#666666" fontSize="lg">
                                This feature is under development.
                            </Text>
                        </Box>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Box bg="#f9f9f9" minH="100vh">
            <Flex direction={{ base: "column", lg: "row" }} h="100vh">
                {/* Mobile Header */}
                {isMobile && (
                    <Flex
                        justify="space-between"
                        align="center"
                        p={4}
                        bg="white"
                        boxShadow="sm"
                        borderBottom="1px solid"
                        borderColor="gray.100"
                    >
                        <Heading size="md" color="#111111" fontWeight="700">
                            Admin Panel
                        </Heading>
                        <IconButton
                            icon={<HamburgerIcon />}
                            variant="ghost"
                            onClick={onOpen}
                            aria-label="Open menu"
                        />
                    </Flex>
                )}

                {/* Desktop Sidebar */}
                {!isMobile && (
                    <Box
                        w="280px"
                        bg="white"
                        boxShadow="lg"
                        p={6}
                        borderRight="1px solid"
                        borderColor="gray.100"
                    >
                        <VStack align="stretch" spacing={6} h="full">
                            <Heading size="lg" color="#111111" fontWeight="700" textAlign="center">
                                Admin Panel
                            </Heading>

                            <Box flex="1">
                                <NavMenu />
                            </Box>

                            <Button
                                onClick={handleLogout}
                                colorScheme="red"
                                variant="outline"
                                borderRadius="xl"
                                _hover={{
                                    bg: "red.50",
                                    transform: "translateY(-1px)",
                                }}
                                transition="all 0.3s ease"
                            >
                                Logout
                            </Button>
                        </VStack>
                    </Box>
                )}

                {/* Mobile Drawer */}
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            <Heading size="md" color="#111111" fontWeight="700">
                                Admin Panel
                            </Heading>
                        </DrawerHeader>
                        <DrawerBody>
                            <VStack align="stretch" spacing={6} h="full">
                                <Box flex="1">
                                    <NavMenu onItemClick={onClose} />
                                </Box>

                                <Button
                                    onClick={() => {
                                        handleLogout();
                                        onClose();
                                    }}
                                    colorScheme="red"
                                    variant="outline"
                                    borderRadius="xl"
                                    _hover={{
                                        bg: "red.50",
                                        transform: "translateY(-1px)",
                                    }}
                                    transition="all 0.3s ease"
                                >
                                    Logout
                                </Button>
                            </VStack>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>

                {/* Main Content */}
                <Box
                    flex="1"
                    p={{ base: 4, md: 6, lg: 8 }}
                    overflowY="auto"
                >
                    {renderContent()}
                </Box>
            </Flex>
        </Box>
    );
};

export default AdminDashboardPage;