import axios from 'axios';
import Cookies from 'js-cookie';
import router from './router/router';

axios.interceptors.request.use(config => {
    const token = Cookies.get('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            if (error.response.status === 401) {
                Cookies.remove('token');
                router.push('/login');
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
