export interface User {
  _id?: string;
  name: string;
  email: string;
  isVerified?: boolean;
  preferences?: {
    darkMode?: boolean;
    emailNotifications?: boolean;
  };
  createdAt?: Date;
}