import 'leaflet/dist/leaflet.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App.jsx'
import './index.css'
import './reset.css'

// Розширюємо тему Chakra UI для українського сайту продажу будинків
const theme = extendTheme({
    colors: {
        brand: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
        },
        accent: {
            500: '#f59e0b',
            600: '#d97706',
        }
    },
    fonts: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
    },
    styles: {
        global: {
            body: {
                bg: 'gray.50',
                color: 'gray.800',
            }
        }
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'medium',
                borderRadius: 'md',
            },
            variants: {
                solid: {
                    bg: 'brand.600',
                    color: 'white',
                    _hover: {
                        bg: 'brand.700',
                    }
                },
                outline: {
                    borderColor: 'brand.600',
                    color: 'brand.600',
                }
            }
        },
        Card: {
            baseStyle: {
                container: {
                    borderRadius: 'xl',
                    overflow: 'hidden',
                    boxShadow: 'lg',
                    transition: 'all 0.3s ease',
                    _hover: {
                        transform: 'translateY(-8px)',
                        boxShadow: 'xl',
                    }
                }
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
