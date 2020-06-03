const { apiFetch } = wp;

export const SETTINGS_API_PATH = '/bmfbe/v1/settings';

export async function allSettings() {
	return await apiFetch( {
		path: SETTINGS_API_PATH,
		method: 'GET',
	} );
}

export async function updateSettings( settings ) {
	return await apiFetch( {
		path: SETTINGS_API_PATH,
		method: 'PUT',
		data: settings,
	} );
}
