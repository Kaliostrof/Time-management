import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { appReducer, projectsReducer, userReducer, projectReducer } from './reducers';
import { thunk } from 'redux-thunk';

const reducer = combineReducers({
	app: appReducer,
	user: userReducer,
	project: projectReducer,
	projects: projectsReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
