import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Link,
  useToast,
  useColorModeValue,
  Card,
  CardBody,
  Divider,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import { authService } from '../../services/authService';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    loginOrEmail: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.loginOrEmail.trim()) {
      newErrors.loginOrEmail = 'Email або логін є обов\'язковим';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль є обов\'язковим';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      const response = await authService.login({
        loginOrEmail: formData.loginOrEmail,
        password: formData.password
      });
      
      if (response.success) {
        toast({
          title: 'Успішний вхід',
          description: 'Ви успішно увійшли в систему',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Redirect to home page or back to where they came from
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.auth) {
        setErrors(error);
      } else {
        toast({
          title: 'Помилка входу',
          description: error.message || 'Сталася помилка під час входу',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="md">
        <VStack spacing={8}>
          <Box textAlign="center">
            <Heading size="xl" mb={4} display="flex" alignItems="center" justifyContent="center">
              <FaSignInAlt style={{ marginRight: '12px' }} />
              Вхід в систему
            </Heading>
            <Text color="gray.800" fontWeight="500">
              Увійдіть в свій акаунт для керування обраними будинками
            </Text>
          </Box>
          
          <Card bg={cardBg} w="100%" boxShadow="lg">
            <CardBody p={8}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.loginOrEmail}>
                    <FormLabel>Email або логін *</FormLabel>
                    <Input
                      name="loginOrEmail"
                      value={formData.loginOrEmail}
                      onChange={handleInputChange}
                      placeholder="Введіть email або логін"
                      color="black"
                      _placeholder={{ color: "gray.600" }}
                    />
                    {errors.loginOrEmail && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.loginOrEmail}
                      </Text>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Пароль *</FormLabel>
                    <InputGroup>
                      <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Введіть пароль"
                        color="black"
                        _placeholder={{ color: "gray.600" }}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
                          icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    {errors.password && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.password}
                      </Text>
                    )}
                  </FormControl>
                  
                  {errors.auth && (
                    <Alert status="error">
                      <AlertIcon />
                      {errors.auth}
                    </Alert>
                  )}
                  
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    width="100%"
                    isLoading={loading}
                    loadingText="Вхід..."
                  >
                    Увійти
                  </Button>
                </VStack>
              </form>
              
              <Divider my={6} />
              
              <Text textAlign="center" color="gray.800" fontWeight="500">
                Ще не маєте акаунту?{' '}
                <Link as={RouterLink} to="/register" color="blue.500" fontWeight="semibold">
                  Зареєструватися
                </Link>
              </Text>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginPage;