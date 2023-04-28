import { IPersonaProps } from "office-ui-fabric-react";
import { Category, RequestStatus } from "../../DataProvider/IDataProvider";

export interface IDisplayFormState {
    allCategories: Category[],
    category: Category,
    allManufacturers: RequestStatus[],
    Manufacturer: RequestStatus,
    title: string,
    responsibles: IPersonaProps[],
    price: number,
    allStatuses: RequestStatus[] ,
    requestStatus: RequestStatus
}