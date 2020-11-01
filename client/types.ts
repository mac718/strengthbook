export type User = {
  email: string;
  password: string;
  profile: Profile;
  workouts: [];
  prs: [];
};

export type Profile = {
  firstName: string;
  lastName: string;
  bodyweight: number;
  dob: Date;
  trackedMovements: string[];
};

export interface Set {
  date: Date;
  movement: string;
  exerciseOrder: number;
  setOrder: number;
  weight: number;
  reps: number;
  rpe: number;
  rir: number;
  e1rm: number;
}

export interface Workout {
  date: Date;
  sets: Set[];
  _id: string;
}
