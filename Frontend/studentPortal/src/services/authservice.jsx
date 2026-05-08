import axiosClient from "./axiosClient";

// LOGIN
export const loginApi = async (credentials) => {
  try {
    const response = await axiosClient.post("/auth/login", credentials);

    return response; // مهم نرجع whole response
  } catch (error) {
    console.log("API ERROR:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

// LOGOUT
export const logoutApi = async () => {
  try {
    await axiosClient.patch("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};