import { ISiteUserProps } from "@pnp/sp/site-users";
import { IPersonaProps } from "office-ui-fabric-react";

export default interface IDataProvider {
  addNewRequest(newRequest: ItemRequest): Promise<void>;
  updateRequestById(requestId: number, request: ItemRequest): Promise<void>;
  checkUserRolesForRequestById(requestId: number): Promise<UserRole[]>;
  getRequestById(requestId: number): Promise<ItemRequest>;
  getUserById(userId: number): Promise<ISiteUserProps>;
  getCategories(): Promise<Category[]>;
  getValuesFromField(fieldName: string): Promise<RequestStatus[]>;
}

export interface ItemRequest {
    category: Category,
    Manufacturer: RequestStatus,
    title: string,
    responsibles: IPersonaProps[],
    price: number,
    requestStatus: RequestStatus
}
export interface Category {
  label: string,
  value: number
}
export interface RequestStatus {
  key: string,
  text: string
}

export enum UserRole{
  Manager = 0,
  Responsible = 1,
  Admin = 2
}
