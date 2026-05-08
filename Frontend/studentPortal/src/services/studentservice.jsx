import axiosClient from './axiosClient';

// GET /api/course/my-courses
export const getMyCourses = async () => {
    try {
        const response = await axiosClient.get('/course/my-courses');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error fetching courses" };
    }
};

// POST /api/course/enroll
export const enrollInCourse = async (courseId) => {
    try {
        const response = await axiosClient.post('/course/enroll', { courseId });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to enroll in course" };
    }
};

// DELETE /api/course/withdraw
export const withdrawFromCourse = async (courseId) => {
    try {
        const response = await axiosClient.delete('/course/withdraw', {
            data: { courseId }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to withdraw from course" };
    }
};

// GET /api/grade/
export const getMyGrades = async () => {
    try {
        const response = await axiosClient.get('/grade/');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error fetching grades" };
    }
};