import * as dayjs from 'dayjs';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { IUser } from 'app/entities/user/user.model';

export interface IServiceStarRating {
  id?: number;
  stars?: number | null;
  date?: dayjs.Dayjs | null;
  comment?: string | null;
  service?: ICreateYourEventService | null;
  user?: IUser | null;
}

export class ServiceStarRating implements IServiceStarRating {
  constructor(
    public id?: number,
    public stars?: number | null,
    public date?: dayjs.Dayjs | null,
    public comment?: string | null,
    public service?: ICreateYourEventService | null,
    public user?: IUser | null
  ) {}
}

export function getServiceStarRatingIdentifier(serviceStarRating: IServiceStarRating): number | undefined {
  return serviceStarRating.id;
}
