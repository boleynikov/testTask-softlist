import { IPersonaProps } from 'office-ui-fabric-react';
import { Category, RequestStatus } from '../../DataProvider/IDataProvider';
import { ValidationModel } from '../../Validation/Validator';

export interface INewFormState {
    allCategories: Category[],
    category: Category,
    allManufacturers: RequestStatus[],
    Manufacturer: RequestStatus,
    title: string,
    responsibles: IPersonaProps[],
    price: number,
    allStatuses: RequestStatus[] ,
    requestStatus: RequestStatus,
    validation: ValidationModel
}