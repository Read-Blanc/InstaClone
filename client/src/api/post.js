import axiosInstance from "../utils/axiosInstance";

export const createPost = async (FormData, accessToken) => {
  return await axiosInstance.post("/post/create", FormData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllPosts = async (page, limit, accessToken) => {
  return await axiosInstance.get(`/post/get?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
