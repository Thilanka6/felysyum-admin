import { BASE_URL } from "@/app/server_request/serverUrls";
import axios from "axios";

export const serverPostRequest = async (object: any, classPath: string) => {
  try {
    const response = await axios.post(BASE_URL + classPath, object, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response:", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const serverGetWithBareGet = async (
  params: any,
  classPath: string,
  token: string,
) => {
  try {
    const response = await axios.get(BASE_URL + classPath, {
      params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    //console.log("Response:", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const serverPatchWithBareGet = async (
  params: any,
  classPath: string,
  token: string,
) => {
  try {
    const response = await axios.patch(
      BASE_URL + classPath,
      params, // ✅ data body (2nd arg)
      {
        // ✅ config (3rd arg)
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
