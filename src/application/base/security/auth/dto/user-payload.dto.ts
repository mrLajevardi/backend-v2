export class UserPayload {
  userId?: number;
  username?: string;
  originalUser?: {
    userId?: number;
    username?: string;
  };
  isRobot?: number;
  robotToken?: string;
  isPublic?: boolean;
}
