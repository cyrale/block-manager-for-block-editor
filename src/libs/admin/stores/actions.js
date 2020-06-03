export function fetchAllFromAPI( path ) {
	return {
		type: 'API_FETCH_ALL',
		request: {
			path,
			method: 'GET',
		},
	};
}
