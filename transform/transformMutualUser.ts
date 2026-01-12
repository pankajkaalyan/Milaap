import { Interests, InterestShown, Match } from "@/types";
import { ConnectionResponse } from "@/types/mutualMatchModel";

// export interface TransformedUser {
//   id: number;
//   name: string;
//   email: string;
//   age: number;
//   profession: string;
//   location: string;
//   caste: string;
//   subCaste: string | null;
//   compatibilityScore: number;
//   highestEducation: string;
//   city: string;
//   gender: string;
//   about: string | null;
//   horoscope: {
//     gotra?: string | null;
//     mangalDosha?: string | null;
//     rashi?: string | null;
//     nakshatra?: string | null;
//   };
//   familyDetails: {
//     fatherName?: string | null;
//     motherName?: string | null;
//     siblings?: string | null;
//     familyValues?: string | null;
//   };
//   verificationStatus: string;
//   latitude: number;
//   longitude: number;
//   heightInCm: number;
//   isVerified: boolean;
//   video: string | null;
//   audio: string | null;
//   photos: string[];
//   status: string;
//   partnerPreferences: any;
//   interestShown: any;
//   isFavourite: boolean;
//   isBlocked: boolean;
// }

export function transformUserResponse(data: ConnectionResponse, interests: Interests): Match {
  const user = data.connectedUser;
  const profile = user?.profile;

  return {
    id: user.id,
    name: profile.fullName || user.name || '',
    email: user.email,
    age: profile.age || 0,
    profession: profile.profession || '',
    location: profile['city'] ||  '',
    caste: profile.caste || '',
    subCaste: profile.subCaste || '',
    highestEducation: profile.highestEducation || '',
    gender: profile.gender,
    about: profile.about || '',
    horoscope: profile.horoscope,
    familyDetails: profile.familyDetails,
    verificationStatus: profile.verificationStatus,
    latitude: profile.latitude || 0,
    longitude: profile.longitude || 0,
    heightInCm: profile.heightInCm || 0,
    isVerified: profile.verificationStatus.toLocaleLowerCase() === 'verified',
    video: profile.video || null,
    audio: profile.audio || null,
    photos: profile.photos || [],
    status: profile.status,
    partnerPreferences: profile.partnerPreferences,
    interestShown: findIntrest(interests, user.interestShownList),
    isFavourite: profile.isFavourite || false,
    isBlocked: profile.isBlocked || false,
    compatibilityScore: profile.compatibilityScore || 0,
  };
}

export const findIntrest = (userIntreset: Interests, interestList: InterestShown[]): InterestShown | null => {
  let intrestShown: InterestShown | null = null;
  if (userIntreset && interestList && interestList.length > 0) {
    const allInterests = [...userIntreset?.sent, ...userIntreset?.received];
    const matchesMade = interestList.filter(item =>
      allInterests.some(i => i.interestRequestId === item.interestRequestId)
    );
    if(matchesMade.length){
      intrestShown = {
        interestRequestId: matchesMade[0].interestRequestId,
        isSent: matchesMade[0].isSent,
        isMutual: matchesMade[0].isMutual,
        status: matchesMade[0].status
      }
    }
  }
  return intrestShown;
}
