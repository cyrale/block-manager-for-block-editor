import * as apiFetch from '@wordpress/api-fetch';

/**
 * API path for settings.
 *
 * @constant {string}
 * @since 1.0.0
 */
export const SETTINGS_API_PATH = '/bmfbe/v1/settings';

/**
 * Get all settings.
 *
 * @return {Promise<Object>} All settings values.
 * @since 1.0.0
 */
export async function allSettings() {
	return await apiFetch( {
		method: 'GET',
		path: SETTINGS_API_PATH,
	} );
}

/**
 * Update settings.
 *
 * @param {Object} settings Updated settings values.
 *
 * @return {Promise<Object>} Updated settings values.
 * @since 1.0.0
 */
export async function updateSettings( settings ) {
	return await apiFetch( {
		data: settings,
		method: 'PUT',
		path: SETTINGS_API_PATH,
	} );
}
