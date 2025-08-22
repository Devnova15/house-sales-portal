import {
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaHome,
    FaFacebook, FaInstagram, FaTelegram, FaHeart
} from 'react-icons/fa';
import {
    Box, Container, SimpleGrid, Stack, Text, Flex,
    Heading, Link, Icon, HStack, VStack, Divider
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const accent = '#F5A623';
const accentHover = '#F6AB5E';
const bgLight = '#f9f9f9';
const bgWhite = '#ffffff';
const textDark = '#111111';
const textDark2 = '#222222';
const borderRadius = '1rem';

const Footer = () => {
    return (
        <Box
            as="footer"
            bg={bgWhite}
            color={textDark2}
            borderTopWidth={1}
            borderColor="gray.200"
            py={{ base: 10, md: 14, lg: 20 }}
            width="100%"
        >
            <Container maxW="1600px" px={{ base: 4, md: 6, lg: 8 }}>
                <SimpleGrid
                    columns={{ base: 1, md: 3 }}
                    spacing={{ base: 10, md: 16, lg: 24 }}
                    mb={12}
                >
                    {/* Логотип и описание */}
                    <Stack spacing={6}>
                        <Flex align="center">
                            <Icon as={FaHome} w={8} h={8} color={accent} mr={3} />
                            <Heading as="h3" size="md" color={textDark} fontWeight="700">
                                Продаж будинків
                            </Heading>
                        </Flex>
                        <Text fontSize="md" lineHeight="tall" color={textDark2}>
                            Наш сайт пропонує великий вибір будинків для продажу.
                            Ми допомагаємо знайти ідеальний дім для вашої родини
                            з найкращими умовами та розташуванням.
                        </Text>
                    </Stack>

                    {/* Быстрые ссылки */}
                    <Stack spacing={6}>
                        <Heading as="h3" size="sm" color={textDark} fontWeight="700">
                            Швидкі посилання
                        </Heading>
                        <Stack spacing={4}>
                            <Link
                                as={RouterLink}
                                to="/"
                                color={textDark2}
                                fontSize="md"
                                _hover={{ color: accent, transform: 'translateX(5px)' }}
                                transition="all 0.3s ease"
                            >
                                Головна
                            </Link>
                            <Link
                                as={RouterLink}
                                to="/houses"
                                color={textDark2}
                                fontSize="md"
                                _hover={{ color: accent, transform: 'translateX(5px)' }}
                                transition="all 0.3s ease"
                            >
                                Оголошення
                            </Link>
                            <Link
                                as={RouterLink}
                                to="/about"
                                color={textDark2}
                                fontSize="md"
                                _hover={{ color: accent, transform: 'translateX(5px)' }}
                                transition="all 0.3s ease"
                            >
                                Про нас
                            </Link>
                            <Link
                                as={RouterLink}
                                to="/contact"
                                color={textDark2}
                                fontSize="md"
                                _hover={{ color: accent, transform: 'translateX(5px)' }}
                                transition="all 0.3s ease"
                            >
                                Контакти
                            </Link>
                        </Stack>
                    </Stack>

                    {/* Контакты */}
                    <Stack spacing={6}>
                        <Heading as="h3" size="sm" color={textDark} fontWeight="700">
                            Контакти
                        </Heading>
                        <VStack spacing={4} align="start">
                            <Flex align="center" _hover={{ color: accent }}>
                                <Icon as={FaPhone} color={accent} boxSize={5} mr={3} />
                                <Text fontSize="md">+38 (099) 123-45-67</Text>
                            </Flex>
                            <Flex align="center" _hover={{ color: accent }}>
                                <Icon as={FaEnvelope} color={accent} boxSize={5} mr={3} />
                                <Text fontSize="md">info@example.com</Text>
                            </Flex>
                            <Flex align="center" _hover={{ color: accent }}>
                                <Icon as={FaMapMarkerAlt} color={accent} boxSize={5} mr={3} />
                                <Text fontSize="md">вул. Київська 123, Путрівка</Text>
                            </Flex>
                        </VStack>
                    </Stack>
                </SimpleGrid>

                {/* Социальные сети */}
                <Box mb={12} mt={8}>
                    <Divider mb={10} borderColor="gray.200" />
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        justify="space-between"
                        align={{ base: "center", md: "center" }}
                        gap={8}
                    >
                        <Text fontSize="xl" fontWeight="600" color={textDark}>
                            Слідкуйте за нами в соціальних мережах
                        </Text>
                        <HStack spacing={8}>
                            {[FaFacebook, FaInstagram, FaTelegram].map((SocialIcon, idx) => (
                                <Link key={idx} href="#" isExternal>
                                    <Box
                                        bg="gray.100"
                                        p={4}
                                        borderRadius="full"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        transition="all 0.3s ease"
                                        _hover={{
                                            bg: accent,
                                            transform: "translateY(-5px)",
                                            boxShadow: "lg"
                                        }}
                                    >
                                        <Icon as={SocialIcon} boxSize={6} color={textDark} />
                                    </Box>
                                </Link>
                            ))}
                        </HStack>
                    </Flex>
                </Box>

                {/* Нижний колонтитул */}
                <Divider mb={6} borderColor="gray.200" />
                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                    fontSize="sm"
                    py={4}
                    color={textDark2}
                >
                    <Text>
                        © {new Date().getFullYear()} Продаж будинків. Всі права захищено.
                    </Text>
                    <Text mt={{ base: 4, md: 0 }}>
                        Зроблено з <Icon as={FaHeart} color={accent} mx={1} transform="translateY(-1px)" /> в Україні
                    </Text>
                </Flex>
            </Container>
        </Box>
    );
};

export default Footer;