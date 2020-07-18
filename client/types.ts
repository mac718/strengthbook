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

export interface Set {
  movement: string;
  exerciseOrder: number;
  setOrder: number;
  weight: number;
  reps: number;
  rep: number;
  e1rm: number;
}

export interface Workout {
  date: Date;
  sets: Set[];
}
