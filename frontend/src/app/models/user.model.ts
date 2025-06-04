export interface User {
  _id: string;       // MongoDB's ObjectId as string
  name: string;      // User's name
  email: string;     // User's email address
  token: string;     // Authentication token (required for auth interceptor)
  createdAt: string; // When the user was created
}