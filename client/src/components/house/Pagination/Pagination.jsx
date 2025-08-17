import { 
    Box, 
    Button, 
    Flex, 
    Text, 
    IconButton,
    useColorModeValue,
    HStack
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    totalHouses, 
    limit, 
    onPageChange 
}) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const activeBgColor = useColorModeValue('brand.500', 'brand.600');
    const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

    // Генерируем массив номеров страниц для отображения
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 7;
        
        if (totalPages <= maxVisiblePages) {
            // Если страниц мало, показываем все
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Если страниц много, показываем с многоточиями
            if (currentPage <= 4) {
                // Показываем первые страницы
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                // Показываем последние страницы
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Показываем страницы вокруг текущей
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const pageNumbers = generatePageNumbers();

    if (totalPages <= 1) {
        return null; // Не показываем пагинацию, если только одна страница
    }

    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalHouses);

    return (
        <Box 
            bg={bgColor} 
            p={6} 
            borderRadius="xl" 
            boxShadow="md" 
            borderWidth="1px" 
            borderColor={borderColor}
            mt={6}
        >
            {/* Информация о результатах */}
            <Text 
                textAlign="center" 
                mb={4} 
                color="gray.600" 
                fontSize="sm"
            >
                Показано {startItem}-{endItem} із {totalHouses} будинків
            </Text>

            {/* Кнопки пагинации */}
            <Flex justify="center" align="center">
                <HStack spacing={2}>
                    {/* Кнопка "Назад" */}
                    <IconButton
                        icon={<FaChevronLeft />}
                        onClick={() => onPageChange(currentPage - 1)}
                        isDisabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                        aria-label="Предыдущая страница"
                        _hover={{ bg: hoverBgColor }}
                    />

                    {/* Номера страниц */}
                    {pageNumbers.map((page, index) => (
                        page === '...' ? (
                            <Text key={index} px={2} color="gray.500">
                                ...
                            </Text>
                        ) : (
                            <Button
                                key={page}
                                onClick={() => onPageChange(page)}
                                size="sm"
                                variant={currentPage === page ? "solid" : "outline"}
                                bg={currentPage === page ? activeBgColor : "transparent"}
                                color={currentPage === page ? "white" : "inherit"}
                                _hover={{ 
                                    bg: currentPage === page ? activeBgColor : hoverBgColor 
                                }}
                                minW="40px"
                            >
                                {page}
                            </Button>
                        )
                    ))}

                    {/* Кнопка "Вперед" */}
                    <IconButton
                        icon={<FaChevronRight />}
                        onClick={() => onPageChange(currentPage + 1)}
                        isDisabled={currentPage === totalPages}
                        variant="outline"
                        size="sm"
                        aria-label="Следующая страница"
                        _hover={{ bg: hoverBgColor }}
                    />
                </HStack>
            </Flex>

            {/* Дополнительная информация */}
            <Text 
                textAlign="center" 
                mt={4} 
                color="gray.500" 
                fontSize="xs"
            >
                Сторінка {currentPage} із {totalPages}
            </Text>
        </Box>
    );
};

export default Pagination;