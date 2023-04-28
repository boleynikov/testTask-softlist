import { Guid } from "@microsoft/sp-core-library";
import IDataProvider from "../../DataProvider/IDataProvider";

export interface IDisplayFormProps {
    context: any;
    dataProvider: IDataProvider;
    listGuid: Guid;
    itemId: number;
    onClose: () => void;
}