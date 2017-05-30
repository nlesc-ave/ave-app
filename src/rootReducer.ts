import { combineReducers } from 'redux';

import {
    API_ROOT,
    ApiRootAction,
    FLANK,
    FlankAction,
    OtherAction
} from './actions';

function apiroot(state: string = '/api', action: ApiRootAction | OtherAction = OtherAction) {
    switch (action.type) {
        case API_ROOT:
            return action.payload;
        default:
            return state;
    }
}

function flank(state: number = 1000, action: FlankAction | OtherAction = OtherAction) {
    switch (action.type) {
        case FLANK:
            console.log(action);
            return action.payload;
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    apiroot,
    flank
});
