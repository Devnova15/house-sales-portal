import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Icon,
    useBreakpointValue
} from '@chakra-ui/react';
import { FaBuilding, FaUsers, FaHandshake, FaAward } from 'react-icons/fa';

const AboutPage = () => {
    const heroHeight = useBreakpointValue({ base: '60vh', md: '70vh', lg: '80vh' });
    const heroTextSize = useBreakpointValue({ base: '2xl', md: '3xl', lg: '4xl' });
    const heroDescSize = useBreakpointValue({ base: 'md', md: 'lg', lg: 'xl' });

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
                    bg="linear-gradient(135deg, rgba(17, 17, 17, 0.7) 0%, rgba(34, 34, 34, 0.7) 100%)"
                    zIndex={1}
                />

                {/* Декоративные элементы */}
                <Box
                    position="absolute"
                    top="-100px"
                    right="-100px"
                    width="300px"
                    height="300px"
                    bg="rgba(245, 166, 35, 0.15)"
                    borderRadius="50%"
                    filter="blur(80px)"
                    zIndex={2}
                />
                <Box
                    position="absolute"
                    bottom="-80px"
                    left="-80px"
                    width="250px"
                    height="250px"
                    bg="rgba(245, 166, 35, 0.15)"
                    borderRadius="50%"
                    filter="blur(60px)"
                    zIndex={2}
                />

                <Container
                    maxW="container.xl"
                    position="relative"
                    zIndex={3}
                    textAlign="center"
                    px={{ base: 4, md: 6 }}
                >
                    <VStack spacing={{ base: 6, md: 8 }}>
                        <Heading
                            as="h1"
                            fontSize={heroTextSize}
                            fontWeight="800"
                            color="#ffffff"
                            lineHeight="1.2"
                            letterSpacing="tight"
                            textShadow="0 4px 8px rgba(0, 0, 0, 0.5)"
                        >
                            Про мене
                        </Heading>
                        <Text
                            fontSize={heroDescSize}
                            color="rgba(255, 255, 255, 0.95)"
                            maxW="900px"
                            lineHeight="1.6"
                            fontWeight="500"
                            textAlign="center"
                            textShadow="0 2px 4px rgba(0, 0, 0, 0.5)"
                        >
                            Я займаюся будівництвом та продажем приватних будинків з 2010 року. Організовую весь процес — від вибору ділянки до здачі готового об'єкта.
                            Працюю з надійними майстрами та особисто контролюю кожен етап: фундамент, стіни, дах, електрика, сантехніка, оздоблення.
                            Пропоную будинки у різних форматах — з ремонтом, без або "під ключ".
                        </Text>
                    </VStack>
                </Container>
            </Box>

            {/* Main Content */}
            <Box bg="#f9f9f9" py={{ base: 12, md: 16, lg: 20 }}>
                <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
                    <VStack spacing={{ base: 16, md: 20 }}>
                        {/* Intro Section */}
                        <Box
                            bg="#ffffff"
                            rounded="xl"
                            p={{ base: 8, md: 10, lg: 12 }}
                            shadow="md"
                            w="full"
                            transition="all 0.3s ease"
                            _hover={{
                                shadow: "lg",
                                transform: "translateY(-4px)"
                            }}
                        >
                            <VStack spacing={6} textAlign="center">
                                <Heading
                                    as="h2"
                                    fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                                    fontWeight="700"
                                    color="#111111"
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
                                    Моя історія
                                </Heading>
                                <VStack spacing={4}>
                                    <Text
                                        fontSize={{ base: 'md', md: 'lg' }}
                                        color="#222222"
                                        lineHeight="1.7"
                                        maxW="800px"
                                    >
                                        З 2010 року я реалізую проєкти приватного житла. Починав з невеликих будівництв,
                                        і поступово сформував команду перевірених фахівців, з якими разом створюємо надійні й комфортні будинки.
                                        За роки роботи десятки клієнтів вже оселилися в домах, які я організував від нуля до передачі ключів.
                                    </Text>
                                    <Text
                                        fontSize={{ base: 'md', md: 'lg' }}
                                        color="#222222"
                                        lineHeight="1.7"
                                        maxW="800px"
                                    >
                                        Моя мета — зробити покупку будинку простою та чесною.
                                        Ви отримуєте житло без посередників, з прозорими умовами та реальними гарантіями.
                                    </Text>
                                </VStack>
                            </VStack>
                        </Box>

                        {/* Values Section */}
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
                                    Мої принципи
                                </Heading>

                                <Box
                                    display="flex"
                                    flexWrap="wrap"
                                    gap={{ base: 6, md: 8 }}
                                    w="full"
                                    justifyContent="center"
                                >
                                    {[
                                        {
                                            icon: FaBuilding,
                                            title: "Якість",
                                            description: "Будую лише з перевірених матеріалів. Кожен етап робіт контролюється — від фундаменту до даху."
                                        },
                                        {
                                            icon: FaUsers,
                                            title: "Клієнтоорієнтованість",
                                            description: "Пропоную варіанти під ваші потреби — будинки з ремонтом, без або \"під ключ\". Враховую побажання на всіх етапах."
                                        },
                                        {
                                            icon: FaHandshake,
                                            title: "Чесність",
                                            description: "Ніяких прихованих умов. Ви знаєте, що отримуєте і за які кошти. Прозорі угоди — мій принцип."
                                        },
                                        {
                                            icon: FaAward,
                                            title: "Професіоналізм",
                                            description: "Працюю з командою досвідчених майстрів. Кожен спеціаліст відповідає за свою частину, а я — за результат в цілому."
                                        }
                                    ].map((value, index) => (
                                        <Box
                                            key={index}
                                            w={{
                                                base: "100%",
                                                sm: "calc(50% - 12px)",
                                                lg: "calc(25% - 18px)"
                                            }}
                                            maxW={{
                                                base: "400px",
                                                sm: "none"
                                            }}
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
                                                        transform: "scale(1.1) rotate(5deg)"
                                                    }}
                                                >
                                                    <Icon
                                                        as={value.icon}
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
                                                    {value.title}
                                                </Heading>
                                                <Text
                                                    fontSize={{ base: 'sm', md: 'md' }}
                                                    color="#222222"
                                                    lineHeight="1.6"
                                                >
                                                    {value.description}
                                                </Text>
                                            </VStack>
                                        </Box>
                                    ))}
                                </Box>
                            </VStack>
                        </Box>

                        {/* Team Section */}
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
                                    Команда виконавців
                                </Heading>

                                <Box
                                    display="flex"
                                    flexWrap="wrap"
                                    gap={{ base: 6, md: 8 }}
                                    w="full"
                                    justifyContent="center"
                                >
                                    {[
                                        {
                                            title: "Будівельна бригада",
                                            position: "Зведення коробки будинку",
                                            description: "Майстри з досвідом понад 10 років. Якість та дотримання термінів — гарантія."
                                        },
                                        {
                                            title: "Електрики та сантехніки",
                                            position: "Інженерні мережі",
                                            description: "Забезпечують надійність систем та відповідність сучасним стандартам."
                                        },
                                        {
                                            title: "Майстри оздоблення",
                                            position: "Ремонт та декор",
                                            description: "Виконують роботи з урахуванням сучасних технологій та дизайну."
                                        }
                                    ].map((member, index) => (
                                        <Box
                                            key={index}
                                            w={{
                                                base: "100%",
                                                md: "calc(50% - 16px)",
                                                lg: "calc(33.333% - 21px)"
                                            }}
                                            maxW={{
                                                base: "400px",
                                                md: "none"
                                            }}
                                            bg="#ffffff"
                                            rounded="xl"
                                            shadow="md"
                                            overflow="hidden"
                                            transition="all 0.3s ease"
                                            _hover={{
                                                shadow: "lg",
                                                transform: "translateY(-8px)"
                                            }}
                                        >
                                            <Box
                                                height="200px"
                                                bgImage="url('/images/placeholder-house.jpg')"
                                                bgSize="cover"
                                                bgPosition="center"
                                                position="relative"
                                                _before={{
                                                    content: '""',
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    bg: "linear-gradient(135deg, rgba(247, 194, 114, 0.8) 0%, rgba(244, 185, 79, 0.8) 100%)"
                                                }}
                                            />
                                            <Box p={{ base: 6, md: 8 }}>
                                                <VStack spacing={3} textAlign="center">
                                                    <Heading
                                                        as="h3"
                                                        fontSize={{ base: 'lg', md: 'xl' }}
                                                        fontWeight="600"
                                                        color="#111111"
                                                    >
                                                        {member.title}
                                                    </Heading>
                                                    <Text
                                                        fontSize="sm"
                                                        color="#F5A623"
                                                        fontWeight="600"
                                                        textTransform="uppercase"
                                                        letterSpacing="wide"
                                                    >
                                                        {member.position}
                                                    </Text>
                                                    <Text
                                                        fontSize={{ base: 'sm', md: 'md' }}
                                                        color="#222222"
                                                        lineHeight="1.6"
                                                    >
                                                        {member.description}
                                                    </Text>
                                                </VStack>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </VStack>
                        </Box>
                    </VStack>
                </Container>
            </Box>
        </Box>
    );
};

export default AboutPage;