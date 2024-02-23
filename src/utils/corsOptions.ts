const whitelist = [
  // ** This is the website where react app is deployed
  "",
  // ** This is for local development
  "http://localhost:5173",
];
export const corsOptions = {
  credentials: true,
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow: boolean) => void
  ) => {
    if (
      (typeof origin === "string" && whitelist.indexOf(origin) !== -1) ||
      !origin
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  optionsSuccessStatus: 200,
};
