import * as actions from './actions';
import { SETTINGS_API_PATH } from './constants';

export function* getSettings() {
	const settings = yield actions.fetchFromAPI( SETTINGS_API_PATH );
	return actions.setSettings( settings );
}

export function loadingStatus() {
	return actions.loadingStatus();
}

export function savingStatus() {
	return actions.savingStatus();
}
