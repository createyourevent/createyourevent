import * as dayjs from 'dayjs';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { IUser } from 'app/entities/user/user.model';

export interface IServiceLikeDislike {
  id?: number;
  like?: number | null;
  dislike?: number | null;
  date?: dayjs.Dayjs | null;
  comment?: string | null;
  createYourEventService?: ICreateYourEventService | null;
  user?: IUser | null;
}

export class ServiceLikeDislike implements IServiceLikeDislike {
  constructor(
    public id?: number,
    public like?: number | null,
    public dislike?: number | null,
    public date?: dayjs.Dayjs | null,
    public comment?: string | null,
    public createYourEventService?: ICreateYourEventService | null,
    public user?: IUser | null
  ) {}
}

export function getServiceLikeDislikeIdentifier(serviceLikeDislike: IServiceLikeDislike): number | undefined {
  return serviceLikeDislike.id;
}
