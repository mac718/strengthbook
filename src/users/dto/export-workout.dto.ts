import { ISet } from '../user.schema';

export class ExportWorkoutDto {
  id: string;
  date: Date;
  sets: ISet[];
}
