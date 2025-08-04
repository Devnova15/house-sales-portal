import 'leaflet/dist/leaflet.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App.jsx'
import './index.css'
import './reset.css'
import './dark-theme.css'

const theme = extendTheme({
    colors: {
        brand: {
            50: '#f0f0f0',
            100: '#d4c0a1',
            200: '#c9b8a8',
            300: '#b8a99a',
            400: '#a99b8c',
            500: '#9a8d7e',
            600: '#8b7e70',
            700: '#7c7062',
            800: '#6d6254',
            900: '#5e5346',
        },
        accent: {
            500: '#d4c0a1',
            600: '#c9b8a8',
        },
        gray: {
            50: '#f7f7f7',
            100: '#e0e0e0',
            200: '#c7c7c7',
            300: '#a0a0a0',
            400: '#787878',
            500: '#666666',
            600: '#4d4d4d',
            700: '#333333',
            800: '#1e1e1e',
            900: '#121212',
        }
    },
    fonts: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
    },
    styles: {
        global: {
            body: {
                bg: 'gray.900',
                color: 'gray.100',
            }
        }
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'medium',
                borderRadius: 'sm',
            },
            variants: {
                solid: {
                    bg: 'brand.100',
                    color: 'gray.900',
                    _hover: {
                        bg: 'brand.200',
                        transform: 'translateY(-2px)',
                        boxShadow: 'md',
                    }
                },
                outline: {
                    borderColor: 'brand.100',
                    color: 'brand.100',
                    _hover: {
                        bg: 'gray.800',
                        transform: 'translateY(-2px)',
                    }
                },
                ghost: {
                    color: 'gray.100',
                    _hover: {
                        bg: 'gray.800',
                        color: 'brand.100',
                    }
                }
            }
        },
        Card: {
            baseStyle: {
                container: {
                    bg: 'gray.800',
                    borderRadius: 'md',
                    overflow: 'hidden',
                    boxShadow: 'md',
                    borderWidth: '1px',
                    borderColor: 'gray.700',
                    transition: 'all 0.3s ease',
                    _hover: {
                        transform: 'translateY(-8px)',
                        boxShadow: 'xl',
                        borderColor: 'brand.100',
                    }
                }
            }
        },
        Heading: {
            baseStyle: {
                color: 'gray.100',
            }
        },
        Text: {
            baseStyle: {
                color: 'gray.200',
            }
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ChakraProvider>
    </React.StrictMode>,
)
