import React, { useState } from 'react';
import {
    FaFilter,
    FaSearch,
    FaUndo,
    FaHome,
    FaRulerCombined,
    FaChevronDown,
    FaChevronUp,
    FaDollarSign,
    FaTools,
    FaCouch
} from 'react-icons/fa';
import {
    Box,
    VStack,
    Heading,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Checkbox,
    Button,
    HStack,
    Flex,
    Icon,
    Badge,
    Collapse,
    useDisclosure,
    Text,
    SimpleGrid,
    Stack,
    Divider
} from '@chakra-ui/react';

const accent = '#F5A623';
const accentHover = '#F6AB5E';
const accentGradient = 'linear(to-r, #F7C272, #F4B94F)';
const bgWhite = '#ffffff';
const textDark = '#111111';
const textDark2 = '#222222';
const borderRadius = '1rem';

const initialFilters = {
    priceMin: '',
    priceMax: '',
    rooms: '',
    floors: '',
    withRepair: false,
    withFurniture: false
};

const floorOptions = ['1', '2', '3+'];

const FilterPanel = ({ onFilterChange }) => {
    const [filters, setFilters] = useState(initialFilters);
    const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

    const handleChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilterChange(filters);
    };

    const handleReset = () => {
        setFilters(initialFilters);
        onFilterChange({});
    };

    const activeFiltersCount = Object.values(filters).filter(
        value => value !== '' && value !== false
    ).length;

    return (
        <Box
            bg="white"
            borderRadius="16px"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.08)"
            border="1px solid"
            borderColor="gray.100"
            overflow="hidden"
            position="relative"
            maxW="100%"
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                bgGradient: accentGradient,
            }}
        >
            {/* Компактный Header */}
            <Box
                p={4}
                bg="linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)"
                cursor="pointer"
                onClick={onToggle}
                borderBottom="1px solid"
                borderColor="gray.100"
                _hover={{
                    bg: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
                }}
                transition="all 0.3s ease"
            >
                <Flex alignItems="center" justifyContent="space-between">
                    <HStack spacing={3}>
                        <Box
                            p={2}
                            bg="white"
                            borderRadius="12px"
                            boxShadow="0 3px 12px rgba(245, 166, 35, 0.15)"
                            border="1px solid"
                            borderColor="orange.100"
                        >
                            <Icon as={FaFilter} boxSize={4} color={accent} />
                        </Box>
                        <Box>
                            <Heading
                                size="sm"
                                color={textDark}
                                fontWeight="700"
                                mb={0}
                            >
                                Фільтри пошуку
                            </Heading>
                            <Text fontSize="xs" color="gray.600" fontWeight="500">
                                Налаштуйте параметри
                            </Text>
                        </Box>
                    </HStack>

                    <HStack spacing={2}>
                        {activeFiltersCount > 0 && (
                            <Badge
                                bgGradient={accentGradient}
                                color="white"
                                fontSize="xs"
                                py={1}
                                px={2}
                                borderRadius="full"
                                fontWeight="600"
                                boxShadow="0 2px 8px rgba(245, 166, 35, 0.3)"
                            >
                                {activeFiltersCount}
                            </Badge>
                        )}
                        <Box
                            p={1.5}
                            borderRadius="full"
                            bg="white"
                            boxShadow="0 2px 6px rgba(0, 0, 0, 0.08)"
                        >
                            <Icon
                                as={isOpen ? FaChevronUp : FaChevronDown}
                                boxSize={3}
                                color="gray.500"
                                transition="transform 0.3s ease"
                            />
                        </Box>
                    </HStack>
                </Flex>
            </Box>

            {/* Компактный Content */}
            <Collapse in={isOpen} animateOpacity>
                <Box as="form" onSubmit={handleSubmit} p={4}>
                    <VStack spacing={4} align="stretch">

                        {/* Компактная секция цены */}
                        <Box>
                            <HStack mb={2} spacing={2}>
                                <Icon as={FaDollarSign} color={accent} boxSize={4} />
                                <Text fontSize="sm" fontWeight="600" color={textDark}>
                                    Ціновий діапазон
                                </Text>
                            </HStack>
                            <SimpleGrid columns={2} spacing={2}>
                                <InputGroup size="sm">
                                    <InputLeftElement
                                        color={accent}
                                        fontSize="sm"
                                        fontWeight="600"
                                        h="36px"
                                    >
                                        $
                                    </InputLeftElement>
                                    <Input
                                        type="number"
                                        placeholder="Мін."
                                        value={filters.priceMin}
                                        onChange={(e) => handleChange('priceMin', e.target.value)}
                                        borderRadius="10px"
                                        border="1px solid"
                                        borderColor="gray.300"
                                        color={textDark}
                                        fontSize="sm"
                                        h="36px"
                                        _placeholder={{ color: 'gray.600' }}
                                        _hover={{ borderColor: accentHover }}
                                        _focus={{
                                            borderColor: accent,
                                            boxShadow: `0 0 0 2px ${accent}15`,
                                        }}
                                        transition="all 0.2s ease"
                                    />
                                </InputGroup>
                                <InputGroup size="sm">
                                    <InputLeftElement
                                        color={accent}
                                        fontSize="sm"
                                        fontWeight="600"
                                        h="36px"
                                    >
                                        $
                                    </InputLeftElement>
                                    <Input
                                        type="number"
                                        placeholder="Макс."
                                        value={filters.priceMax}
                                        onChange={(e) => handleChange('priceMax', e.target.value)}
                                        borderRadius="10px"
                                        border="1px solid"
                                        borderColor="gray.300"
                                        color={textDark}
                                        fontSize="sm"
                                        h="36px"
                                        _placeholder={{ color: 'gray.600' }}
                                        _hover={{ borderColor: accentHover }}
                                        _focus={{
                                            borderColor: accent,
                                            boxShadow: `0 0 0 2px ${accent}15`,
                                        }}
                                        transition="all 0.2s ease"
                                    />
                                </InputGroup>
                            </SimpleGrid>
                        </Box>

                        {/* Компактная секция параметров */}
                        <SimpleGrid columns={2} spacing={3}>
                            <FormControl>
                                <HStack mb={2} spacing={2}>
                                    <Icon as={FaHome} color={accent} boxSize={3} />
                                    <Text fontSize="sm" fontWeight="600" color={textDark}>
                                        Кімнати
                                    </Text>
                                </HStack>
                                <Select
                                    placeholder="Кількість"
                                    value={filters.rooms}
                                    onChange={(e) => handleChange('rooms', e.target.value)}
                                    borderRadius="10px"
                                    border="1px solid"
                                    borderColor="gray.300"
                                    color={textDark}
                                    fontSize="sm"
                                    h="36px"
                                    _hover={{ borderColor: accentHover }}
                                    _focus={{
                                        borderColor: accent,
                                        boxShadow: `0 0 0 2px ${accent}15`
                                    }}
                                    sx={{
                                        '& option': {
                                            color: textDark,
                                            backgroundColor: 'white'
                                        }
                                    }}
                                    css={{
                                        color: `${textDark} !important`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        '&::placeholder, &::-webkit-input-placeholder': {
                                            color: 'gray.600 !important',
                                            fontWeight: 'normal',
                                            opacity: '1'
                                        },
                                        '&::-moz-placeholder': {
                                            color: 'gray.600 !important',
                                            fontWeight: 'normal',
                                            opacity: '1'
                                        },
                                        '&:-ms-input-placeholder': {
                                            color: 'gray.600 !important',
                                            fontWeight: 'normal',
                                            opacity: '1'
                                        }
                                    }}
                                    transition="all 0.2s ease"
                                >
                                    {[1, 2, 3, 4, '5+'].map(value => (
                                        <option key={value} value={value}>
                                            {value} {value === 1 ? 'кімната' : 'кімнат'}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <HStack mb={2} spacing={2}>
                                    <Icon as={FaRulerCombined} color={accent} boxSize={3} />
                                    <Text fontSize="sm" fontWeight="600" color={textDark}>
                                        Поверхи
                                    </Text>
                                </HStack>
                                <Select
                                    placeholder="Поверховість"
                                    value={filters.floors}
                                    onChange={(e) => handleChange('floors', e.target.value)}
                                    borderRadius="10px"
                                    border="1px solid"
                                    borderColor="gray.300"
                                    color={textDark}
                                    fontSize="sm"
                                    h="36px"
                                    _hover={{ borderColor: accentHover }}
                                    _focus={{
                                        borderColor: accent,
                                        boxShadow: `0 0 0 2px ${accent}15`
                                    }}
                                    sx={{
                                        '& option': {
                                            color: textDark,
                                            backgroundColor: 'white'
                                        }
                                    }}
                                    css={{
                                        color: `${textDark} !important`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        '&::placeholder, &::-webkit-input-placeholder': {
                                            color: 'gray.600 !important',
                                            fontWeight: 'normal',
                                            opacity: '1'
                                        },
                                        '&::-moz-placeholder': {
                                            color: 'gray.600 !important',
                                            fontWeight: 'normal',
                                            opacity: '1'
                                        },
                                        '&:-ms-input-placeholder': {
                                            color: 'gray.600 !important',
                                            fontWeight: 'normal',
                                            opacity: '1'
                                        }
                                    }}
                                    transition="all 0.2s ease"
                                >
                                    {floorOptions.map(floor => (
                                        <option key={floor} value={floor}>
                                            {floor} поверх{floor === '3+' ? 'ів' : ''}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </SimpleGrid>

                        {/* Компактный разделитель */}
                        <Box position="relative" py={1}>
                            <Divider borderColor="gray.200" />
                            <Box
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                bg="white"
                                px={3}
                                borderRadius="full"
                                border="1px solid"
                                borderColor="gray.200"
                            >
                                <Text fontSize="xs" color="gray.500" fontWeight="500">
                                    Додатково
                                </Text>
                            </Box>
                        </Box>

                        {/* Компактные чекбоксы */}
                        <SimpleGrid columns={2} spacing={2}>
                            <Box
                                p={3}
                                bg={filters.withRepair ? `${accent}20` : 'white'}
                                borderRadius="12px"
                                border="1px solid"
                                borderColor={filters.withRepair ? accent : 'gray.400'}
                                _hover={{
                                    borderColor: accent,
                                    bg: `${accent}10`
                                }}
                                transition="all 0.2s ease"
                                cursor="pointer"
                                onClick={() => handleChange('withRepair', !filters.withRepair)}
                            >
                                <VStack spacing={1}>
                                    <Icon
                                        as={FaTools}
                                        color={accent}
                                        boxSize={4}
                                    />
                                    <Checkbox
                                        isChecked={filters.withRepair}
                                        onChange={(e) => handleChange('withRepair', e.target.checked)}
                                        colorScheme="orange"
                                        size="sm"
                                        pointerEvents="none"
                                        sx={{
                                            '& .chakra-checkbox__control': {
                                                borderColor: 'gray.500',
                                                borderWidth: '1px'
                                            }
                                        }}
                                    >
                                        <Text
                                            fontSize="xs"
                                            fontWeight="600"
                                            color={accent}
                                            textAlign="center"
                                        >
                                            З ремонтом
                                        </Text>
                                    </Checkbox>
                                </VStack>
                            </Box>

                            <Box
                                p={3}
                                bg={filters.withFurniture ? `${accent}20` : 'white'}
                                borderRadius="12px"
                                border="1px solid"
                                borderColor={filters.withFurniture ? accent : 'gray.400'}
                                _hover={{
                                    borderColor: accent,
                                    bg: `${accent}10`
                                }}
                                transition="all 0.2s ease"
                                cursor="pointer"
                                onClick={() => handleChange('withFurniture', !filters.withFurniture)}
                            >
                                <VStack spacing={1}>
                                    <Icon
                                        as={FaCouch}
                                        color={accent}
                                        boxSize={4}
                                    />
                                    <Checkbox
                                        isChecked={filters.withFurniture}
                                        onChange={(e) => handleChange('withFurniture', e.target.checked)}
                                        colorScheme="orange"
                                        size="sm"
                                        pointerEvents="none"
                                        sx={{
                                            '& .chakra-checkbox__control': {
                                                borderColor: 'gray.500',
                                                borderWidth: '1px'
                                            }
                                        }}
                                    >
                                        <Text
                                            fontSize="xs"
                                            fontWeight="600"
                                            color={accent}
                                            textAlign="center"
                                        >
                                            З меблями
                                        </Text>
                                    </Checkbox>
                                </VStack>
                            </Box>
                        </SimpleGrid>

                        {/* Компактные кнопки */}
                        <HStack spacing={2} pt={1}>
                            <Button
                                type="button"
                                leftIcon={<FaUndo size={12} />}
                                onClick={handleReset}
                                size="sm"
                                borderRadius="10px"
                                variant="outline"
                                borderWidth="1px"
                                borderColor="gray.300"
                                color="gray.600"
                                fontWeight="600"
                                flex={1}
                                h="36px"
                                fontSize="sm"
                                _hover={{
                                    borderColor: "gray.400",
                                    bg: "gray.50",
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                }}
                                _active={{
                                    transform: 'translateY(0px)',
                                }}
                                transition="all 0.2s ease"
                            >
                                Скинути
                            </Button>

                            <Button
                                type="submit"
                                leftIcon={<FaSearch size={12} />}
                                size="sm"
                                borderRadius="10px"
                                bgGradient={accentGradient}
                                color="white"
                                fontWeight="600"
                                flex={2}
                                h="36px"
                                fontSize="sm"
                                boxShadow="0 3px 15px rgba(245, 166, 35, 0.3)"
                                _hover={{
                                    bgGradient: 'linear(to-r, #F6AB5E, #F5A623)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 18px rgba(245, 166, 35, 0.4)'
                                }}
                                _active={{
                                    transform: 'translateY(0px)',
                                }}
                                transition="all 0.2s ease"
                            >
                                Знайти
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Collapse>
        </Box>
    );
};

export default FilterPanel;