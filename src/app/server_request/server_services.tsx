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
