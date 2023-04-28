import { Guid } from "@microsoft/sp-core-library";
import IDataProvider from "../../DataProvider/IDataProvider";

export interface IEditFormProps {
    context: any;
    dataProvider: IDataProvider;
    listGuid: Guid;
    itemId: number;
    onSave: () => void;
    onClose: () => void;
}