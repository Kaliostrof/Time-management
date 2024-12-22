import { request } from '../utils';
import { addTask } from './add-task';

export const addTaskAsync = (projectId, time, task) => (dispatch) =>
	request(`/projects/${projectId}/tasks`, 'POST', { time, task }).then((task) => {
		dispatch(addTask(task));
	});
