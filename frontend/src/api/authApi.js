import axios from "axios";

export const getMeApi = async (token) => {
  const resp = await axios.get("http://localhost:5000/api/auth/getme", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return resp.data;
};
