import { IUser } from 'app/entities/user/user.model';

export interface IUserExtension {
  id?: number;
  address?: string | null;
  phone?: string | null;
  loggedIn?: boolean | null;
  points?: number | null;
  user?: IUser | null;
}

export class UserExtension implements IUserExtension {
  constructor(
    public id?: number,
    public address?: string | null,
    public phone?: string | null,
    public loggedIn?: boolean | null,
    public points?: number | null,
    public user?: IUser | null
  ) {
    this.loggedIn = this.loggedIn ?? false;
  }
}

export function getUserExtensionIdentifier(userExtension: IUserExtension): number | undefined {
  return userExtension.id;
}
