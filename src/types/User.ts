export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: USER_ROLE;
  authenticated: {
    sessionToken: string;
  };
  profile?: {
    bio: string;
    age: number;
    ftp: number;
    bikeWeight: number;
    bodyWeight: number;
  };
};

export type USER_ROLE = "USER" | "ADMIN";
