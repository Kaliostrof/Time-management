import { ACTION_TYPE } from './action-type';

export const setProjectData = (projectData) => ({
	type: ACTION_TYPE.SET_PROJECT_DATA,
	payload: projectData,
});
