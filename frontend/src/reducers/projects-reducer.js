import { ACTION_TYPE } from '../actions';

const initialProjectState = {
	projects: [],
};

export const projectsReducer = (state = initialProjectState, action) => {
	switch (action.type) {
		case ACTION_TYPE.SET_PROJECTS:
			console.log(action.payload);
			return {
				...state,
				projects: [...state.projects, action.payload],
			};
		case ACTION_TYPE.LOGOUT:
			return initialProjectState;
		default:
			return state;
	}
};
