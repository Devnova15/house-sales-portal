import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Grid,
    Card,
    CardBody,
    Image,
    Text,
    Button,
    VStack,
    HStack,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Spinner,
    Alert,
    AlertIcon,
    Container
} from '@chakra-ui/react';
import { houseService } from '../../services/houseService';

const HouseList = ({ onEdit }) => {
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, houseId: null });
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Fetch houses on component mount
    useEffect(() => {
        fetchHouses();
    }, []);

    const fetchHouses = async () => {
        try {
            setLoading(true);
            const data = await houseService.getAllHouses();
            setHouses(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching houses:', err);
            setError('Failed to load houses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (houseId) => {
        setDeleteConfirmation({ show: true, houseId });
        onOpen();
    };

    const confirmDelete = async () => {
        try {
            await houseService.deleteHouse(deleteConfirmation.houseId);
            // Remove the deleted house from the state
            setHouses(houses.filter(house => house._id !== deleteConfirmation.houseId));
            // Hide the confirmation dialog
            setDeleteConfirmation({ show: false, houseId: null });
            onClose();
        } catch (err) {
            console.error('Error deleting house:', err);
            setError('Failed to delete house. Please try again later.');
            onClose();
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmation({ show: false, houseId: null });
        onClose();
    };

    if (loading) {
        return (
            <Container maxW="container.xl" py={8}>
                <Flex justify="center" align="center" minH="200px">
                    <VStack spacing={4}>
                        <Spinner
                            size="xl"
                            color="#F5A623"
                            thickness="4px"
                        />
                        <Text fontSize="lg" color="#222222">Loading houses...</Text>
                    </VStack>
                </Flex>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxW="container.xl" py={8}>
                <Alert
                    status="error"
                    bg="red.50"
                    borderRadius="xl"
                    borderLeft="4px solid"
                    borderLeftColor="red.500"
                >
                    <AlertIcon />
                    <Text color="#111111">{error}</Text>
                </Alert>
            </Container>
        );
    }

    if (houses.length === 0) {
        return (
            <Container maxW="container.xl" py={8}>
                <Box
                    textAlign="center"
                    py={16}
                    bg="#ffffff"
                    borderRadius="xl"
                    boxShadow="md"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    <Text fontSize="xl" color="#222222" fontWeight="medium">
                        No houses found. Add your first house using the form below.
                    </Text>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={8}>
                <Heading
                    as="h3"
                    size="lg"
                    color="#111111"
                    fontFamily="Inter, sans-serif"
                    fontWeight="bold"
                    mb={6}
                >
                    Existing Houses
                </Heading>

                <Grid
                    templateColumns={{
                        base: '1fr',
                        md: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)',
                        xl: 'repeat(4, 1fr)'
                    }}
                    gap={6}
                >
                    {houses.map(house => (
                        <Card
                            key={house._id}
                            bg="#ffffff"
                            borderRadius="xl"
                            boxShadow="md"
                            overflow="hidden"
                            transition="all 0.3s ease"
                            _hover={{
                                boxShadow: 'lg',
                                transform: 'translateY(-2px)'
                            }}
                            border="1px solid"
                            borderColor="gray.100"
                        >
                            <Box position="relative" height="200px">
                                {house.images && house.images.length > 0 ? (
                                    <Image
                                        src={house.images[0]}
                                        alt={house.title}
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                    />
                                ) : (
                                    <Flex
                                        height="100%"
                                        align="center"
                                        justify="center"
                                        bg="gray.100"
                                        color="#666666"
                                        fontSize="sm"
                                        fontWeight="medium"
                                    >
                                        No Image
                                    </Flex>
                                )}
                            </Box>

                            <CardBody p={6}>
                                <VStack align="stretch" spacing={3}>
                                    <Heading
                                        as="h4"
                                        size="md"
                                        color="#111111"
                                        fontFamily="Inter, sans-serif"
                                        fontWeight="bold"
                                        noOfLines={2}
                                    >
                                        {house.title}
                                    </Heading>

                                    <Text
                                        fontSize="xl"
                                        fontWeight="bold"
                                        color="#F5A623"
                                        fontFamily="Inter, sans-serif"
                                    >
                                        ${house.price.toLocaleString()}
                                    </Text>

                                    <Text
                                        color="#666666"
                                        fontSize="sm"
                                        noOfLines={2}
                                    >
                                        {house.address}
                                    </Text>

                                    <Text
                                        color="#666666"
                                        fontSize="sm"
                                        fontWeight="medium"
                                    >
                                        {house.bedrooms} bed • {house.bathrooms} bath • {house.area} m²
                                    </Text>

                                    <HStack spacing={3} pt={4}>
                                        <Button
                                            flex={1}
                                            bg="linear-gradient(135deg, #F7C272 0%, #F4B94F 100%)"
                                            color="#ffffff"
                                            fontWeight="bold"
                                            borderRadius="lg"
                                            transition="all 0.3s ease"
                                            _hover={{
                                                bg: "#F6AB5E",
                                                transform: 'translateY(-1px)',
                                                boxShadow: 'md'
                                            }}
                                            _active={{
                                                transform: 'translateY(0)'
                                            }}
                                            onClick={() => onEdit(house)}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            flex={1}
                                            bg="#ffffff"
                                            color="#dc2626"
                                            border="2px solid"
                                            borderColor="#dc2626"
                                            fontWeight="bold"
                                            borderRadius="lg"
                                            transition="all 0.3s ease"
                                            _hover={{
                                                bg: "#dc2626",
                                                color: "#ffffff",
                                                transform: 'translateY(-1px)',
                                                boxShadow: 'md'
                                            }}
                                            _active={{
                                                transform: 'translateY(0)'
                                            }}
                                            onClick={() => handleDeleteClick(house._id)}
                                        >
                                            Delete
                                        </Button>
                                    </HStack>
                                </VStack>
                            </CardBody>
                        </Card>
                    ))}
                </Grid>
            </Box>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isOpen} onClose={cancelDelete} isCentered>
                <ModalOverlay bg="blackAlpha.600" />
                <ModalContent
                    bg="#ffffff"
                    borderRadius="xl"
                    boxShadow="xl"
                    mx={4}
                    maxW="400px"
                >
                    <ModalHeader
                        color="#111111"
                        fontFamily="Inter, sans-serif"
                        fontWeight="bold"
                        fontSize="xl"
                        pb={2}
                    >
                        Confirm Deletion
                    </ModalHeader>

                    <ModalBody pb={6}>
                        <Text color="#666666" fontSize="md">
                            Are you sure you want to delete this house? This action cannot be undone.
                        </Text>
                    </ModalBody>

                    <ModalFooter gap={3}>
                        <Button
                            bg="#ffffff"
                            color="#111111"
                            border="2px solid"
                            borderColor="#111111"
                            fontWeight="bold"
                            borderRadius="lg"
                            transition="all 0.3s ease"
                            _hover={{
                                bg: "#f9f9f9",
                                transform: 'translateY(-1px)'
                            }}
                            onClick={cancelDelete}
                            flex={1}
                        >
                            Cancel
                        </Button>

                        <Button
                            bg="#dc2626"
                            color="#ffffff"
                            fontWeight="bold"
                            borderRadius="lg"
                            transition="all 0.3s ease"
                            _hover={{
                                bg: "#b91c1c",
                                transform: 'translateY(-1px)',
                                boxShadow: 'md'
                            }}
                            _active={{
                                transform: 'translateY(0)'
                            }}
                            onClick={confirmDelete}
                            flex={1}
                        >
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default HouseList;