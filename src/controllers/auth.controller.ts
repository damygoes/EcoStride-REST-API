import express from "express";
import passport from "passport";

const authRouter = express.Router();

authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("https://eco-stride.vercel.app");
  }
);

authRouter.post("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ error: "Error logging out" });
    }
    if (req.session) {
      req.session.destroy((error) => {
        if (error) {
          console.error("Error destroying session:", error);
          return res.status(500).json({ error: "Error clearing session" });
        }
        // Send a response indicating logout was successful
        res.json({ message: "Logout successful" });
      });
    } else {
      res.json({ message: "Logout successful" });
    }
  });
});

export default authRouter;
