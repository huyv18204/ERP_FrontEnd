import instance from "../configs/axios";
export const Create = async (endpoint, data) => {
  try {
    const res = await instance.post(endpoint, data);
    return res.data;
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
    const res = await instance.put(endpoint, data);
    return res.data;
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
    const res = await instance.get(endpoint);
    return res.data;
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
    const res = await instance.delete(endpoint);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.error(
      "Error deleting data:",
      error.response ? error.response.data : error.message
    );
    throw error; // Ném lỗi để hàm gọi bên ngoài có thể xử lý
  }
};

// export const ServerStatus = async () => {
//   try {
//     const response = await axios.get("http://localhost:8000/ping");
//     return response.status === 200;
//   } catch (error) {
//     console.error("Server is not available:", error.message);
//     return false;
//   }
// };
