import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {ApiRootAction, FlankAction, setApiRoot, setFlank} from '../actions';
import {IDispatchProps, IStateProps, SettingsPage as SettingsPageComp } from '../components/SettingsPage';

type DispatchActions = ApiRootAction | FlankAction;

const mapStateToProps = (state: IStateProps) => state;
const mapDispatchToProps = (dispatch: Dispatch<DispatchActions>): IDispatchProps => ({
    saveSettings: (apiRoot: string, flank: number) => {
        dispatch(setApiRoot(apiRoot));
        dispatch(setFlank(flank));
    }
});

const connector = connect<IStateProps, IDispatchProps, any>(mapStateToProps, mapDispatchToProps);
export const SettingsPage = connector(SettingsPageComp);
