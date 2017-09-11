import { combineReducers } from 'redux'

import {
  ApiRootActions,
  FlankActions,
  OtherAction,
  RESET_API_ROOT,
  RESET_FLANK,
  UPDATE_API_ROOT,
  UPDATE_FLANK
} from './actions'

const DEFAULT_API_ROOT = '/api'

function apiroot(
  state: string = DEFAULT_API_ROOT,
  action: ApiRootActions | OtherAction = OtherAction
) {
  switch (action.type) {
    case UPDATE_API_ROOT:
      return action.payload
    case RESET_API_ROOT:
      return DEFAULT_API_ROOT
    default:
      return state
  }
}

const DEFAULT_FLANK = 1000

function flank(
  state: number = DEFAULT_FLANK,
  action: FlankActions | OtherAction = OtherAction
) {
  switch (action.type) {
    case UPDATE_FLANK:
      return action.payload
    case RESET_FLANK:
      return DEFAULT_FLANK
    default:
      return state
  }
}

export const rootReducer = combineReducers({
  apiroot,
  flank
})
