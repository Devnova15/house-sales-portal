import React, { useState } from 'react';
import { FaFilter, FaSearch, FaUndo, FaHome, FaRulerCombined } from 'react-icons/fa';
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
    Divider,
    Flex,
    Icon,
    useColorModeValue,
    Collapse,
    useDisclosure,
    Badge
} from '@chakra-ui/react';

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

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const headingBgColor = useColorModeValue('gray.50', 'gray.700');
    const accentColor = useColorModeValue('brand.600', 'brand.400');
    const textColor = useColorModeValue('gray.800', 'gray.100'); // ТЕМНЕЕ ТЕКСТ

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
            bg={bgColor}
            color={textColor} // <- применяется ко всему тексту внутри
            borderRadius="xl"
            boxShadow="md"
            borderWidth="1px"
            borderColor={borderColor}
            overflow="hidden"
        >
            <Flex
                p={4}
                bg={headingBgColor}
                alignItems="center"
                justifyContent="space-between"
                cursor="pointer"
                onClick={onToggle}
            >
                <Flex alignItems="center">
                    <Icon as={FaFilter} mr={3} color={accentColor} />
                    <Heading size="md" color={textColor}>
                        Фільтри пошуку
                    </Heading>
                </Flex>

                {activeFiltersCount > 0 && (
                    <Badge colorScheme="brand" borderRadius="full" px={2}>
                        {activeFiltersCount}
                    </Badge>
                )}
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <Box as="form" onSubmit={handleSubmit} p={5}>
                    <VStack spacing={5} align="stretch">
                        {/* Price range filter */}
                        <FormControl>
                            <FormLabel fontWeight="medium" color={textColor}>
                                Ціна ($)
                            </FormLabel>
                            <HStack spacing={4}>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none" color="gray.400">
                                        $
                                    </InputLeftElement>
                                    <Input
                                        type="number"
                                        placeholder="Від"
                                        value={filters.priceMin}
                                        onChange={(e) => handleChange('priceMin', e.target.value)}
                                        borderRadius="md"
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none" color="gray.400">
                                        $
                                    </InputLeftElement>
                                    <Input
                                        type="number"
                                        placeholder="До"
                                        value={filters.priceMax}
                                        onChange={(e) => handleChange('priceMax', e.target.value)}
                                        borderRadius="md"
                                    />
                                </InputGroup>
                            </HStack>
                        </FormControl>

                        {/* Room count filter */}
                        <FormControl>
                            <FormLabel fontWeight="medium" color={textColor}>
                                Кількість кімнат
                            </FormLabel>
                            <Select
                                placeholder="Всі варіанти"
                                value={filters.rooms}
                                onChange={(e) => handleChange('rooms', e.target.value)}
                                icon={<FaHome />}
                                borderRadius="md"
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5+">5+</option>
                            </Select>
                        </FormControl>

                        {/* Floor count filter */}
                        <FormControl>
                            <FormLabel fontWeight="medium" color={textColor}>
                                Поверховість
                            </FormLabel>
                            <Select
                                placeholder="Всі варіанти"
                                value={filters.floors}
                                onChange={(e) => handleChange('floors', e.target.value)}
                                icon={<FaRulerCombined />}
                                borderRadius="md"
                            >
                                {floorOptions.map(floor => (
                                    <option key={floor} value={floor}>
                                        {floor}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <Divider />

                        {/* Additional features checkboxes */}
                        <VStack align="start" spacing={3}>
                            <Checkbox
                                isChecked={filters.withRepair}
                                onChange={(e) => handleChange('withRepair', e.target.checked)}
                                colorScheme="brand"
                                size="lg"
                            >
                                З ремонтом
                            </Checkbox>
                            <Checkbox
                                isChecked={filters.withFurniture}
                                onChange={(e) => handleChange('withFurniture', e.target.checked)}
                                colorScheme="brand"
                                size="lg"
                            >
                                З меблями
                            </Checkbox>
                        </VStack>

                        <Divider />

                        {/* Action buttons */}
                        <HStack spacing={4}>
                            <Button
                                type="submit"
                                leftIcon={<FaSearch />}
                                colorScheme="brand"
                                size="md"
                                width="full"
                                borderRadius="md"
                            >
                                Пошук
                            </Button>
                            <Button
                                type="button"
                                leftIcon={<FaUndo />}
                                variant="outline"
                                onClick={handleReset}
                                size="md"
                                width="full"
                                borderRadius="md"
                            >
                                Скинути
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Collapse>
        </Box>
    );
};

export default FilterPanel;
