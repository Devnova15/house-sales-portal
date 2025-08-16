import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Flex, 
  HStack, 
  Link, 
  IconButton, 
  Button, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  useDisclosure, 
  useColorModeValue,
  Container,
  Text,
  Icon,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Tooltip
} from '@chakra-ui/react';
import { FaHome, FaList, FaInfoCircle, FaPhone, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.800');
  const accentColor = useColorModeValue('brand.600', 'brand.400');

  const navItems = [
    { name: 'Головна', path: '/', icon: FaHome },
    { name: 'Оголошення', path: '/houses', icon: FaList },
    { name: 'Про нас', path: '/about', icon: FaInfoCircle },
    { name: 'Контакти', path: '/contact', icon: FaPhone }
  ];

  return (
    <Box 
      as="header" 
      bg={bgColor} 
      px={0} 
      boxShadow="md" 
      position="sticky" 
      top="0" 
      zIndex="1000"
      borderBottom="1px"
      borderColor={borderColor}
      width="100%"
    >
      <Container maxW="100%" px={[4, 6, 8]}>
        <Flex h={20} alignItems="center" justifyContent="space-between">
          <Link
            as={RouterLink}
            to="/"
            fontSize={["lg", "xl", "2xl"]}
            fontWeight="bold"
            letterSpacing="wider"
            color={textColor}
            _hover={{ textDecoration: 'none', color: accentColor }}
            display="flex"
            alignItems="center"
          >
            <Icon as={FaHome} mr={3} color={accentColor} boxSize={[5, 6]} />
            <Text>Продаж будинків</Text>
          </Link>

          <HStack spacing={10} alignItems="center" display={{ base: 'none', md: 'flex' }}>
            <HStack as="nav" spacing={8}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  as={RouterLink}
                  to={item.path}
                  px={3}
                  py={2}
                  rounded="md"
                  _hover={{
                    textDecoration: 'none',
                    bg: hoverBgColor,
                    color: accentColor,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }}
                  fontWeight="500"
                  fontSize="md"
                  color={textColor}
                  display="flex"
                  alignItems="center"
                  transition="all 0.3s ease"
                >
                  <Icon as={item.icon} mr={2} />
                  {item.name}
                </Link>
              ))}

            </HStack>
          </HStack>

          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            icon={<FaBars />}
            variant="ghost"
            aria-label="Відкрити меню"
            size="lg"
            color={accentColor}
            _hover={{
              bg: hoverBgColor,
              transform: 'scale(1.1)',
              transition: 'all 0.3s ease'
            }}
            transition="all 0.3s ease"
          />
        </Flex>
      </Container>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay backdropFilter="blur(2px)" />
        <DrawerContent bg={bgColor} boxShadow="xl">
          <DrawerCloseButton color={accentColor} size="lg" />
          <DrawerHeader 
            borderBottomWidth="1px" 
            borderColor={borderColor}
            fontSize="xl"
            fontWeight="bold"
            color={accentColor}
          >
            Меню
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} align="stretch" mt={6}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  as={RouterLink}
                  to={item.path}
                  px={3}
                  py={4}
                  rounded="md"
                  _hover={{
                    textDecoration: 'none',
                    bg: hoverBgColor,
                    color: accentColor,
                    transform: 'translateX(5px)',
                    transition: 'all 0.3s ease'
                  }}
                  fontWeight="500"
                  fontSize="lg"
                  onClick={onClose}
                  display="flex"
                  alignItems="center"
                  transition="all 0.3s ease"
                  borderBottom="1px"
                  borderColor={borderColor}
                  pb={4}
                >
                  <Icon as={item.icon} mr={3} boxSize={5} />
                  {item.name}
                </Link>
              ))}

            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
