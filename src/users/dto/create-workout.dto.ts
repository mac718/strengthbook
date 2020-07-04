import { ISet } from '../user.schema';

export class CreateWorkoutDto {
  date: Date;
  sets: ISet[];
}
