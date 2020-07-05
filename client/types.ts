export type User = {
  email: string;
  password: string;
  profile: Profile;
  workouts: [];
};

export type Profile = {
  firstName: string;
  lastName: string;
  bodyweight: number;
  dob: Date;
};
