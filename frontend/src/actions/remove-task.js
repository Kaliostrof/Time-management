import { ACTION_TYPE } from './action-type';

export const removeTask = (taskId) => ({
	type: ACTION_TYPE.REMOVE_TASK,
	payload: taskId,
});
