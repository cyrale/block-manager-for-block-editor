export function fetchFromAPI( path ) {
	return {
		type: 'API_FETCH',
		request: {
			path,
			method: 'GET',
		},
	};
}
