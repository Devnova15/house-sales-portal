export const ROUTES = {
    ROOT: "/",
    HOUSES: {
        LIST: "/houses",
        DETAIL: (id) => `/houses/${id}`,
        ADD: "/houses/add",
        EDIT: (id) => `/houses/${id}/edit`,
    },
    AUTH: {
        LOGIN: "/login",
        REGISTER: "/register",
        FORGOT_PASSWORD: "/forgot-password",
    },
    PROFILE: {
        DASHBOARD: "/profile",
        SETTINGS: "/profile/settings",
        MY_LISTINGS: "/profile/listings",
    },
    ADMIN: {
        DASHBOARD: "/dashboard",
        LOGIN: "/admin/login",
    },
    ABOUT: "/about",
    CONTACT: "/contact",
};