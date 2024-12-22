import { ACTION_TYPE } from '../actions';

const initialUserState = {
	session: null,
	id: null,
	login: null,
	//avatar: '', // найти инфу
	dateOfBirth: '', //нужно будет добавить пароль
};

export const userReducer = (state = initialUserState, action) => {
	switch (action.type) {
		case ACTION_TYPE.SET_USER:
			return {
				...state,
				...action.payload,
			};
		case ACTION_TYPE.LOGOUT:
			return initialUserState;
		default:
			return state;
	}
};
