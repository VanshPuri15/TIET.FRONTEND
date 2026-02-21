import api from './axios';

export const createReferral = async (referralData) => {
    const response = await api.post('/api/referrals', referralData);
    return response.data;
};

export const getReferrals = async () => {
    const response = await api.get('/api/referrals');
    return response.data;
};
