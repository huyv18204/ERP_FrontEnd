import axios from "axios";
const user = localStorage.getItem("user");
const token = user ? JSON.parse(user).access_token : null;
const URL_APP = "http://127.0.0.1:8000/api/auth/";

export const login = async (email, password) => {
  const response = await axios
    .post(URL_APP + "login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        console.log(response.data.token);
      }
      return response.data;
    });

  localStorage.setItem("user", JSON.stringify(response));
  return response;
};

export const logout = async () => {
  return await axios
    .post(
      URL_APP + "logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data);
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
