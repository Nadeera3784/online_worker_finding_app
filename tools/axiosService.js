import axios from 'axios';
const axiosService = axios.create({
    baseURL: 'http://www.onlineworkersfinder.xyz/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept'    : 'application/json',
    }
});

export default axiosService;