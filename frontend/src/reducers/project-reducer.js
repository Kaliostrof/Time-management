import { ACTION_TYPE } from '../actions';

const initialProjectState = {
	id: '',
	title: '',
	totalTime: '',
	tasks: [],
};

export const projectReducer = (state = initialProjectState, action) => {
	switch (action.type) {
		case ACTION_TYPE.ADD_TASK:
			return {
				...state,
				tasks: [...state.tasks, action.payload],
			};
		case ACTION_TYPE.REMOVE_TASK:
			return {
				...state,
				tasks: state.tasks.filter((task) => task.id !== action.payload),
			};
		case ACTION_TYPE.SET_PROJECT_DATA:
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};
