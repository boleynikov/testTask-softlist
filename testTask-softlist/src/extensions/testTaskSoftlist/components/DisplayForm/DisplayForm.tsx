import * as React from 'react';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IDisplayFormProps } from './IDisplayFormProps';
import { TextField, Dropdown, Label, PrimaryButton } from 'office-ui-fabric-react';
import { IDisplayFormState } from './IDisplayFormState';
import AsyncSelect from 'react-select/async';
import styles from '../TestTaskSoftlist.module.scss';


export default class DisplayForm extends React.Component<IDisplayFormProps, IDisplayFormState> {
    constructor(props: IDisplayFormProps) {
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
            }
        }
    }
    async componentDidMount(): Promise<void> {
        const categories = await this.props.dataProvider.getCategories();
        const statuses = await this.props.dataProvider.getValuesFromField("Requeststatus");
        const manufacturers = await this.props.dataProvider.getValuesFromField("Manufacturer");
        console.log("categories", categories);
        console.log("statuses", statuses);
        console.log("manufacturers", manufacturers);
        await this.setState({allCategories: categories})

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
        return (
            <div className={styles.formCard}>
                <div>
                    <h1>View request {this.props.itemId}</h1>
                </div>
                <div>
                    <TextField
                        label="Title"
                        placeholder="Type..."
                        value={this.state.title}>
                    </TextField>
                </div>
                <div>
                    
                <Label>Сategory</Label>
                    <AsyncSelect
                        cacheOptions
                        loadOptions={loadOptions}
                        value={this.state.category}
                        defaultOptions
                        />
                </div>
                <div>
                    <Dropdown
                        label="Manufacturer"
                        placeholder="Select an manufacturer"
                        options={this.state.allManufacturers}
                        selectedKey={this.state.Manufacturer.key}
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
                        disabled={true}
                        principalTypes={[PrincipalType.User]}
                        resolveDelay={1000} />
                </div>
                <div>
                    <TextField
                        type="number"
                        max={100000}
                        step={0.01}
                        label="Price"
                        value={this.state.price.toString()}
                        defaultValue={"0.00"}
                        min={"0.00"}>
                    </TextField>
                </div>
                <div>
                    <Dropdown
                        label="Request Status"
                        options={this.state.allStatuses}
                        selectedKey={this.state.requestStatus.key}
                    />
                </div>
                <div className={styles.flexBar}>
                    <PrimaryButton
                        className={styles.button}
                        text="Close"
                        onClick={this.props.onClose}
                        allowDisabledFocus />
                </div>
            </div>
        )
    }
}
