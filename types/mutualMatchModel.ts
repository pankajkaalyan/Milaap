import { FamilyDetails, HoroscopeDetails, InterestShown, PartnerPreferences, UserProfile, VerificationStatus } from "./models";

export interface ConnectionResponse {
  connectionId: number;
  connectedSince: string;
  connectedUser: ConnectedUser;
}

export interface ConnectedUser {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  profile: UserProfile;
  interestShownList: InterestShown[];
}

export interface IRange {
  min: number | null;
  max: number | null;
}


