export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  profileImage?: string;
  role?: string;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    language?: string;
  };
  token?: string;
}