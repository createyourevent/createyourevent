import * as dayjs from 'dayjs';

export interface IContact {
  id?: number;
  name?: string;
  email?: string;
  message?: string;
  date?: dayjs.Dayjs | null;
}

export class Contact implements IContact {
  constructor(public id?: number, public name?: string, public email?: string, public message?: string, public date?: dayjs.Dayjs | null) {}
}

export function getContactIdentifier(contact: IContact): number | undefined {
  return contact.id;
}
