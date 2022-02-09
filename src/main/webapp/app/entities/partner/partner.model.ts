export interface IPartner {
  id?: number;
  name?: string;
  address?: string;
  phone?: string;
  logoContentType?: string;
  logo?: string;
  mail?: string;
  webaddress?: string;
  sponsorshipAmount?: number | null;
  active?: boolean | null;
}

export class Partner implements IPartner {
  constructor(
    public id?: number,
    public name?: string,
    public address?: string,
    public phone?: string,
    public logoContentType?: string,
    public logo?: string,
    public mail?: string,
    public webaddress?: string,
    public sponsorshipAmount?: number | null,
    public active?: boolean | null
  ) {
    this.active = this.active ?? false;
  }
}

export function getPartnerIdentifier(partner: IPartner): number | undefined {
  return partner.id;
}
