import { request } from '../utils';

export const removeProjectAsync = (id) => () => request(`/projects/${id}`, 'DELETE');
