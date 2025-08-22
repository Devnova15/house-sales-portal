import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    Button,
    VStack,
} from '@chakra-ui/react';

import { keyframes } from '@emotion/react';

// Анимация появления
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const NotFoundPage = () => {
    return (
        <Box
            minH="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            bg="linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%)"
            px={{ base: 4, md: 6, lg: 8 }}
            py={{ base: 6, md: 8 }}
            fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        >
            <VStack spacing={{ base: 4, md: 6 }} maxW="600px">
                {/* 404 заголовок */}
                <Heading
                    as="h1"
                    fontSize={{
                        base: "6rem",
                        sm: "8rem",
                        md: "10rem",
                        lg: "12rem"
                    }}
                    fontWeight="800"
                    lineHeight="0.9"
                    bgGradient="linear(135deg, #F7C272, #F4B94F)"
                    bgClip="text"
                    textShadow="0 4px 8px rgba(245, 166, 35, 0.2)"
                    animation={`${fadeInUp} 0.6s ease-out 0.1s both`}
                    m={0}
                >
                    404
                </Heading>

                {/* Заголовок страницы */}
                <Heading
                    as="h2"
                    fontSize={{
                        base: "1.5rem",
                        sm: "2rem",
                        md: "2.25rem",
                        lg: "2.5rem"
                    }}
                    fontWeight="600"
                    color="#111111"
                    letterSpacing="-0.02em"
                    animation={`${fadeInUp} 0.6s ease-out 0.2s both`}
                    m={0}
                >
                    Сторінку не знайдено
                </Heading>

                {/* Описание */}
                <Text
                    fontSize={{
                        base: "1rem",
                        sm: "1.1rem",
                        md: "1.2rem",
                        lg: "1.25rem"
                    }}
                    color="#666666"
                    lineHeight="1.6"
                    fontWeight="400"
                    maxW="500px"
                    animation={`${fadeInUp} 0.6s ease-out 0.3s both`}
                    px={{ base: 2, md: 0 }}
                >
                    Вибачте, сторінка, яку ви шукаєте, не існує або була переміщена.
                </Text>

                {/* Кнопка возврата на главную */}
                <Button
                    as={RouterLink}
                    to="/"
                    bg="transparent"
                    border="2px solid"
                    borderColor="#F7C272"
                    color="#F7C272"
                    fontSize={{ base: "1rem", md: "1.1rem", lg: "1.125rem" }}
                    fontWeight="600"
                    px={{ base: 8, md: 10, lg: 12 }}
                    py={{ base: 4, md: 5, lg: 6 }}
                    h="auto"
                    borderRadius="1rem"
                    transition="all 0.3s ease"
                    letterSpacing="0.02em"
                    minW={{ base: "200px", md: "220px" }}
                    animation={`${fadeInUp} 0.6s ease-out 0.4s both`}
                    _hover={{
                        bgGradient: "linear(135deg, #F7C272, #F4B94F)",
                        color: "white",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(245, 166, 35, 0.4)",
                        textDecoration: "none"
                    }}
                    _active={{
                        transform: "translateY(0)",
                        boxShadow: "0 4px 12px rgba(245, 166, 35, 0.3)"
                    }}
                    _focus={{
                        boxShadow: "0 0 0 3px rgba(245, 166, 35, 0.3)"
                    }}
                >
                    Повернутися на головну
                </Button>

            </VStack>
        </Box>
    );
};

export default NotFoundPage;