export { fetchAllFromAPI } from '../actions';

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

	const savedSettings = yield {
		type: 'SAVE_SETTINGS',
		settings,
	};

	yield {
		type: 'INIT_SETTINGS',
		settings: savedSettings,
	};

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
