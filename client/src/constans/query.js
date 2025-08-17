import {CONFIG} from "../config/config.js";

const apiUrl= CONFIG.API_URL
export const QUERY = {
    CUSTOMER : {
        LOGIN : `${apiUrl}/customers/login`,
        ME : `${apiUrl}/customers/customer`,
    },
    ADMIN : {
        LOGIN : `${apiUrl}/customers/admin/login`,
        ME : `${apiUrl}/customers/customer`,
    }
}