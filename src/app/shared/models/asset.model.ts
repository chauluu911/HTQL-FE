export interface IAsset {
  id?: string;
  code?: string;
  name?: string;
  status?: string;
  deleted?: boolean;
  checked?: boolean;
  description?: string;
  serialNumber?: number | string;
  assetType?: string;
  assetTypeId?: string;
  productId?: string;
  ownerId?: string;
  total?: number | BigInteger | null;
}

export class Asset implements IAsset {
  constructor(
    public id?: string,
    public code?: string,
    public name?: string,
    public status?: string,
    public deleted?: boolean,
    public checked?: boolean,
    public description?: string,
    public serialNumber?: number | string,
    public assetType?: string,
    public assetTypeId?: string,
    public productId?: string,
    public total?: number | BigInteger | null,
    public ownerId?: string
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.status = status;
    this.deleted = deleted;
    this.checked = checked;
    this.description = description;
    this.serialNumber = serialNumber;
    this.assetType = assetType;
    this.assetTypeId = assetTypeId;
    this.productId = productId;
    this.ownerId = ownerId;
    this.total = total;
  }
}
