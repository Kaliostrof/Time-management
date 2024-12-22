export const request = async (url, method, data) => {
	return await fetch('/api' + url, {
		method: method || 'GET',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: data ? JSON.stringify(data) : undefined,
	}).then((res) => res.json());
};
