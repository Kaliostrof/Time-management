import { ACTION_TYPE } from './action-type';

export const addTask = (task) => ({
	type: ACTION_TYPE.ADD_TASK,
	payload: task,
});
