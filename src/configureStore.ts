import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import { rootEpic } from './rootEpic';
import { rootReducer} from './rootReducer';

const epicMiddleware = createEpicMiddleware(rootEpic);

export const configureStore = () =>
  createStore(
    rootReducer,
    applyMiddleware(epicMiddleware)
  )
;
