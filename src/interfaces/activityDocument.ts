export interface AddressDetails {
  city: string;
  state: string;
  country: string;
}

export interface StartCoordinateDetails {
  latitude: number;
  longitude: number;
}

export interface EndCoordinateDetails {
  latitude: number;
  longitude: number;
}

// Specific structure for documents that come out of the aggregation
export interface ActivityDocument {
  name: string;
  slug: string;
  description: string;
  distance: number;
  elevationGain: number;
  minimumGrade?: number;
  maximumGrade?: number;
  averageGrade: number;
  timeToComplete?: number;
  difficultyLevel: string;
  activityType: string;
  routeType: string;
  climbCategory?: string;
  photos: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  addressDetails: AddressDetails; // Assuming $lookup brings in the entire address document
  createdBy: string;
  startCoordinateDetails: StartCoordinateDetails;
  endCoordinateDetails: EndCoordinateDetails;
  isCreatedByAdmin: boolean;
}
