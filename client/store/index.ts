import { createStore, combineReducers } from 'redux';
import { MakeStore, createWrapper } from 'next-redux-wrapper';
import { AuthState } from './auth';

export interface State {
  auth: AuthState;
}

const combinedReducer = combineReducers({ auth });
const makeStore: MakeStore<State> = () => createStore(combinedReducer);

export const store = createWrapper<State>(makeStore, {
  debug: true,
});
