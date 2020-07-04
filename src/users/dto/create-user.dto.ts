import { Profile } from '../profile.interface';
export class CreateUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly profile: Profile;
}
