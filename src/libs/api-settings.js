const { apiFetch } = wp;

export function getSettings() {
	return apiFetch( {
		path: '/bmfbe/v1/settings',
		method: 'GET',
	} );
}

export function updateSettings( settings ) {
	return apiFetch( {
		path: '/bmfbe/v1/settings',
		method: 'PATCH',
		data: settings,
	} );
}
