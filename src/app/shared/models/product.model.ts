export interface IProduct {
  id?: string;
  name?: string;
  code?: string;
  price?: number;
  type?: string;
  subType?: string;
  imageId?: string;
  createdBy?: string;
  createdAt?: number;
  lastModifiedBy?: string;
  lastModifiedAt?: number;
  deleted?: true;
}

export class Product implements IProduct {
  constructor(
    public id?: string,
    public name?: string,
    public code?: string,
    public price?: number,
    public type?: string,
    public subType?: string,
    public imageId?: string,
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.price = price;
    this.type = type;
    this.subType = subType;
    this.imageId = imageId;
  }
}
