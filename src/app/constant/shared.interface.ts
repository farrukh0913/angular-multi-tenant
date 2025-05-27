export interface ICompany {
  id?: number;
  name: string;
}

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  companyId: number;
  roleId: number;
  privileges: number[];
  companyIds?: number[];
  userCompanies?: any;
}
