export type User = {
  email: string;
  password: string;
  profile: Profile;
};

export type Profile = {
  firstName: string;
  lastName: string;
  bodyWeight: number;
};
