import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SPFI, spfi, SPFx } from "@pnp/sp";

import { Log } from '@microsoft/sp-core-library';
import {
  BaseFormCustomizer
} from '@microsoft/sp-listview-extensibility';

import TestTaskSoftlist, { ITestTaskSoftlistProps } from './components/TestTaskSoftlist';
import IDataProvider from './DataProvider/IDataProvider';
import SharePointDataProvider from './DataProvider/SharepointDataProvider';

/**
 * If your form customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ITestTaskSoftlistFormCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = 'TestTaskSoftlistFormCustomizer';

export default class TestTaskSoftlistFormCustomizer
  extends BaseFormCustomizer<ITestTaskSoftlistFormCustomizerProperties> {
    private sp: SPFI = undefined;
    private _dataProvider: IDataProvider;
  public onInit(): Promise<void> {
    // Add your custom initialization to this method. The framework will wait
    // for the returned promise to resolve before rendering the form.
    Log.info(LOG_SOURCE, 'Activated TestTaskSoftlistFormCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    this.sp = spfi().using(SPFx(this.context));
    this._dataProvider = new SharePointDataProvider(this.context);
    return Promise.resolve();
  }

  public render(): void {
    // Use this method to perform your custom rendering.

    const testTaskSoftlist: React.ReactElement<{}> =
      React.createElement(TestTaskSoftlist, {
        sp: this.sp,
        context: this.context,
        dataProvider: this._dataProvider,
        listGuid: this.context.list.guid,
        itemID: this.context.itemId,
        displayMode: this.displayMode,
        onSave: this._onSave,
        onClose: this._onClose

      } as ITestTaskSoftlistProps);

    ReactDOM.render(testTaskSoftlist, this.domElement);
  }

  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  private _onSave = (): void => {

    // You MUST call this.formSaved() after you save the form.
    this.formSaved();
  }

  private _onClose = (): void => {
    // You MUST call this.formClosed() after you close the form.
    this.formClosed();
  }
}
