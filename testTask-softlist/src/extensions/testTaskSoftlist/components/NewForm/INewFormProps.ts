import { Guid } from '@microsoft/sp-core-library';
import IDataProvider from '../../DataProvider/IDataProvider';

export interface INewFormProps {
    context: any;
    dataProvider: IDataProvider;
    listGuid: Guid;
    onSave: () => void;
    onClose: () => void;
}