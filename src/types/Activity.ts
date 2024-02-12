export type ActivityType = "Run" | "Bike" | "Hike";
export type RouteType = "Flat" | "Rolling" | "Hilly";
export type DifficultyLevel =
  | "Easy"
  | "Moderate"
  | "Hard"
  | "Very Hard"
  | "Extremely Hard";
export type ClimbCategory =
  | "Four"
  | "Three"
  | "Two"
  | "One"
  | "Hors Categorie (HC)";

export type Address = {
  city: string;
  state: string;
  country: string;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Activity = {
  id: string;
  name: string;
  slug: string;
  description: string;
  distance: number;
  elevationGain: number;
  minimumGrade: number;
  maximumGrade: number;
  averageGrade: number;
  timeToComplete: number;
  difficultyLevel: DifficultyLevel;
  activityType: ActivityType;
  routeType: RouteType;
  climbCategory?: ClimbCategory;
  photos?: string[];
  tags?: string[];
  address: Address;
  startCoordinate: Coordinate;
  endCoordinate: Coordinate;
};
