import { ACTION_TYPE } from './action-type';

export const setProjects = (projects) => ({
	type: ACTION_TYPE.SET_PROJECTS,
	payload: projects,
});
