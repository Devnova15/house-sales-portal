import React, { useState } from 'react';
import {
    Box,
    Flex,
    VStack,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Alert,
    AlertIcon,
    Text,
    Container,
    useBreakpointValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constans/rotes';
import { QUERY } from "../../constans/query.js";
import { sendRequest } from "../../utils/sendRequest.js";

const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Responsive values
    const cardWidth = useBreakpointValue({ base: "90%", sm: "400px", md: "450px" });
    const cardPadding = useBreakpointValue({ base: 6, md: 8 });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            loginOrEmail: username,
            password: password,
        };

        setError('');
        setLoading(true);

        try {
            const data = await sendRequest(QUERY.ADMIN.LOGIN, 'POST', userData);

            if (data.success && data.token && data.token.includes('Bearer ') && data.token.length > 7) {
                console.log("Login success, token:", data.token);
                await login(data.token);
                console.log("Navigating to dashboard...");
                navigate(ROUTES.ADMIN.DASHBOARD);
            } else {
                console.error('Invalid token format:', data);
                setError(data.message || 'Authentication failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('Authentication error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            bg="linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%)"
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            <Container maxW="container.sm" centerContent>
                <Box
                    bg="white"
                    w={cardWidth}
                    p={cardPadding}
                    borderRadius="xl"
                    boxShadow="xl"
                    border="1px solid"
                    borderColor="gray.100"
                    transition="all 0.3s ease"
                    _hover={{
                        boxShadow: "2xl",
                        transform: "translateY(-2px)",
                    }}
                >
                    {/* Header */}
                    <VStack spacing={6} align="stretch">
                        <Box textAlign="center">
                            <Heading
                                size="xl"
                                color="#111111"
                                fontWeight="700"
                                mb={2}
                            >
                                Admin Login
                            </Heading>
                            <Text color="#666666" fontSize="md">
                                Sign in to access the admin dashboard
                            </Text>
                        </Box>

                        {/* Error Alert */}
                        {error && (
                            <Alert
                                status="error"
                                borderRadius="xl"
                                bg="red.50"
                                border="1px solid"
                                borderColor="red.200"
                            >
                                <AlertIcon />
                                <Text fontSize="sm" color="red.700">
                                    {error}
                                </Text>
                            </Alert>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={5} align="stretch">
                                <FormControl isRequired>
                                    <FormLabel
                                        color="#222222"
                                        fontWeight="500"
                                        fontSize="sm"
                                        mb={2}
                                    >
                                        Username
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter your username"
                                        size="lg"
                                        borderRadius="xl"
                                        borderColor="gray.200"
                                        bg="gray.50"
                                        _hover={{
                                            borderColor: "#F6AB5E",
                                            bg: "white",
                                        }}
                                        _focus={{
                                            borderColor: "#F5A623",
                                            boxShadow: "0 0 0 1px #F5A623",
                                            bg: "white",
                                        }}
                                        _placeholder={{
                                            color: "gray.400",
                                        }}
                                        transition="all 0.3s ease"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel
                                        color="#222222"
                                        fontWeight="500"
                                        fontSize="sm"
                                        mb={2}
                                    >
                                        Password
                                    </FormLabel>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        size="lg"
                                        borderRadius="xl"
                                        borderColor="gray.200"
                                        bg="gray.50"
                                        _hover={{
                                            borderColor: "#F6AB5E",
                                            bg: "white",
                                        }}
                                        _focus={{
                                            borderColor: "#F5A623",
                                            boxShadow: "0 0 0 1px #F5A623",
                                            bg: "white",
                                        }}
                                        _placeholder={{
                                            color: "gray.400",
                                        }}
                                        transition="all 0.3s ease"
                                    />
                                </FormControl>

                                <Button
                                    type="submit"
                                    size="lg"
                                    borderRadius="xl"
                                    bg="linear-gradient(135deg, #F7C272 0%, #F4B94F 100%)"
                                    color="white"
                                    fontWeight="600"
                                    isLoading={loading}
                                    loadingText="Logging in..."
                                    _hover={{
                                        bg: "linear-gradient(135deg, #F6AB5E 0%, #F5A623 100%)",
                                        transform: "translateY(-2px)",
                                        boxShadow: "lg",
                                    }}
                                    _active={{
                                        transform: "translateY(0)",
                                        boxShadow: "md",
                                    }}
                                    _disabled={{
                                        opacity: 0.6,
                                        cursor: "not-allowed",
                                        transform: "none",
                                    }}
                                    transition="all 0.3s ease"
                                    mt={2}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </VStack>
                        </form>

                        {/* Footer Text */}
                        <Box textAlign="center" pt={4}>
                            <Text fontSize="sm" color="#666666">
                                Secure admin access only
                            </Text>
                        </Box>
                    </VStack>
                </Box>
            </Container>
        </Box>
    );
};

export default AdminLoginPage;