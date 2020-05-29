import { apiFetch } from './controls';
import { SETTINGS_API_PATH } from './constants';

export function initSettings( settings ) {
	return {
		type: 'INIT_SETTINGS',
		settings,
	};
}

export function updateSettings( name, value ) {
	return {
		type: 'UPDATE_SETTINGS',
		name,
		value,
	};
}

export function* saveSettings( settings ) {
	yield {
		type: 'SAVE_SETTINGS_START',
	};

	const savedSettings = yield apiFetch( {
		path: SETTINGS_API_PATH,
		method: 'PUT',
		data: settings,
	} );

	yield {
		type: 'SAVE_SETTINGS_FINISH',
	};

	return savedSettings;
}

export function loadingStatus() {
	return {
		type: 'LOADING_STATUS',
	};
}

export function savingStatus() {
	return {
		type: 'SAVING_STATUS',
	};
}

export function fetchFromAPI( path ) {
	return {
		type: 'API_FETCH',
		request: {
			path,
			method: 'GET',
		},
	};
}
