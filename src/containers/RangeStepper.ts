import { connect } from 'react-redux';

import { IProps, RangeStepper as RangeStepperComp } from '../components/RangeStepper';

const mapStateToProps = (state: IProps) => state;

const connector = connect<IProps, {}, any>(mapStateToProps);
export const RangeStepper = connector(RangeStepperComp);
