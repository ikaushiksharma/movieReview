import client from "./client";
import { getToken, catchError } from "../utils/helper";
export const createActor = async (formData) => {
  const token = getToken();
  try {
    const { data } = await client.post("/actor/create", formData, {
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "mulitpart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
export const searchActor = async (query) => {
  const token = getToken();
  try {
    const { data } = await client(`/actor/search?name=${query}`, {
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "mulitpart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
export const getActors = async (pageNo, limit) => {
  const token = getToken();
  try {
    const { data } = await client(`/actor/actors/pageNo=${pageNo}&limit=${limit}`, {
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "mulitpart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
