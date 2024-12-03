import { createStore, applyMiddleware, StoreEnhancer } from "redux";
import { routerMiddleware } from 'connected-react-router'
import {thunk }from 'redux-thunk'
import { createBrowserHistory } from 'history'
import reducer from "../reducer/reducer";
import { composeWithDevTools } from '@redux-devtools/extension';
export const history = createBrowserHistory();
const initialState = {};
const middleware:any = [
    thunk ,
  routerMiddleware(history)
];

const composeEnhancers = composeWithDevTools({
    name: 'Zconnect',
    actionsBlacklist: ['REDUX_STORAGE_SAVE']
});

const store = createStore(
  reducer(history),
  initialState,
  composeEnhancers(
    applyMiddleware(...middleware)
  )
);

// Load user after store creation
//loadUser(store, "");

export default store;
