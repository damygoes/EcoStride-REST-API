import jwt from "jsonwebtoken";

export const userIsUserMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1]; // Because i'm using a "Bearer <token>" format
  if (!token) {
    return res.status(401).send("Access Denied / Unauthorized request");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified; // Attaching the user payload to the request
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};
