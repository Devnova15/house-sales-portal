import {
    Box,
    Button,
    Flex,
    Text,
    IconButton,
    HStack,
    Container
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Константы стилей
const accent = '#F5A623';
const accentHover = '#F6AB5E';
const accentGradient = 'linear(to-r, #F7C272, #F4B94F)';
const bgWhite = '#ffffff';
const textDark = '#111111';
const textDark2 = '#222222';
const borderRadius = '1rem';

const Pagination = ({
                        currentPage,
                        totalPages,
                        totalHouses,
                        limit,
                        onPageChange
                    }) => {
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i);
                }
            }
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    if (totalPages <= 1) {
        return null;
    }

    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalHouses);

    return (
        <Container maxW="container.xl" px={4}>
            <Box
                bg={bgWhite}
                p={{ base: 4, md: 6 }}
                borderRadius={borderRadius}
                boxShadow="md"
                mt={8}
                transition="all 0.3s ease"
            >
                <Flex
                    direction="column"
                    align="center"
                    spacing={4}
                >
                    {/* Пагинация */}
                    <HStack spacing={2} justify="center" mb={4}>
                        <IconButton
                            icon={<FaChevronLeft />}
                            onClick={() => onPageChange(currentPage - 1)}
                            isDisabled={currentPage === 1}
                            aria-label="Попередня сторінка"
                            size={{ base: 'sm', md: 'md' }}
                            rounded="xl"
                            color={textDark}
                            bg={bgWhite}
                            borderWidth="1px"
                            borderColor="gray.200"
                            _hover={{
                                bg: 'gray.50',
                                transform: 'translateY(-2px)',
                                boxShadow: 'md'
                            }}
                            transition="all 0.3s ease"
                        />

                        {pageNumbers.map(page => (
                            <Button
                                key={page}
                                onClick={() => onPageChange(page)}
                                size={{ base: 'sm', md: 'md' }}
                                rounded="xl"
                                fontWeight="600"
                                bg={currentPage === page ? accent : bgWhite}
                                color={currentPage === page ? bgWhite : textDark2}
                                borderWidth="1px"
                                borderColor={currentPage === page ? accent : 'gray.200'}
                                _hover={{
                                    bg: currentPage === page ? accentHover : 'gray.50',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'md'
                                }}
                                transition="all 0.3s ease"
                                minW={{ base: '32px', md: '40px' }}
                            >
                                {page}
                            </Button>
                        ))}

                        <IconButton
                            icon={<FaChevronRight />}
                            onClick={() => onPageChange(currentPage + 1)}
                            isDisabled={currentPage === totalPages}
                            aria-label="Наступна сторінка"
                            size={{ base: 'sm', md: 'md' }}
                            rounded="xl"
                            color={textDark}
                            bg={bgWhite}
                            borderWidth="1px"
                            borderColor="gray.200"
                            _hover={{
                                bg: 'gray.50',
                                transform: 'translateY(-2px)',
                                boxShadow: 'md'
                            }}
                            transition="all 0.3s ease"
                        />
                    </HStack>

                    {/* Информация о количестве */}
                    <Text
                        color={textDark2}
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="500"
                        textAlign="center"
                    >
                        Показано {startItem}-{endItem} з {totalHouses} будинків
                    </Text>

                    {/* Дополнительная информация */}
                    <Text
                        color={textDark2}
                        fontSize={{ base: 'xs', md: 'sm' }}
                        fontWeight="500"
                        mt={2}
                    >
                        Сторінка {currentPage} із {totalPages}
                    </Text>
                </Flex>
            </Box>
        </Container>
    );
};

export default Pagination;