import { UserRole } from '../../users/user.entity';

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
};
