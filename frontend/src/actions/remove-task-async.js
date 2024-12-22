import { request } from '../utils';
import { removeTask } from './remove-task';

export const removeTaskAsync = (projectId, taskId) => (dispatch) =>
	request(`/projects/${projectId}/tasks/${taskId}`, 'DELETE').then(() => {
		dispatch(removeTask(taskId));
	});
