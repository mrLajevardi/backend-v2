export class UserPayload {
  userId?: number;
  username?: string;
  personalVerification?: boolean;
  originalUser?: {
    userId?: number;
    username?: string;
  };
  guid?: string;
  isRobot?: number;
  robotToken?: string;
  aiAccessToken?: string;
  isPublic?: boolean;
  twoFactorAuth?: string;
}
