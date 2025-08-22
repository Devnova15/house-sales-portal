import { Link as RouterLink } from 'react-router-dom';
import { FaHome, FaSearchLocation, FaPhoneAlt, FaChevronRight } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    SimpleGrid,
    VStack,
    Flex,
    Icon,
    useBreakpointValue
} from '@chakra-ui/react';
import FeaturedHouses from '../../components/house/FeaturedHouses';

// Константы стилей
const accent = '#F5A623';
const accentGradient = 'linear(to-r, #F7C272, #F4B94F)';
const bgLight = '#f9f9f9';
const bgWhite = '#ffffff';
const textDark = '#111111';
const textDark2 = '#222222';
const borderRadius = '1rem';

const HomePage = () => {
    const center = [50.202664892265766, 30.274876895590857];
    const heroHeight = useBreakpointValue({ base: '60vh', md: '80vh' });

    // Адаптивный размер заголовка и кнопки
    const heroFontSize = useBreakpointValue({ base: '2xl', sm: '3xl', md: '4xl', lg: '5xl' });
    const heroTextFontSize = useBreakpointValue({ base: 'sm', sm: 'md', md: 'lg' });
    const heroButtonSize = useBreakpointValue({ base: 'sm', sm: 'md', md: 'lg' });
    const heroButtonPx = useBreakpointValue({ base: 4, sm: 6, md: 8 });

    const features = [
        {
            icon: FaHome,
            title: "Різноманіття вибору",
            description: "Будинки для будь-якого стилю та бюджету."
        },
        {
            icon: FaSearchLocation,
            title: "Інтуїтивний пошук",
            description: "Фільтри за ціною, площею, кімнатами, локацією."
        },
        {
            icon: FaPhoneAlt,
            title: "Прямий контакт",
            description: "Спілкуйтеся напряму з продавцем без посередників."
        }
    ];

    return (
        <Box>
            {/* Hero секция */}
            <Box
                h={heroHeight}
                position="relative"
                bgImage="url('/images/HomePageImages/main-image.jpg')"
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
            >
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    // Менее контрастный оверлей
                    bg="rgba(0, 0, 0, 0.25)"
                    backdropFilter="brightness(1.05) contrast(1.05)"
                >
                    <Container
                        maxW="container.xl"
                        h="100%"
                        centerContent
                        justifyContent="center"
                    >
                        <VStack
                            spacing={6}
                            maxW="800px"
                            bg="rgba(255, 255, 255, 0.95)"
                            p={{ base: 4, md: 12 }}
                            rounded={borderRadius}
                            boxShadow="dark-lg"
                            textAlign="center"
                        >
                            <Heading
                                as="h1"
                                fontSize={heroFontSize}
                                fontWeight="bold"
                                color={textDark}
                                lineHeight="1.2"
                                letterSpacing="tight"
                            >
                                Знайдіть будинок своєї мрії
                            </Heading>
                            <Text
                                fontSize={heroTextFontSize}
                                color={textDark2}
                                maxW="600px"
                                fontWeight="500"
                            >
                                Ми пропонуємо великий вибір будинків на будь-який смак і бюджет.
                            </Text>
                            <Button
                                as={RouterLink}
                                to="/houses"
                                size={heroButtonSize}
                                bgGradient={accentGradient}
                                color={textDark}
                                rightIcon={<FaChevronRight />}
                                _hover={{
                                    bgGradient: 'linear(to-r, #F5A623, #F4B94F)',
                                    color: textDark,
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'lg'
                                }}
                                rounded={borderRadius}
                                transition="all 0.3s ease"
                                fontWeight="600"
                                px={heroButtonPx}
                            >
                                Переглянути оголошення
                            </Button>
                        </VStack>
                    </Container>
                </Box>
            </Box>

            {/* Секция с преимуществами */}
            <Box py={16} bg={bgLight}>
                <Container maxW="container.xl">
                    <SimpleGrid
                        columns={{ base: 1, md: 3 }}
                        spacing={{ base: 8, md: 12 }}
                        px={4}
                    >
                        {features.map((feature, idx) => (
                            <Flex
                                key={idx}
                                bg={bgWhite}
                                p={6}
                                rounded={borderRadius}
                                boxShadow="md"
                                transition="all 0.3s ease"
                                _hover={{
                                    transform: 'translateY(-4px)',
                                    boxShadow: 'lg'
                                }}
                            >
                                <VStack align="start" spacing={4}>
                                    <Icon
                                        as={feature.icon}
                                        boxSize={8}
                                        color={accent}
                                    />
                                    <Heading
                                        as="h3"
                                        fontSize="xl"
                                        fontWeight="600"
                                        color={textDark}
                                    >
                                        {feature.title}
                                    </Heading>
                                    <Text color={textDark2}>
                                        {feature.description}
                                    </Text>
                                </VStack>
                            </Flex>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>

            <FeaturedHouses />

            {/* Секция с картой */}
            <Box py={16} bg={bgLight}>
                <Container maxW="container.xl" px={4}>
                    <VStack spacing={8} mb={8} textAlign="center">
                        <Heading
                            as="h2"
                            fontSize={{ base: '2xl', md: '3xl' }}
                            color={textDark}
                            fontWeight="bold"
                        >
                            Місце розташування
                        </Heading>
                        <Text
                            fontSize={{ base: 'md', md: 'lg' }}
                            color={textDark2}
                            maxW="600px"
                        >
                            Наші будинки розташовані поблизу Києва в зручному місці
                        </Text>
                    </VStack>

                    <Box
                        rounded={borderRadius}
                        overflow="hidden"
                        boxShadow="lg"
                        bg={bgWhite}
                    >
                        <MapContainer
                            center={center}
                            zoom={10}
                            scrollWheelZoom={false}
                            style={{ height: '500px', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
                                    Путрівка
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;
