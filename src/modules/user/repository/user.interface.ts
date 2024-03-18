export interface IauthenticatedUser {
  name: string;
  email: string;
  profilePicture?: string;
  googleId?: string;
  authType: string;
}
