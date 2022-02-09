import * as dayjs from 'dayjs';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { IUser } from 'app/entities/user/user.model';

export interface IServiceComment {
  id?: number;
  comment?: string | null;
  date?: dayjs.Dayjs | null;
  serviceComments?: IServiceComment[] | null;
  createYourEventService?: ICreateYourEventService | null;
  user?: IUser | null;
  serviceComment?: IServiceComment | null;
}

export class ServiceComment implements IServiceComment {
  constructor(
    public id?: number,
    public comment?: string | null,
    public date?: dayjs.Dayjs | null,
    public serviceComments?: IServiceComment[] | null,
    public createYourEventService?: ICreateYourEventService | null,
    public user?: IUser | null,
    public serviceComment?: IServiceComment | null
  ) {}
}

export function getServiceCommentIdentifier(serviceComment: IServiceComment): number | undefined {
  return serviceComment.id;
}
