import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import * as actions from '../actions'
import {
  IDispatchProps,
  IStateProps,
  SettingsPage as SettingsPageComp
} from '../components/SettingsPage'

const mapStateToProps = (state: IStateProps) => state
const mapDispatchToProps = (
  dispatch: Dispatch<actions.DispatchActions>
): IDispatchProps => ({
  resetSettings: () => {
    dispatch(actions.resetApiRoot())
    dispatch(actions.resetFlank())
  },
  saveSettings: (apiRoot: string, flank: number) => {
    dispatch(actions.updateApiRoot(apiRoot))
    dispatch(actions.updateFlank(flank))
  }
})

const connector = connect<IStateProps, IDispatchProps, any>(
  mapStateToProps,
  mapDispatchToProps
)
export const SettingsPage = connector(SettingsPageComp)
