import { UserRoleName } from '../misc/utilities.misc';

export class User {
  id?: number;
  created_at?: string;
  updated_at?: string;
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  image_profil?: string;
  email_verified_at?: string;
  api_token?: string;
  remember_token?: string;
  account_number?: string;
  is_active?: boolean;
  role?: string;
}
