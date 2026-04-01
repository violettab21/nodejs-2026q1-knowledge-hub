export class CreateUserDto {
  login: string;
  password: string;
  role?: 'admin' | 'editor' | 'viewer';
}
