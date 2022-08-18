export interface IOrganization {
  id?: string;
  code?: string;
  name?: string;
  email?: string;
  businessCode?: string;
  legalRepresentative?: string;
  invoiceIssuingAddress?: string;
  phoneNumber?: string;
  type?: string;
  status?: string;
  deleted?: boolean;
  checked?: boolean;
  incorporationDate?: string | Date | null;
}

export class Organization implements IOrganization {
  constructor(
    public id?: string,
    public code?: string,
    public name?: string,
    public email?: string,
    public businessCode?: string,
    public legalRepresentative?: string,
    public incorporationDate?: string | Date | null,
    public invoiceIssuingAddress?: string,
    public phoneNumber?: string,
    public type?: string,
    public status?: string,
    public deleted?: boolean,
    public checked?: boolean
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.email = email;
    this.businessCode = businessCode;
    this.legalRepresentative = legalRepresentative;
    this.incorporationDate = incorporationDate;
    this.invoiceIssuingAddress = invoiceIssuingAddress;
    this.phoneNumber = phoneNumber;
    this.type = type;
    this.status = status;
    this.deleted = deleted;
    this.checked = checked;
  }
}
