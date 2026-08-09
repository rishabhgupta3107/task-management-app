export interface UserProfile {
  username: string;
  fullName?: string;
  email?: string;
  dob?: string;
  age?: number;
  avatarUrl?: string;
  title?: string;
  bio?: string;
  timezone?: string;
  createdAt?: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  dob?: string;
  avatarUrl?: string;
  title?: string;
  bio?: string;
  timezone?: string;
}
