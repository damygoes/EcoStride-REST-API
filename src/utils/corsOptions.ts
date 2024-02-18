const whitelist = [
  // add the website where your react app is deployed
  // ** Remove the last three after development as well as !origin and leave the top one as the website where your react app is deployed.
  "http://localhost:3000",
  "http://localhost:5173",
];
export const corsOptions = {
  credentials: true,
  origin: (
    origin: string,
    callback: (error: Error | null, allow: boolean) => void
  ) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  optionsSucessStatus: 200,
};
