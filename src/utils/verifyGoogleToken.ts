import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  // Extract user details from the payload
  const userDetails = {
    email: payload ? payload["email"] : "",
    firstName: payload ? payload["given_name"] : "",
    lastName: payload ? payload["family_name"] : "",
    avatar: payload ? payload["picture"] : "",
  };

  return userDetails;
};
