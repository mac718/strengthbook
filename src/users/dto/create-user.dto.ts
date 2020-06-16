import { Profile } from '../profile.interface';
export class CreateUserDto {
  readonly email: string;
  readonly password: string;
  readonly profile: Profile;
}
