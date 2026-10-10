import axios from "axios";

const api=axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"});

api.interceptors.request.use((config)=>{
const token =localStorage.getItem("token");
if(token){
config.headers["Authorization"] = `Bearer ${token}`;
}
return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLoginCall = error.config?.url?.includes("/auth/login");
    // Public GETs never return 401/403, so this means the token is expired or invalid
    if ((status === 401 || status === 403) && !isLoginCall && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default api;