export interface IAdminFeesPrice {
  id?: number;
  feesOrganisator?: number | null;
  feesSupplier?: number | null;
  feesService?: number | null;
  feesOrganizations?: number | null;
}

export class AdminFeesPrice implements IAdminFeesPrice {
  constructor(
    public id?: number,
    public feesOrganisator?: number | null,
    public feesSupplier?: number | null,
    public feesService?: number | null,
    public feesOrganizations?: number | null
  ) {}
}

export function getAdminFeesPriceIdentifier(adminFeesPrice: IAdminFeesPrice): number | undefined {
  return adminFeesPrice.id;
}
