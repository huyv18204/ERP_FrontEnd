import axios from "axios";

// Khởi tạo instance Axios
const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).access_token : null;
};

const getRefreshToken = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).refresh_token : null;
};
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const { data } = await axios.post("/auth/refresh", {
            refresh_token: refreshToken,
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              access_token: data.access_token,
              refresh_token: refreshToken,
            })
          );
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return instance(originalRequest);
        } catch (err) {
          localStorage.removeItem("user");
          window.location.href = "/login";
          return Promise.reject(err);
        }
      } else {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
