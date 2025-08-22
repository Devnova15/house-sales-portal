import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Icon,
    Button,
    useBreakpointValue,
    SimpleGrid
} from '@chakra-ui/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaViber, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const ContactPage = () => {
    const center = [50.202664892265766, 30.274876895590857];
    const heroHeight = useBreakpointValue({ base: '50vh', md: '60vh', lg: '70vh' });
    const heroTextSize = useBreakpointValue({ base: '2xl', md: '3xl', lg: '4xl' });
    const heroDescSize = useBreakpointValue({ base: 'md', md: 'lg', lg: 'xl' });
    const infoGridColumns = useBreakpointValue({ base: 1, sm: 2, lg: 4 });

    return (
        <Box fontFamily="Inter, sans-serif">
            {/* Hero Section */}
            <Box
                position="relative"
                minH={heroHeight}
                bgImage="url('/images/HomePageImages/main-image.jpg')"
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
            >
                {/* Градиентный оверлей */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="linear-gradient(135deg, rgba(17, 17, 17, 0.75) 0%, rgba(34, 34, 34, 0.75) 100%)"
                    zIndex={1}
                />

                {/* Декоративные элементы */}
                <Box
                    position="absolute"
                    top="-80px"
                    right="-80px"
                    width="250px"
                    height="250px"
                    bg="rgba(245, 166, 35, 0.15)"
                    borderRadius="50%"
                    filter="blur(60px)"
                    zIndex={2}
                />
                <Box
                    position="absolute"
                    bottom="-60px"
                    left="-60px"
                    width="200px"
                    height="200px"
                    bg="rgba(245, 166, 35, 0.15)"
                    borderRadius="50%"
                    filter="blur(40px)"
                    zIndex={2}
                />

                <Container
                    maxW="container.xl"
                    position="relative"
                    zIndex={3}
                    textAlign="center"
                    px={{ base: 4, md: 6 }}
                >
                    <VStack spacing={{ base: 4, md: 6 }}>
                        <Heading
                            as="h1"
                            fontSize={heroTextSize}
                            fontWeight="800"
                            color="#ffffff"
                            lineHeight="1.2"
                            letterSpacing="tight"
                            textShadow="0 4px 8px rgba(0, 0, 0, 0.5)"
                        >
                            Контакти
                        </Heading>
                        <Text
                            fontSize={heroDescSize}
                            color="rgba(255, 255, 255, 0.95)"
                            maxW="700px"
                            lineHeight="1.6"
                            fontWeight="500"
                            textAlign="center"
                            textShadow="0 2px 4px rgba(0, 0, 0, 0.5)"
                        >
                            Зв'яжіться з нами для отримання додаткової інформації або консультації
                        </Text>
                    </VStack>
                </Container>
            </Box>

            {/* Main Content */}
            <Box bg="#f9f9f9" py={{ base: 12, md: 16, lg: 20 }}>
                <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
                    <VStack spacing={{ base: 16, md: 20 }}>
                        {/* Contact Info Section */}
                        <Box w="full">
                            <VStack spacing={{ base: 8, md: 12 }}>
                                <Heading
                                    as="h2"
                                    fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                                    fontWeight="700"
                                    color="#111111"
                                    textAlign="center"
                                    position="relative"
                                    _after={{
                                        content: '""',
                                        position: "absolute",
                                        bottom: "-8px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: "60px",
                                        height: "3px",
                                        bg: "#F5A623",
                                        borderRadius: "full"
                                    }}
                                >
                                    Наші контакти
                                </Heading>

                                <SimpleGrid
                                    columns={infoGridColumns}
                                    spacing={{ base: 6, md: 8 }}
                                    w="full"
                                >
                                    {[
                                        {
                                            icon: FaPhone,
                                            title: "Телефон",
                                            lines: ["+380 44 123 4567", "+380 67 987 6543"]
                                        },
                                        {
                                            icon: FaEnvelope,
                                            title: "Email",
                                            lines: ["info@housesales.com", "support@housesales.com"]
                                        },
                                        {
                                            icon: FaMapMarkerAlt,
                                            title: "Адреса",
                                            lines: ["вул. Хрещатик, 22", "Київ, 01001, Україна"]
                                        },
                                        {
                                            icon: FaClock,
                                            title: "Години роботи",
                                            lines: ["Пн-Пт: 9:00 - 18:00", "Сб: 10:00 - 15:00"]
                                        }
                                    ].map((contact, index) => (
                                        <Box
                                            key={index}
                                            bg="#ffffff"
                                            p={{ base: 6, md: 8 }}
                                            rounded="xl"
                                            shadow="md"
                                            textAlign="center"
                                            transition="all 0.3s ease"
                                            _hover={{
                                                shadow: "lg",
                                                transform: "translateY(-8px)"
                                            }}
                                        >
                                            <VStack spacing={4}>
                                                <Box
                                                    bg="linear-gradient(135deg, #F7C272 0%, #F4B94F 100%)"
                                                    p={4}
                                                    borderRadius="xl"
                                                    transition="all 0.3s ease"
                                                    _hover={{
                                                        transform: "scale(1.1)"
                                                    }}
                                                >
                                                    <Icon
                                                        as={contact.icon}
                                                        boxSize={8}
                                                        color="#ffffff"
                                                    />
                                                </Box>
                                                <Heading
                                                    as="h3"
                                                    fontSize={{ base: 'lg', md: 'xl' }}
                                                    fontWeight="600"
                                                    color="#111111"
                                                >
                                                    {contact.title}
                                                </Heading>
                                                <VStack spacing={1}>
                                                    {contact.lines.map((line, lineIndex) => (
                                                        <Text
                                                            key={lineIndex}
                                                            fontSize={{ base: 'sm', md: 'md' }}
                                                            color="#222222"
                                                            lineHeight="1.6"
                                                        >
                                                            {line}
                                                        </Text>
                                                    ))}
                                                </VStack>
                                            </VStack>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            </VStack>
                        </Box>

                        {/* Social Media Contact Section */}
                        <Box
                            bg="#ffffff"
                            rounded="xl"
                            p={{ base: 8, md: 10, lg: 12 }}
                            shadow="md"
                            w="full"
                            transition="all 0.3s ease"
                            _hover={{
                                shadow: "lg"
                            }}
                        >
                            <VStack spacing={{ base: 6, md: 8 }}>
                                <Heading
                                    as="h2"
                                    fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                                    fontWeight="700"
                                    color="#111111"
                                    textAlign="center"
                                    position="relative"
                                    _after={{
                                        content: '""',
                                        position: "absolute",
                                        bottom: "-8px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: "60px",
                                        height: "3px",
                                        bg: "#F5A623",
                                        borderRadius: "full"
                                    }}
                                >
                                    Напишіть нам
                                </Heading>

                                <Box w="full" maxW="600px" mx="auto">
                                    <VStack spacing={6}>
                                        <Text
                                            fontSize={{ base: 'md', md: 'lg' }}
                                            color="#666666"
                                            textAlign="center"
                                            lineHeight="1.6"
                                        >
                                            Оберіть зручний для Вас спосіб зв'язку
                                        </Text>

                                        {/* На больших экранах */}
                                        <HStack spacing={4} w="full" display={{ base: 'none', md: 'flex' }}>
                                            <Button
                                                as="a"
                                                href="viber://chat?number=380671234567"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                size="lg"
                                                flex={1}
                                                bg="#665CAC"
                                                color="white"
                                                rounded="xl"
                                                leftIcon={<FaViber />}
                                                fontSize="md"
                                                fontWeight="600"
                                                h="60px"
                                                _hover={{ bg: "#5A4E9A", transform: "translateY(-2px)", shadow: "lg" }}
                                                transition="all 0.3s ease"
                                            >
                                                Viber
                                            </Button>

                                            <Button
                                                as="a"
                                                href="https://wa.me/380671234567"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                size="lg"
                                                flex={1}
                                                bg="#25D366"
                                                color="white"
                                                rounded="xl"
                                                leftIcon={<FaWhatsapp />}
                                                fontSize="md"
                                                fontWeight="600"
                                                h="60px"
                                                _hover={{ bg: "#20C55A", transform: "translateY(-2px)", shadow: "lg" }}
                                                transition="all 0.3s ease"
                                            >
                                                WhatsApp
                                            </Button>

                                            <Button
                                                as="a"
                                                href="https://t.me/username"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                size="lg"
                                                flex={1}
                                                bg="#0088CC"
                                                color="white"
                                                rounded="xl"
                                                leftIcon={<FaTelegram />}
                                                fontSize="md"
                                                fontWeight="600"
                                                h="60px"
                                                _hover={{ bg: "#007BB8", transform: "translateY(-2px)", shadow: "lg" }}
                                                transition="all 0.3s ease"
                                            >
                                                Telegram
                                            </Button>
                                        </HStack>

                                        {/* На мобильных устройствах */}
                                        <VStack spacing={3} w="full" display={{ base: 'flex', md: 'none' }}>
                                            <Button
                                                as="a"
                                                href="viber://chat?number=380671234567"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                size="md"
                                                w="full"
                                                bg="#665CAC"
                                                color="white"
                                                rounded="xl"
                                                leftIcon={<FaViber />}
                                                fontSize={{ base: 'xs', sm: 'sm' }}
                                                fontWeight="600"
                                                h={{ base: '48px', sm: '56px' }}
                                                px={{ base: 3, sm: 4 }}
                                                _hover={{ bg: "#5A4E9A", transform: "translateY(-2px)", shadow: "lg" }}
                                                transition="all 0.3s ease"
                                            >
                                                Viber
                                            </Button>

                                            <Button
                                                as="a"
                                                href="https://wa.me/380671234567"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                size="md"
                                                w="full"
                                                bg="#25D366"
                                                color="white"
                                                rounded="xl"
                                                leftIcon={<FaWhatsapp />}
                                                fontSize={{ base: 'xs', sm: 'sm' }}
                                                fontWeight="600"
                                                h={{ base: '48px', sm: '56px' }}
                                                px={{ base: 3, sm: 4 }}
                                                _hover={{ bg: "#20C55A", transform: "translateY(-2px)", shadow: "lg" }}
                                                transition="all 0.3s ease"
                                            >
                                                WhatsApp
                                            </Button>

                                            <Button
                                                as="a"
                                                href="https://t.me/username"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                size="md"
                                                w="full"
                                                bg="#0088CC"
                                                color="white"
                                                rounded="xl"
                                                leftIcon={<FaTelegram />}
                                                fontSize={{ base: 'xs', sm: 'sm' }}
                                                fontWeight="600"
                                                h={{ base: '48px', sm: '56px' }}
                                                px={{ base: 3, sm: 4 }}
                                                _hover={{ bg: "#007BB8", transform: "translateY(-2px)", shadow: "lg" }}
                                                transition="all 0.3s ease"
                                            >
                                                Telegram
                                            </Button>
                                        </VStack>
                                    </VStack>
                                </Box>
                            </VStack>
                        </Box>

                        {/* Map Section */}
                        <Box
                            bg="#ffffff"
                            rounded="xl"
                            p={{ base: 6, md: 8 }}
                            shadow="md"
                            w="full"
                            transition="all 0.3s ease"
                            _hover={{
                                shadow: "lg"
                            }}
                        >
                            <VStack spacing={{ base: 6, md: 8 }}>
                                <Heading
                                    as="h2"
                                    fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                                    fontWeight="700"
                                    color="#111111"
                                    textAlign="center"
                                    position="relative"
                                    _after={{
                                        content: '""',
                                        position: "absolute",
                                        bottom: "-8px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: "60px",
                                        height: "3px",
                                        bg: "#F5A623",
                                        borderRadius: "full"
                                    }}
                                >
                                    Наше розташування
                                </Heading>

                                <Box
                                    w="full"
                                    h={{ base: "300px", md: "400px", lg: "500px" }}
                                    rounded="xl"
                                    overflow="hidden"
                                    shadow="md"
                                    transition="all 0.3s ease"
                                    _hover={{
                                        shadow: "lg"
                                    }}
                                >
                                    <MapContainer
                                        center={center}
                                        zoom={13}
                                        scrollWheelZoom={false}
                                        style={{ height: '100%', width: '100%' }}
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
                                                House Sales Portal<br />
                                                вул. Хрещатик, 22<br />
                                                Київ, 01001, Україна
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                </Box>
                            </VStack>
                        </Box>
                    </VStack>
                </Container>
            </Box>
        </Box>
    );
};

export default ContactPage;