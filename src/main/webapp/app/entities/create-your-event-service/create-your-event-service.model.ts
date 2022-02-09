import { IServiceMap } from 'app/entities/service-map/service-map.model';
import { IImage } from 'app/entities/image/image.model';
import { IMp3 } from 'app/entities/mp-3/mp-3.model';
import { IUser } from 'app/entities/user/user.model';
import { ITags } from 'app/entities/tags/tags.model';
import { ServiceCategory } from 'app/entities/enumerations/service-category.model';

export interface ICreateYourEventService {
  id?: number;
  name?: string;
  logoContentType?: string | null;
  logo?: string | null;
  active?: boolean | null;
  activeOwner?: boolean | null;
  description?: string;
  address?: string;
  motto?: string;
  phone?: string;
  webAddress?: string | null;
  category?: ServiceCategory;
  serviceMaps?: IServiceMap[] | null;
  images?: IImage[] | null;
  mp3s?: IMp3[] | null;
  user?: IUser | null;
  tags?: ITags[] | null;
}

export class CreateYourEventService implements ICreateYourEventService {
  constructor(
    public id?: number,
    public name?: string,
    public logoContentType?: string | null,
    public logo?: string | null,
    public active?: boolean | null,
    public activeOwner?: boolean | null,
    public description?: string,
    public address?: string,
    public motto?: string,
    public phone?: string,
    public webAddress?: string | null,
    public category?: ServiceCategory,
    public serviceMaps?: IServiceMap[] | null,
    public images?: IImage[] | null,
    public mp3s?: IMp3[] | null,
    public user?: IUser | null,
    public tags?: ITags[] | null
  ) {
    this.active = this.active ?? false;
    this.activeOwner = this.activeOwner ?? false;
  }
}

export function getCreateYourEventServiceIdentifier(createYourEventService: ICreateYourEventService): number | undefined {
  return createYourEventService.id;
}
