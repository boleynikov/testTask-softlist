// import { ValidationProps } from "./IValidationProps";
// import { IQualitySurveyState as SurveyModel } from "../components/IQualityServeyState";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import { ItemRequest } from "../DataProvider/IDataProvider";
export interface ValidationModel {
    ManufacturerError: boolean,
    categoryError: boolean,
    titleError: boolean,
    responsibleError: boolean
}

export default class Validator {
    private request: ItemRequest;
    constructor(props: ItemRequest) {
        this.request = props;
    }
    public validateModel(): ValidationModel {
        const model: ValidationModel = {
            ManufacturerError: false,
            categoryError: false,
            titleError: false,
            responsibleError: false
        }
        model.responsibleError = this.request.responsibles.length == 0 ? true : false;
        model.titleError = isEmpty(this.request.title);
        model.categoryError = isEmpty(this.request.category.label);
        model.ManufacturerError = isEmpty(this.request.Manufacturer.text);
        return model;
    }

}