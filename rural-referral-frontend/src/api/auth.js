import api from './axios';

export const login = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
};

export const signup = async (userData) => {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
};
