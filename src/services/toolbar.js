import instance from "../configs/axios";
const user = localStorage.getItem("user");
const token = user ? JSON.parse(user).access_token : null;
export const Create = async (endpoint, data) => {
  try {
    if (token) {
      const res = await instance.post(endpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    }
  } catch (error) {
    console.error(
      "Error create data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const Update = async (endpoint, data) => {
  try {
    if (token) {
      const res = await instance.put(endpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    }
  } catch (error) {
    console.error(
      "Error update data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const Query = async (endpoint, data) => {
  const params = new URLSearchParams();

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
  }

  try {
    if (token) {
      const res = await instance.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });
      return res.data;
    }
  } catch (error) {
    console.error(
      "Error fetching employees:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const Delete = async (endpoint) => {
  try {
    if (token) {
      const res = await instance.delete(endpoint);
      if (res.status === 200) {
        return res.data;
      }
    }
  } catch (error) {
    console.error(
      "Error deleting data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
