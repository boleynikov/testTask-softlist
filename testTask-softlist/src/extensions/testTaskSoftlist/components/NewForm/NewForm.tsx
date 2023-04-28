import * as React from 'react';
import AsyncSelect from 'react-select/async';
import { INewFormProps } from './INewFormProps';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IPersonaProps, TextField, Label, Dropdown, IDropdownOption, DefaultButton } from 'office-ui-fabric-react';
import { INewFormState } from './INewFormState';
import { ActionMeta } from 'react-select';
import { PrimaryButton } from '@fluentui/react';
import Validator from '../../Validation/Validator';
import styles from '../TestTaskSoftlist.module.scss';

export default class NewForm extends React.Component<INewFormProps, INewFormState> {
  constructor(props: INewFormProps) {
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
    const categories = await this.props.dataProvider.getCategories();
    const statuses = await this.props.dataProvider.getValuesFromField("Requeststatus");
    const manufacturers = await this.props.dataProvider.getValuesFromField("Manufacturer");

    console.log("categories", categories);
    console.log("statuses", statuses);
    console.log("manufacturers", manufacturers);

    await this.setState({
      allCategories: categories,
      allStatuses: statuses,
      allManufacturers: manufacturers,
      requestStatus: {
        key: statuses[0].key.toString(),
        text: statuses[0].text
      }
    })

  }
  private handleSubmit = async () => {
    let validationModelErrors = new Validator(this.state).validateModel();
    this.setState({ validation: validationModelErrors });
    if (Object.values(validationModelErrors).includes(true)) {
      return;
    }
    await this.props.dataProvider.addNewRequest(this.state);
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
  private onCategoriesChanged = async (newCategory: any, actionMeta: ActionMeta<number>) => {
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

    return (
      <div className={styles.formCard}>
        <div>
          <h1>Create new request</h1>
        </div>
        <div>
          <TextField
            label="Title"
            placeholder="Type..."
            onChange={this.onTitleChanged}
            errorMessage={this.state.validation.titleError ? "You must enter title" : ""}>
          </TextField>
        </div>
        <div>
          <Label>Сategory</Label>
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            onChange={this.onCategoriesChanged} />
          {this.state.validation.categoryError && <span style={{ color: "#8B0000" }}>Please select category</span>}
        </div>
        <div>
          <Dropdown
            label="Manufacturer"
            placeholder="Select an manufacturer"
            options={this.state.allManufacturers}
            onChange={this.onManufacturerChanged}
            errorMessage={this.state.validation.ManufacturerError ? 'Please choose Manufacturer' : ""}
          />
        </div>
        <div>
          <PeoplePicker
            context={this.props.context}
            titleText="Responsible person/persons"
            personSelectionLimit={15}
            showtooltip={true}
            onChange={this.onResponsiblePersonChanged}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000}
            errorMessage={this.state.validation.responsibleError ? 'Please choose Responsible' : ""}
          />
        </div>
        <div>
          <TextField
            type="number"
            max={100000}
            step={0.01}
            label="Price"
            placeholder="Type..."
            defaultValue={"0.00"}
            min={"0.00"}
            onChange={this.onPriceChanged}>
          </TextField>
        </div>
        <div>
          <Dropdown
            label="Request Status"
            placeholder="Статус заявки при створенні 'Не розпочато'"
            options={this.state.allStatuses}
            onChange={this.onRequestStatusChanged}
            disabled={true}
          />
        </div>
        <div className={styles.flexBar}>
          <DefaultButton
            className={styles.button}
            text="Cancel"
            onClick={this.props.onClose} />
          <PrimaryButton
            className={styles.button}
            text="Save"
            onClick={this.handleSubmit}
            allowDisabledFocus />
        </div>
      </div>
    );
  }
};

