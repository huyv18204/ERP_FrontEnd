import instance from "../configs/axios";
export const Save = async (endpoint, data) => {
  try {
    const res = await instance.post(endpoint, data);
    return res.data;
  } catch (error) {
    console.error(
      "Error saving data:",
      error.response ? error.response.data : error.message
    );
  }
};

export const Update = async (endpoint, data) => {
  try {
    const res = await instance.put(endpoint, data);
    return res.data;
  } catch (error) {
    console.error(
      "Error saving data:",
      error.response ? error.response.data : error.message
    );
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
    console.error("Error fetching employees:", error);
  }
};

export const Delete = async (endpoint) => {
  await instance.delete(endpoint).then((res) => {
    if (res.status === 200) {
      return res.data;
    }
  });
};
