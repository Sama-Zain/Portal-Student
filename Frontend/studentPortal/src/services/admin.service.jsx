import axiosClient from './axiosClient';

// GET /api/user/ — Admin only
export const getAllUsers = async () => {
    try {
        const response = await axiosClient.get('/user/');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Unauthorized access to user data" };
    }
};

// POST /api/user/add-user — Admin only
export const addUser = async (userData) => {
    try {
        const response = await axiosClient.post('/user/add-user', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to add user" };
    }
};

// POST /api/grade/ — Admin only
export const uploadStudentGrade = async (gradeData) => {
    try {
        const response = await axiosClient.post('/grade/', gradeData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to upload grade" };
    }
};

// PUT /api/user/profile
export const updateProfile = async (profileData) => {
    try {
        const response = await axiosClient.put('/user/profile', profileData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update profile information" };
    }
};

// GET /api/user/profile
export const getProfile = async () => {
    try {
        const response = await axiosClient.get('/user/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to get profile" };
    }
};