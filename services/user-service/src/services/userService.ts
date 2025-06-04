// /services/user-service/src/services/memberService.ts
import axios from "axios";
import config from "../config/env";

export const fetchUserProfile = async (memberId: string) => {
  try {
    // Call the Auth Service API endpoint to fetch the member profile
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
    // console.log(config.AUTH_URL)
    const response = await axios.get(`${config.AUTH_URL}/auth/profile/${memberId}`);
    // Return the user data from the Auth Service
    // console.log(response.data)
    const userData = response.data as { user: any };
    return userData;
  } catch (error: any) {
    console.error("Error fetching member profile:", error.message);
    throw new Error("Failed to fetch member profile from Auth Service");
  }
};


export const updateUserProfile = async (memberId: string, data: any) => {
  try {
    // Call the Auth Service API endpoint to update the member profile
    const response = await axios.put(`${config.AUTH_URL}/auth/profile/${memberId}`, data);
    // Return the updated user data from the Auth Service
    const userData = response.data as { user: any };
    return userData.user;
  } catch (error: any) {
    console.error("Error updating member profile:", error.message);
    throw new Error("Failed to update member profile in Auth Service");
  }
};
