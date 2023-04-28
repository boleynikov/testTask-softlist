import * as React from 'react';
// import { useEffect } from 'react';
import { Log, FormDisplayMode, Guid } from '@microsoft/sp-core-library';
import { SPFI } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import NewForm from './NewForm/NewForm';
import EditForm from './EditForm/EditForm';
import DisplayForm from './DisplayForm/DisplayForm';

import styles from './TestTaskSoftlist.module.scss';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';
import IDataProvider from '../DataProvider/IDataProvider';

export interface ITestTaskSoftlistProps {
  sp: SPFI;
  context: FormCustomizerContext;
  dataProvider: IDataProvider;
  listGuid: Guid;
  itemID: number;
  displayMode: FormDisplayMode;
  onSave: () => void;
  onClose: () => void;
}

const LOG_SOURCE: string = 'TestTaskSoftlist';

export default class TestTaskSoftlist extends React.Component<ITestTaskSoftlistProps, {}> {
   componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: TestTaskSoftlist mounted');
  }

  componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: TestTaskSoftlist unmounted');
  }

  public render(): React.ReactElement<{}> {
    return <div className={styles.testTaskSoftlist}>
      {this.props.displayMode === FormDisplayMode.New &&
        <NewForm
          context={this.props.context}
          dataProvider={this.props.dataProvider}
          listGuid={this.props.listGuid}
          onSave={this.props.onSave}
          onClose={this.props.onClose} />
      }
      {this.props.displayMode === FormDisplayMode.Edit &&
        <EditForm
          context={this.props.context}
          dataProvider={this.props.dataProvider}
          listGuid={this.props.listGuid}
          itemId={this.props.itemID}
          onSave={this.props.onSave}
          onClose={this.props.onClose} />
      }
      {this.props.displayMode === FormDisplayMode.Display &&
        <DisplayForm
          context={this.props.context}
          dataProvider={this.props.dataProvider}
          listGuid={this.props.listGuid}
          itemId={this.props.itemID}
          onClose={this.props.onClose} />
      }
    </div>;
  }
}
