import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new Error("Failed to refresh access token");
  }
};

export function tokenNeedsRefresh(expiryDate: Date): boolean {
  // Convert expiryDate to a timestamp for comparison
  const expiryTimestamp = expiryDate.getTime();

  // Get the current timestamp
  const now = Date.now();

  // Check if the expiry timestamp is less than the current timestamp plus a buffer
  // For example, you might want to refresh the token if it's going to expire within the next 5 minutes
  const buffer = 5 * 60 * 1000; // 5 minutes in milliseconds

  return expiryTimestamp - now < buffer;
}
