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
  date: Date;
  movement: string;
  exerciseOrder: number;
  setOrder: number;
  weight: number;
  reps: number;
  rpe: number;
  e1rm: number;
}

export interface Workout {
  date: Date;
  sets: Set[];
}
