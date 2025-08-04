import { 
    FaPhone, 
    FaEnvelope, 
    FaMapMarkerAlt, 
    FaHome, 
    FaFacebook, 
    FaInstagram, 
    FaTelegram, 
    FaHeart 
} from 'react-icons/fa';
import { 
    Box, 
    Container, 
    SimpleGrid, 
    Stack, 
    Text, 
    Flex, 
    Heading, 
    Link, 
    Icon, 
    Button, 
    HStack, 
    VStack, 
    Divider, 
    useColorModeValue,
    Input,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    const bgColor = useColorModeValue('gray.900', 'gray.900');
    const textColor = useColorModeValue('gray.400', 'gray.400');
    const headingColor = useColorModeValue('white', 'white');
    const borderColor = useColorModeValue('gray.800', 'gray.800');
    const iconColor = useColorModeValue('brand.500', 'brand.400');
    const hoverColor = useColorModeValue('brand.400', 'brand.300');
    const inputBgColor = useColorModeValue('gray.800', 'gray.800');

    return (
        <Box
            as="footer"
            bg={bgColor}
            color={textColor}
            borderTopWidth={1}
            borderColor={borderColor}
            py={16}
            width="100%"
        >
            <Container maxW="100%" px={[4, 6, 8, 10]}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={10}>
                    <Stack spacing={4}>
                        <Flex align="center">
                            <Icon as={FaHome} w={6} h={6} color={iconColor} mr={2} />
                            <Heading as="h3" size="md" color={headingColor}>
                                Продаж будинків
                            </Heading>
                        </Flex>
                        <Text color={textColor} fontSize="sm">
                            Наш сайт пропонує великий вибір будинків для продажу. Ми допомагаємо знайти
                            ідеальний дім для вашої родини.
                        </Text>
                    </Stack>

                    <Stack spacing={4}>
                        <Heading as="h3" size="md" color={headingColor}>
                            Швидкі посилання
                        </Heading>
                        <Stack spacing={2}>
                            <Link 
                                as={RouterLink} 
                                to="/" 
                                _hover={{ color: hoverColor, textDecoration: 'none' }}
                                display="flex"
                                alignItems="center"
                            >
                                <Icon as={FaHome} mr={2} />
                                Головна
                            </Link>
                            <Link 
                                as={RouterLink} 
                                to="/houses" 
                                _hover={{ color: hoverColor, textDecoration: 'none' }}
                                display="flex"
                                alignItems="center"
                            >
                                <Icon as={FaHome} mr={2} />
                                Оголошення
                            </Link>
                            <Link 
                                as={RouterLink} 
                                to="/about" 
                                _hover={{ color: hoverColor, textDecoration: 'none' }}
                                display="flex"
                                alignItems="center"
                            >
                                <Icon as={FaHome} mr={2} />
                                Про нас
                            </Link>
                            <Link 
                                as={RouterLink} 
                                to="/contact" 
                                _hover={{ color: hoverColor, textDecoration: 'none' }}
                                display="flex"
                                alignItems="center"
                            >
                                <Icon as={FaHome} mr={2} />
                                Контакти
                            </Link>
                        </Stack>
                    </Stack>

                    <Stack spacing={4}>
                        <Heading as="h3" size="md" color={headingColor}>
                            Контакти
                        </Heading>
                        <VStack spacing={3} align="start">
                            <Flex align="center">
                                <Icon as={FaPhone} mr={3} color={iconColor} />
                                <Text>+380 (XX) XXX-XX-XX</Text>
                            </Flex>
                            <Flex align="center">
                                <Icon as={FaEnvelope} mr={3} color={iconColor} />
                                <Text>info@houses-sale.com</Text>
                            </Flex>
                            <Flex align="center">
                                <Icon as={FaMapMarkerAlt} mr={3} color={iconColor} />
                                <Text>м. Київ, вул. Головна, 123</Text>
                            </Flex>
                        </VStack>
                    </Stack>

                    <Stack spacing={4}>
                        <Heading as="h3" size="md" color={headingColor}>
                            Підписка на новини
                        </Heading>
                        <Text fontSize="sm">
                            Підпишіться, щоб отримувати інформацію про нові пропозиції
                        </Text>
                        <InputGroup size="lg">
                            <Input
                                pr="7rem"
                                type="email"
                                placeholder="Ваш email"
                                borderRadius="full"
                                bg={inputBgColor}
                                borderColor={borderColor}
                                _hover={{ borderColor: hoverColor }}
                                _focus={{ borderColor: hoverColor, boxShadow: `0 0 0 1px ${hoverColor}` }}
                                fontSize="md"
                                py={6}
                            />
                            <InputRightElement width="7rem" h="full">
                                <Button 
                                    size="md" 
                                    colorScheme="brand"
                                    borderLeftRadius={0}
                                    borderRightRadius="full"
                                    h="full"
                                    mr={1}
                                    _hover={{ bg: 'brand.400' }}
                                >
                                    Підписатися
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </Stack>
                </SimpleGrid>

                {/* Social Media */}
                <Box mb={10} mt={6}>
                    <Divider mb={8} borderColor={borderColor} />
                    <Flex 
                        direction={{ base: 'column', md: 'row' }}
                        justify="space-between"
                        align={{ base: 'center', md: 'center' }}
                        gap={6}
                    >
                        <Text fontSize="lg" fontWeight="medium" color={headingColor}>Слідкуйте за нами в соціальних мережах</Text>
                        <HStack spacing={6}>
                            <Link href="#" isExternal>
                                <Box
                                    as="span"
                                    bg="whiteAlpha.100"
                                    p={3}
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    transition="all 0.3s ease"
                                    _hover={{ 
                                        bg: "brand.600", 
                                        transform: "translateY(-5px)",
                                        boxShadow: "lg"
                                    }}
                                >
                                    <Icon 
                                        as={FaFacebook} 
                                        w={5} 
                                        h={5} 
                                        color="white"
                                    />
                                </Box>
                            </Link>
                            <Link href="#" isExternal>
                                <Box
                                    as="span"
                                    bg="whiteAlpha.100"
                                    p={3}
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    transition="all 0.3s ease"
                                    _hover={{ 
                                        bg: "brand.600", 
                                        transform: "translateY(-5px)",
                                        boxShadow: "lg"
                                    }}
                                >
                                    <Icon 
                                        as={FaInstagram} 
                                        w={5} 
                                        h={5} 
                                        color="white"
                                    />
                                </Box>
                            </Link>
                            <Link href="#" isExternal>
                                <Box
                                    as="span"
                                    bg="whiteAlpha.100"
                                    p={3}
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    transition="all 0.3s ease"
                                    _hover={{ 
                                        bg: "brand.600", 
                                        transform: "translateY(-5px)",
                                        boxShadow: "lg"
                                    }}
                                >
                                    <Icon 
                                        as={FaTelegram} 
                                        w={5} 
                                        h={5} 
                                        color="white"
                                    />
                                </Box>
                            </Link>
                        </HStack>
                    </Flex>
                </Box>

                <Divider mb={6} borderColor={borderColor} />
                <Flex 
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    align="center"
                    fontSize="sm"
                    py={4}
                >
                    <Text color="whiteAlpha.800">
                        © {new Date().getFullYear()} Продаж будинків. Всі права захищено.
                    </Text>
                    <Text mt={{ base: 4, md: 0 }} color="whiteAlpha.800">
                        Зроблено з <Icon as={FaHeart} color="red.500" mx={1} transform="translateY(-1px)" /> в Україні
                    </Text>
                </Flex>
            </Container>
        </Box>
    );
};

export default Footer;
