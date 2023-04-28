import * as React from 'react';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IEditFormProps } from './IEditFormProps';
import { IEditFormState } from './IEditFormState';
import { Dropdown, IDropdownOption, IPersonaProps, Label, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import AsyncSelect from 'react-select/async';
import Validator from '../../Validation/Validator';
import styles from '../TestTaskSoftlist.module.scss';
import { Category, UserRole } from '../../DataProvider/IDataProvider';
import { DefaultButton } from '@fluentui/react';
export default class EditForm extends React.Component<IEditFormProps, IEditFormState> {
    private userRoles: UserRole[];
    constructor(props: IEditFormProps) {
        super(props);
        this.state = {
            allCategories: [],
            category: {
                label: "",
                value: 0
            },
            allManufacturers: [],
            Manufacturer: {
                key: "",
                text: ""
            },
            title: "",
            responsibles: [],
            price: 0.00,
            allStatuses: [],
            requestStatus: {
                key: "",
                text: ""
            },
            validation: {
                ManufacturerError: false,
                categoryError: false,
                titleError: false,
                responsibleError: false
            }
        }
    }

    async componentDidMount(): Promise<void> {
        this.userRoles = await this.props.dataProvider.checkUserRolesForRequestById(this.props.itemId);
        const categories = await this.props.dataProvider.getCategories();
        const statuses = await this.props.dataProvider.getValuesFromField("Requeststatus");
        const manufacturers = await this.props.dataProvider.getValuesFromField("Manufacturer");
        console.log("categories", categories);
        console.log("statuses", statuses)
        console.log("manufacturers", manufacturers);
        await this.setState({ allCategories: categories })

        const currentItem = await this.props.dataProvider.getRequestById(this.props.itemId);
        await this.setState({
            allStatuses: statuses,
            allManufacturers: manufacturers,
            title: currentItem.title,
            category: this.state.allCategories.find(cat => cat.value == currentItem.category.value),
            Manufacturer: currentItem.Manufacturer,
            responsibles: currentItem.responsibles,
            price: currentItem.price,
            requestStatus: currentItem.requestStatus
        });
        console.log("this.state", this.state);
    }

    private handleSubmit = async () => {
        let validationModelErrors = new Validator(this.state).validateModel();
        this.setState({ validation: validationModelErrors });
        if (Object.values(validationModelErrors).includes(true)) {
            return;
        }
        await this.props.dataProvider.updateRequestById(this.props.itemId, this.state);
        this.props.onSave();
    }
    private onTitleChanged = async (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        await this.setState({ title: newValue });
    }
    private onPriceChanged = async (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        await this.setState({ price: Number.parseFloat(newValue) });
    }
    private onResponsiblePersonChanged = async (items: IPersonaProps[]) => {
        await this.setState({ responsibles: items });
        console.log("this.state.responsibles", this.state.responsibles);
    }
    private onCategoriesChanged = async (newCategory: Category) => {
        await this.setState({ category: newCategory });
        console.log("this.state.category", this.state.category);
    }
    private onManufacturerChanged = async (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        const value = {
            key: option.key.toString(),
            text: option.text
        }
        await this.setState({ Manufacturer: value })
        console.log("this.state.Manufacturer", this.state.Manufacturer);
    }
    private onRequestStatusChanged = async (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        const value = {
            key: option.key.toString(),
            text: option.text
        }
        await this.setState({ requestStatus: value })
        console.log("this.state.requestStatus", this.state.requestStatus);
    }
    render() {
        const filterCategories = (inputValue: string) => {
            return this.state.allCategories.filter((category) =>
                category.label.toLowerCase().includes(inputValue.toLowerCase())
            );
        };
        const loadOptions = (
            inputValue: string,
            callback: (options: any) => void
        ) => {
            setTimeout(() => {
                callback(filterCategories(inputValue));
            }, 1000);
        };
        const isAdmin = this.userRoles?.includes(UserRole.Admin);
        const isManager = this.userRoles?.includes(UserRole.Manager);
        const IsResponsible = this.userRoles?.includes(UserRole.Responsible);
        const peoplePickerEnabled = this.state.requestStatus.text == "В роботі" && isAdmin;
        return (
            <div className={styles.formCard}>
                <div className={styles.flexBar}>
                    <h1>Edit request {this.props.itemId}</h1>
                    <h5><i>Roles:{this.userRoles?.length != 0 ?
                        this.userRoles?.map(role => {
                            return ` ${UserRole[role]};`;
                        }) : " none"}</i></h5>
                </div>
                <div>
                    <TextField
                        label="Title"
                        placeholder="Type..."
                        value={this.state.title}
                        onChange={this.onTitleChanged}
                        errorMessage={this.state.validation.titleError ? "You must enter title" : ""}
                        disabled={!isManager}>
                    </TextField>
                </div>
                <div>
                    <Label
                        disabled={!isManager}>
                        Сategory
                    </Label>
                    <AsyncSelect
                        cacheOptions
                        loadOptions={loadOptions}
                        value={this.state.category}
                        defaultOptions
                        onChange={this.onCategoriesChanged}
                        isDisabled={!isManager}
                    />
                </div>
                <div>
                    <Dropdown
                        label="Manufacturer"
                        placeholder="Select an manufacturer"
                        options={this.state.allManufacturers}
                        selectedKey={this.state.Manufacturer.key}
                        onChange={this.onManufacturerChanged}
                        disabled={!isManager}
                    />
                </div>
                <div>
                    <PeoplePicker
                        context={this.props.context}
                        titleText="Responsible person/persons"
                        personSelectionLimit={15}
                        showtooltip={true}
                        defaultSelectedUsers={this.state.responsibles?.map(user => user.secondaryText)}
                        showHiddenInUI={false}
                        principalTypes={[PrincipalType.User]}
                        resolveDelay={1000}
                        onChange={this.onResponsiblePersonChanged}
                        errorMessage={this.state.validation.responsibleError ? 'Please choose Responsible' : ""}
                        disabled={!isManager && !peoplePickerEnabled}
                    />
                </div>
                <div>
                    <TextField
                        type="number"
                        max={100000}
                        step={0.01}
                        label="Price"
                        value={this.state.price.toString()}
                        min={"0.00"}
                        onChange={this.onPriceChanged}
                        disabled={!isManager}>
                    </TextField>
                </div>
                <div>
                    <Dropdown
                        label="Request Status"
                        options={this.state.allStatuses}
                        selectedKey={this.state.requestStatus.key}
                        onChange={this.onRequestStatusChanged}
                        disabled={!isManager && !IsResponsible}
                    />
                </div>
                <div className={styles.flexBar}>
                    <DefaultButton
                        className={styles.button}
                        text="Cancel"
                        onClick={this.props.onClose} />
                    {this.userRoles?.length != 0 &&
                        <PrimaryButton
                            className={styles.button}
                            text="Save"
                            onClick={this.handleSubmit}
                            allowDisabledFocus />}

                </div>
            </div>
        )
    }
};