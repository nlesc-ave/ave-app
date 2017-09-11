import { applyMiddleware, compose, createStore } from 'redux'
import persistState from 'redux-localstorage'
import { createEpicMiddleware } from 'redux-observable'

import { rootEpic } from './rootEpic'
import { rootReducer } from './rootReducer'

const epicMiddleware = createEpicMiddleware(rootEpic)

const enhancer = compose(applyMiddleware(epicMiddleware), persistState())

export const configureStore = () => createStore(rootReducer, enhancer)
