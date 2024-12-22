import { request } from '../utils';
import { setProjectData } from './set-project-data';

export const saveProjectAsync = (id, newProjectData) => (dispatch) => {
	return request(`/projects/${id}`, 'PATCH', newProjectData).then((updatedProject) => {
		dispatch(setProjectData(updatedProject.data));
		console.log(updatedProject);
		return updatedProject.data;
	});
};
