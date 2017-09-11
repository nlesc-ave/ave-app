import { connect } from 'react-redux'

import {
  IStateProps,
  RegionPage as RegionPageComp
} from '../components/RegionPage'

const mapStateToProps = (state: IStateProps) => state

const connector = connect<IStateProps, {}, any>(mapStateToProps)
export const RegionPage = connector(RegionPageComp)
