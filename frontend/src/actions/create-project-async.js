import { request } from '../utils';
import { setProjectData } from './set-project-data';

export const createProjectAsync = (newProjectData) => (dispatch) => {
	const saveRequest = request('/projects', 'POST', newProjectData);

	return saveRequest.then(({ updatedProject }) => {
		dispatch(setProjectData(updatedProject.data));

		return updatedProject.data;
	});
};
